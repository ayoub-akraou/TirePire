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
			required: [true, "the password is required"],
			select: false,
		},
		role: {
			type: String,
			enum: ["regular", "admin"],
			default: "regular",
		},
		rib: {
			type: String,
			unique: true,
			required: [true, "the RIB is required!"],
			match: [/^[0-9]{24}$/, "RIB should have 24 character!"],
		},
	},
	{ timestamps: true }
);

const UserModel = mongoose.model("User", userSchema);

export default UserModel;
