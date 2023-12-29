import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
	{
		username: {
			type: String,
			required: [true, "Please provide a username"],
			unique: true,
		},
		email: {
			type: String,
			required: [true, "Please provide an email address"],
			unique: true,
		},
		password: {
			type: String,
			required: [true, "Please provide a password"],
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
		forgotPasswordToken: String,
		forgotPasswordTokenExpiry: Date,
		verifyToken: String,
		verifyTokenExpiry: Date,
	},
	{ timestamps: true }
);

const User = models.users || model("users", userSchema);

export default User;
