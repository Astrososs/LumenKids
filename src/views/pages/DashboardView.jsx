import { useState, useEffect, useMemo } from 'react';
import { SkeletonBlock } from '../components/LoadingSkeletons';
import { formatCountdown, getMsUntilNextLocalMidnight } from '../../utils/dailyQuest';

const calculateCourseProgress = (course, user) => {
  if (!course.units) return { percent: 0, text: "0/0" };
  let total = 0;
  let completed = 0;
  course.units.forEach(unit => {
    if (unit.missions) {
      unit.missions.forEach(mission => {
        total++;
        if (user?.progress?.[mission.id]) completed++;
      });
    }
  });
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { percent, text: `${completed}/${total}` };
};

const HeroProgress = ({ currentLevel, progressPercent, xpNeeded }) => (
  <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 border border-blue-700/50 shadow-2xl relative overflow-hidden group">
    <div className="absolute top-0 right-0 text-9xl opacity-10 rotate-12 select-none group-hover:scale-110 transition duration-700">🚀</div>
    <div className="relative z-10">
      <div className="flex justify-between items-end mb-2">
        <h2 className="text-2xl font-bold text-white">Level {currentLevel}</h2>
        <span className="text-blue-200 font-bold">{Math.round(progressPercent)}%</span>
      </div>
      <div className="w-full bg-black/30 h-6 rounded-full overflow-hidden backdrop-blur-sm border border-white/10">
        <div
          className="h-full bg-gradient-to-r from-blue-400 to-purple-400 shadow-[0_0_20px_rgba(96,165,250,0.6)] transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-blue-200 mt-4 text-sm bg-blue-900/40 inline-block px-3 py-1 rounded-lg">
        🎯 Earn <span className="font-bold text-white">{xpNeeded} XP</span> for Level {currentLevel + 1}
      </p>
    </div>
  </div>
);

const CourseGrid = ({ courses, loading, user, onGoToCourses, onGoToCourseDetail }) => (
  <div>
    <div className="flex justify-between items-end mb-4">
      <h2 className="text-xl font-bold flex items-center gap-2">🔭 Jump Back In</h2>
      <button onClick={onGoToCourses} className="cursor-pointer text-sm text-gray-400 hover:text-white transition">
        See All &rarr;
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {loading ? (
        <>
          <SkeletonBlock className="h-40 w-full" />
          <SkeletonBlock className="h-40 w-full" />
        </>
      ) : courses.length > 0 ? (
        courses.slice(0, 4).map(course => {
          const { percent, text } = calculateCourseProgress(course, user);
          return (
            <div
              key={course.id}
              onClick={() => onGoToCourseDetail(course.id)}
              className="bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50 p-6 rounded-3xl cursor-pointer transition-all duration-300 group relative overflow-hidden flex flex-col justify-between min-h-[160px]"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${course.color || 'bg-blue-500'} opacity-5 rounded-full blur-2xl group-hover:opacity-15 transition duration-500`} />
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className={`w-12 h-12 rounded-2xl ${course.color || 'bg-blue-600'} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition`}>
                    {course.icon || '📚'}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition">
                    ➜
                  </div>
                </div>
                <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{course.title}</h3>
                <p className="text-xs text-gray-400 line-clamp-2">{course.description}</p>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mb-1">
                  <span>Progress</span><span>{text}</span>
                </div>
                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div
          onClick={onGoToCourses}
          className="col-span-full border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-3xl p-10 text-center cursor-pointer group transition bg-gray-800/30"
        >
          <div className="text-5xl mb-4 opacity-50 group-hover:scale-110 transition">✨</div>
          <h3 className="text-xl font-bold text-white">Start your first adventure!</h3>
          <p className="text-sm text-gray-400 mt-2">Create a course to see it here.</p>
        </div>
      )}
    </div>
  </div>
);

const DailyQuestCard = ({ dailyQuest, onClaim }) => {
  const [msLeft, setMsLeft] = useState(getMsUntilNextLocalMidnight());

  useEffect(() => {
    const id = setInterval(() => setMsLeft(getMsUntilNextLocalMidnight()), 1000);
    return () => clearInterval(id);
  }, []);

  const countdown = useMemo(() => formatCountdown(msLeft), [msLeft]);

  const progress = dailyQuest?.progress || 0;
  const target = dailyQuest?.target || 0;
  const pct = target > 0 ? Math.round((progress / target) * 100) : 0;

  const completed = !!dailyQuest?.completed;
  const claimed = !!dailyQuest?.claimed;
  const rewardXp = dailyQuest?.rewardXp || 0;

  return (
    <div className="relative w-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-25 blur" />
      <div className="relative bg-gray-800 rounded-2xl p-6 border border-white/10 shadow-[0_10px_35px_rgba(0,0,0,0.35)]">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Daily Quest</span>
              {completed && !claimed && (
                <span className="bg-green-500/20 text-green-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                  READY
                </span>
              )}
              {claimed && (
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                  CLAIMED
                </span>
              )}
            </div>

            <div className="text-lg font-extrabold text-white truncate">
              {dailyQuest?.title || 'Loading daily quest...'}
            </div>
            <div className="text-sm text-gray-300 mt-1">
              {dailyQuest?.description || "Generating today's challenge."}
            </div>
          </div>

          <div className="text-right shrink-0">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Resets in</div>
            <div className="font-mono text-white text-sm bg-black/20 border border-white/10 px-3 py-1 rounded-lg mt-1">
              {countdown.text}
            </div>
            <div className="text-[10px] text-blue-300 font-bold mt-2">+{rewardXp} XP</div>
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-2">
            <span>Progress</span>
            <span className="text-white">{progress}/{target}</span>
          </div>

          <div className="w-full bg-gray-900/60 h-3 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-blue-400 to-purple-400 transition-all duration-700"
              style={{ width: `${Math.min(100, Math.max(0, pct))}%` }}
            />
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={onClaim}
              disabled={!completed || claimed}
              className="cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition"
            >
              {claimed ? 'Reward Claimed' : completed ? 'Claim Reward' : 'Complete Quest'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ user, isEditing, editForm, setEditForm, onSaveProfile, onCancelEdit, setIsEditing }) => (
  <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl overflow-hidden relative">
    <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-900/20 to-transparent" />
    {isEditing ? (
      <div className="relative z-10 space-y-4 animate-fade-in">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Update Profile</h3>
        {['nickname', 'age'].map(field => (
          <div key={field} className="space-y-1">
            <label className="text-xs text-blue-400 font-bold ml-1 uppercase">{field}</label>
            <input
              type={field === 'age' ? 'number' : 'text'}
              value={editForm[field]}
              onChange={e => setEditForm({ ...editForm, [field]: e.target.value })}
              className="w-full bg-gray-900 border border-gray-600 focus:border-blue-500 rounded-xl px-4 py-2 text-white text-sm focus:outline-none transition"
            />
          </div>
        ))}
        <div className="flex gap-2 mt-2">
          <button onClick={onSaveProfile} className="cursor-pointer flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-xl text-xs shadow-lg transition">
            Save
          </button>
          <button onClick={onCancelEdit} className="cursor-pointer flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-xl text-xs transition">
            Cancel
          </button>
        </div>
      </div>
    ) : (
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl font-bold border-4 border-gray-800 shadow-2xl mb-4">
          {user?.nickname?.[0]?.toUpperCase() || "U"}
        </div>
        <h2 className="text-2xl font-bold text-white">{user?.nickname}</h2>
        <p className="text-gray-400 text-sm mb-6">Cadet • Age {user?.stats?.age || "?"}</p>

        <div className="grid grid-cols-2 gap-3 w-full mb-6">
          <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
            <div className="text-blue-400 font-bold text-lg">{user?.stats?.xp || 0}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold">Total XP</div>
          </div>
          <div className="bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
            <div className="text-yellow-400 font-bold text-lg">{user?.stats?.totalStars || 0} ⭐</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold">Stars</div>
          </div>
        </div>

        <button
          onClick={() => setIsEditing(true)}
          className="cursor-pointer w-full bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-bold py-2.5 rounded-xl border border-gray-600 transition"
        >
          Edit Profile
        </button>
      </div>
    )}
  </div>
);

const DashboardView = ({
  user, courses = [], coursesLoading = false,
  isEditing, setIsEditing, editForm, setEditForm, onSaveProfile, onCancelEdit,
  onClaimDailyReward,
  onGoToCourses, onGoToCourseDetail
}) => {
  const currentLevel = user?.stats?.currentLevel || 1;
  const currentXP = user?.stats?.xp || 0;
  const progressPercent = Math.min(100, Math.max(0, (currentXP % 100)));
  const xpNeeded = 100 - (currentXP % 100);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen text-white">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Welcome back, <span className="text-blue-400 font-bold">{user?.nickname || "Cadet"}</span>. System ready.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-800/50 px-5 py-2 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
          <span className="text-2xl animate-pulse">🔥</span>
          <div>
            <div className="text-xl font-bold leading-none text-yellow-400">{user?.stats?.streakDays || 0}</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Day Streak</div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        <div className="lg:col-span-12">
          <HeroProgress currentLevel={currentLevel} progressPercent={progressPercent} xpNeeded={xpNeeded} />
        </div>

        <div className="lg:col-span-8 space-y-8">
          <CourseGrid
            courses={courses}
            loading={coursesLoading}
            user={user}
            onGoToCourses={onGoToCourses}
            onGoToCourseDetail={onGoToCourseDetail}
          />
        </div>

        <div className="lg:col-span-4 space-y-8">
          <ProfileCard
            user={user}
            isEditing={isEditing}
            editForm={editForm}
            setEditForm={setEditForm}
            onSaveProfile={onSaveProfile}
            onCancelEdit={onCancelEdit}
            setIsEditing={setIsEditing}
          />
        </div>

        <div className="lg:col-span-12">
          <DailyQuestCard dailyQuest={user?.dailyQuest} onClaim={onClaimDailyReward} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
