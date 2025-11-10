import blacklistModel from "../models/BlacklistModel";
export default class BlackListRepository {
	static async create(data) {
		return await blacklistModel.create(data);
	}
}
