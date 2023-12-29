import bcryptjs from "bcryptjs";
import { NextResponse, NextRequest } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

export async function POST(request: NextRequest) {
	const reqBody = await request.json();
	const { email } = reqBody;
	if (!email) {
		return NextResponse.json({ message: "Invalid email" }, { status: 400 });
	}
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return NextResponse.json(
				{ message: "User does not exist" },
				{ status: 401 }
			);
		}
		// send verification email
		await sendEmail({ email, emailType: "RESET", userId: user._id });

		return NextResponse.json(
			{ message: "Password reset link sent on your email successfuly" },
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
