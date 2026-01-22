import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  loadCourses, 
  createCourse, 
  setActiveCourse, 
  deleteCourse,  
  courseAdded 
} from '../store/slices/courseSlice';
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
    const result = await dispatch(createCourse({
      uid: user.uid,
      topic,
      age: user.stats?.age || 10
    }));
    
    if (createCourse.fulfilled.match(result)) {
      dispatch(courseAdded(result.payload));
      
      Swal.fire({
        icon: 'success',
        title: 'Course Created!',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        background: '#1f2937',
        color: '#fff'
      });
    }
    
    setIsCreating(false);
    setTopic("");
  };

  const handleSelectCourse = (courseId) => {
    dispatch(setActiveCourse(courseId));
    navigate(`/courses/${courseId}`);
  };

  const handleDeleteCourse = async (courseId) => {
    const result = await Swal.fire({
      title: 'Delete Course?',
      text: "All your progress in this course will be lost forever!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Delete Course',
      background: '#1f2937',
      color: '#fff'
    });

    if (result.isConfirmed) {
      await dispatch(deleteCourse({ uid: user.uid, courseId }));
      
      Swal.fire({
        title: 'Deleted!',
        text: 'Course has been removed.',
        icon: 'success',
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  return (
    <CoursesView
      subjects={courses}
      onSelectSubject={handleSelectCourse}
      onDeleteSubject={handleDeleteCourse}
      isLoading={loading}
      isCreating={isCreating}
      topic={topic}
      onTopicChange={setTopic}
      onCreateCourse={handleCreate}
      error={error}
    />
  );
}