import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DocumentView.css'

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
            'Authorization': `Bearer ${token}`,
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
    <div className="document-view-container">
      <button className="back-button" onClick={() => navigate('/')}>Back</button>
      <div className="text-section">
        <h1>Text</h1>
        <p>{information.text}</p>
      </div>
      <div className="keywords-section">
        <h1>Keywords</h1>
        {Array.isArray(information.keywords) ? (
          information.keywords.map((keyword, index) => (
            <p key={index} className="keyword-item">- {keyword}</p>
          ))
        ) : (
          <p className="keyword-item">No keywords available</p>
        )}
      </div>
    </div>
  )
};

export default DocumentView;
