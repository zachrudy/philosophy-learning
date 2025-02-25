// src/pages/AdminPage.tsx
import React from 'react';
import { AdminContainer } from '../components/admin';

const AdminPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Philosophy Course Admin</h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <AdminContainer />
        </div>
      </main>
    </div>
  );
};

export default AdminPage;
