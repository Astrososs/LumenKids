import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  createNewChat, 
  sendMessageToChat, 
  deleteChat, 
  subscribeToChats 
} from '../models/chatModel';
import { sendMessageToAi } from '../models/aiModel';
import ChatView from '../views/ChatView';

export default function ChatPresenter() {
  const { data: user } = useSelector((state) => state.user);
  
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    if (!user?.uid) return;
    
    const unsubscribe = subscribeToChats(user.uid, (data) => {
      setChats(data);
     
    });

    return () => unsubscribe();
  }, [user, currentChatId]);


  const activeChat = chats.find(c => c.id === currentChatId);
  const messages = activeChat ? activeChat.messages : [];

 

  const handleSend = async () => {
    if (!input.trim() || !user) return;
    
    const userQuestion = input;
    setInput(""); 
    setLoading(true);

    try {
      let activeId = currentChatId;

  
      const userMsgObj = { 
        role: 'user', 
        content: userQuestion,
        timestamp: new Date().toISOString()
      };

    
      if (!activeId) {
      
        activeId = await createNewChat(user.uid, userQuestion);
        setCurrentChatId(activeId);
      } else {
       
        await sendMessageToChat(user.uid, activeId, userMsgObj);
      }

      const contextForAi = messages.map(msg => ({
        role: msg.role,
        text: msg.content 
      }));

      const userAge = user.stats?.age || 10; 
      const aiResult = await sendMessageToAi(userQuestion, userAge, contextForAi);

      
      const aiMsgObj = {
        role: 'assistant',
        content: aiResult.text,
        timestamp: aiResult.timestamp || new Date().toISOString()
      };

      await sendMessageToChat(user.uid, activeId, aiMsgObj);

    } catch (error) {
      console.error("Chat Flow Error:", error);
      alert("Something went wrong talking to Lumen.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewChat = () => {
    setCurrentChatId(null); 
  };

  const handleDelete = async (e, chatId) => {
    e.stopPropagation();
    if (window.confirm("Delete this conversation?")) {
      await deleteChat(user.uid, chatId);
      if (currentChatId === chatId) setCurrentChatId(null);
    }
  };

  return (
    <ChatView
      chats={chats}
      currentChatId={currentChatId}
      messages={messages}
      input={input}
      setInput={setInput}
      loading={loading}
      onSend={handleSend}
      onSelectChat={setCurrentChatId}
      onNewChat={handleNewChat}
      onDeleteChat={handleDelete}
      hasActiveChat={!!currentChatId}
    />
  );
}