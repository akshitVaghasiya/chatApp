import React, { useState } from 'react'
import { useUserStore } from '../../../../lib/userStore';
import { db } from '../../../../lib/firebase';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

const AddUser = () => {
  const [user, setUser] = useState(null);

  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    try {
      const userRef = collection(db, "users");

      const q = query(userRef, where("username", "==", username));

      const querySnapShot = await getDocs(q);

      console.log("querySnapShot-->", querySnapShot);
      if (!querySnapShot.empty) {
        setUser(querySnapShot.docs[0].data());
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAdd = async e => {
    e.preventDefault();

    const chatRef = collection(db, "chats");
    const userChatsRef = collection(db, "userchats");

    try {
      const newChatRef = doc(chatRef);

      await setDoc(newChatRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatsRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });

      await updateDoc(doc(userChatsRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="p-6 absolute h-max w-max m-auto inset-0 bg-[#111928db] rounded-lg addUser">
      <form className="flex gap-2.5" onSubmit={handleSearch}>
        <input
          type="text"
          name="username"
          id="simple-search"
          className="bg-white w-full flex-1 text-gray-900 text-sm rounded-lg focus:outline-none block w-full p-3"
          placeholder="Search..."
        />
        <button className="p-2.5 ms-2 bg-blue-600 text-sm font-medium text-white rounded-lg focus:outline-none hover:bg-blue-800">Search</button>
      </form>
      {user && (<div className="mt-5 flex justify-between items-center user">
        <div className="flex items-center gap-2.5 detail">
          <img src={user.avatar || "./avatar.png"} className="rounded-full h-[40px] w-[40px] object-cover " alt="" height={40} width={40} />
          <span className="font-medium">{user.username}</span>
        </div>
        <button className="p-2 bg-blue-600 text-xs text-white rounded-lg focus:outline-none hover:bg-blue-800"
          onClick={handleAdd}>Add User</button>
      </div>)}
    </div>
  )
}

export default AddUser
