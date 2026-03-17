import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const ChatDashboard = () => {
  return (
    <div className="flex h-screen w-full bg-transparent overflow-hidden">
      <Sidebar />
      <ChatWindow />
    </div>
  );
};

export default ChatDashboard;
