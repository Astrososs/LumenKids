const SidebarView = ({ 
  currentPath, 
  navItems, 
  onNavigate, 
  onLogout,
  isMobileOpen, 
  setIsMobileOpen,
  hideMobileHeader
}) => {
  return (
    <>
      {!hideMobileHeader && (
        <div className="md:hidden fixed top-0 left-0 w-full h-16 bg-gray-800 border-b border-gray-700 z-40 flex items-center justify-between px-4 shadow-md">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  LK
              </div>
              <span className="text-xl font-bold text-white tracking-wide">LumenKids</span>
           </div>
           
           <button 
             onClick={() => setIsMobileOpen(!isMobileOpen)}
             className="cursor-pointer text-gray-300 hover:text-white p-2"
           >
             <span className="text-2xl">{isMobileOpen ? "✕" : "☰"}</span>
           </button>
        </div>
      )}

      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 border-r border-gray-700 transition-transform duration-300 ease-in-out
        md:translate-x-0 md:sticky md:top-0 md:h-screen md:flex md:flex-col
        ${isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        
        <div className="hidden md:flex p-6 items-center gap-3 border-b border-gray-700">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              LK
          </div>
          <span className="text-xl font-bold text-white tracking-wide">LumenKids</span>
        </div>

        <div className="md:hidden p-6 border-b border-gray-700 flex justify-between items-center">
            <span className="text-xl font-bold text-white">Menu</span>
            <button onClick={() => setIsMobileOpen(false)} className="cursor-pointer text-gray-400">✕</button>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems && navItems.map((item) => {
             const isActive = currentPath === item.path;
             return (
               <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`cursor-pointer w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
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
              className="cursor-pointer w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition duration-200 font-medium"
          >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
          </button>
        </div>

      </div>

      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default SidebarView;