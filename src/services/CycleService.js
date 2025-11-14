import dayjs from "dayjs";
import EmailService from "./EmailService.js";
import GroupRepository from "../repositories/GroupRepository.js";
import MembershipRepository from "../repositories/MembershipRepository.js";

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

	static async startCycle(data) {
		const { group_id, user_id, start_date } = data;
		const cycle_order = data.cycle_order.map((user) => {
			return {
				member_id: user._id,
				paymentByMember: data.cycle_order.map((member) => ({
					member_id: member._id,
					payed: false,
				})).filter((member) => (String(member.member_id) !== String(user._id))),
			};
		});
		const group = await GroupRepository.getOne({ _id: group_id });
		if (!group) {
			const error = new Error("group not found");
			error.statusCode = 404;
			throw error;
		}

		if (String(user_id) !== String(group.admin_id)) {
			const error = new Error("the group admin only can create a cycle!");
			error.statusCode = 403;
			throw error;
		}

		const nth = group.cycles.length + 1;
		const numberOfMembers = cycle_order.length;
		group.acceptMembers = false;
		const cycle = {
			cycle_number: nth,
			start_date: dayjs(start_date).toDate(),
			end_date: dayjs(start_date)
				.add(group.frequency * numberOfMembers, "month")
				.toDate(),
			cycle_order,
			currentTurn: 0,
		};
		group.cycles.push(cycle);
		await group.save();
		const updatedGroup = await GroupRepository.getOne({ _id: group._id });
		const members = updatedGroup.cycles
			.find((c) => c.cycle_number === nth)
			.cycle_order.map((member) => member.member_id);

		for (const m of members) {
			await EmailService.send(
				m.email,
				"ayoubakraou@gmail.com",
				`🔔 Le cycle ${group.name} démarre bientôt !`,
				`	<p>Bonjour ${m.member_id.name},</p>
					<p>Le cycle <b>${group.name}</b> commencera le <b>${dayjs(start_date).format("DD/MM/YYYY")}</b>.</p>
					<p>Montant à verser : <b>${group.amount} DH</b>.</p>`
			);
		}
	}
}
