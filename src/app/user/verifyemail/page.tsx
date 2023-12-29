"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function VerifyEmail() {
	const [token, setToken] = useState("");
	const [verified, setVerified] = useState(false);
	const [user, setUser] = useState("");
	const verifyUserEmail = async () => {
		try {
			const response = await axios.post("/api/users/verifyemail", { token });
			setVerified(true);
			// console.log("response=>", response.data);
			setUser(response.data.user.username);
			toast.success(response.data.message);
		} catch (error: any) {
			console.log("Error =>", error.response.data);
			toast.error(error.response.data.message);
		}
	};

	useEffect(() => {
		const urlToken = window.location.search.split("=")[1];
		setToken(urlToken || "");
	}, [verified]);

	useEffect(() => {
		if (token.length > 0) {
			verifyUserEmail();
		}
	}, [token]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			{!verified ? (
				<>
					<h1 className="text-3xl">Verify Email</h1>
					<h2 className="p-2 my-2 bg-orange-500 text-black rounded-md">
						{token ? token : "No token"}
					</h2>
				</>
			) : (
				<div className="text-center my-4 flex flex-col items-center justify-center gap-5">
					<h2 className="text-2xl">✅ Email Verified Successfully</h2>
					<p>User: {user}</p>
					<Link
						href={"/user/login"}
						className="bg-violet-700  uppercase py-1 border border-transparent px-4 rounded-md hover:bg-indigo-700 hover:text-white hover:shadow hover:shadow-blue-900 active:scale-95 disabled:opacity-70 hover:scale-110 transition-all"
					>
						Login
					</Link>
				</div>
			)}
		</div>
	);
}
