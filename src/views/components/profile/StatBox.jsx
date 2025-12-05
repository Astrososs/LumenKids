const StatBox = ({ label, value, icon, color }) => {
  return (

    <div className="bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-700 flex items-center gap-4 flex-1">
      
      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${color}`}>
        {icon}
      </div>
      
      <div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-wider">{label}</p>
        

        <p className="text-xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};

export default StatBox;