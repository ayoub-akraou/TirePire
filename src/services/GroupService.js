import GroupModel from "../models/GroupModel.js";

export default class GroupService {
	static async getAll() {
		const groups = await GroupModel.find();
		return groups;
	}

	static async store(data, session) {
		const newGroup = new GroupModel(data);
		await newGroup.save({ session });
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
}
