import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadSubjects } from '../store/slices/courseSlice'; 
import CoursesView from '../views/pages/CoursesView';

export default function CoursesPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { subjects, loading } = useSelector((state) => state.course);

  useEffect(() => {
    dispatch(loadSubjects());
  }, [dispatch]);

  const handleSubjectClick = (subjectId) => {
    navigate(`/courses/${subjectId}`);
  };

  if (loading) return <div className="p-10 text-white">Loading Courses...</div>;

  return (
    <CoursesView 
      subjects={subjects}
      onSelectSubject={handleSubjectClick}
    />
  );
}