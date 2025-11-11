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
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}

		let invited_id = user_id;
		let initiatedBy = "member";
		if (user_id == group.admin_id) {
			invited_id = member_id;
			initiatedBy = "owner";
		}

		const GroupAcceptMembers = group?.acceptMembers;
		if (!GroupAcceptMembers) {
			const error = new Error("This Group is no longer open for new memberships!");
			error.statusCode = 403;
			throw error;
		}

		const membershipExist = await MembershipModel.findOne({
			group_id,
			member_id,
		});

		if (membershipExist) {
			const error = new Error("membership is already exist!");
			error.statusCode = 409;
			throw error;
		}

		const newMembership = new MembershipModel({ group_id, member_id: invited_id, initiatedBy });
		await newMembership.save();
		return newMembership;
	}

	static async getOne(id) {
		if (!membership) {
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}
		return membership;
	}

	static async delete(id) {
		if (!membership) {
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}
		return membership;
	}
}
