import './App.css';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PublicRoute from './utils/PublicRoute'
import PrivateRoute from './utils/PrivateRoute';
import HomePage from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import DocumentView from './pages/DocumentView';

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
        <Route path="/" element={<PrivateRoute element={<HomePage />} />} />
        <Route path="/register"  element={<PublicRoute element={<Register />} to="/" />} />
        <Route path="/login" element={<PublicRoute element={<Login />} to="/" />} />
        <Route path="/document/view/:id" element={<PrivateRoute element={<DocumentView />} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
