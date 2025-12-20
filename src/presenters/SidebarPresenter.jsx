import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { signOutUser } from '../store/slices/userSlice';
import SidebarView from './views/pages/SidebarView';

export default function SidebarPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { data: user } = useSelector((state) => state.user);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  if (!user || location.pathname === '/login') {
    return null;
  }

  const handleLogout = () => {
    dispatch(signOutUser());
    navigate('/login');
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsMobileOpen(false); 
  };

  return (
    <SidebarView 
      currentPath={location.pathname}
      navItems={[
        { label: "Dashboard", path: "/", icon: "🏠" },
        { label: "Courses", path: "/courses", icon: "📚" },
        { label: "AI Buddy", path: "/chat", icon: "🤖" },
        { label: "Friends", path: "/social", icon: "👥" }, 
      ]}
      onNavigate={handleNavigate}
      onLogout={handleLogout}
      isMobileOpen={isMobileOpen}
      setIsMobileOpen={setIsMobileOpen}
      hideMobileHeader={location.pathname === '/chat'}
    />
  );
}