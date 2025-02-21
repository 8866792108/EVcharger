import React from 'react';

export const Select = ({ children, className }) => (
  <div className={`relative ${className}`}>
    {children}
  </div>
);

export const SelectTrigger = ({ children, onClick, className }) => (
  <button
    onClick={onClick}
    className={`w-full px-4 py-2 bg-gray-200 rounded-md focus:outline-none ${className}`}
  >
    {children}
  </button>
);

export const SelectContent = ({ children, className }) => (
  <div
    className={`absolute z-10 mt-2 w-full bg-white border rounded-md shadow-md ${className}`}
  >
    {children}
  </div>
);

export const SelectItem = ({ children, onClick, className }) => (
  <div
    onClick={onClick}
    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${className}`}
  >
    {children}
  </div>
);

export const SelectValue = ({ value, className }) => (
  <span className={`block ${className}`}>{value}</span>
);
