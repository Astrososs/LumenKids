import { useParams, useNavigate } from 'react-router-dom';
import { getSubjects, getUnitsBySubject, getMissionsByUnit } from '../models/missionModel';
import SubjectView from '../views/pages/SubjectView';

export default function SubjectPresenter() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const allSubjects = getSubjects();
  const subjectInfo = allSubjects.find(s => s.id === subjectId);

  if (!subjectInfo) return <div>Subject not found</div>;


  const units = getUnitsBySubject(subjectId);


  const unitsWithMissions = units.map(unit => ({
    ...unit,
    missions: getMissionsByUnit(unit.id)
  }));

  const handleMissionClick = (missionId) => {
    navigate(`/mission/${missionId}`);
  };

  return (
    <SubjectView 
      subject={subjectInfo}
      units={unitsWithMissions}
      onBack={() => navigate('/courses')}
      onStartMission={handleMissionClick}
    />
  );
}