import { UnitRowSkeleton } from '../components/LoadingSkeletons';

const SubjectView = ({ 
  subject, units, completedMissions, 
  onBack, onSelectMission, isLoading,
  isEditing, onRenameUnit, onReorderUnit, onDeleteUnit
}) => {
  
  const getMissionStyle = (type) => {
    switch (type) {
      case 'theory': return { icon: '📖', label: 'Lesson', color: 'bg-blue-500/20 border-blue-500 text-blue-300' };
      case 'quiz': return { icon: '🧩', label: 'Quiz', color: 'bg-purple-500/20 border-purple-500 text-purple-300' };
      case 'exam': return { icon: '🏆', label: 'Boss', color: 'bg-orange-500/20 border-orange-500 text-orange-300' };
      default: return { icon: '⭐', label: 'Activity', color: 'bg-gray-700 border-gray-600 text-gray-300' };
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10 min-h-screen">
      

      <div className="flex items-center gap-4 border-b border-gray-700 pb-8">
        <button onClick={onBack} className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-white transition">← Back</button>
        <div>
           <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">{subject?.icon || '📚'}</span>
              {subject?.title || <span className="animate-pulse bg-gray-700 h-8 w-40 rounded"></span>}
           </h1>
           <p className="text-gray-400">{subject?.description || "Explore the units below..."}</p>
        </div>
      </div>


      {isLoading && (!units || units.length === 0) && (
         <div className="space-y-6">
             <UnitRowSkeleton />
             <UnitRowSkeleton />
         </div>
      )}


      {units && units.map((unit, index) => (
        <div key={unit.id || index} className={`space-y-4 animate-fade-in-up ${isEditing ? 'p-4 border border-dashed border-gray-600 rounded-xl bg-gray-800/30' : ''}`}>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div className="flex-1">
                    {isEditing ? (
                        <div className="space-y-2">
                            <input value={unit.title} onChange={(e) => onRenameUnit(index, 'title', e.target.value)} className="w-full bg-gray-900 border border-blue-500 rounded p-2 text-white font-bold" />
                            <input value={unit.description} onChange={(e) => onRenameUnit(index, 'description', e.target.value)} className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-gray-300 text-sm" />
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-white">{unit.title}</h2>
                            <p className="text-gray-400 text-sm">{unit.description}</p>
                        </>
                    )}
                </div>

                {isEditing ? (
                    <div className="flex items-center gap-2">
                        <button onClick={() => onReorderUnit(index, -1)} disabled={index === 0} className="p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-30">⬆️</button>
                        <button onClick={() => onReorderUnit(index, 1)} disabled={index === units.length - 1} className="p-2 bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-30">⬇️</button>
                        <button onClick={() => onDeleteUnit(index)} className="p-2 bg-red-900/50 text-red-400 rounded hover:bg-red-900 border border-red-800">🗑️</button>
                    </div>
                ) : (
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-widest bg-gray-800 px-3 py-1 rounded-full">
                        {unit.missions ? unit.missions.length : 0} Missions
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {unit.missions && unit.missions.map(mission => {
                    const style = getMissionStyle(mission.type);
                    const isCompleted = completedMissions?.[mission.id]; 

                    return (
                        <div 
                        key={mission.id}
                        onClick={() => !isEditing && onSelectMission(mission.id)}
                        className={`relative group flex items-center gap-4 p-5 rounded-xl border-2 transition-all duration-300 ${isEditing ? 'opacity-70 cursor-default border-gray-700 bg-gray-900' : 'cursor-pointer hover:scale-[1.02] hover:shadow-xl bg-gray-800 border-gray-700'} ${isCompleted ? 'bg-gray-800/80 border-green-500/50' : ''}`}
                        >
                            {isCompleted && !isEditing && <div className="absolute top-[-10px] right-[-10px] bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-10">✅</div>}
                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-inner ${style.color}`}>{style.icon}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider mb-1 inline-block ${style.color.replace('bg-', 'bg-opacity-10 ')}`}>{style.label}</span>
                                    <span className="text-xs text-yellow-500 font-bold">+{mission.xpReward} XP</span>
                                </div>
                                <h3 className={`text-base font-bold transition ${isCompleted ? 'text-green-400' : 'text-white'}`}>{mission.title}</h3>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="w-full h-px bg-gray-800 mt-8"></div>
        </div>
      ))}
    </div>
  );
};

export default SubjectView;