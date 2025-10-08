import jwt from "jsonwebtoken";
import BlacklistModel from "../models/BlacklistModel.js";

export default async function authMiddleware(req, res, next) {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return res.status(401).json({ success: false, message: "No token provided" });
		}

		const token = authHeader.split(" ")[1];
		const isBlacklisted = await BlacklistModel.exists({ token });
		if (isBlacklisted) {
			return res.status(401).json({ success: false, message: "Token expired or revoked" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		req.token = token;

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ success: false, message: "Token expired" });
		}
		if (error.name === "JsonWebTokenError") {
			return res.status(401).json({ success: false, message: "Invalid token" });
		}
		return res.status(500).json({ success: false, message: "Authentication failed" });
	}
}
