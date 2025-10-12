import MembershipModel from "../models/MembershipModel.js";
import GroupModel from "../models/GroupModel.js";

export default class MembershipService {
	static async getAll() {
		const memberships = await MembershipModel.find();
		return memberships;
	}

	static async store(data) {
		const { group_id, user_id, member_id } = data;

		const group = await GroupModel.findById(group_id);

		if (!group) {
			throw new Error("group not found!");
		}

		let invited_id = user_id;
		let initiatedBy = "member";
		if (user_id == group.admin_id) {
			invited_id = member_id;
			initiatedBy = "owner";
		}

		const GroupAcceptMembers = group?.acceptMembers;
		if (!GroupAcceptMembers) {
			throw new Error("This Group is no longer open for new memberships!");
		}

		const membershipExist = await MembershipModel.findOne({
			group_id,
			member_id,
		});

		if (membershipExist) {
			throw new Error("membership is already exist!");
		}

		const newMembership = new MembershipModel({ group_id, member_id: invited_id, initiatedBy, status });
		await newMembership.save();
		return newMembership;
	}

	static async getOne(id) {
		const membership = await MembershipModel.findById(id);
		if (!membership) throw new Error("Not Found");
		return membership;
	}

	static async delete(id) {
		const membership = await MembershipModel.findByIdAndDelete(id);
		if (!membership) throw new Error("Not Found");
		return membership;
	}
}
