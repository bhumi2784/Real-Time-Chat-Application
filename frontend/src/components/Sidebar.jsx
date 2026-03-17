import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { useChat } from '../context/ChatContext';
import api from '../services/api';
import { Search, UserCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const { authUser, logout } = useAuth();
  const { onlineUsers } = useSocket();
  const { selectedUser, setSelectedUser } = useChat();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to get users', error);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 glass-panel border-r border-dark-800 flex flex-col h-full flex-shrink-0 z-20 shadow-2xl">
      <div className="p-4 border-b border-dark-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {authUser?.profilePic ? (
            <img
              src={authUser.profilePic}
              alt={authUser.name}
              className="w-10 h-10 rounded-full object-cover border-2 border-primary-500/50"
            />
          ) : (
            <UserCircle className="w-10 h-10 text-gray-500" />
          )}
          <div>
            <h2 className="text-white font-medium">{authUser?.name}</h2>
            <span className="text-[10px] uppercase tracking-wider text-primary-400 bg-primary-500/10 border border-primary-500/20 px-2 py-0.5 rounded-full mt-1 inline-block">
              My Profile
            </span>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 text-gray-400 hover:text-red-400 hover:bg-dark-850 rounded-lg transition-all"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </div>

      <div className="p-4 border-b border-dark-800">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-dark-900 border border-dark-700 text-white placeholder-gray-500 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto w-full">
        {filteredUsers.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No users found</div>
        ) : (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedUser?._id === user._id;

            return (
              <div
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`p-4 flex items-center gap-3 cursor-pointer transition-all border-b border-dark-800/50 ${
                  isSelected ? 'bg-primary-500/10 border-l-4 border-l-primary-500' : 'hover:bg-dark-850 border-l-4 border-l-transparent'
                }`}
              >
                <div className="relative">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover border border-dark-700"
                    />
                  ) : (
                    <UserCircle className="w-12 h-12 text-gray-500" />
                  )}
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-dark-900 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-white font-medium truncate">{user.name}</h3>
                    {user.lastMessage && (
                      <span className="text-[10px] text-gray-500">
                        {new Date(user.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <p className={`text-sm truncate ${user.lastMessage && !user.lastMessage.seen && user.lastMessage.senderId !== authUser._id ? 'text-primary-400 font-medium' : 'text-gray-400'}`}>
                    {user.lastMessage ? (
                      user.lastMessage.senderId === authUser._id ? (
                        `You: ${user.lastMessage.text}`
                      ) : (
                        user.lastMessage.text
                      )
                    ) : (
                      isOnline ? 'Online' : 'Offline'
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
