import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2'; 
import { loadActiveCourse, updateCourse, modifyCourseWithAi } from '../store/slices/courseSlice';
import SubjectView from '../views/pages/SubjectView';
// Import the locking logic [cite: 11]
import { getUnitLockStatus } from '../utils/missionLogic';

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

  const handleDeleteUnit = async (index) => {
    const result = await Swal.fire({
        title: 'Delete Unit?',
        text: "This unit will be removed from the course layout.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#374151',
        confirmButtonText: 'Yes, delete it',
        background: '#1f2937',
        color: '#fff'
    });
    
    if (result.isConfirmed) {
        const newUnits = editedCourse.units.filter((_, i) => i !== index);
        setEditedCourse({ ...editedCourse, units: newUnits });
    }
  };

  const handleSave = async () => {
    await dispatch(updateCourse({ uid: user.uid, courseId: activeCourse.id, courseData: editedCourse }));
    setIsEditing(false);
    
    Swal.fire({
        icon: 'success',
        title: 'Changes Saved!',
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 2000,
        background: '#1f2937',
        color: '#fff'
    });
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
    
    Swal.fire({
        icon: 'success',
        title: 'AI Update Complete!',
        text: 'Lumen has updated your course.',
        background: '#1f2937',
        color: '#fff'
    });
  };

  /**
   * ENFORCES UNIT LOCKING
   * Checks progress before navigating to ensure the previous exam is passed. [cite: 10, 11]
   */
  const handleSelectMission = (missionId) => {
    if (isEditing) return; 

    // Find the index of the unit containing this mission
    const currentUnits = activeCourse?.units || [];
    const unitIndex = currentUnits.findIndex(u => 
      u.missions?.some(m => m.id === missionId)
    );

    // Validate lock status [cite: 11]
    const isLocked = getUnitLockStatus(unitIndex, currentUnits, user?.progress || {});

    if (isLocked) {
      Swal.fire({
        title: 'Unit Locked! 🔒',
        text: 'You need to pass the previous unit\'s Boss Exam to unlock this mission!',
        icon: 'error',
        confirmButtonColor: '#2563eb',
        background: '#1f2937',
        color: '#fff'
      });
      return;
    }

    navigate(`/mission/${missionId}`);
  };

  return (
    <SubjectView 
        subject={isEditing ? editedCourse : activeCourse} 
        units={isEditing ? editedCourse?.units : activeCourse?.units} 
        completedMissions={user?.progress || {}}
        isLoading={loading} 
        
        onBack={() => navigate('/courses')}
        onSelectMission={handleSelectMission}
        
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleSave}
        onCancel={handleCancel}
        
        onRenameUnit={handleUnitChange}
        onReorderUnit={handleReorderUnit}
        onDeleteUnit={handleDeleteUnit}
        
        aiPrompt={aiPrompt}
        setAiPrompt={setAiPrompt}
        onAiEdit={handleAiEdit}
        isAiProcessing={isAiProcessing}
    />
  );
}