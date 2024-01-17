import { InboxOutlined, CheckCircleOutlined, CloseCircleOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import { Button, Layout, Space, Table, message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const { Content } = Layout;
const { Dragger } = Upload;


const Dashboard = () => {
  const [fileList, setFileList] = useState([]);
  const navigate = useNavigate();

  const [documents, setDocuments] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/list', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('data', data);
          setDocuments(data);
        } else {
          console.error('Failed to fetch document list');
        }
      } catch (error) {
        console.error('Error during fetch:', error);
      }
    };

    fetchDocuments();
  }, [uploadStatus]);

  const handleDownload = async (documentId, documentName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/download/${documentId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const downloader = document.createElement('a');
        downloader.href = url;
        downloader.download = documentName;
        document.body.appendChild(downloader);
        downloader.click();
        document.body.removeChild(downloader);
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Failed to download document');
      }
    } catch (error) {
      console.error('Error during download:', error);
    }
  };

  const handleUpload = async (file) => {
    try {
      const token = localStorage.getItem('token');
      console.log('token', token);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments((prevDocuments) => [data, ...prevDocuments]);
        setUploadStatus((prevStatus) => !prevStatus);
      } else if (response.status === 401) {
        navigate('/login');
      } else {
        console.error('Failed to upload document');
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    onChange(info) {
      const { status, originFileObj } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setFileList(info.fileList);
        if (originFileObj) {
          handleUpload(originFileObj);
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  const columns = [
    {
      title: 'Filename',
      dataIndex: 'file',
      key: 'file',
      render: (text, record) => (
        <Button type="link" onClick={() => handleDownload(record.id, record.file)}>
          {text}
        </Button>
      ),
    },
    {
      title: 'Upload Date',
      dataIndex: 'upload_date',
      key: 'upload_date',
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.upload_date) - new Date(b.upload_date),
    },
    {
      title: 'Number of Keywords',
      dataIndex: 'keywords',
      key: 'keywords',
      render: (keywords) => keywords.length,
      sorter: (a, b) => a.keywords.length - b.keywords.length,
    },
    {
      title: 'OCR Status',
      key: 'ocr_status',
      render: (_, record) =>
        record.keywords.length === 0 ? (
          <CloseCircleOutlined style={{ color: 'red' }} />
        ) : (
          <CheckCircleOutlined style={{ color: 'green' }} />
        ),
      sorter: (a, b) => a.keywords.length - b.keywords.length,
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" icon={<EyeOutlined />} onClick={() => navigate(`/document/view/${record.id}`)} />
          <Button type="link" icon={<DownloadOutlined />} onClick={() => handleDownload(record.id, record.file)} />
        </Space>
      ),
    },
  ];

  const layoutStyle = {
    width: '100%',
    height: '100vh',
  };
  
  const contentStyle = {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    height: '80vh',
    padding: 12,
  };
  
	return (
		<Layout style={layoutStyle}>
			<Content style={contentStyle}>
				<div style={{ padding: 24, flex: 1, height: '90%', justifySelf: 'center' }}>
					<Dragger {...props}>
						<p className="ant-upload-drag-icon">
							<InboxOutlined />
						</p>
						<p className="ant-upload-text">Click or drag file to this area to upload</p>
					</Dragger>
				</div>
				<div style={{ padding: 24, flex: 2, overflow: 'auto' }}>
					<Table columns={columns} dataSource={documents} rowKey="id" />
				</div>
			</Content>
		</Layout>
	);
};

export default Dashboard;
