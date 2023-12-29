import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connectDB();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { username, email, password } = reqBody;
		if (!username || !email || !password) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		// Check if user already exists in the database
		let userExist = await User.findOne({ $or: [{ email }, { username }] });
		if (userExist) {
			return NextResponse.json(
				{
					message: "User with this username or email already exist",
				},
				{ status: 409 }
			);
		}
		// Hash passwords before saving to the database
		const salt = await bcryptjs.genSalt(10);
		const hashedPassword = await bcryptjs.hash(password, salt);
		const user = await User.create({
			username,
			email,
			password: hashedPassword,
		});

		// send verification email
		await sendEmail({ email, emailType: "VERIFY", userId: user._id });

		return NextResponse.json(
			{
				message: `Account created successfully`,
				success: true,
				user,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
