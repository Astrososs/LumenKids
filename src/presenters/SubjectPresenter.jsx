import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  getSubjectById, 
  getUnitsBySubject,
  getMissionsByUnit  
} from '../models/missionModel';
import SubjectView from '../views/pages/SubjectView';

export default function SubjectPresenter() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  
  const subject = getSubjectById(subjectId);

  const unitsRaw = getUnitsBySubject(subjectId);

  const units = unitsRaw.map(unit => ({
    ...unit,
    missions: getMissionsByUnit(unit.id)
  }));


  const { data: user } = useSelector((state) => state.user);
  const completedMissions = user?.progress || {};

  const handleBack = () => {
    navigate('/courses');
  };

  const handleSelectMission = (missionId) => {
    navigate(`/mission/${missionId}`);
  };

  return (
    <SubjectView 
      subject={subject}
      units={units} 
      completedMissions={completedMissions}
      onBack={handleBack}
      onSelectMission={handleSelectMission}
    />
  );
}