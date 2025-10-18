import cron from "node-cron";
import dayjs from "dayjs";
import GroupModel from "../models/GroupModel.js";
import MembershipModel from "../models/MembershipModel.js";
import EmailService from "../services/EmailService.js";

async function getGroupMembers(groupId, turnMemberId) {
	const members = await MembershipModel.find({
		group_id: groupId,
		status: "accepted",
	}).populate("member_id");

	// Exclure le membre qui a le tour actuel
	return members.filter((member) => member.member_id._id.toString() !== turnMemberId.toString());
	// return members;
}

async function sendMonthlyPaymentReminder(group, cycle) {
	const currentTurnData = cycle.cycle_order[cycle.currentTurn];
	const turnUser = currentTurnData?.member_id;
	const turnMemberId = turnUser._id;
	const members = await getGroupMembers(group._id, turnMemberId);

	if (!turnUser) return;

	await Promise.all(
		members.map(async (m) => {
			try {
				await EmailService.send(
					m.member_id.email,
					// "ayoubakraou@gmail.com",
					`💰 Versement du mois - ${group.name}`,
					`
						<p>Bonjour ${m.member_id.name},</p>
						<p>Le cycle <b>${group.name}</b> continue ce mois-ci.</p>
						<p>Le bénéficiaire de ce tour est <b>${turnUser.name}</b>.</p>
						<p>Veuillez lui verser la somme de <b>${group.amount} DH</b>.</p>
						<p>RIB du bénéficiaire : <b>${turnUser.rib || "Non renseigné"}</b></p>
						<hr/>
						<p>Merci de votre participation et de votre ponctualité 💪</p>
						<p>— L’équipe ${group.name}</p>
					`
				);
				console.log(`✅ Email envoyé à ${m.member_id.email}`);
			} catch (err) {
				console.error(err);
			}
		})
	);
}

async function incrementCycleTurn(group, cycle) {
	cycle.currentTurn = cycle.currentTurn + 1;
	group.markModified("cycles");
	await group.save();
}

export default async function initNotificationScheduler() {
	cron.schedule("0 0 0 * * *", async () => {
		console.log("start job");

		const today = dayjs();

		const groups = await GroupModel.find({
			"cycles.start_date": { $exists: true, $ne: null },
			acceptMembers: false,
		})
			.populate({
				path: "cycles.cycle_order.member_id",
				select: "name email profileImg",
			})
			.populate({
				path: "cycles.cycle_order.paymentByMember.member_id",
				select: "name email profileImg",
			});

		for (const group of groups) {
			for (const cycle of group.cycles) {
				const startDate = dayjs(cycle.start_date);
				const frequency = group.frequency;
				const totalMonths = frequency * cycle.cycle_order.length;

				// Rappel mensuel
				for (let i = 0; i < totalMonths; i += frequency) {
					const paymentDate = startDate.add(i, "month");
					if (paymentDate.isSame(today, "day")) {
						await sendMonthlyPaymentReminder(group, cycle);
						await incrementCycleTurn(group, cycle);
					}
				}
			}
		}

		console.log("end job");
	});
}
