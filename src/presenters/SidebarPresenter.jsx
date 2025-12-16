import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/userSlice';
import { logoutUser } from '../models/userModel';
import SidebarView from '../views/pages/SidebarView';

export default function SidebarPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const { isAuthenticated } = useSelector((state) => state.user);

  const navItems = [
    { label: "Dashboard", path: "/", icon: "🏠" },
    { label: "Courses", path: "/courses", icon: "📚" },
    { label: "AI Buddy", path: "/chat", icon: "🤖" },
  ];

  if (!isAuthenticated || location.pathname === '/login') {
    return null;
  }

  const handleLogout = async () => {
    await logoutUser();
    dispatch(logout());
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileOpen(false); 
  };

  const isChatPage = location.pathname === '/chat';

  return (
    <SidebarView 
      currentPath={location.pathname}
      navItems={navItems}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      isMobileOpen={isMobileOpen}
      setIsMobileOpen={setIsMobileOpen}
      hideMobileHeader={isChatPage}
    />
  );
}