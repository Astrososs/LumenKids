import React, { Component } from 'react';

const Button =({
label,
onClick,
variant = 'primary',
isLoading = false,
disabled = false

}) => {

const baseStyle = "px-6 py-2 rounded-xl font-bold transition-all duration-200 active:scale-95";

const variants = {

primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-800",
    danger: "bg-red-100 hover:bg-red-200 text-red-600"

};
const disabledStyle = "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500 shadow-none active:scale-100";

const finalClass = `${baseStyle} ${ (isLoading || disabled) ? disabledStyle : variants[variant] }`;

return (

<button onClick={onClick}
disabled={isLoading || disabled}
className={finalClass}
>

{isLoading ? (
  <div className="flex items-center justify-center gap-2">
    
    <svg className="animate-spin h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span>Loading...</span>
  </div>
) : (
  label
)}

</button>
);



};
export default Button;