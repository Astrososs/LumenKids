import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/userSlice'; 
import SidebarView from '../views/pages/SidebarView';

export default function SidebarPresenter() {
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const { isAuthenticated, data: user } = useSelector((state) => state.user);


  if (!isAuthenticated) {
    return null; 
  }


  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      dispatch(logout());
      navigate('/login');
    }
  };

  const handleNavigate = (path) => {
    navigate(path);
  };

  const navItems = [
    { name: "Dashboard", path: "/", icon: "🏠" },
    { name: "Courses", path: "/courses", icon: "📚" },
    { name: "AI Buddy", path: "/chat", icon: "🤖" },
  ];

  return (
    <SidebarView 
        user={user}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        navItems={navItems}
    />
  );
}
