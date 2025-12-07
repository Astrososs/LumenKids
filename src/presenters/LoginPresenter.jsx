import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess } from '../store/slices/userSlice'; 


import LoginView from '../views/pages/LoginView';

export default function LoginPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.user);

  const handleLogin = () => {
    dispatch(loginStart());


    setTimeout(() => {
      const mockUser = {
        uid: "user_abc123",
        nickname: "Space Cadet",
        email: "cadet@techtots.com",
        settings: { avatarId: "robot_blue_v1" },
        stats: { currentLevel: 5, xp: 75, totalStars: 12, streakDays: 3 },
        progress: {}
      };

      dispatch(loginSuccess(mockUser));
      navigate('/'); 
    }, 800);
  };


  return <LoginView onLogin={handleLogin} isLoading={loading} />;
}