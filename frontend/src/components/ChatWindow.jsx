import { useEffect, useState, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Send, UserCircle, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

const ChatWindow = () => {
  const { selectedUser, messages, setMessages, isTyping, setIsTyping } = useChat();
  const { socket, onlineUsers } = useSocket();
  const { authUser } = useAuth();
  
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const isOnline = selectedUser ? onlineUsers.includes(selectedUser._id) : false;

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser) return;
      setLoading(true);
      try {
        const res = await api.get(`/messages/${selectedUser._id}`);
        setMessages(res.data);
      } catch (error) {
        toast.error('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [selectedUser, setMessages]);

  useEffect(() => {
    if (!socket) return;

    socket.on('newMessage', (message) => {
      if (selectedUser && (message.senderId === selectedUser._id || message.receiverId === selectedUser._id)) {
        setMessages((prev) => [...prev, message]);
      }
    });

    socket.on('typing', (userId) => {
      if (selectedUser && userId === selectedUser._id) {
        setIsTyping(true);
      }
    });

    socket.on('stopTyping', (userId) => {
      if (selectedUser && userId === selectedUser._id) {
        setIsTyping(false);
      }
    });

    return () => {
      socket.off('newMessage');
      socket.off('typing');
      socket.off('stopTyping');
    };
  }, [socket, selectedUser, setMessages, setIsTyping]);

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedUser) return;

    socket.emit('typing', { receiverId: selectedUser._id });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { receiverId: selectedUser._id });
    }, 2000);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    if (socket) {
      socket.emit('stopTyping', { receiverId: selectedUser._id });
    }

    try {
      const res = await api.post(`/messages/send/${selectedUser._id}`, {
        text: newMessage,
      });
      setMessages([...messages, res.data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-transparent text-gray-400 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="w-24 h-24 mb-6 bg-dark-800 border border-dark-700 rounded-3xl flex items-center justify-center shadow-2xl relative">
          <Send className="w-12 h-12 text-primary-500/70 translate-x-1" />
          <div className="absolute -inset-0.5 rounded-3xl z-[-1] bg-gradient-to-tr from-primary-600/50 to-transparent blur-md"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-3">Welcome to your Chat</h2>
        <p className="text-gray-400 max-w-sm text-center">Select a user from the sidebar to start a conversation with end-to-end sleekness.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-dark-950/80 backdrop-blur-md relative min-w-0 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div className="p-4 border-b border-dark-800 flex items-center gap-3 bg-dark-900/90 backdrop-blur-md z-10 sticky top-0 shadow-sm">
        <div className="relative">
          {selectedUser.profilePic ? (
            <img
              src={selectedUser.profilePic}
              alt={selectedUser.name}
              className="w-11 h-11 rounded-full object-cover border border-dark-700"
            />
          ) : (
            <UserCircle className="w-11 h-11 text-gray-500" />
          )}
          {isOnline && (
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-dark-900 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
          )}
        </div>
        <div>
          <h2 className="text-white font-medium">{selectedUser.name}</h2>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            {isOnline ? (
              <>
                <span className="font-semibold text-green-400">Online</span>
              </>
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-t-primary-500 border-r-transparent border-b-primary-500 border-l-transparent rounded-full"></div>
          </div>
        ) : (
          <>
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-10">
                No previous messages. Start a conversation!
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isMe = msg.senderId === authUser._id;
                const showAvatar = idx === 0 || messages[idx - 1].senderId !== msg.senderId;

                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}
                  >
                    <div className={`flex items-end max-w-[70%] gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      {showAvatar ? (
                        <div className="w-8 h-8 flex-shrink-0">
                          {isMe ? (
                            authUser.profilePic ? (
                              <img src={authUser.profilePic} alt="Me" className="w-8 h-8 rounded-full border border-gray-700" />
                            ) : null
                          ) : (
                            selectedUser.profilePic ? (
                              <img src={selectedUser.profilePic} alt={selectedUser.name} className="w-8 h-8 rounded-full border border-gray-700" />
                            ) : (
                              <UserCircle className="w-8 h-8 text-gray-500" />
                            )
                          )}
                        </div>
                      ) : (
                        <div className="w-8 flex-shrink-0" />
                      )}

                      <div
                        className={`p-3 lg:p-4 rounded-2xl shadow-sm relative group ${
                          isMe
                            ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-tr-sm shadow-primary-500/20'
                            : 'bg-dark-800 text-gray-100 border border-dark-700/50 rounded-tl-sm shadow-black/20'
                        }`}
                      >
                        <p className="text-[15px] leading-relaxed break-words">{msg.text}</p>
                        <span className={`text-[10px] mt-1.5 flex justify-end items-center gap-1 opacity-70 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMe && <span className="text-[9px]">✓✓</span>}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="flex items-end max-w-[70%] gap-2">
                  <div className="w-8 h-8">
                    {selectedUser.profilePic ? (
                      <img src={selectedUser.profilePic} alt={selectedUser.name} className="w-8 h-8 rounded-full border border-dark-700" />
                    ) : (
                      <UserCircle className="w-8 h-8 text-gray-500" />
                    )}
                  </div>
                  <div className="bg-dark-800 border border-dark-700/50 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center">
                    <div className="flex space-x-1.5 items-center h-4">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-dark-900 border-t border-dark-800">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative max-w-4xl mx-auto">
          <button
            type="button"
            className="p-3 text-gray-500 hover:text-white transition-colors absolute left-1 top-1/2 -translate-y-1/2"
            disabled
          >
            <ImageIcon className="w-5 h-5 opacity-40 cursor-not-allowed" />
          </button>
          <input
            type="text"
            value={newMessage}
            onChange={handleTyping}
            placeholder="Type a message..."
            className="flex-1 bg-dark-800 border border-dark-700 text-white rounded-full pl-12 pr-14 py-3.5 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 focus:bg-dark-850 transition-all shadow-inner"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-95"
          >
            <Send className="w-4 h-4 translate-x-px m-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
