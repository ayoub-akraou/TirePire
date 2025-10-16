import cron from "node-cron";
import dayjs from "dayjs";
import GroupModel from "../models/GroupModel.js";
import MembershipModel from "../models/MembershipModel.js";
import EmailService from "../services/EmailService.js";

async function getGroupMembers(groupId) {
	return MembershipModel.find({ group_id: groupId, status: "accepted" }).populate("member_id");
}

async function sendCycleStartReminder(group, cycle, startDate) {
	const members = await getGroupMembers(group._id);

	for (const m of members) {
		await EmailService.send(
			m.member_id.email,
			`🔔 Le cycle ${group.name} démarre bientôt !`,
			`	<p>Bonjour ${m.member_id.name},</p>
				<p>Le cycle <b>${group.name}</b> commencera le <b>${startDate.format("DD/MM/YYYY")}</b>.</p>
				<p>Montant à verser : <b>${group.amount} DH</b>.</p>`
		);
	}
}

async function sendMonthlyPaymentReminder(group, cycle) {
	const members = await getGroupMembers(group._id);
	const currentTurnData = cycle.cycle_order[cycle.currentTurn];
	const turnUser = currentTurnData?.member_id;

	if (!turnUser) return;

	await Promise.all(
		members.map(async (m) => {
			try {
				await EmailService.send(
					m.member_id.email,
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

export default function initNotificationScheduler() {
	cron.schedule("0 0 0 * * *", async () => {
		console.log("start");

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

				// Rappel avant le début
				if (
					startDate.subtract(1, "month").isSame(today, "day") &&
					startDate.subtract(1, "month").isSame(today, "month") &&
					startDate.subtract(1, "month").isSame(today, "year")
				) {
					await sendCycleStartReminder(group, cycle, startDate);
				}

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

		console.log("end");
	});
}
