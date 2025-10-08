import mongoose from "mongoose";

export default async function dbConnect() {
	try {
		mongoose.connect(process.env.MONGODB_URI);
		console.log("la connexion est etablis avec success!");
	} catch (error) {
		console.error(error.message);
		process.exit(1);
	}
}
