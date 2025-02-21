import React from 'react';

export const Card = ({ children, className, onClick }) => {
  return (
    <div
      className={`border rounded-lg shadow-lg p-4 ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return <div className="p-2">{children}</div>;
};
