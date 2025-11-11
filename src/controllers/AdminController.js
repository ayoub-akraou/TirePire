import AdminService from "../services/AdminService.js";

export class AdminController {
	static async accept(req, res) {
		try {
			const data = { ...req.body, user_id: req.user.id };
			const membership = await AdminService.accept(data);
			res.status(201).json({
				success: true,
				data: membership,
				message: "membership accepted succesfuly",
			});
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	static async reject(req, res) {
		try {
			const data = { ...req.body, user_id: req.user.id };
			const membership = await AdminService.reject(data);
			res.status(201).json({
				success: true,
				data: membership,
				message: "membership rejected succesfuly",
			});
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
}
