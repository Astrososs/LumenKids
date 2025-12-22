import { useState, useEffect } from 'react';
import { SkeletonBlock } from '../components/LoadingSkeletons';

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

const GoalSelectorModal = ({ courses, isOpen, onClose, onConfirm }) => {
    const [selectedCourseId, setSelectedCourseId] = useState(null);
    const [selectedMissions, setSelectedMissions] = useState([]);

    useEffect(() => {
        if (!isOpen) {
            setSelectedCourseId(null);
            setSelectedMissions([]);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const activeCourse = courses.find(c => c.id === selectedCourseId);

    const toggleMission = (title) => {
        setSelectedMissions(prev => 
            prev.includes(title) ? prev.filter(m => m !== title) : [...prev, title]
        );
    };

    const handleConfirm = () => {
        if (!activeCourse || selectedMissions.length === 0) return;
        const missionText = selectedMissions.length === 1 
            ? `Mission: "${selectedMissions[0]}"` 
            : `${selectedMissions.length} Missions: ${selectedMissions[0]}...`;
        onConfirm(`Complete ${missionText} in ${activeCourse.title}`);
    };

    return (
        <div className="fixed inset-0 bg-gray-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
            <div className="bg-gray-800 border border-gray-600 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                <div className="p-6 border-b border-gray-700 bg-gray-900 relative">
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Daily Mission
                    </h3>
                    <p className="text-gray-400 text-xs uppercase tracking-widest mt-1">Select parameters for today's mission</p>
                </div>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-800/50">
                    {!selectedCourseId ? (
                        <div className="space-y-3 animate-slide-in-right">
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">1. Select Sector</p>
                            {courses.length === 0 ? (
                                <div className="text-gray-500 text-center py-10 border-2 border-dashed border-gray-700 rounded-xl">No active sectors. Initialize a course first.</div>
                            ) : courses.map(course => (
                                <button key={course.id} onClick={() => setSelectedCourseId(course.id)} className="cursor-pointer w-full text-left bg-gray-700 hover:bg-gray-600 border-l-4 border-transparent hover:border-blue-500 p-4 rounded-r-xl transition-all flex items-center gap-4 group">
                                    <div className="text-2xl opacity-70 group-hover:opacity-100 group-hover:scale-110 transition">{course.icon || '📦'}</div>
                                    <div className="flex-1">
                                        <span className="font-bold text-white block group-hover:text-blue-300">{course.title}</span>
                                        <span className="text-[10px] text-gray-400 uppercase">{course.units?.length || 0} Units Detected</span>
                                    </div>
                                    <span className="text-gray-500 group-hover:text-blue-400 font-mono">➜</span>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-4 animate-slide-in-right">
                            <button onClick={() => { setSelectedCourseId(null); setSelectedMissions([]); }} className="cursor-pointer text-xs text-gray-400 hover:text-white flex items-center gap-2 mb-2 group">
                                <span className="group-hover:-translate-x-1 transition">←</span> Back to Sectors
                            </button>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="text-2xl">{activeCourse.icon}</div>
                                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Mission Select: <span className="text-white">{activeCourse.title}</span></p>
                            </div>
                            <div className="space-y-2">
                                {activeCourse.units?.flatMap(u => u.missions || []).map((mission, idx) => (
                                    <label key={idx} className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all ${selectedMissions.includes(mission.title) ? 'bg-blue-600/20 border-blue-500 shadow-lg' : 'bg-gray-700/30 border-gray-700 hover:bg-gray-700'}`}>
                                        <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${selectedMissions.includes(mission.title) ? 'bg-blue-500 border-blue-500' : 'border-gray-500 bg-gray-800'}`}>
                                            {selectedMissions.includes(mission.title) && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={selectedMissions.includes(mission.title)} onChange={() => toggleMission(mission.title)} />
                                        <span className={`text-sm ${selectedMissions.includes(mission.title) ? 'text-white font-bold' : 'text-gray-300'}`}>{mission.title}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-5 border-t border-gray-700 bg-gray-900 flex justify-between items-center">
                    <button onClick={onClose} className="cursor-pointer text-gray-400 hover:text-white text-xs font-bold uppercase tracking-wider transition px-2">Abort</button>
                    <button onClick={handleConfirm} disabled={selectedMissions.length === 0} className="cursor-pointer bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl text-sm font-bold shadow-lg transition active:scale-95 flex items-center gap-2">
                        <span>CONFIRM</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                    </button>
                </div>
            </div>
        </div>
    );
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
                <div className="h-full bg-gradient-to-r from-blue-400 to-purple-400 shadow-[0_0_20px_rgba(96,165,250,0.6)] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
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
            <button onClick={onGoToCourses} className="cursor-pointer text-sm text-gray-400 hover:text-white transition">See All &rarr;</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
                <><SkeletonBlock className="h-40 w-full" /><SkeletonBlock className="h-40 w-full" /></>
            ) : courses.length > 0 ? (
                courses.slice(0, 4).map(course => {
                    const { percent, text } = calculateCourseProgress(course, user);
                    return (
                        <div key={course.id} onClick={() => onGoToCourseDetail(course.id)} className="bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:border-blue-500/50 p-6 rounded-3xl cursor-pointer transition-all duration-300 group relative overflow-hidden flex flex-col justify-between h-full min-h-[160px]">
                            <div className={`absolute top-0 right-0 w-32 h-32 ${course.color || 'bg-blue-500'} opacity-5 rounded-full blur-2xl group-hover:opacity-15 transition duration-500`}></div>
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`w-12 h-12 rounded-2xl ${course.color || 'bg-blue-600'} flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition`}>{course.icon || '📚'}</div>
                                    <div className="w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition">➜</div>
                                </div>
                                <h3 className="font-bold text-lg text-white mb-1 line-clamp-1">{course.title}</h3>
                                <p className="text-xs text-gray-400 line-clamp-2">{course.description}</p>
                            </div>
                            <div className="mt-4">
                                <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold mb-1"><span>Progress</span><span>{text}</span></div>
                                <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full transition-all duration-1000 ${percent === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${percent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })
            ) : (
                <div onClick={onGoToCourses} className="col-span-full border-2 border-dashed border-gray-700 hover:border-blue-500 rounded-3xl p-10 text-center cursor-pointer group transition bg-gray-800/30">
                    <div className="text-5xl mb-4 opacity-50 group-hover:scale-110 transition">✨</div>
                    <h3 className="text-xl font-bold text-white">Start your first adventure!</h3>
                    <p className="text-sm text-gray-400 mt-2">Create a course to see it here.</p>
                </div>
            )}
        </div>
    </div>
);

const DailyGoalCard = ({ user, onOpenModal }) => (
    <div onClick={onOpenModal} className="relative w-full group cursor-pointer">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
        <div className="relative bg-gray-800 rounded-2xl p-6 flex items-center justify-between border border-gray-700">
            <div className="flex items-center gap-5 flex-1 min-w-0">
                <div className={`w-14 h-14 rounded-xl flex shrink-0 items-center justify-center text-2xl shadow-lg border border-white/10 ${user?.dailyGoal ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">Daily Mission</h3>
                        {user?.dailyGoal && <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-500/20 shrink-0">ACTIVE</span>}
                    </div>
                    <p className={`text-lg font-bold truncate ${user?.dailyGoal ? 'text-white' : 'text-gray-500 italic'}`}>{user?.dailyGoal || "No orders received. Tap to set mission."}</p>
                </div>
            </div>
            <button className="cursor-pointer ml-4 bg-gray-700 group-hover:bg-blue-600 text-gray-300 group-hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition flex shrink-0 items-center gap-2">
                <span>{user?.dailyGoal ? 'UPDATE' : 'SET GOAL'}</span><span className="text-lg leading-none">»</span>
            </button>
        </div>
    </div>
);

const ProfileCard = ({ user, isEditing, editForm, setEditForm, onSaveProfile, onCancelEdit, setIsEditing }) => (
    <div className="bg-gray-800 rounded-3xl p-6 border border-gray-700 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-blue-900/20 to-transparent"></div>
        {isEditing ? (
            <div className="relative z-10 space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Update Profile</h3>
                {['nickname', 'age'].map(field => (
                    <div key={field} className="space-y-1">
                        <label className="text-xs text-blue-400 font-bold ml-1 uppercase">{field}</label>
                        <input 
                            type={field === 'age' ? 'number' : 'text'}
                            value={editForm[field]} 
                            onChange={e => setEditForm({...editForm, [field]: e.target.value})} 
                            className="w-full bg-gray-900 border border-gray-600 focus:border-blue-500 rounded-xl px-4 py-2 text-white text-sm focus:outline-none transition"
                        />
                    </div>
                ))}
                <div className="flex gap-2 mt-2">
                    <button onClick={onSaveProfile} className="cursor-pointer flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-xl text-xs shadow-lg transition">Save</button>
                    <button onClick={onCancelEdit} className="cursor-pointer flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 rounded-xl text-xs transition">Cancel</button>
                </div>
            </div>
        ) : (
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-5xl font-bold border-4 border-gray-800 shadow-2xl mb-4">{user?.nickname?.[0]?.toUpperCase() || "U"}</div>
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
                <button onClick={() => setIsEditing(true)} className="cursor-pointer w-full bg-gray-700 hover:bg-gray-600 text-gray-200 text-xs font-bold py-2.5 rounded-xl border border-gray-600 transition">Edit Profile</button>
            </div>
        )}
    </div>
);

const Leaderboard = ({ user, leaderboard, safeEmail, setFriendEmail, onAddFriend, onRemoveFriend, isSocialLoading }) => (
    <div className="bg-gray-900 rounded-3xl border border-gray-800 p-6 shadow-xl flex flex-col h-[400px]">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-4">🏆 Friends</h2>
        <form onSubmit={(e) => { e.preventDefault(); onAddFriend(); }} className="flex gap-2 mb-4">
            <input value={safeEmail} onChange={(e) => setFriendEmail(e.target.value)} placeholder="Add friend..." className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition"/>
            <button disabled={!safeEmail.trim()} type="submit" className="cursor-pointer bg-blue-600 hover:bg-blue-500 text-white font-bold px-3 rounded-xl text-lg leading-none transition shadow-lg">+</button>
        </form>
        <div className="space-y-2 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-gray-800">
            {isSocialLoading ? <SkeletonBlock className="h-12 w-full" /> : leaderboard.length === 0 ? <div className="text-center py-10 text-gray-500 text-xs">No friends yet.</div> : leaderboard.map((player, idx) => {
                const isUser = player.uid === user.uid;
                return (
                    <div key={player.uid} className={`flex items-center justify-between p-3 rounded-xl border transition hover:bg-gray-800 ${isUser ? 'bg-blue-900/10 border-blue-500/30' : 'bg-transparent border-transparent'}`}>
                        <div className="flex items-center gap-3">
                            <span className={`font-bold w-4 text-center text-sm ${idx < 3 ? 'text-yellow-400' : 'text-gray-600'}`}>{idx + 1}</span>
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-white border border-gray-600">{player.nickname?.[0] || "?"}</div>
                            <div className="text-sm font-bold text-gray-300 truncate max-w-[80px]">{player.nickname}</div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-blue-400">{player.stats?.xp}</span>
                            {!isUser && <button onClick={() => onRemoveFriend(player.uid)} className="cursor-pointer text-gray-600 hover:text-red-400 transition ml-1"><span className="text-sm">🗑️</span></button>}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
);

const DashboardView = ({ 
    user, courses = [], coursesLoading = false, friends = [], 
    friendEmail = "", setFriendEmail, onAddFriend, onRemoveFriend, isSocialLoading,
    isEditing, setIsEditing, editForm, setEditForm, onSaveProfile, onCancelEdit,
    isGoalModalOpen, setIsGoalModalOpen, onSetGoal, 
    onGoToCourses, onGoToCourseDetail 
}) => {
    const safeFriends = Array.isArray(friends) ? friends : [];
    const leaderboard = [...safeFriends, user].filter(p => p).sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0));
    const safeEmail = friendEmail || "";
    
    const currentLevel = user?.stats?.currentLevel || 1;
    const currentXP = user?.stats?.xp || 0;
    const progressPercent = Math.min(100, Math.max(0, (currentXP % 100)));
    const xpNeeded = 100 - (currentXP % 100);

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto min-h-screen text-white">
            <GoalSelectorModal courses={courses} isOpen={isGoalModalOpen} onClose={() => setIsGoalModalOpen(false)} onConfirm={onSetGoal} />

            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Welcome back, <span className="text-blue-400 font-bold">{user?.nickname || "Cadet"}</span>. System ready.</p>
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
                <div className="lg:col-span-8 space-y-8">
                    <HeroProgress currentLevel={currentLevel} progressPercent={progressPercent} xpNeeded={xpNeeded} />
                    <CourseGrid courses={courses} loading={coursesLoading} user={user} onGoToCourses={onGoToCourses} onGoToCourseDetail={onGoToCourseDetail} />
                    <DailyGoalCard user={user} onOpenModal={() => setIsGoalModalOpen(true)} />
                </div>
                <div className="lg:col-span-4 space-y-8">
                    <ProfileCard user={user} isEditing={isEditing} editForm={editForm} setEditForm={setEditForm} onSaveProfile={onSaveProfile} onCancelEdit={onCancelEdit} setIsEditing={setIsEditing} />
                    <Leaderboard user={user} leaderboard={leaderboard} safeEmail={safeEmail} setFriendEmail={setFriendEmail} onAddFriend={onAddFriend} onRemoveFriend={onRemoveFriend} isSocialLoading={isSocialLoading} />
                </div>
            </div>
        </div>
    );
};

export default DashboardView;