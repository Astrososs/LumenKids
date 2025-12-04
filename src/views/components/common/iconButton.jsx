import React from 'react';

const IconButton = ({ icon, onClick, disabled = false, color = "blue" }) => {
  
  
  const baseStyle = "rounded-full w-10 h-10 flex items-center justify-center transition-all duration-200 active:scale-95";

  
  const colorStyle = disabled 
    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
    : (color === "blue" ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md" : "bg-gray-100 hover:bg-gray-200 text-gray-700");

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${colorStyle}`}
    >
     
      {icon}
    </button>
  );
};

export default IconButton;