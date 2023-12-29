import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { email, password } = reqBody;
		if (!email || !password) {
			return NextResponse.json(
				{ message: "Email or Password is missing" },
				{ status: 400 }
			);
		}

		// Check if user exists in the database
		const user = await User.findOne({ email });
		if (!user) {
			return NextResponse.json(
				{ error: "Invalid Email or password" },
				{ status: 400 }
			);
		}

		if (!user.isVerified) {
			return NextResponse.json(
				{ error: "Please verify your email to login" },
				{ status: 403 }
			);
		}

		// check password
		const isPasswordValid = await bcryptjs.compare(password, user.password);
		if (!isPasswordValid) {
			return NextResponse.json(
				{ error: "Invalid Email or password" },
				{ status: 401 }
			);
		}

		// create token data
		let tokenData = {
			_id: user._id,
			username: user.username,
			email: user.email,
		};

		// create token
		const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
			expiresIn: process.env.TOKEN_EXPIRY,
		});

		const response = NextResponse.json({
			message: "User logged in successfully",
			success: true,
			user,
		});
		response.cookies.set("token", token, { httpOnly: true, secure: true });
		return response;
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
