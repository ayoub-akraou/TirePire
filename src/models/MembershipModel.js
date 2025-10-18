import mongoose, { Schema, Types } from "mongoose";

const membershipSchema = new Schema(
	{
		group_id: { type: Types.ObjectId, ref: "Group", required: true },
		member_id: { type: Types.ObjectId, ref: "User", required: true },
		initiatedBy: {
			type: String,
			enum: ["member", "owner"],
			default: null,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected"],
			default: "pending",
		},
	},
	{ timestamps: true }
);

membershipSchema.index({ group_id: 1, member_id: 1 }, { unique: true });

const membershipModel = mongoose.model("Membership", membershipSchema);

export default membershipModel;

/**
 * owner can invite people
 ****** check if he is the owner
 ****** need target user id and the id of the group
 *
 * people can send invitation to join
 ****** need the loggedin user id and the id of the group
 *
 * owner should not be invited because he is already a member
 ***** check if the member_id is for the owner
 */
