import React, { useState } from "react";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";

const SignupForm = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });

    const [loading, setLoading] = useState(false);

    const handleAvatarChange = (event) => {
        console.log("events->", event);
        const file = event.target.files[0];
        if (file) {
            // const reader = new FileReader();
            // reader.onloadend = () => {
            setAvatar({
                file: file,
                url: URL.createObjectURL(file)
            });
            // };
            // reader.readAsDataURL(file);
        }
        console.log("avatar-->", avatar);
    };

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target)

        const { username, email, password } = Object.fromEntries(formData);

        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);

            const imgUrl = await upload(avatar.file);

            const docRef = await setDoc(doc(db, "users", res.user.uid), {
                id: res.user.uid,
                username,
                email,
                avatar: imgUrl,
                password,
                blocked: []
            });

            await setDoc(doc(db, 'userchats', res.user.uid), {
                chats: [],
            });

            toast.success("Accouunt created! Tou can login now!")

        } catch (error) {
            console.log("error-->", error)
            toast.error(error.message)
        } finally {
            setLoading(false);
            e.target.reset();
            setAvatar({
                file: null,
                url: ""
            });
        }
    }

    return (
        <div className="selection:bg-indigo-500 selection:text-white">
            <div className="flex justify-center items-center">
                <div className="p-8 flex-1">
                    <div className="mx-auto overflow-hidden">
                        <div className="p-8">
                            <h1 className="text-5xl font-bold text-indigo-600">
                                Create account
                            </h1>

                            <form className="mt-10" onSubmit={handleSignUp}>
                                <div className="">
                                    <input
                                        id="avatar"
                                        name="avatar"
                                        type="file"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    <label htmlFor="avatar" className="flex items-center cursor-pointer gap-3 text-black hover:underline">
                                        <img
                                            src={avatar.url || "./avatar.png"}
                                            alt="Avatar"
                                            width={50}
                                            height={50}
                                            className="w-[50px] h-[50px] rounded-lg object-cover"
                                        />
                                        Upload an image
                                    </label>
                                </div>
                                <div className="mt-7 relative">
                                    <input
                                        id="username"
                                        name="username"
                                        type="text"
                                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                                        placeholder="Username"
                                    />
                                    <label
                                        htmlFor="username"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Username
                                    </label>
                                </div>
                                <div className="mt-7 relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="text"
                                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                                        placeholder="john@doe.com"
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Email address
                                    </label>
                                </div>
                                <div className="mt-7 relative">
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-indigo-600"
                                        placeholder="Password"
                                    />
                                    <label
                                        htmlFor="password"
                                        className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                                    >
                                        Password
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="mt-10 px-8 py-4 uppercase rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-center block w-full focus:outline-none focus:ring focus:ring-offset-2 focus:ring-indigo-500 focus:ring-opacity-80 cursor-pointer"
                                >{loading ? "loading.." : "Sign up"}</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignupForm;