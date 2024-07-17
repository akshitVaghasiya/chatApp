import React from 'react'
import './detail.css'
import { auth, db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore';
import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useUserStore } from '../../lib/userStore';

const Detail = () => {
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
    const { currentUser } = useUserStore();

    const blockUser = async () => {
        console.log("helo", user);
        if (!user) return;
        console.log("helo");
        const userDocRef = doc(db, "users", currentUser.id)

        try {
            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
            });
            changeBlock()
        } catch (error) {

        }
    }

    return (
        <div className='flex-1 flex flex-col detail'>
            <div className="flex py-7 px-5 flex-col items-center gap-3 border-b border-[#dddddd35] user">
                <img src={user?.avatar || "./avatar.png"} className="rounded-full h-[80px] w-[80px] object-cover" alt="avatar" height={80} width={80} />
                <span className="font-bold">{user?.username}</span>
                <p>Lorem, ipsum dolor sit amet consectetur.</p>
            </div>
            <div className="p-5 flex flex-col flex-1 overflow-y-scroll gap-6 info">
                <div className="option">
                    <div className="flex justify-between items-center title">
                        <span>chat setting</span>
                        <img src="./arrowUp.png" className="bg-[#1119284d] rounded-full object-cover p-2 cursor-pointer" alt="" height={30} width={30} />
                    </div>
                </div>
                <div className="option">
                    <div className="flex justify-between items-center title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" className="bg-[#1119284d] rounded-full object-cover p-2 cursor-pointer" alt="" height={30} width={30} />
                    </div>
                </div>
                <div className="option">
                    <div className="flex justify-between items-center title">
                        <span>Shared photos</span>
                        <img src="./arrowDown.png" className="bg-[#1119284d] rounded-full object-cover p-2 cursor-pointer" alt="" height={30} width={30} />
                    </div>
                    <div className="flex flex-col mt-5 gap-5 photo">
                        <div className="flex justify-between items-center photoItem">
                            <div className="flex gap-2 items-center photoDetail">
                                <img src="./avatar.png" className="rounded-sm" alt="" height={40} width={40} />
                                <span className="text-gray-400">photo_2024.png</span>
                            </div>
                            <img src="./download.png" className="bg-[#1119284d] rounded-full object-cover p-2 cursor-pointer" alt="" height={30} width={30} />
                        </div>
                        <div className="flex justify-between items-center photoItem">
                            <div className="flex gap-2 items-center photoDetail">
                                <img src="./avatar.png" className="rounded-sm" alt="" height={40} width={40} />
                                <span className="text-gray-400">photo_2024.png</span>
                            </div>
                            <img src="./download.png" className="bg-[#1119284d] rounded-full object-cover p-2 cursor-pointer" alt="" height={30} width={30} />
                        </div>
                        <div className="flex justify-between items-center photoItem">
                            <div className="flex gap-2 items-center photoDetail">
                                <img src="./avatar.png" className="rounded-sm" alt="" height={40} width={40} />
                                <span className="text-gray-400">photo_2024.png</span>
                            </div>
                            <img src="./download.png" className="bg-[#1119284d] rounded-full object-cover p-2 cursor-pointer" alt="" height={30} width={30} />
                        </div>
                    </div>
                </div>
                <div className="option">
                    <div className="flex justify-between items-center title">
                        <span>Shared files</span>
                        <img src="./arrowUp.png" className="bg-[#1119284d] rounded-full object-cover p-2 cursor-pointer" alt="" height={30} width={30} />
                    </div>
                </div>
            </div>
            <div className="flex flex-col gap-2.5 px-5 py-2.5">
                <button className="py-1.5 px-5 text-white rounded-lg cursor-pointer bg-[#e64a6980] hover:bg-[#e64a69bf]" onClick={() => blockUser()}>{isCurrentUserBlocked ? "You are  Blocked!" : isReceiverBlocked ? "User Blocked" : "Block user"}</button>
                <button className="py-1.5 px-5 text-white rounded-lg cursor-pointer bg-[#e64a6980] hover:bg-[#e64a69bf]" onClick={() => auth.signOut()}>Logout</button>
            </div>
        </div>
    )
}

export default Detail
