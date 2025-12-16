import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../store/slices/userSlice';
import { logoutUser } from '../models/userModel';
import SidebarView from '../views/pages/SidebarView';

export default function SidebarPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
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

  return (
    <SidebarView 
      currentPath={location.pathname}
      navItems={navItems}
      onNavigate={(path) => navigate(path)}
      onLogout={handleLogout}
    />
  );
}