import React from 'react';

export const Dialog = ({ children, open, onClose }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 ${open ? 'block' : 'hidden'}`}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-4"
        onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the dialog
      >
        {children}
      </div>
    </div>
  );
};

export const DialogContent = ({ children }) => (
  <div className="p-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-xl font-semibold">{children}</h2>
);
