import CycleService from "../services/CycleService.js";

export default class CycleController {
	static async index(req, res) {
		try {
			const { group_id } = req.params;
			const cycles = await CycleService.getAll(group_id);
			res.status(200).json({
				success: true,
				data: cycles, 
				message: "cycles retrieved successfully!",
			});
		} catch (error) {
			res.status(error.statusCode || 500).json({ success: false, message: error.message });
		}
	}

	static async store(req, res) {
		try {
			const { group_id } = req.params;
			const user_id = req.user.id;
			const data = { ...req.body };
			const cycle = await CycleService.store(group_id, user_id, data);
			res.status(201).json({
				success: true,
				data: cycle,
				message: "cycle created succesfuly",
			});
		} catch (error) {
			res.status(error.statusCode || 500).json({ success: false, message: error.message });
		}
	}

	static async startCycle(req, res) {
		try {
			const { group_id } = req.params;
			const user_id = req.user.id;
			const data = { ...req.body, group_id, user_id };
			const cycle = await CycleService.startCycle(data);
			res.status(200).json({
				success: true,
				data: cycle,
				message: "cycle started succesfuly",
			});
		} catch (error) {
			res.status(error.statusCode || 500).json({ success: false, message: error.message });
		}
	}
}
