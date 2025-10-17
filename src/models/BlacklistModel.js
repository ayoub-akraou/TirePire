import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
	token: {
		required: true,
		type: String,
		unique: true,
	},
	expiresAt: {
		type: Date,
	},
});

// create an index and sort it and set an expire rule
blacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const blacklistModel = mongoose.model("Blacklist", blacklistSchema);

export default blacklistModel;
