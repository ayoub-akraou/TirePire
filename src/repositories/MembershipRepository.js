import MembershipModel from "../models/MembershipModel";

export default class MembershipRepository {
	static async getAll() {
		const memberships = await MembershipModel.find({});
		return memberships;
	}

	static async get(filters) {
		const membership = await MembershipModel.find(filters);
		return membership;
	}

	static async getOne(filters) {
		const membership = await MembershipModel.findOne(filters);
		return membership;
	}

	static async getMembers(group_id) {
		const members = await MembershipModel.find({
			group_id,
			status: "accepted",
		}).populate("member_id");
		return members.map((m) => m.member_id);
	}

	static async create(data) {
		const newMembership = new MembershipModel(data);
		await newMembership.save();
		return newMembership;
	}

	static async delete(id) {
		const membership = await MembershipModel.findByIdAndDelete(id);
		return membership;
	}
}
