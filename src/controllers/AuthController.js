import AuthService from "../services/AuthService.js";
export default class AuthController {
	static async register(req, res) {
		try {
			const user = await AuthService.register(req.body);
			res.status(201).json({ success: true, data: user });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
