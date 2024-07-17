import { useEffect } from 'react';
import './App.css'
import Chat from './components/chat/Chat'
import Detail from './components/detail/Detail'
import List from './components/list/List'
import LoginPage from './components/login/LoginPage';
import Notification from './components/notification/Notification';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './lib/firebase';
import { useUserStore } from './lib/userStore';
import { useChatStore } from './lib/chatStore';

function App() {

  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId, changeChat } = useChatStore();

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    })

    return () => {
      unSub();
    }
  }, [fetchUserInfo])

  if (isLoading) return <div className="loading">Loading..</div>

  return (
    <>
      <div className="h-[90vh] w-[90vw] main">
        {
          currentUser ? <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </> :
            <LoginPage />
        }
        <Notification />
      </div>
    </>
  )
}

export default App
