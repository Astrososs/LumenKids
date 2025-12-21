import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { 
  addFriendThunk, 
  removeFriendThunk, 
  updateUserProfile 
} from '../store/slices/userSlice';
import { loadCourses } from '../store/slices/courseSlice';
import { fetchMultipleUserProfiles } from '../models/userModel';
import DashboardView from '../views/pages/DashboardView';

export default function DashboardPresenter() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { data: user } = useSelector((state) => state.user);
    const { list: courses, loading: coursesLoading } = useSelector((state) => state.courses);

    const [friendsProfiles, setFriendsProfiles] = useState([]);
    const [friendEmail, setFriendEmail] = useState("");
    const [isSocialLoading, setIsSocialLoading] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ nickname: '', age: '' });

    const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
    
    useEffect(() => {
        if (user?.uid) {
            dispatch(loadCourses(user.uid));

            if (user.friends?.length > 0) {
                setIsSocialLoading(true);
                fetchMultipleUserProfiles(user.friends).then(profiles => {
                    setFriendsProfiles(profiles);
                    setIsSocialLoading(false);
                });
            } else {
                setFriendsProfiles([]);
            }

            setEditForm({ nickname: user.nickname || '', age: user.stats?.age || 10 });
        }
    }, [dispatch, user?.uid, user?.friends]);


    const handleAddFriend = async () => {
        if (!friendEmail.trim()) return;
        const result = await dispatch(addFriendThunk({ uid: user.uid, friendEmail }));
        if (addFriendThunk.fulfilled.match(result)) {
            setFriendEmail("");
            Swal.fire({ icon: 'success', title: 'Friend Added!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#1f2937', color: '#fff' });
        } else {
            Swal.fire({ icon: 'error', title: 'Oops', text: result.payload, background: '#1f2937', color: '#fff' });
        }
    };

    const handleRemoveFriend = async (friendUid) => {
        const result = await Swal.fire({
            title: 'Remove Friend?', text: "Remove from leaderboard?", icon: 'warning',
            showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#374151', confirmButtonText: 'Yes', background: '#1f2937', color: '#fff'
        });
        if (result.isConfirmed) await dispatch(removeFriendThunk({ uid: user.uid, friendUid }));
    };

    const handleSaveProfile = async () => {
        if (!editForm.nickname.trim()) return;
        await dispatch(updateUserProfile({
            uid: user.uid,
            data: { nickname: editForm.nickname, 'stats.age': parseInt(editForm.age) || 10 }
        }));
        setIsEditing(false);
    };

    const handleSetInteractiveGoal = async (goalDescription) => {
        await dispatch(updateUserProfile({
            uid: user.uid,
            data: { dailyGoal: goalDescription }
        }));
        setIsGoalModalOpen(false);
        Swal.fire({ icon: 'success', title: 'Mission Accepted!', text: 'Good luck, Cadet!', toast: true, position: 'top-end', timer: 2000, showConfirmButton: false, background: '#1f2937', color: '#fff' });
    };

    return (
        <DashboardView 
            user={user}
            courses={courses}
            coursesLoading={coursesLoading}
            friends={friendsProfiles}

            friendEmail={friendEmail}
            setFriendEmail={setFriendEmail}
            onAddFriend={handleAddFriend}
            onRemoveFriend={handleRemoveFriend}
            isSocialLoading={isSocialLoading}

            isEditing={isEditing}
            setIsEditing={setIsEditing}
            editForm={editForm}
            setEditForm={setEditForm}
            onSaveProfile={handleSaveProfile}
            onCancelEdit={() => setIsEditing(false)}

            isGoalModalOpen={isGoalModalOpen}
            setIsGoalModalOpen={setIsGoalModalOpen}
            onSetGoal={handleSetInteractiveGoal}

            onGoToCourses={() => navigate('/courses')}
            onGoToCourseDetail={(id) => navigate(`/courses/${id}`)}
            onGoToChat={() => navigate('/chat')}
        />
    );
}