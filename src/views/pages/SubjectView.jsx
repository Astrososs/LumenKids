
const SubjectView = ({ subject, units, onBack, onStartMission }) => {
  return (
    <div className="p-6 max-w-5xl mx-auto min-h-screen">
      

      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition">
            ←
        </button>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <span className="text-4xl">{subject.icon}</span> 
            {subject.title}
        </h1>
      </div>


      <div className="space-y-12">
        {units.map((unit) => (
            <div key={unit.id} className="animate-fade-in-up">
                

                <div className={`p-6 rounded-t-3xl ${subject.color} shadow-lg border-b-4 border-black/20`}>
                    <h2 className="text-2xl font-bold text-white">{unit.title}</h2>
                    <p className="text-white/80">{unit.description}</p>
                </div>


                <div className="bg-gray-800 p-6 rounded-b-3xl border-x border-b border-gray-700 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {unit.missions.length > 0 ? (
                        unit.missions.map((mission) => (
                            <div 
                                key={mission.id}
                                onClick={() => onStartMission(mission.id)}
                                className="bg-gray-700 p-4 rounded-xl flex items-center justify-between cursor-pointer hover:bg-gray-600 hover:scale-[1.02] transition-all duration-200 border-2 border-transparent hover:border-blue-400 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-inner ${
                                        mission.difficulty === 1 ? "bg-green-500 text-green-900" : "bg-orange-500 text-orange-900"
                                    }`}>
                                        {mission.difficulty}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-white group-hover:text-blue-300 transition">{mission.title}</h3>
                                        <span className="text-xs text-gray-400">+{mission.xpReward} XP</span>
                                    </div>
                                </div>

                                <span className="text-2xl opacity-0 group-hover:opacity-100 transition transform translate-x-[-10px] group-hover:translate-x-0">
                                    ▶
                                </span>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 italic p-4">More missions coming soon...</div>
                    )}
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default SubjectView;