import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DocumentList = () => {
  const navigate = useNavigate();
  const initialSortCriteria = 'upload_date';
  const initialSortOrder = 'asc';

  const [documents, setDocuments] = useState([]);
  const [sortCriteria, setSortCriteria] = useState(initialSortCriteria);
  const [sortOrder, setSortOrder] = useState(initialSortOrder);
  const [uploadStatus, setUploadStatus] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8000/api/list', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
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
          'Authorization': `Bearer ${token}`,
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

  const handleUpload = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      const fileInput = document.getElementById('file-input');
      formData.append('file', fileInput.files[0]);

      const response = await fetch('http://localhost:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setDocuments((prevDocuments) => [data, ...prevDocuments]);
        setUploadStatus((prevStatus) => !prevStatus);
      } else if (response.status == 401) {
        navigate('/login');
      } else {
        console.error('Failed to upload document');
      }
    } catch (error) {
      console.error('Error during upload:', error);
    }
  };
  
  const handleSort = (criteria) => {
    setSortOrder((prevOrder) => (sortCriteria === criteria ? (prevOrder === 'asc' ? 'desc' : 'asc') : 'asc'));
    setSortCriteria(criteria);
  };

  const resetSort = () => {
    setSortCriteria(initialSortCriteria);
    setSortOrder(initialSortOrder);
  };

  const sortedDocuments = [...documents].sort((a, b) => {
    const aValue = sortCriteria === 'upload_date' ? new Date(a.upload_date) : a.keywords.length;
    const bValue = sortCriteria === 'upload_date' ? new Date(b.upload_date) : b.keywords.length;

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return (
    <div>
      <div>
        <button onClick={resetSort}>Reset Sort</button>
        <button onClick={handleUpload}>Submit</button>
        <label htmlFor="file-input" className="upload-btn">
          <input type="file" id="file-input" accept=".pdf,.doc,.docx,.png,.jpg" />
        </label>
      </div>
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Filename</th>
            <th onClick={() => handleSort('upload_date')}>Upload Date</th>
            <th onClick={() => handleSort('keywords')}>Number of Keywords</th>
          </tr>
        </thead>
        <tbody>
          {sortedDocuments.map((document, index) => (
            <tr key={index}>
              <td>{document.id}</td>
              <td>
                <button onClick={() => handleDownload(document.id, document.file)}>{document.file}</button>
              </td>
              <td>{document.upload_date}</td>
              <td>{document.keywords.length}</td>
              <button onClick={() => navigate(`/document/view/${document.id}`)}>View</button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentList;
