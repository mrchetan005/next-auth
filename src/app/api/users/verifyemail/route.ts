import { connectDB } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextResponse, NextRequest } from "next/server";

connectDB();

export async function POST(request: NextRequest) {
	try {
		const reqBody = await request.json();
		const { token } = reqBody;

		const user = await User.findOneAndUpdate({
			verifyToken: token,
			verifyTokenExpiry: { $gt: Date.now() },
		},
		{
			$set: {
				isVerified: true,
			},
			$unset: {
				verifyToken: 1,
				verifyTokenExpiry: 1,
			},
		},
		{ new: true }
	).select("-password");
		if (!user) {
			return NextResponse.json({ message: "Invalid Token" }, { status: 401 });
		}
		return NextResponse.json(
			{
				message: "Email verified successfully",
				success: true,
				user,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return NextResponse.json({ message: error.message }, { status: 500 });
	}
}
