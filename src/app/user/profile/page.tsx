"use client";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

const Profile = () => {
	const [user, setUser] = useState({ _id: "", username: "" });
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const handleLogout = async () => {
		try {
			setLoading(true);
			const response = await axios.get("/api/users/logout");
			toast.success(response.data.message);
			router.push("/user/login");
		} catch (error: any) {
			toast.error(error.response.data.error);
		} finally {
			setLoading(false);
		}
	};

	const getUserDetails = async () => {
		try {
			const res = await axios.get("/api/users/me");
			console.log(res.data);
			setUser(res.data.data);
		} catch (error: any) {
			toast.error(error.response.data.error);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center flex-col gap-5">
			<div className="text-center">
				<h1 className="text-xl font-medium">Profile Page</h1>
				<p className="text-lg text-gray-300 ">Welcome to the profile page</p>
				<h2 className="text-lg bg-yellow-400 text-black font-medium capitalize py-2 rounded-md px-4">
					{user._id !== "" ? (
						<Link href={`/user/profile/${user._id}`}>
							User: {user.username}
						</Link>
					) : (
						"Nothing"
					)}
				</h2>
			</div>
			<button
				disabled={loading}
				onClick={getUserDetails}
				className="bg-indigo-700 uppercase py-1 border border-transparent px-4 rounded-md hover:bg-purple-700 hover:shadow hover:shadow-blue-900 active:scale-95 disabled:opacity-70 hover:scale-110 transition-all disabled:cursor-no-drop"
			>
				{loading ? "Logging out..." : "Get User Details"}
			</button>
			<div className="flex gap-5">
				<Link
					href="/"
					className="group text-center rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
				>
					<h2 className={`mb-3 text-2xl font-semibold`}>
						Home{" "}
						<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
							-&gt;
						</span>
					</h2>
					<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
						Find in-depth information about Home Page and how it looks {";)"}
					</p>
				</Link>
				<button
					disabled={loading}
					onClick={handleLogout}
					className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
				>
					<h2 className={`mb-3 text-2xl font-semibold text-red-500`}>
						Logout{" "}
						<span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
							-&gt;
						</span>
					</h2>
					<p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
						Logout from your account and login to your account again.
					</p>
				</button>
			</div>
		</div>
	);
};

export default Profile;
