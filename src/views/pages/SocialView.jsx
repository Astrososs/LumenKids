const SocialView = ({ 
  user, 
  friends, 
  emailInput, 
  setEmailInput, 
  onAddFriend, 
  onRemoveFriend, 
  isLoading 
}) => {

  const leaderboard = [...friends, user]
    .filter(p => p !== null)
    .sort((a, b) => (b.stats?.xp || 0) - (a.stats?.xp || 0));

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen">
      <h1 className="text-3xl font-bold text-white mb-6 text-center md:text-left flex items-center gap-3">
        Friends Leaderboard <span className="text-yellow-400">🏆</span>
      </h1>

      <form 
        onSubmit={(e) => { e.preventDefault(); onAddFriend(); }}
        className="flex flex-col md:flex-row gap-4 mb-8 bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl"
      >
        <div className="flex-1">
            <label className="block text-gray-400 text-xs font-bold mb-2 ml-1">ADD A STUDY BUDDY</label>
            <input 
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="cadet@starfleet.com"
              className="w-full p-3 rounded-xl bg-gray-700 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
        </div>
        <button 
          type="submit"
          disabled={!emailInput.trim()}
          className="cursor-pointer self-end bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-all transform active:scale-95 shadow-lg border border-blue-500 h-[50px]"
        >
          Add Friend
        </button>
      </form>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-blue-400 animate-pulse font-medium flex flex-col items-center gap-2">
            <span className="text-4xl">📡</span>
            <span>Syncing with Starfleet...</span>
          </div>
        ) : (
          leaderboard.map((player, idx) => {
            const isCurrentUser = player.uid === user.uid;
            return (
                <div 
                  key={player.uid} 
                  className={`group p-5 rounded-2xl border flex justify-between items-center transition-all duration-300 ${
                    isCurrentUser 
                      ? 'border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                      : 'border-gray-700 bg-gray-800 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <span className={`text-2xl font-black w-8 ${idx === 0 ? 'text-yellow-400' : 'text-gray-500'}`}>
                        #{idx + 1}
                    </span>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-2 ${isCurrentUser ? 'border-yellow-500 bg-yellow-600' : 'border-gray-600 bg-gray-700'} text-white shadow-inner`}>
                        {player.nickname ? player.nickname[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg flex items-center gap-2">
                        {player.nickname}
                        {isCurrentUser && <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/30 uppercase">You</span>}
                      </p>
                      <p className="text-xs text-gray-400 font-medium tracking-wide">Level {player.stats?.currentLevel || 1} Cadet</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-blue-400 font-black text-xl leading-none">{player.stats?.xp || 0}</p>
                      <p className="text-blue-500/60 text-[10px] font-bold uppercase tracking-widest">XP Points</p>
                      <p className="text-yellow-500 text-xs font-bold mt-1">{player.stats?.totalStars || 0} ⭐</p>
                    </div>
                    
                    {!isCurrentUser && (
                      <button 
                        onClick={() => onRemoveFriend(player.uid)}
                        className="cursor-pointer opacity-0 group-hover:opacity-100 p-2.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                        title="Remove Friend"
                      >
                        <span className="text-xl">🗑️</span>
                      </button>
                    )}
                  </div>
                </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default SocialView;