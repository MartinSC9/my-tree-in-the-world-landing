import React from 'react';
import Navbar from '@shared/components/layout/Navbar';

const AuthenticatedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-1 max-w-full overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};

export default AuthenticatedLayout;
