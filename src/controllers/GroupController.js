import mongoose from "mongoose";
import membershipModel from "../models/MembershipModel.js";
import GroupService from "../services/GroupService.js";

export default class GroupController {
	static async index(req, res) {
		try {
			const groups = await GroupService.getAll();
			res.status(200).json({ success: true, data: groups, message: "Groups retrieved successfully!" });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	static async store(req, res) {
		let group_id;
		try {
			const user_id = req.user?.id;
			const data = { ...req.body, user_id };

			const group = await GroupService.store(data);

			group_id = group._id;

			await membershipModel.create({
				group_id,
				member_id: user_id,
				status: "accepted",
			});
			res.status(201).json({ success: true, data: group, message: "group created succesfuly" });
		} catch (error) {
			await GroupService.delete(group_id);
			res.status(400).json({ success: false, message: error.message });
		}
	}

	static async show(req, res) {
		try {
			const id = req.params.id;
			const group = await GroupService.getOne(id);
			res.status(200).json({ success: true, data: group, message: "group retrieved succesfuly!" });
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}

	static async update(req, res) {}

	static async destroy(req, res) {
		try {
			const id = req.params.id;
			await GroupService.delete(id);
			res.sendStatus(204);
		} catch (error) {
			res.status(400).json({ success: false, message: error.message });
		}
	}
}
