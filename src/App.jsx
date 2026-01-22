import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig';
import {logout, setLoading, loadUserProfile } from './store/slices/userSlice';

import LoginPresenter from './presenters/LoginPresenter';
import CoursesPresenter from './presenters/CoursesPresenter'; 
import SubjectPresenter from './presenters/SubjectPresenter'; 
import MissionPresenter from './presenters/MissionPresenter'; 
import ChatPresenter from './presenters/ChatPresenter';
import DashboardPresenter from './presenters/DashboardPresenter';
import SidebarPresenter from './presenters/SidebarPresenter';

function AppContent() {
  const dispatch = useDispatch();
  
  const { data: user, loading: authLoading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(setLoading(true));
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        dispatch(loadUserProfile(currentUser.uid));
      } else {
        dispatch(logout());
        dispatch(setLoading(false));
      }
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
      
      <SidebarPresenter />

      <main className="flex-1 overflow-x-hidden relative">
         <Routes>
            <Route path="/" element={<DashboardPresenter />} />
            
            <Route path="/courses" element={<CoursesPresenter />} />
            <Route path="/courses/:subjectId" element={<SubjectPresenter />} />
            <Route path="/mission/:missionId" element={<MissionPresenter />} />
            <Route path="/chat" element={<ChatPresenter />} />
            
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
