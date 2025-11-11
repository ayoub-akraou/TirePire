import GroupRepository from "../repositories/GroupRepository.js";

export default class GroupService {
	static async getAll() {
		const groups = await GroupRepository.getAll();
		return groups;
	}

	static async store(data) {
		return await GroupRepository.create(data);
	}

	static async getOne(id) {
		const group = await GroupRepository.getOne({id: id});
		if (!group) {
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}
		return group;
	}

	static async delete(id) {
		const group = await GroupRepository.getOne({id: id});
		if (!group) {
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}
		await GroupRepository.delete(id);
		return group;
	}

	static async getGroupsCreatedByUser(user_id) {
		const groups = GroupRepository.getOne({ admin_id: user_id });
		return groups;
	}

	static async getGroupsMemberedByUser(user_id) {
		const groups = await GroupModel.find({}).populate({path: "memberships", match: {member_id: user_id, status: "accepted"}});
		return groups;
	}
}
