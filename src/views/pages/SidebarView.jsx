
const SidebarView = ({ currentPath, navItems, onNavigate, onLogout }) => {
  return (
    <div className="hidden md:flex flex-col w-64 bg-gray-800 h-screen fixed left-0 top-0 border-r border-gray-700 z-50">
      
      <div className="p-6 flex items-center gap-3 border-b border-gray-700">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            LK
        </div>
        <span className="text-xl font-bold text-white tracking-wide">LumenKids</span>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems && navItems.map((item) => {
           const isActive = currentPath === item.path;
           return (
             <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
             >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
             </button>
           );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-200 font-medium"
        >
            <span className="text-xl">🚪</span>
            <span>Logout</span>
        </button>
      </div>

    </div>
  );
};

export default SidebarView;