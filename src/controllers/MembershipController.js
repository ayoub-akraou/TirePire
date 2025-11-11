import MembershipService from "../services/MembershipService.js";

export default class MembershipController {
	static async index(req, res) {
		try {
			const memberships = await MembershipService.getAll();
			res.status(200).json({
				success: true,
				data: memberships,
				message: "memberships retrieved successfully!",
			});
		} catch (error) {
			res.status(error.statusCode || 500).json({ success: false, message: error.message });
		}
	}

	static async store(req, res) {
		try {
			const data = { ...req.body, user_id: req.user.id };
			const membership = await MembershipService.store(data);
			res.status(201).json({
				success: true,
				data: membership,
				message: "membership created succesfuly",
			});
		} catch (error) {
			res.status(error.statusCode || 500).json({ success: false, message: error.message });
		}
	}

	static async show(req, res) {
		try {
			const id = req.params.id;
			const membership = await MembershipService.getOne(id);
			res.status(200).json({
				success: true,
				data: membership,
				message: "membership retrieved succesfuly!",
			});
		} catch (error) {
			res.status(error.statusCode || 500).json({ success: false, message: error.message });
		}
	}

	static async update(req, res) {}

	static async destroy(req, res) {
		try {
			const id = req.params.id;
			await MembershipService.delete(id);
			res.sendStatus(204);
		} catch (error) {
			res.status(error.statusCode || 500).json({ success: false, message: error.message });
		}
	}
}
