import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "the name is required"],
		},
		slug: {
			type: String,
			lowercase: true,
		},
		email: {
			type: String,
			required: [true, "the email is required"],
			unique: true,
			lowercase: true,
		},
		phone: String,
		profileImg: {
			type: String,
			default: "/images/profiles/profile-placeholder.jpeg",
		},
		password: {
			type: String,
			minLength: [8, "too short password"],
			maxLength: [20, "too long password"],
			required: [true, "the password is required"],
			select: false,
		},
		role: {
			type: String,
			enum: ["regular", "admin"],
			default: "regular",
		},
	},
	{ timestamps: true }
);

const userModel = mongoose.model("User", userSchema);

export default userModel;
