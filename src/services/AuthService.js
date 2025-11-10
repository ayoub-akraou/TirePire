import UserModel from "../models/UserModel.js";
import blacklistModel from "../models/BlacklistModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import BlacklistRepository from "../repositories/BlacklistRepository.js";

export default class AuthService {
	static async register(data) {
		const { email } = data;
		const isAlreadyExist = await UserRepository.findByEmail(email);

		if (isAlreadyExist) {
			const error = new Error("email already exist! use another email or login!");
			error.statusCode = 400;
			throw error;
		}

		const user = await UserRepository.createUser(data);
		return user;
	}

	static async login(data) {
		const { email, password } = data;
		const user = await UserRepository.findByEmail(email, true);

		if (!user || !(await bcrypt.compare(password, user.password))) {
			const error = new Error("Invalid credentials");
			error.statusCode = 401; // Unauthorized
			throw error;
		}

		const token = jwt.sign(
			{ id: user._id, email: user.email, role: user.role },
			process.env.JWT_SECRET,
			{
				// expiresIn: "1d",
			}
		);

		delete user.password;

		return { user, token };
	}

	static async logout(token) {
		const decodedToken = jwt.decode(token);
		const data = { token };
		if (decodedToken.exp) data.expiresAt = new Date(decodedToken.exp * 1000);
		await BlacklistRepository.create(data);
	}
}
