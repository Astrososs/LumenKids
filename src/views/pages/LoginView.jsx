import React from 'react';


const LoginView = ({ onLogin, isLoading }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
        
        <div className="text-6xl mb-4 animate-bounce">🚀</div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome to LumenKids</h1>
        <p className="text-gray-400 mb-8">Your AI Study Buddy awaits!</p>

        <div className="space-y-4">
          <button
            onClick={onLogin}
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border border-blue-500"
          >
            {isLoading ? "Launching..." : "Login as Space Cadet"}
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            (No account login details required)
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;