import { param } from "express-validator";
import CycleService from "../services/CycleService.js";

export default class CycleController {
	static async index(req, res) {
		try {
			const { group_id } = req.params;
			const cycles = await CycleService.getAll(group_id);
			res.status(200).json({ success: true, data: cycles, message: "cycles retrieved successfully!" });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
}
