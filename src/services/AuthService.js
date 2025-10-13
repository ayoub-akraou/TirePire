import UserModel from "../models/UserModel.js";
import blacklistModel from "../models/BlacklistModel.js";
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

	static async login(data) {
		const { email, password } = data;
		const user = await UserModel.findOne({ email }).select("+password");

		if (!user || !(await bcrypt.compare(password, user.password))) {
			const error = new Error("Invalid credentials");
			error.statusCode = 401; // Unauthorized
			throw error;
		}

		const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
			// expiresIn: "1d",
		});

		const userData = user.toObject();
		userData.id = userData._id;
		delete userData._id;
		delete userData.password;

		return { user: userData, token };
	}

	static async logout(token) {
		const decodedToken = jwt.decode(token);
		await blacklistModel.create({ token, expiresAt: new Date(decodedToken.exp * 1000) });
	}
}
