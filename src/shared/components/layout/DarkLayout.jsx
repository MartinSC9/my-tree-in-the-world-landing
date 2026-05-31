import React from 'react';
import Navbar from '@shared/components/layout/Navbar';

const DarkLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-black dark">
      <Navbar />
      <div className="flex-1 max-w-full overflow-x-hidden">{children}</div>
    </div>
  );
};

export default DarkLayout;
