import ProfileHeader from '../components/profile/ProfileHeader';
import StatBox from '../components/profile/StatBox';
import Button from '../components/common/Button';

const DashboardView = ({ user, missions }) => {
  const MissionCard = ({ mission }) => (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition shadow-lg group cursor-pointer">
      <div className="flex justify-between items-start mb-4">
        <span className="text-3xl group-hover:scale-110 transition">🚀</span>
        <span className="bg-blue-900 text-blue-200 text-xs font-bold px-2 py-1 rounded-full">Lvl {mission.difficulty}</span>
      </div>
      <h3 className="text-white font-bold text-xl mb-2">{mission.topic_name || "Mission"}</h3>
      <p className="text-gray-400 text-sm">Complete this to earn XP!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 pb-20">
      <div className="w-full max-w-7xl mx-auto p-6 space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
           <div>
             <h1 className="text-3xl font-bold text-white mb-2">Welcome Back! 👋</h1>
             <div className="mt-2">
                {user ? <ProfileHeader user={user} /> : <span className="text-gray-400">Loading...</span>}
             </div>
           </div>
        </header>

        {/* Stats Grid */}
        {user?.stats && (
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatBox label="Streak" value={`${user.stats.streakDays} Days`} icon="🔥" color="bg-orange-100 text-orange-600" />
                <StatBox label="Stars" value={user.stats.totalStars} icon="⭐" color="bg-yellow-100 text-yellow-600" />
            </section>
        )}

        {/* Missions Grid */}
        <section>
            <div className="flex justify-between items-end mb-6">
                <h2 className="text-2xl font-bold text-white">Your Missions</h2>
                <Button label="View All" variant="white" />
            </div>

            {missions?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {missions.map((m, i) => <MissionCard key={i} mission={m} />)}
                </div>
            ) : (
                <div className="w-full p-12 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-500 gap-4">
                    <span className="text-5xl animate-pulse">🚀</span>
                    <p>Mission Control Loading...</p>
                </div>
            )}
        </section>

      </div>
    </div>
  );
};

export default DashboardView;