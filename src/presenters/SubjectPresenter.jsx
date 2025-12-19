import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadSubjectDetails } from '../store/slices/courseSlice'; 
import SubjectView from '../views/pages/SubjectView';

export default function SubjectPresenter() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { activeSubject, activeUnits, loading } = useSelector((state) => state.course);
  const { data: user } = useSelector((state) => state.user);
  const completedMissions = user?.progress || {};

  useEffect(() => {
    if (subjectId) {
        dispatch(loadSubjectDetails(subjectId));
    }
  }, [subjectId, dispatch]);

  const handleBack = () => {
    navigate('/courses');
  };

  const handleSelectMission = (missionId) => {
    navigate(`/mission/${missionId}`);
  };

  if (loading) return <div className="p-10 text-white animate-pulse">Loading Subject...</div>;

  return (
    <SubjectView 
      subject={activeSubject}
      units={activeUnits} 
      completedMissions={completedMissions}
      onBack={handleBack}
      onSelectMission={handleSelectMission}
    />
  );
}