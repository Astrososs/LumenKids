import { useSelector } from 'react-redux';
import SocialView from '../views/pages/SocialView';

export default function SocialPresenter() {
  const { data: user } = useSelector((state) => state.user);

  return (
    <SocialView
      user={user}
      friendsProfiles={[]}
      friendEmail=""
      onFriendEmailChange={() => {}}
      onAddFriend={() => {
        alert('Friends feature is currently unavailable');
      }}
      onRemoveFriend={() => {}}
    />
  );
}