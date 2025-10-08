import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default class AuthService {
	static async register(data) {
		const { email, password } = data;
		const isAlreadyExist = await UserModel.findOne({ email });

		if (isAlreadyExist) {
			const error = new Error("email already exist! use another email or login!");
			error.statusCode = 400;
			throw error;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new UserModel({ ...data, password: hashedPassword });
		const savedUser = (await user.save()).toObject();

		savedUser.id = savedUser._id;

		delete savedUser._id;
		delete savedUser.password;

		return savedUser;
	}
}
