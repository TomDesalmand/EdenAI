import { Breadcrumb, Button, Layout, Tag, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './DocumentView.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

const DocumentView = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [information, setInformation] = useState({ text: '', keywords: [] });

	useEffect(() => {
		const fetchDocuments = async () => {
			try {
				const token = localStorage.getItem('token');
				const response = await fetch(`http://localhost:8000/api/document/${id}`, {
					method: 'GET',
					headers: {
						Authorization: `Bearer ${token}`,
						'Content-Type': 'application/json',
					},
				});
				if (response.ok) {
					const data = await response.json();
					setInformation(data);
				} else {
					console.error('Failed to fetch document');
				}
			} catch (error) {
				console.error('Error during fetch:', error);
			}
		};
		fetchDocuments();
	}, [id]);

	return (
		<Layout style={{ minHeight: '100vh' }}>
			<Header style={{ background: '#fff', padding: 0 }}>
				<Breadcrumb style={{ margin: '16px 20px' }}>
					<Breadcrumb.Item>Home</Breadcrumb.Item>
					<Breadcrumb.Item>Document</Breadcrumb.Item>
				</Breadcrumb>
			</Header>
			<Content style={{ padding: '20px 50px' }}>
				<div style={{ background: '#fff', padding: 24, minHeight: 280 }}>
					<Title level={2}>Document Details</Title>
					<Button type="primary" onClick={() => navigate('/')}>
						Back to List
					</Button>

					<div style={{ marginTop: '20px' }}>
						<Title level={4}>Text</Title>
						<Paragraph>{information.text || 'No text available'}</Paragraph>
					</div>

					<div style={{ marginTop: '20px' }}>
						<Title level={4}>Keywords</Title>
						{Array.isArray(information.keywords) && information.keywords.length > 0 ? (
							information.keywords.map((keyword, index) => (
								<Tag color="blue" key={index} style={{ marginBottom: '10px' }}>
									{keyword}
								</Tag>
							))
						) : (
							<Paragraph>No keywords available</Paragraph>
						)}
					</div>
				</div>
			</Content>
		</Layout>
	);
};

export default DocumentView;
