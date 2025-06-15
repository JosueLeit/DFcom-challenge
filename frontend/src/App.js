import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout/Layout';
import ProductListPage from './pages/ProductListPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import ProductFormPage from './pages/ProductFormPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ProductListPage />} />
          <Route path="/products/new" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />
        </Routes>
      </Layout>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App; 