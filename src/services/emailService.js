import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: { user: process.env.EMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
});

export default class EmailService {
	static async send(to, subject, html) {
		try {
			await transporter.sendMail({
				from: `"TireLire:" <${process.env.EMAIL_USER}>`,
				to,
				subject,
				html,
			});
			console.log(`Email envoyé à ${to}`);
		} catch (err) {
			console.error("Erreur d'envoi d'email :", err);
		}
	}
}
