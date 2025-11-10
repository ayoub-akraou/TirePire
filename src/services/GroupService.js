import GroupModel from "../models/GroupModel.js";

export default class GroupService {
	static async getAll() {
		const groups = await GroupModel.find();
		return groups;
	}

	static async store(data) {
		const newGroup = new GroupModel(data);
		await newGroup.save();
		return newGroup;
	}

	static async getOne(id) {
		const group = await GroupModel.findById(id);
		if (!group) throw new Error("Not Found");
		return group;
	}

	static async delete(id) {
		const group = await GroupModel.findByIdAndDelete(id);
		if (!group) throw new Error("Not Found");
		return group;
	}

	static async getGroupsCreatedByUser(user_id) {
		const groups = await GroupModel.find({ admin_id: user_id });
		return groups;
	}

	static async getGroupsMemberedByUser(user_id) {
		const groups = await GroupModel.find({ admin_id: user_id });
		return groups;
	}
}
