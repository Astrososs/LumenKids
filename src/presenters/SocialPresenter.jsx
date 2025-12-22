import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  addFriendThunk, 
  removeFriendThunk, 
  loadFriendsProfilesThunk 
} from '../store/slices/userSlice';

import Swal from 'sweetalert2';
import SocialView from '../views/pages/SocialView'; 

export default function SocialPresenter() {
  const dispatch = useDispatch();
  
  
  const { data: user, friendsProfiles } = useSelector((state) => state.user);
  
  const [friendEmail, setFriendEmail] = useState("");

  useEffect(() => {
    if (user?.friends?.length > 0) {
      dispatch(loadFriendsProfilesThunk(user.friends));
    }
  }, [dispatch, user?.friends]);

  const handleAddFriend = async () => {
    if (!friendEmail.trim()) return;
    
    const result = await dispatch(addFriendThunk({ uid: user.uid, friendEmail }));
    
    if (addFriendThunk.fulfilled.match(result)) {
      setFriendEmail("");
      Swal.fire({
        title: "Success!",
        text: "Friend added to leaderboard!",
        icon: "success",
        background: '#1f2937',
        color: '#fff'
      });
    } else {
      Swal.fire({
        title: "Error",
        text: result.payload,
        icon: "error",
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  const handleRemoveFriend = async (friendUid) => {
    const result = await Swal.fire({
      title: 'Remove Friend?',
      text: "They will be removed from your leaderboard.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, remove them!',
      background: '#1f2937',
      color: '#fff'
    });

    if (result.isConfirmed) {
      await dispatch(removeFriendThunk({ uid: user.uid, friendUid }));
      
      Swal.fire({
        title: 'Removed!',
        text: 'Leaderboard updated.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#1f2937',
        color: '#fff'
      });
    }
  };

  return (
    <SocialView 
      user={user}
      friends={friendsProfiles} 
      emailInput={friendEmail}
      setEmailInput={setFriendEmail}
      onAddFriend={handleAddFriend}
      isLoading={false} 
      onRemoveFriend={handleRemoveFriend}
    />
  );
}