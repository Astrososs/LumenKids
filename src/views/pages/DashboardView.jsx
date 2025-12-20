import { useNavigate } from 'react-router-dom';

const DashboardView = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const totalXp = user?.stats?.xp || 0;
  const currentLevelProgress = totalXp % 100; 

  return (
    <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto">
      
      <header className="flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center text-3xl shadow-inner border-2 border-blue-400">
                {user?.nickname ? user.nickname[0].toUpperCase() : "U"}
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Hello, <span className="text-blue-400">{user?.nickname || "Explorer"}</span>! 🚀
                </h1>
                <p className="text-gray-400">Ready to learn something new today?</p>
            </div>
        </div>
        
        <button 
            onClick={onLogout}
            className="cursor-pointer px-6 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-full transition text-sm font-bold"
        >
            Logout
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h3 className="text-gray-400 text-sm font-bold uppercase">Current Level</h3>
                    <div className="text-4xl font-extrabold text-white mt-1">
                        {user?.stats?.currentLevel || 1}
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-blue-400 font-bold text-xl">{currentLevelProgress}</span>
                    <span className="text-gray-500 text-sm"> / 100 XP</span>
                </div>
            </div>

            <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                <div 
                    className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${currentLevelProgress}%` }} 
                ></div>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
                {100 - currentLevelProgress} XP needed for Level {(user?.stats?.currentLevel || 1) + 1}
            </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md flex items-center justify-between">
            <div>
                <h3 className="text-gray-400 text-sm font-bold uppercase">Day Streak</h3>
                <div className="text-4xl font-extrabold text-white mt-1">
                    {user?.stats?.streakDays || 0} 🔥
                </div>
                <p className="text-xs text-gray-500 mt-2">Keep it up!</p>
            </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-md flex items-center justify-between">
             <div>
                <h3 className="text-gray-400 text-sm font-bold uppercase">Missions Done</h3>
                <div className="text-4xl font-extrabold text-white mt-1">
                    {user?.progress ? Object.keys(user.progress).length : 0} ✅
                </div>
                <p className="text-xs text-gray-500 mt-2">Total tasks completed</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
            onClick={() => navigate('/courses')}
            className="group cursor-pointer bg-gradient-to-r from-blue-600 to-blue-800 p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition border border-blue-500 relative overflow-hidden"
        >
            <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 rotate-12">📚</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition">Continue Learning &rarr;</h2>
            <p className="text-blue-100">Jump back into your Math or Science missions.</p>
        </div>

        <div 
            onClick={() => navigate('/chat')}
            className="group cursor-pointer bg-gradient-to-r from-purple-600 to-purple-800 p-8 rounded-2xl shadow-lg transform hover:scale-[1.02] transition border border-purple-500 relative overflow-hidden"
        >
             <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 rotate-[-12deg]">🤖</div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:translate-x-1 transition">Ask AI Buddy &rarr;</h2>
            <p className="text-purple-100">Stuck on a problem? Ask Lumen for help!</p>
        </div>
      </div>

    </div>
  );
};

export default DashboardView;