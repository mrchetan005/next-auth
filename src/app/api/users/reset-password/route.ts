import bcryptjs from "bcryptjs";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
	const reqBody = await request.json();
	const { token, password } = reqBody;
	if (!password || !token) {
		return NextResponse.json(
			{ error: "userId and password is required" },
			{ status: 400 }
		);
	}

	try {
		// create hashed password
		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);
		const user = await User.findOneAndUpdate(
			{
				forgotPasswordToken: token,
				forgotPasswordTokenExpiry: { $gt: Date.now() },
			},
			{
				$set: {
					password: hashedPassword,
				},
				$unset: {
					forgotPasswordToken: 1,
					forgotPasswordTokenExpiry: 1,
				},
			},
			{ new: true }
		).select("-password");

		if (!user) {
			return NextResponse.json(
				{ message: "Invalid or expired Token." },
				{ status: 400 }
			);
		}
		return NextResponse.json(
			{ message: `Password reset successfully`, success: true, user },
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
