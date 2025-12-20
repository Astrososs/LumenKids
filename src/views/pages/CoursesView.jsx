import { CourseCardSkeleton } from '../components/LoadingSkeletons';

const CoursesView = ({ 
  subjects, onSelectSubject, onDeleteSubject, 
  isLoading, isCreating, 
  topic, onTopicChange, onCreateCourse, error 
}) => {
  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      
    
      <div className="mb-10 p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
        <h2 className="text-2xl text-white font-bold mb-4 flex items-center gap-2">
            ✨ Magic Course Generator
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            value={topic}
            onChange={(e) => onTopicChange(e.target.value)}
            placeholder="e.g. Dinosaurs, Black Holes, Pirates..."
            className="flex-1 p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
            disabled={isCreating} 
          />
          <button 
            onClick={onCreateCourse}
            disabled={isCreating || !topic.trim()}
            className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold transition transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {isCreating ? "Generating..." : "Create Course 🚀"}
          </button>
        </div>
        {error && <p className="text-red-400 mt-3 font-medium">⚠️ {error}</p>}
      </div>
      

      <h1 className="text-3xl font-bold text-white mb-2">Explore Courses 🔭</h1>
      <p className="text-gray-400 mb-8">Choose a subject to start your adventure!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {isCreating && (
           <div className="relative overflow-hidden rounded-2xl p-6 border-2 border-blue-500 bg-gray-800 animate-pulse flex flex-col justify-center items-center text-center">
               <div className="text-5xl mb-4 animate-bounce">🤖</div>
               <h3 className="text-xl font-bold text-white">Building Course...</h3>
               <p className="text-sm text-blue-300 mt-2">AI is writing lessons & quizzes!</p>
           </div>
        )}

        {isLoading && subjects.length === 0 && (
           <>
             <CourseCardSkeleton />
             <CourseCardSkeleton />
             <CourseCardSkeleton />
           </>
        )}

        {subjects.map((subject) => (
          <div 
            key={subject.id}
            onClick={() => onSelectSubject(subject.id)}
            className={`
              relative overflow-hidden rounded-2xl p-6 cursor-pointer group 
              border border-gray-700 hover:border-white transition-all duration-300
              hover:shadow-2xl transform hover:-translate-y-1 bg-gray-800
            `}
          >
            <div className={`absolute top-0 right-0 w-32 h-32 ${subject.color || 'bg-blue-600'} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 transition-opacity group-hover:opacity-20`}></div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    onDeleteSubject(subject.id);
                }}
                className="cursor-pointer absolute top-4 right-4 z-20 text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-700 transition"
                title="Delete Course"
            >
                🗑️
            </button>

            <div className="relative z-10 flex flex-col h-full">
              <div className={`w-14 h-14 rounded-xl ${subject.color || 'bg-blue-600'} flex items-center justify-center text-3xl mb-4 shadow-lg`}>
                {subject.icon || '📚'}
              </div>

              <h3 className="text-2xl font-bold text-white mb-2">{subject.title}</h3>
              <p className="text-gray-400 mb-6 flex-grow line-clamp-3">{subject.description}</p>

              <div className="flex items-center text-blue-400 font-bold group-hover:text-white transition">
                <span>Start Learning</span>
                <span className="ml-2 transform group-hover:translate-x-2 transition">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CoursesView;