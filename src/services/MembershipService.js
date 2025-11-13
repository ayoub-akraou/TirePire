import MembershipModel from "../models/MembershipModel.js";
import MembershipRepository from "../repositories/MembershipRepository.js";
import GroupRepository from "../repositories/GroupRepository.js";

export default class MembershipService {
	static async getAll() {
		const memberships = await MembershipRepository.getAll();
		return memberships;
	}

	static async getMembers(group_id) {
		const members = await MembershipRepository.getMembers(group_id);
		return members;
	}

	static async store(data) {
		const { group_id, user_id, member_id } = data;

		const group = await GroupRepository.getOne({ _id: group_id });

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

		const membershipExist = await MembershipRepository.getOne({
			group_id,
			member_id,
		});

		if (membershipExist) {
			const error = new Error("membership is already exist!");
			error.statusCode = 409;
			throw error;
		}

		const newMembership = MembershipRepository.create({
			group_id,
			member_id: invited_id,
			initiatedBy,
		});
		return newMembership;
	}

	static async getOne(id) {
		const membership = await MembershipRepository.getOne({ _id: id });
		if (!membership) {
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}
		return membership;
	}

	static async delete(id) {
		const membership = await MembershipRepository.delete(id);
		if (!membership) {
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}
		return membership;
	}
}
