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
					cycle_number: { type: Number, required: true },
					start_date: {
						type: Date,
						validate: {
							validator: (v) => v >= new Date(),
							message: "Start date cannot be in the past",
						},
					},
					end_date: {
						type: Date,
						validate: {
							validator: function (v) {
								return v > this.start_date;
							},
							message: "End date must be after the start date",
						},
					},
					cycle_order: [
						{
							member_id: { type: Types.ObjectId, ref: "User", required: true },
							paymentByMember: [
								{
									member_id: {
										type: Types.ObjectId,
										ref: "User",
										required: true,
									},
									payed: { type: Boolean, default: false },
								},
							],
						},
					],
					currentTurn: {
						type: Number,
						default: 0,
						min: 0,
					},
				},
			],
			default: [],
		},
	},
	{ timestamps: true }
);

const GroupModel = mongoose.model("Group", groupSchema);

export default GroupModel;
