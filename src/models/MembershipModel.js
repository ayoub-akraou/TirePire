import mongoose, { Schema, Types } from "mongoose";

const membershipSchema = new Schema(
	{
		group_id: { type: Types.ObjectId, ref: "Group" },
		member_id: { type: Types.ObjectId, ref: "User" },
	},
	{ timestamps: true }
);

const membershipModel = mongoose.model("Membership", membershipSchema);

export default membershipModel;
