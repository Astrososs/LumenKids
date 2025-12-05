import ProfileHeader from '../components/profile/ProfileHeader';
import StatBox from '../components/profile/StatBox';
import Button from '../components/common/Button';

const Dashboard = () => {

  // Mock user for demonstration
  const user = {
    nickname: "Space Cadet",
    settings: { avatarId: "robot_blue_v1" },
    stats: { currentLevel: 5, xp: 75, totalStars: 12, streakDays: 3 }
  };

  return (

    <div className="min-h-screen bg-gray-900 pb-20">
      
      <div className="max-w-md mx-auto p-6 space-y-6">
        
        <header>

           <h1 className="text-2xl font-bold text-white mb-4">Welcome Back! 👋</h1>
           <ProfileHeader user={user} />
        </header>

        <section className="flex gap-4">
            <StatBox 
                label="Streak" 
                value={`${user.stats.streakDays} Days`} 
                icon="🔥" 
                color="bg-orange-100 text-orange-600"
            />
            <StatBox 
                label="Stars" 
                value={user.stats.totalStars} 
                icon="⭐" 
                color="bg-yellow-100 text-yellow-600"
            />
        </section>

        <section>
            <div className="flex justify-between items-end mb-4">

                <h2 className="text-xl font-bold text-white">Your Missions</h2>
                <Button label="View All" variant="white" />
            </div>


            <div className="p-8 border-2 border-dashed border-gray-700 rounded-2xl flex flex-col items-center justify-center text-gray-500 gap-2">
                <span className="text-4xl">🚀</span>
                <p>Mission Control Loading...</p>
                <p className="text-xs">(Waiting for Ritwan's Mission Cards)</p>
            </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;