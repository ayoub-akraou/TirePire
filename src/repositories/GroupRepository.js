import GroupModel from "../models/GroupModel.js";

export default class GroupRepository {
	static async getAll() {
		return await GroupModel.find();
	}

	static async create(data) {
		const newGroup = new GroupModel(data);
		await newGroup.save();
		return newGroup;
	}

	static async getOne(filter) {
		return await GroupModel.findOne(filter);
	}

	static async getGroupsMemberedByUser(user_id) {
		return await GroupModel.find({}).populate({
			path: "memberships",
			match: { member_id: user_id, status: "accepted" },
		});
	}

	static async delete(id) {
		return await GroupModel.findByIdAndDelete(id);
	}
}
