import mongoose from "mongoose";

export async function connectDB() {
	try {
		mongoose.connect(process.env.MONGO_URI!);
		const connection = mongoose.connection;
		connection.on("connected", () => {
			console.log(`Mongoose connected successfully`);
		});
		connection.on("error", (err) => {
			console.log(
				`MongoDB connection error. Please make sure MongoDB is running. ${err}`
			);
			process.exit(1);
		});
	} catch (error) {
		console.log(`Something went wrong while connecting to mongoDB`, error);
	}
}
