
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadCourses, createCourse, setActiveCourse, deleteCourse } from '../store/slices/courseSlice';
import CoursesView from '../views/pages/CoursesView';

export default function CoursesPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { data: user } = useSelector((state) => state.user);
  const { list: courses, loading, error } = useSelector((state) => state.courses);

  const [isCreating, setIsCreating] = useState(false);
  const [topic, setTopic] = useState("");

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadCourses(user.uid));
    }
  }, [dispatch, user]);

  const handleCreate = async () => {
    if (!topic.trim()) return;
    setIsCreating(true); 
    await dispatch(createCourse({ 
      uid: user.uid, 
      topic, 
      age: user.stats?.age || 10 
    }));
    setIsCreating(false);
    setTopic("");
  };

  const handleSelectCourse = (courseId) => {
    dispatch(setActiveCourse(courseId));
    navigate(`/courses/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course? All progress will be lost!")) {
        await dispatch(deleteCourse({ uid: user.uid, courseId }));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-10 p-8 bg-gray-800 rounded-2xl border border-gray-700 shadow-xl">
        <h2 className="text-2xl text-white font-bold mb-4 flex items-center gap-2">
            ✨ Magic Course Generator
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Dinosaurs, Black Holes, Pirates..."
            className="flex-1 p-4 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition"
            disabled={isCreating} 
          />
          <button 
            onClick={handleCreate}
            disabled={isCreating || !topic.trim()}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold transition transform hover:scale-105 disabled:opacity-50 disabled:scale-100"
          >
            {isCreating ? "Generating..." : "Create Course 🚀"}
          </button>
        </div>
        {error && <p className="text-red-400 mt-3 font-medium">⚠️ {error}</p>}
      </div>

      <CoursesView 
        subjects={courses} 
        isLoading={loading}
        isCreating={isCreating}
        onSelectSubject={handleSelectCourse} 
        onDeleteSubject={handleDeleteCourse}
      />
    </div>
  );
}
