import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
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
  const { history: chats, idMap, sendStatus, deleteStatus, subscribeStatus, error } =
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

  const resolvedChatId = (currentChatId && idMap[currentChatId]) || currentChatId;

  const activeChat = chats.find((c) => c.id === resolvedChatId);
  const messages = activeChat ? activeChat.messages : [];

  const handleBack = () => navigate('/');

  const handleSend = async () => {
    if (!input.trim() || !user?.uid) return;

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

    if (window.confirm('Delete this conversation?')) {
      await dispatch(deleteChatThunk({ uid: user.uid, chatId }));

      const resolved = (currentChatId && idMap[currentChatId]) || currentChatId;
      if (resolved === chatId) setCurrentChatId(null);
    }
  };

  const isSending = sendStatus === 'loading';
  const isDeleting = deleteStatus === 'loading';
  const isSubscribing = subscribeStatus === 'loading';

  return (
    <ChatView
      chats={chats}
      currentChatId={resolvedChatId}
      messages={messages}
      input={input}
      setInput={setInput}
      loading={isSending}
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
