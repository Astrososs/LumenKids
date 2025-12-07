import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import DashboardPresenter from './presenters/DashboardPresenter';
import ChatPresenter from './presenters/ChatPresenter';
import LoginPresenter from './presenters/LoginPresenter';


const RequireAuth = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.user);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

function App() {
  const { isAuthenticated } = useSelector((state) => state.user);

  const layoutClasses = isAuthenticated 
    ? "flex-1 min-h-screen transition-all duration-300 pt-16 md:pt-0 md:ml-20" 
    : "flex-1 min-h-screen w-full"; 

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col md:flex-row">
        

        <main className={layoutClasses}>
          <div className="w-full h-full"> 
            <Routes>
              <Route path="/login" element={<LoginPresenter />} />
              
              <Route path="/" element={
                <RequireAuth>
                  <ChatPresenter />
                </RequireAuth>
              } />
              
              <Route path="/chat" element={
                <RequireAuth>
                  <ChatPresenter />
                </RequireAuth>
              } />

              <Route path="*" element={<LoginPresenter />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App;