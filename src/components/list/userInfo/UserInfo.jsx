import React from 'react'
import '../list.css'
import { useUserStore } from '../../../lib/userStore'

const UserInfo = () => {
    const { currentUser } = useUserStore();
    console.log("currentUser->", currentUser);
    return (
        <div className="p-5 flex items-center justify-between userInfo">
            <div className="flex items-center gap-5 user">
                <img src={currentUser.avatar || "./avatar.png"} className="rounded-full object-cover w-[50px] h-[50px]" alt="avatar" height={50} width={50} />
                <h2 className="font-bold text-xl">{currentUser.username}</h2>
            </div>
            <div className="flex gap-5 icons">
                <img src="./more.png" alt="" height={20} width={20} />
                <img src="./video.png" alt="" height={20} width={20} />
                <img src="./edit.png" alt="" height={20} width={20} />
            </div>
        </div>
    )
}

export default UserInfo
