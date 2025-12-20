import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import { authenticateUser } from '../store/slices/userSlice'; 
import LoginView from '../views/pages/LoginView';

export default function LoginPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, data: user } = useSelector((state) => state.user);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); 

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleAuth = () => {
    if (!email || !password) {
        
        Swal.fire({
          icon: 'warning',
          title: 'Missing Details',
          text: 'Please enter both your email and password to continue!',
          confirmButtonColor: '#2563eb', 
          background: '#1f2937', 
          color: '#fff'
        });
        return;
    }

    dispatch(authenticateUser({ email, password, nickname, isRegistering }));
  };

  return (
    <LoginView 
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        nickname={nickname} setNickname={setNickname}
        isRegistering={isRegistering} setIsRegistering={setIsRegistering}
        onAuth={handleAuth} 
        isLoading={loading}
        error={error}
    />
  );
}