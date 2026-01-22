import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Swal from 'sweetalert2';
import { loadActiveCourse, updateCourse, modifyCourseWithAi } from '../store/slices/courseSlice';
import SubjectView from '../views/pages/SubjectView';
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (subjectId && user?.uid) {
      if (!activeCourse || activeCourse.id !== subjectId) {
        dispatch(loadActiveCourse({ uid: user.uid, courseId: subjectId }));
      }
    }
  }, [subjectId, user?.uid, dispatch]);

  useEffect(() => {
    if (activeCourse && activeCourse.id === subjectId) {
      setEditedCourse(JSON.parse(JSON.stringify(activeCourse)));
    }
  }, [activeCourse, subjectId]);

  const handleUnitChange = (index, field, value) => {
    setEditedCourse(prev => {
      if (!prev || !prev.units) return prev;
      
      const newUnits = [...prev.units];
      newUnits[index] = { ...newUnits[index], [field]: value };
      
      const updated = { ...prev, units: newUnits };
      return updated;
    });
  };

  const handleReorderUnit = (index, direction) => {
    setEditedCourse(prev => {
      if (!prev || !prev.units) return prev;
      
      const newUnits = [...prev.units];
      const targetIndex = index + direction;
      
      if (targetIndex >= 0 && targetIndex < newUnits.length) {
        [newUnits[index], newUnits[targetIndex]] = [newUnits[targetIndex], newUnits[index]];
        const updated = { ...prev, units: newUnits };
        return updated;
      }
      
      return prev;
    });
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
      setEditedCourse(prev => {
        if (!prev || !prev.units) return prev;
        const newUnits = prev.units.filter((_, i) => i !== index);
        return { ...prev, units: newUnits };
      });
    }
  };

  const handleSave = async () => {
    if (!editedCourse || !user?.uid || !activeCourse?.id) return;
    
    setIsSaving(true);
    
    try {
      await dispatch(updateCourse({
        uid: user.uid,
        courseId: activeCourse.id,
        courseData: editedCourse
      })).unwrap();
      
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
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Could not save changes. Please try again.',
        background: '#1f2937',
        color: '#fff'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (activeCourse) {
      setEditedCourse(JSON.parse(JSON.stringify(activeCourse)));
    }
  };

  const handleAiEdit = async () => {
    if (!aiPrompt.trim() || !user?.uid || !activeCourse) return;
    
    setIsAiProcessing(true);
    
    try {
      await dispatch(modifyCourseWithAi({
        uid: user.uid,
        course: activeCourse,
        instruction: aiPrompt,
        age: user.stats?.age || 10
      })).unwrap();
      
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
    } catch (error) {
      setIsAiProcessing(false);
      
      Swal.fire({
        icon: 'error',
        title: 'AI Update Failed',
        text: 'Could not update course with AI. Please try again.',
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  const handleSelectMission = (missionId) => {
    if (isEditing) return;
    
    const currentUnits = activeCourse?.units || [];
    const unitIndex = currentUnits.findIndex(u =>
      u.missions?.some(m => m.id === missionId)
    );
    
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

  const displayCourse = isEditing ? editedCourse : activeCourse;

  return (
    <SubjectView
      subject={displayCourse}
      units={displayCourse?.units || []}
      completedMissions={user?.progress || {}}
      onBack={() => navigate('/courses')}
      onSelectMission={handleSelectMission}
      isLoading={loading}
      isEditing={isEditing}
      onRenameUnit={handleUnitChange}
      onReorderUnit={handleReorderUnit}
      onDeleteUnit={handleDeleteUnit}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={handleCancel}
      aiPrompt={aiPrompt}
      setAiPrompt={setAiPrompt}
      onAiEdit={handleAiEdit}
      isAiProcessing={isAiProcessing}
      isSaving={isSaving}
    />
  );
}