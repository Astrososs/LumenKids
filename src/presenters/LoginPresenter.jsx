import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginStart, loginSuccess, loginFailure } from '../store/slices/userSlice'; 
import { loginUser, registerUser } from '../models/userModel';
import LoginView from '../views/pages/LoginView';

export default function LoginPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);
  

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [isRegistering, setIsRegistering] = useState(false); 

  const handleAuth = async () => {

    if (!email || !password) {
        alert("Please enter email and password");
        return;
    }

    dispatch(loginStart());

    let result;


    if (isRegistering) {
        result = await registerUser(email, password, nickname);
    } else {
        result = await loginUser(email, password);
    }


    
    if (result.success) {
        dispatch(loginSuccess(result.user));
        navigate('/'); 
    } else {
        dispatch(loginFailure(result.error));
    }
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