import React from 'react'
import './list.css'
import UserInfo from './userInfo/UserInfo'
import ChatList from './chatList/ChatList'

const List = () => {
    return (
        <div className='flex flex-col flex-1'>
            <UserInfo />
            <ChatList />
        </div>
    )
}

export default List
