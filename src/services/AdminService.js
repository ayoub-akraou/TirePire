import MembershipModel from "../models/MembershipModel.js";

export default class AdminService {
	static async accept(data) {
		const { id } = data;
		const membership = await MembershipModel.findByIdAndUpdate(id, { status: "accepted" });
		if (!membership) {
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}
		return membership;
	}

	static async reject(data) {
		const { id } = data;
		const membership = await MembershipModel.findByIdAndUpdate(id, { status: "rejected" });
		if (!membership) {
			const error = new Error("Not Found");
			error.statusCode = 404;
			throw error;
		}
		return membership;
	}
}
