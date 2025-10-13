import MembershipModel from "../models/MembershipModel.js";
import GroupModel from "../models/GroupModel.js";

export default class MembershipService {
	static async getAll(group_id) {
		const group = await GroupModel.findById(group_id);
		if (!group) throw new Error("Group Not Found!");
		return group.cycles;
	}
}
