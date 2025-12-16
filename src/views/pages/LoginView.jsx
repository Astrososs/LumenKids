const LoginView = ({ 
    email, setEmail, 
    password, setPassword, 
    nickname, setNickname,
    isRegistering, setIsRegistering,
    onAuth, isLoading, error 
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700 text-center">
        
        <div className="text-6xl mb-4 animate-bounce">🚀</div>
        <h1 className="text-3xl font-bold text-white mb-2">
            {isRegistering ? "Join Starfleet" : "Welcome Back"}
        </h1>
        <p className="text-gray-400 mb-8">
            {isRegistering ? "Create your cadet profile" : "Your AI Study Buddy awaits!"}
        </p>

        {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-200 text-sm p-3 rounded-lg mb-4">
                {error}
            </div>
        )}

        <form 
            onSubmit={(e) => { 
                e.preventDefault();
                onAuth();         
            }} 
            className="space-y-4 text-left"
        >
          
          {isRegistering && (
            <div>
                <label className="text-gray-400 text-xs font-bold ml-1">NICKNAME</label>
                <input 
                    type="text" 
                    placeholder="Captain Cool"
                    value={nickname}
                    onChange={e => setNickname(e.target.value)}
                    className="w-full bg-gray-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
          )}

          <div>
            <label className="text-gray-400 text-xs font-bold ml-1">EMAIL</label>
            <input 
                type="email" 
                placeholder="cadet@space.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-gray-400 text-xs font-bold ml-1">PASSWORD</label>
            <input 
                type="password" 
                placeholder="••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-4 rounded-xl transition transform hover:scale-105 disabled:opacity-50 mt-4 shadow-lg border border-blue-500"
          >
            {isLoading ? "Loading..." : (isRegistering ? "Sign Up" : "Login")}
          </button>
          
          <div className="text-center mt-4">
            <button 
                type="button" 
                onClick={() => setIsRegistering(!isRegistering)}
                className="text-sm text-blue-400 hover:text-white underline"
            >
                {isRegistering ? "Already have an account? Login" : "New here? Create Account"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginView;