import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import { loginSuccess, logout, setLoading } from './store/slices/userSlice';
import { getUserProfile } from './models/userModel';

// Presenters
import SocialPresenter from './presenters/SocialPresenter'; // Ensure this is imported
import LoginPresenter from './presenters/LoginPresenter';
import CoursesPresenter from './presenters/CoursesPresenter'; 
import SubjectPresenter from './presenters/SubjectPresenter'; 
import MissionPresenter from './presenters/MissionPresenter'; 
import ChatPresenter from './presenters/ChatPresenter';

// Views
import DashboardView from './views/pages/DashboardView'; 
import SidebarView from './views/pages/SidebarView'; 

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate(); 
  
  const { data: user, loading: authLoading } = useSelector(state => state.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const profile = await getUserProfile(currentUser.uid);
        if (profile) {
          dispatch(loginSuccess(profile));
        }
      } else {
        dispatch(logout());
      }
      dispatch(setLoading(false));
    });
    return () => unsubscribe();
  }, [dispatch]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
        <div className="text-6xl animate-bounce mb-4">🚀</div>
        <div className="text-xl font-bold animate-pulse">Entering the Universe...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginPresenter />; 
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white font-sans">
      
      <SidebarView 
        currentPath={location.pathname}
        navItems={[
          { path: '/', label: 'Dashboard', icon: '🚀' },
          { path: '/courses', label: 'Courses', icon: '🔭' },
          { path: '/chat', label: 'Lumen Chat', icon: '🤖' },
          { path: '/social', label: 'Friends', icon: '👥' }, // ADDED: Friend System Navigation
        ]}
        onNavigate={(path) => {
            navigate(path);       
            setIsMobileOpen(false); 
        }}
        onLogout={() => auth.signOut()}
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen}
      />

      <main className="flex-1 overflow-x-hidden relative">
         <Routes>
            <Route path="/" element={<DashboardView user={user} onLogout={() => auth.signOut()} />} />
            
            <Route path="/courses" element={<CoursesPresenter />} />
            <Route path="/courses/:subjectId" element={<SubjectPresenter />} />
            <Route path="/mission/:missionId" element={<MissionPresenter />} />
            <Route path="/chat" element={<ChatPresenter />} />
            
            {/* ADDED: Friend System Route */}
            <Route path="/social" element={<SocialPresenter />} /> 
            
            <Route path="*" element={<Navigate to="/" />} />
         </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}