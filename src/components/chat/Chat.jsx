import React, { useEffect, useRef, useState } from 'react'
import './chat.css'
import EmojiPicker, { SkinTones } from 'emoji-picker-react'
import {
    arrayUnion,
    doc,
    getDoc,
    onSnapshot,
    updateDoc,
} from "firebase/firestore";
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';

const Chat = () => {

    const [chat, setChat] = useState();
    const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
    const [text, setText] = useState("");

    const [img, setImg] = useState({
        file: null,
        url: "",
    });

    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useChatStore();

    console.log("useeeeeee", user);
    const endRef = useRef(null);

    useEffect(() => {
        endRef.current.scrollIntoView({ behavior: "smooth" });
    }, [])

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data())
        })

        return () => {
            unSub();
        }
    }, [chatId])

    const handleEmoji = (e) => {
        console.log("hello->", e);
        setText(text + e.emoji);
        setEmojiPickerOpen(false);
    }

    const handleImg = (e) => {
        if (e.target.files[0]) {
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0]),
            });
        }
    };

    const handleSend = async () => {
        if (text === "") return;

        let imgUrl = null;

        try {
            if (img.file) {
                imgUrl = await upload(img.file);
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                }),
            });

            const userIDs = [currentUser.id, user.id];

            userIDs.forEach(async (id) => {
                const userChatsRef = doc(db, "userchats", id);
                const userChatsSnapshot = await getDoc(userChatsRef);

                if (userChatsSnapshot.exists()) {
                    const userChatsData = userChatsSnapshot.data();

                    const chatIndex = userChatsData.chats.findIndex(
                        (c) => c.chatId === chatId
                    );

                    userChatsData.chats[chatIndex].lastMessage = text;
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatsData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatsRef, {
                        chats: userChatsData.chats,
                    });
                }
            });
        } catch (err) {
            console.log(err);
        } finally {
            setImg({
                file: null,
                url: "",
            });

            setText("");
        }
    };

    return (
        <div className='flex-[2] flex flex-col border-x border-[#dddddd35]'>
            <div className="flex border-b border-[#dddddd35] p-5 top">
                <div className="flex w-full gap-5 items-center user">
                    <img src={user?.avatar || "./avatar.png"} className="rounded-full h-[50px] w-[50px] object-cover" alt="avatar" height={50} width={50} />
                    <div className="flex-1 w-full texts">
                        <span className="font-bold">{user?.username}</span>
                        <p>Lorem, ipsum dolor sit amet consectetur.</p>
                    </div>
                    <div className="flex gap-5 icons">
                        <img src="./phone.png" alt="" height={20} width={20} />
                        <img src="./video.png" alt="" height={20} width={20} />
                        <img src="./info.png" alt="" height={20} width={20} />
                    </div>
                </div>
            </div>

            <div className="p-5 flex-1 overflow-y-scroll flex flex-col gap-5 center">
                {chat?.messages?.map((message) => (
                    <div key={message?.createAt} className={`max-w-[70%] flex gap-5 ${message.senderId === currentUser?.id ? "self-end own" : "items-start"} message`}>
                        <div className="flex flex-col gap-1 texts">
                            {message.img && <img src={message.img || "./avatar.png"} className="h-[300px] object-cover w-full rounded-lg" alt="image" />}
                            <p className={`p-5 ${message.senderId === currentUser?.id ? "bg-[#5183fe]" : "bg-[#1119284d]"} rounded-lg`}>{message.text}</p>
                            <span className="text-[13px]">1 min ago</span>
                        </div>
                    </div>
                ))
                }
                {img.url && (
                    <div className="max-w-[70%] flex gap-5 self-end message own">
                        <div className="flex flex-col gap-1 texts">
                            <img src={img.url} alt="" className="h-[250px] object-cover w-full rounded-lg" />
                        </div>
                    </div>
                )}
                <div ref={endRef}></div>
            </div>

            <div className="flex items-center border-t border-[#dddddd35] gap-5 p-5 bottom">
                <div className="flex gap-5 icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" height={20} width={20} />
                    </label>
                    <input
                        type="file"
                        id="file"
                        style={{ display: "none" }}
                        onChange={handleImg}
                    />
                    <img src="./camera.png" alt="" height={20} width={20} />
                    <img src="./mic.png" alt="" height={20} width={20} />
                </div>
                <input type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`bg-[#131f32] p-2.5 text-lg rounded-lg focus:outline-none flex-1 ${(isCurrentUserBlocked || isReceiverBlocked) ? "cursor-not-allowed" : ""}`}
                    placeholder={
                        isCurrentUserBlocked || isReceiverBlocked
                            ? "You cannot send a message"
                            : "Type a message..."
                    }
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                />
                <div className="relative emoji">
                    <img src="./emoji.png" alt="emoji" className="cursor-pointer" height={20} width={20} onClick={() => setEmojiPickerOpen((prev) => !prev)} />
                    <EmojiPicker
                        open={emojiPickerOpen}
                        onEmojiClick={handleEmoji}
                        height={350}
                        width={300}
                        style={{
                            position: 'absolute',
                            bottom: '40px',
                            right: '0'
                        }}
                    />
                </div>
                <button onClick={handleSend}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                    className={`p-2.5 ms-2 bg-blue-600 text-sm font-medium text-white rounded-lg focus:outline-none hover:bg-blue-800 ${(isCurrentUserBlocked || isReceiverBlocked) ? "cursor-not-allowed" : ""}`}>Send</button>
            </div>
        </div>
    )
}

export default Chat
