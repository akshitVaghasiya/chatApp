import React, { useEffect, useState } from 'react'
import '../list.css'
import AddUser from './addUser/AddUser';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useUserStore } from '../../../lib/userStore';
import { useChatStore } from '../../../lib/chatStore';

const ChatList = () => {
    const [chats, setChats] = useState([]);
    const [addMore, setAddMore] = useState(false);
    const [input, setInput] = useState("");

    const { currentUser } = useUserStore()
    const { chatId, changeChat } = useChatStore()

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser.id), async (res) => {
            const items = res.data()?.chats;

            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return { ...item, user };
            });
            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
        });

        return () => {
            unSub();
        }
    }, [currentUser.id])
    console.log("chat-->", chats);


    const handleSelect = async (chat) => {
        changeChat(chat.chatId, chat.user);
        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;
        });

        const chatIndex = userChats.findIndex(
            (item) => item.chatId === chat.chatId
        );

        userChats[chatIndex].isSeen = true;

        const userChatsRef = doc(db, "userchats", currentUser.id);

        try {
            await updateDoc(userChatsRef, {
                chats: userChats,
            });
            changeChat(chat.chatId, chat.user);
        } catch (err) {
            console.log(err);
        }
    };

    const filteredChats = chats.filter((c) =>
        c.user.username.toLowerCase().includes(input.toLowerCase())
    );

    return (
        <div className="px-5 py-2 overflow-y-scroll chatList">
            <div className="flex gap-5 pb-3 search">
                <div className="flex items-center flex-1 searchBar">
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            {/* <img src="./search.png" alt="" /> */}
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="text"
                            onChange={(e) => setInput(e.target.value)}
                            className="bg-[#11192880] w-full text-white text-sm rounded-lg focus:outline-none block w-full ps-10 p-2.5"
                            placeholder="Search..."
                        />
                    </div>
                </div>
                <button
                    className="p-2.5 ms-2 bg-[#11192880] text-sm font-medium text-white rounded-lg focus:outline-none"
                    onClick={() => setAddMore((p) => !p)}
                >
                    <img src={addMore ? "./minus.png" : "./plus.png"} alt="plus" height={20} width={20} />
                </button>
            </div>

            {
                filteredChats.map((chat, index) =>
                    <div key={chat.chatId} onClick={() => handleSelect(chat)} style={{
                        backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
                    }} className="flex items-center gap-5 p-5 cursor-pointer border-b border-[#dddddd35] item">
                        <img src={chat.user.avatar || "./avatar.png"} className="rounded-full h-[50px] w-[50px] object-cover " alt="avatar" height={50} width={50} />
                        <div className="texts">
                            <span className="font-medium text-lg">
                                {chat.user.blocked.includes(currentUser.id)
                                    ? "User"
                                    : chat.user.username}
                            </span>
                            <p className="font-light">{chat.lastMessage}</p>
                        </div>
                    </div>
                )
            }
            {addMore && <AddUser />}
        </div >
    )
}

export default ChatList
