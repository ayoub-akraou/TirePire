import mongoose, { Schema, Types } from "mongoose";

const groupSchema = new Schema(
	{
		name: {
			type: String,
			minLength: [5, "too short name"],
			maxLength: [20, "too long name"],
			required: true,
			unique: true,
		},
		amount: {
			type: Types.Decimal128,
			default: 100,
			min: 100,
			max: 10000,
		},
		frequency: {
			type: Number,
			enum: [1, 2, 3, 4],
			default: 1,
		},
		acceptMembers: {
			type: Boolean,
			default: true,
		},
		admin_id: {
			type: Types.ObjectId,
			ref: "User",
			required: true,
		},

		cycles: {
			type: [
				{
					cycle_number: { type: Number, required: true, unique: true },
					cycle_order: [
						{
							member_id: { type: Types.ObjectId, ref: "User", required: true, unique: true },
							paymentByMember: [
								{
									member_id: { type: Types.ObjectId, ref: "User", required: true, unique: true },
									payed: { type: Boolean, default: false },
								},
							],
						},
					],
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);

const GroupModel = mongoose.model("Group", groupSchema);

export default GroupModel;
