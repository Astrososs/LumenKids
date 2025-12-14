import { useNavigate } from 'react-router-dom';
import { getSubjects } from '../models/missionModel'; 
import CoursesView from '../views/pages/CoursesView';

export default function CoursesPresenter() {
  const navigate = useNavigate();
  const subjects = getSubjects();

  const handleSubjectClick = (subjectId) => {

    navigate(`/courses/${subjectId}`);
  };

  return (
    <CoursesView 
      subjects={subjects}
      onSelectSubject={handleSubjectClick}
    />
  );
}