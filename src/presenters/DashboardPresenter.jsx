import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { updateUserProfile, ensureDailyQuest, claimDailyQuestReward } from '../store/slices/userSlice';
import { loadCourses } from '../store/slices/courseSlice';
import DashboardView from '../views/pages/DashboardView';


export default function DashboardPresenter() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data: user } = useSelector((state) => state.user);
  const { list: courses, loading: coursesLoading } = useSelector((state) => state.courses);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ nickname: '', age: '' });
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    if (user?.uid) {
      dispatch(loadCourses(user.uid));
      dispatch(ensureDailyQuest({ uid: user.uid }));
      setEditForm({ nickname: user.nickname || '', age: user.stats?.age || 10 });
    }
  }, [dispatch, user?.uid]);

  const handleSaveProfile = async () => {
    if (!editForm.nickname.trim()) return;
    await dispatch(
      updateUserProfile({
        uid: user.uid,
        data: {
          nickname: editForm.nickname,
          'stats.age': parseInt(editForm.age) || 10,
        },
      })
    );
    setIsEditing(false);
  };

  const handleClaimDailyReward = async () => {
    if (!user?.uid || claiming) return;
    setClaiming(true);
    const res = await dispatch(claimDailyQuestReward({ uid: user.uid }));

    if (res.meta.requestStatus === 'fulfilled') {
      Swal.fire({
        icon: 'success',
        title: 'Daily Quest Complete!',
        text: `+${res.payload?.dailyQuest?.rewardXp ?? 0} XP awarded`,
        toast: true,
        position: 'top-end',
        timer: 2000,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#fff',
      });
    } else {
      Swal.fire({
        icon: 'info',
        title: 'Not ready yet',
        text: res.payload || 'Complete the quest first.',
        toast: true,
        position: 'top-end',
        timer: 2200,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#fff',
      });
    }

    setClaiming(false);
  };

  return (
    <DashboardView
      user={user}
      courses={courses}
      coursesLoading={coursesLoading}
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      editForm={editForm}
      setEditForm={setEditForm}
      onSaveProfile={handleSaveProfile}
      onCancelEdit={() => setIsEditing(false)}
      onClaimDailyReward={handleClaimDailyReward}
      onGoToCourses={() => navigate('/courses')}
      onGoToCourseDetail={(id) => navigate(`/courses/${id}`)}
      onGoToChat={() => navigate('/chat')}
    />
  );
}