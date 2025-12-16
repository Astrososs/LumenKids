import { useEffect, useState } from 'react'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth'; 

import { auth } from './firebase/firebaseConfig'; 
import { getUserProfile } from './models/userModel'; 
import { loginSuccess, logout } from './store/slices/userSlice'; 


import SidebarPresenter from './presenters/SidebarPresenter'; 
import DashboardPresenter from './presenters/DashboardPresenter';
import ChatPresenter from './presenters/ChatPresenter';
import LoginPresenter from './presenters/LoginPresenter';
import CoursesPresenter from './presenters/CoursesPresenter'; 
import SubjectPresenter from './presenters/SubjectPresenter'; 
import MissionPresenter from './presenters/MissionPresenter'; 


const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {

        const userProfile = await getUserProfile(currentUser.uid);
        if (userProfile) {
            dispatch(loginSuccess(userProfile));
        }
      } else {

        dispatch(logout());
      }
      
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        <div className="animate-pulse text-xl">Loading Universe... 🪐</div>
      </div>
    );
  }


  const layoutClasses = isAuthenticated 
    ? "flex-1 min-h-screen transition-all duration-300 pt-16 md:pt-0 md:ml-64"
    : "flex-1 min-h-screen w-full"; 

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col md:flex-row">
        
        <SidebarPresenter />

        <main className={layoutClasses}>
          <div className="w-full h-full"> 
            <Routes>
              
              <Route path="/login" element={<LoginPresenter />} />
              
              <Route path="/" element={
                <RequireAuth>
                  <DashboardPresenter />
                </RequireAuth>
              } />
              
              <Route path="/chat" element={
                <RequireAuth>
                  <ChatPresenter />
                </RequireAuth>
              } />

              <Route path="/courses" element={
                <RequireAuth>
                  <CoursesPresenter />
                </RequireAuth>
              } />

              <Route path="/courses/:subjectId" element={
                <RequireAuth>
                  <SubjectPresenter />
                </RequireAuth>
              } />

              <Route path="/mission/:missionId" element={
                <RequireAuth>
                  <MissionPresenter />
                </RequireAuth>
              } />

              <Route path="*" element={<Navigate to="/login" replace />} />
              
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;