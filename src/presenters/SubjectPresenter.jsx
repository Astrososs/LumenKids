import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { loadActiveCourse, updateCourse, modifyCourseWithAi } from '../store/slices/courseSlice';
import SubjectView from '../views/pages/SubjectView';

export default function SubjectPresenter() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { activeCourse, loading } = useSelector((state) => state.courses);
  const { data: user } = useSelector((state) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedCourse, setEditedCourse] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  useEffect(() => {

    if (subjectId && user?.uid) {

       if (!activeCourse || activeCourse.id !== subjectId) {
           dispatch(loadActiveCourse({ uid: user.uid, courseId: subjectId }));
       }
    }
  }, [subjectId, user?.uid, activeCourse, dispatch]);


  useEffect(() => {
    if (activeCourse) {
       setEditedCourse(JSON.parse(JSON.stringify(activeCourse))); 
    }
  }, [activeCourse]);


  const handleUnitChange = (index, field, value) => {
    const newUnits = [...editedCourse.units];
    newUnits[index] = { ...newUnits[index], [field]: value };
    setEditedCourse({ ...editedCourse, units: newUnits });
  };

  const handleReorderUnit = (index, direction) => {
    const newUnits = [...editedCourse.units];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newUnits.length) {
        [newUnits[index], newUnits[targetIndex]] = [newUnits[targetIndex], newUnits[index]];
        setEditedCourse({ ...editedCourse, units: newUnits });
    }
  };

  const handleDeleteUnit = (index) => {
    if(!window.confirm("Delete this unit?")) return;
    const newUnits = editedCourse.units.filter((_, i) => i !== index);
    setEditedCourse({ ...editedCourse, units: newUnits });
  };

  const handleSave = async () => {
    await dispatch(updateCourse({ uid: user.uid, courseId: activeCourse.id, courseData: editedCourse }));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (activeCourse) setEditedCourse(JSON.parse(JSON.stringify(activeCourse)));
  };

  const handleAiEdit = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiProcessing(true);
    await dispatch(modifyCourseWithAi({ uid: user.uid, course: activeCourse, instruction: aiPrompt, age: user.stats?.age || 10 }));
    setAiPrompt("");
    setIsAiProcessing(false);
    setIsEditing(false); 
  };

  const handleSelectMission = (missionId) => {
    if (isEditing) return; 
    navigate(`/mission/${missionId}`);
  };

  return (
    <div className="relative">
      <div className="bg-gray-800 border-b border-gray-700 p-4 sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 shadow-md">
         <button onClick={() => navigate('/courses')} className="text-gray-400 hover:text-white">← Back</button>
         <div className="flex items-center gap-2">
             {isEditing ? (
                 <>
                    <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold">Save Changes</button>
                    <button onClick={handleCancel} className="text-red-400 hover:text-white px-4">Cancel</button>
                 </>
             ) : (
                 <button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"><span>✏️</span> Edit Course</button>
             )}
         </div>
      </div>

      {isEditing && (
         <div className="max-w-5xl mx-auto mt-6 p-6 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-xl border border-blue-500/50 mx-4">
            <h3 className="text-blue-200 font-bold mb-2 flex items-center gap-2">🤖 AI Assistant Editor</h3>
            <div className="flex gap-2">
                <input value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} placeholder="e.g. 'Add a unit about Black Holes'" className="flex-1 bg-gray-900/80 text-white border border-gray-600 rounded-lg p-3" disabled={isAiProcessing} />
                <button onClick={handleAiEdit} disabled={isAiProcessing} className="bg-purple-600 hover:bg-purple-500 text-white px-6 rounded-lg font-bold disabled:opacity-50">{isAiProcessing ? "Thinking..." : "✨ Magic Edit"}</button>
            </div>
         </div>
      )}

      <div className={isEditing ? "border-2 border-dashed border-blue-500/30 m-4 rounded-xl p-4" : ""}>
          <SubjectView 
            subject={isEditing ? editedCourse : activeCourse} 
            units={isEditing ? editedCourse?.units : activeCourse?.units} 
            completedMissions={user?.progress || {}}
            onBack={() => {}} 
            onSelectMission={handleSelectMission}
            isLoading={loading} 
            isEditing={isEditing}
            onRenameUnit={handleUnitChange}
            onReorderUnit={handleReorderUnit}
            onDeleteUnit={handleDeleteUnit}
          />
      </div>
    </div>
  );
}