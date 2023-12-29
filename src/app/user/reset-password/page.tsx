"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { SyntheticEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";

const ResetPassword = () => {
	const [token, setToken] = useState("");
	const [user, setUser] = useState({
		confirmPassword: "",
		password: "",
	});
	const router = useRouter();
	const [buttonDisabled, setButtonDisabled] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const urlToken = window.location.search.split("=")[1];
		setToken(urlToken || "");
	}, []);

	const handleSubmit = async (e: SyntheticEvent) => {
		e.preventDefault();
		if (token.length <= 0) {
			return toast.error("Invalid token.");
		}
		try {
			setLoading(true);
			const response = await axios.post("/api/users/reset-password", {
				token,
				password: user.password,
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
		if (user.password.length > 5 && user.password.length > 5) {
			setButtonDisabled(!(user.password === user.confirmPassword));
		} else {
			setButtonDisabled(true);
		}
	}, [user]);

	useEffect(() => {});

	return (
		<div className="flex flex-col gap-6 justify-center items-center h-screen w-full">
			<div className="flex flex-col gap-6 p-5 justify-center items-center rounded-2xl w-11/12 sm:w-10/12 max-w-lg border">
				<h1 className="text-3xl font-semibold">Reset Password</h1>
				<form
					className="flex flex-col gap-5 w-full items-center"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col gap-1 w-full">
						<label htmlFor="password">New Password</label>
						<input
							value={user.password}
							onChange={handleChange}
							type="password"
							name="password"
							id="password"
							placeholder="Enter Password"
							className="text-black p-1 font-medium border-none outline-none"
						/>
					</div>
					<div className="flex flex-col gap-1 w-full">
						<label htmlFor="password">Confirm Password</label>
						<input
							value={user.confirmPassword}
							onChange={handleChange}
							type="password"
							name="confirmPassword"
							id="confirmPassword"
							placeholder="Enter Password"
							className="text-black p-1 font-medium border-none outline-none"
						/>
					</div>
					<button
						disabled={buttonDisabled || loading}
						type="submit"
						className="bg-violet-700  uppercase py-1 border border-transparent px-4 rounded-md hover:bg-indigo-700 hover:text-white hover:shadow hover:shadow-blue-900 active:scale-95 disabled:opacity-70 hover:scale-110 transition-all disabled:cursor-no-drop"
					>
						{loading ? "Loading..." : "Reset Password"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetPassword;
