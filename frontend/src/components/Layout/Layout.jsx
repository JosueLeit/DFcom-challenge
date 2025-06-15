import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();

  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/" 
              className="text-xl font-bold text-blue-600 hover:text-blue-700"
            >
              🚀 DFcom - Sistema de Avaliação de Produtos
            </Link>
            
            <nav className="flex space-x-4">
              <Link
                to="/"
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  isActiveRoute('/') && location.pathname === '/'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                Home
              </Link>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {children}
      </main>
      
      <footer className="bg-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm">
            © 2024 DFcom Sistemas - Sistema de Avaliação de Produtos •
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout; 