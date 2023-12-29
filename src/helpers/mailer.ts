import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
	try {
		const hashedToken = await bcryptjs.hash(userId.toString(), 10);
		if (emailType === "VERIFY") {
			await User.findByIdAndUpdate(userId, {
				verifyToken: hashedToken,
				verifyTokenExpiry: Date.now() + 3600000,
			});
		} else if (emailType === "RESET") {
			await User.findByIdAndUpdate(userId, {
				forgotPasswordToken: hashedToken,
				forgotPasswordTokenExpiry: Date.now() + 3600000,
			});
		}
		const transport = nodemailer.createTransport({
			host: process.env.MAILER_HOST,
			port: process.env.MAILER_PORT,
			auth: {
				user: process.env.MAILER_AUTH_USER,
				pass: process.env.MAILER_AUTH_PASS,
			},
		} as nodemailer.TransportOptions);
		const mailOptions = {
			from: "abc@xyz.com",
			to: email,
			subject:
				emailType === "VERIFY"
					? `Please verify your email`
					: `Reset your password`,
			html: `<p>Click <a href="${process.env.DOMAIN}/user/${
				emailType === "VERIFY" ? "verifyemail" : "reset-password"
			}?token=${hashedToken}">here</a> to ${
				emailType === "VERIFY" ? "verify your email" : "reset your password"
			} or copy paste the link below in your browser. <br/>${
				process.env.DOMAIN
			}/user/${
				emailType === "VERIFY" ? "verifyemail" : "reset-password"
			}?token=${hashedToken}</p>`,
		};
		const mailResponse = await transport.sendMail(mailOptions);
		return mailResponse;
	} catch (error: any) {
		throw new Error(error.message);
	}
};
