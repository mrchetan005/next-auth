"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ForgotPassword = () => {
	const router = useRouter();
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState({
		email: "",
	});

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		try {
			setLoading(true);
			const response = await axios.post("/api/users/forgot-password", {
				email: user.email,
			});
			console.log(response.data);
			toast.success(response.data.message);
			router.push(`/user/login`);
		} catch (error: any) {
			console.log("Error:", error.message);
			toast.error(error.response.data.error);
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e: SyntheticEvent) => {
		const { name, value } = e.target as HTMLInputElement;
		setUser((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	useEffect(() => {
		if (user.email.length > 0) {
			setButtonDisabled(false);
		} else {
			setButtonDisabled(true);
		}
	}, [user]);

	return (
		<div className="flex flex-col gap-6 justify-center items-center h-screen w-full">
			<div className="flex flex-col gap-6 p-5 justify-center items-center rounded-2xl w-11/12 sm:w-10/12 max-w-lg border">
				<h1 className="text-3xl font-semibold">Forgot Password</h1>
				<form
					className="flex flex-col gap-5 w-full items-center"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col gap-1 w-full">
						<label htmlFor="email">Email</label>
						<input
							value={user.email}
							onChange={handleChange}
							type="email"
							name="email"
							id="email"
							placeholder="xyz@example.com"
							className="text-black p-1 font-medium border-none outline-none"
						/>
					</div>
					<button
						disabled={buttonDisabled || loading}
						type="submit"
						className="bg-violet-700  uppercase py-1 border border-transparent px-4 rounded-md hover:bg-indigo-700 hover:text-white hover:shadow hover:shadow-blue-900 active:scale-95 disabled:opacity-70 hover:scale-110 transition-all disabled:cursor-no-drop"
					>
						{loading ? "Loading..." : "Continue"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ForgotPassword;
