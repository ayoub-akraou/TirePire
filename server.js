import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Importer vos routes
import authRoutes from "./src/routes/auth.routes.js";
import groupsRoutes from "./src/routes/groups.routes.js";
import membershipsRoutes from "./src/routes/memberships.routes.js";
import cyclesRoute from "./src/routes/cycles.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import initNotificationScheduler from "./src/jobs/NotificationScheduler.js";

import dbConnect from "./src/config/db.js";

// Initialiser dotenv
dotenv.config({ path: "./.env" });
dbConnect();
initNotificationScheduler();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups/", groupsRoutes);
app.use("/api/memberships/", membershipsRoutes);
app.use("/api/cycles/", cyclesRoute);
app.use("/api/admin/", adminRoutes);

// Route par défaut
app.get("/", (req, res) => {
	res.send("API fonctionne !");
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
