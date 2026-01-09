import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@/services/firebase'; // Firestore
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    // Listen to conversations where current user is participant
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', user.uid),
      orderBy('lastMessageAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const convs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setConversations(convs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const sendMessage = async (conversationId, text) => {
    await addDoc(collection(db, `conversations/${conversationId}/messages`), {
      text,
      senderId: user.uid,
      createdAt: serverTimestamp(),
      read: false
    });
  };

  return (
    <ChatContext.Provider value={{ conversations, loading, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);