import { useState } from 'react';
import { Link } from 'react-router-dom';

const SidebarView = ({ user, isAuthenticated, onLogout, onNavigate, navItems }) => {
  const [isOpen, setIsOpen] = useState(false);


  const NavItem = ({ item, isMobile }) => (
    <Link 
      to={item.path} 
      onClick={() => setIsOpen(false)}
      className={`flex items-center text-gray-400 hover:text-white transition group ${
        isMobile ? "gap-4 p-3 text-lg w-full hover:bg-gray-800 rounded-xl" : "flex-col"
      }`}
    >
      <span className="text-2xl group-hover:scale-110 transition">{item.icon}</span>
      <span className={isMobile ? "font-medium" : "text-[10px] uppercase font-bold mt-1"}>
        {item.name}
      </span>
    </Link>
  );


  const AuthButton = ({ isMobile }) => {

    if (!isAuthenticated) return (
      <Link to="/login" onClick={() => setIsOpen(false)} className={`flex items-center text-green-400 hover:text-green-300 ${isMobile ? "gap-4 p-3 border-t border-gray-700 mt-4" : "flex-col"}`}>
        <span className="text-2xl">🔑</span>
        <span className={isMobile ? "text-lg" : "text-[10px] font-bold"}>LOGIN</span>
      </Link>
    );


    return (
      <button 
        onClick={() => { onLogout(); setIsOpen(false); }} 
        title="Logout"
        className={`flex items-center justify-center ${
            isMobile 
            ? "w-full justify-start gap-4 p-3 text-red-400 text-lg border-t border-gray-700 mt-4" 
            : "w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold shadow-lg"
        }`}
      >
        {isMobile ? <><span>🚪</span><span>Logout</span></> : "🚪"}
      </button>
    );
  };

  return (
    <>

      <aside className="hidden md:flex flex-col fixed inset-y-0 left-0 w-20 bg-gray-900 border-r border-gray-700 z-50 py-4">
        <div className="text-3xl cursor-pointer hover:scale-110 transition text-center" onClick={() => onNavigate('/')}>🚀</div>
        
        <nav className="flex-1 flex flex-col space-y-6 mt-8">
          {navItems.map(item => <NavItem key={item.name} item={item} />)}
        </nav>
        
        <div className="mt-auto flex justify-center"><AuthButton /></div>
      </aside>


      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center justify-between px-4 z-50 border-b border-gray-700">
        <button onClick={() => setIsOpen(true)} className="text-white text-2xl">☰</button>
        <span className="text-white font-bold text-lg" onClick={() => onNavigate('/')}>LumenKids 🚀</span>


        <button 
            onClick={isAuthenticated ? onLogout : () => onNavigate('/login')} 
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${isAuthenticated ? "bg-red-600" : "bg-blue-600"}`}
        >
            {isAuthenticated ? "🚪" : "🔑"}
        </button>
      </div>


      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)}>
          <div className="w-64 h-full bg-gray-900 p-4 shadow-2xl border-r border-gray-700" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
               <span className="text-xl font-bold text-white">Menu</span>
               <button onClick={() => setIsOpen(false)} className="text-gray-400">✕</button>
            </div>
            {navItems.map(item => <NavItem key={item.name} item={item} isMobile />)}
            <AuthButton isMobile />
          </div>
        </div>
      )}
    </>
  );
};

export default SidebarView;