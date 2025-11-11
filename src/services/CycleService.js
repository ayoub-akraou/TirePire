import GroupModel from "../models/GroupModel.js";
import dayjs from "dayjs";
import EmailService from "./EmailService.js";
import GroupRepository from "../repositories/GroupRepository.js";
export default class CycleService {
	static async getAll(group_id) {
		const group = await GroupRepository.getOne({ _id: group_id });
		if (!group) {
			const error = new Error("group not found");
			error.statusCode = 404;
			throw error;
		}
		return group.cycles;
	}

	static async startCycle(group_id, start_date, user_id) {
		const group = await GroupRepository.getOne({ _id: group_id });

		if (user_id !== group.admin_id) {
			const error = new Error("the goup admin only can start the cycle!");
			error.statusCode = 403;
			throw error;
		}

		const startDate = dayjs(start_date);
		const cycleAlreadyStarted = Boolean(group.acceptMembers === false);

		if (!cycleAlreadyStarted) {
			group.acceptMembers = false;
			const cycle = group.cycles.at(-1);
			cycle.start_date = startDate;
			const turn = cycle.currentTurn;
			const turnMember = cycle.cycle_order[turn];

			const members = cycle.cycle_order;
			const numberOfMembers = cycle.cycle_order.length;
			const endDate = startDate.add(group.frequency * numberOfMembers, "month");
			cycle.end_date = endDate;
			await group.save();
			for (const m of members) {
				await EmailService.send(
					m.member_id.email,
					"ayoubakraou@gmail.com",
					`🔔 Le cycle ${group.name} démarre bientôt !`,
					`	<p>Bonjour ${m.member_id.name},</p>
					<p>Le cycle <b>${group.name}</b> commencera le <b>${startDate.format("DD/MM/YYYY")}</b>.</p>
					<p>Montant à verser : <b>${group.amount} DH</b>.</p>`
				);
			}
		} else {
			const error = new Error("cycle already started");
			error.statusCode = 409;
			throw error;
		}
	}
}
