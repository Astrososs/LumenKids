import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import {
  handleUserMessage,
  subscribeToChatsThunk,
  unsubscribeFromChatsThunk,
  deleteChatThunk,
  setChatHistory,
} from '../store/slices/chatSlice';
import ChatView from '../views/ChatView';

const makeTempId = () => `temp_${Date.now()}_${Math.random().toString(16).slice(2)}`;

export default function ChatPresenter() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data: user } = useSelector((state) => state.user);
  const { history: chats, idMap, loadingChats, deleteStatus, subscribeStatus, error } =
    useSelector((state) => state.chat);

  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const hasAutoSelectedRef = useRef(false);

  useEffect(() => {
    if (!user?.uid) return;

    setCurrentChatId(null);
    hasAutoSelectedRef.current = false;

    dispatch(subscribeToChatsThunk(user.uid));

    return () => {
      dispatch(unsubscribeFromChatsThunk());
      dispatch(setChatHistory([]));
    };
  }, [user?.uid, dispatch]);

  useEffect(() => {
    if (!currentChatId && chats.length > 0 && !hasAutoSelectedRef.current) {
      setCurrentChatId(chats[0].id);
      hasAutoSelectedRef.current = true;
    }
  }, [chats, currentChatId]);

  useEffect(() => {
    if (currentChatId && idMap[currentChatId]) {
      setCurrentChatId(idMap[currentChatId]);
    }
  }, [idMap, currentChatId]);

  const resolvedChatId = (currentChatId && idMap[currentChatId]) || currentChatId;
  const isCurrentChatLoading = !!(resolvedChatId && loadingChats[resolvedChatId]);

  const activeChat = chats.find((c) => c.id === resolvedChatId);
  const messages = activeChat ? activeChat.messages : [];

  const handleBack = () => navigate('/');

  const handleSend = async () => {
    if (!input.trim() || !user?.uid || isCurrentChatLoading) return;
    
    const userMsg = input;
    setInput(''); 

    const tempChatId = currentChatId ? null : makeTempId();
    if (tempChatId) {
      setCurrentChatId(tempChatId);
      hasAutoSelectedRef.current = true;
    }

    await dispatch(
      handleUserMessage({
        uid: user.uid,
        chatId: currentChatId,
        tempChatId,
        message: userMsg,
        userAge: user.stats?.age || 10,
        history: messages,
      })
    );
  };

  const handleNewChat = () => {
    setCurrentChatId(null);
    setIsMobileMenuOpen(false);
    setInput('');
  };

  const handleSelectChat = (id) => {
    setCurrentChatId(id);
    setIsMobileMenuOpen(false);
  };

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    if (!user?.uid) return;

    const result = await Swal.fire({
      title: 'Delete Conversation?',
      text: "You won't be able to undo this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444', 
      cancelButtonColor: '#374151',
      confirmButtonText: 'Yes, delete it!',
      background: '#1f2937',
      color: '#fff'
    });

    if (result.isConfirmed) {
      await dispatch(deleteChatThunk({ uid: user.uid, chatId }));
      if (resolvedChatId === chatId) setCurrentChatId(null);
      
      Swal.fire({
          title: 'Deleted!',
          text: 'The chat has been removed.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          background: '#1f2937',
          color: '#fff'
      });
    }
  };

  const isDeleting = deleteStatus === 'loading';
  const isSubscribing = subscribeStatus === 'loading';

  return (
    <ChatView
      chats={chats}
      currentChatId={resolvedChatId}
      messages={messages}
      input={input}
      setInput={setInput}
      loading={isCurrentChatLoading} 
      isDeleting={isDeleting}
      isSubscribing={isSubscribing}
      error={error}
      onSend={handleSend}
      onSelectChat={handleSelectChat}
      onNewChat={handleNewChat}
      onDeleteChat={handleDelete}
      hasActiveChat={!!resolvedChatId}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      onBack={handleBack}
    />
  );
}