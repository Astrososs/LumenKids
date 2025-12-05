import React from 'react';

const ProgressBar = ({ value, max = 100, color = "bg-blue-500", label }) => {

    const percentage = (value / max) * 100;

    return (

        <div className="w-full">

            {label && (
                <div className="flex justify-between mb-1 text-xs font-bold text-gray-600">
                    <span>{label}</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className={`${color} h-4 rounded-full transition-all duration-500 ease-in-out`} style={{ width: `${percentage}%` }}>

                </div>

            </div>

        </div>
    )
}


export default ProgressBar