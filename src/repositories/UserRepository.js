import UserModel from "../models/UserModel.js";
class UserRepository {
    static async findByEmail(email) {
        return await UserModel.findOne({ email });
    }

    static async createUser(data) {
        const { password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({ ...data, password: hashedPassword });
        const savedUser = (await user.save()).toObject();

        savedUser.id = savedUser._id;

        delete savedUser._id;
        delete savedUser.password;

        return savedUser;
    }
}