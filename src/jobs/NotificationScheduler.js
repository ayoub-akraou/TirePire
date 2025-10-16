import cron from "node-cron";
import dayjs from "dayjs";
import GroupModel from "../models/GroupModel.js";
import MembershipModel from "../models/MembershipModel.js";
import EmailService from "../services/EmailService.js";

async function getGroupMembers(groupId) {
	return MembershipModel.find({ group_id: groupId, status: "accepted" }).populate("member_id");
}
