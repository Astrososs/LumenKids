import React from 'react';
import Avatar from '../common/Avatar';          
import ProgressBar from '../common/ProgressBar';

const ProfileHeader = ({user}) => {

    if(!user) return null

    return (

    <div className="bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-700 flex items-center gap-6">
      
      <div className="flex-shrink-0">
        <Avatar 
          src={user.settings.avatarId} 
          size="lg" 
        />
      </div>

      <div className="flex-grow">
        
        <div className="flex justify-between items-center mb-2">

          <h2 className="text-2xl font-bold text-white">
            {user.nickname}
          </h2>
          

          <span className="px-3 py-1 bg-yellow-900 text-yellow-100 rounded-full font-bold text-sm border border-yellow-700">
            Level {user.stats.currentLevel}
          </span>
        </div>


        <ProgressBar 
          value={user.stats.xp} 
          max={100} 
          label="XP Progress" 
          color="bg-blue-500"
        />
      </div>

    </div>
  )
}

export default ProfileHeader;