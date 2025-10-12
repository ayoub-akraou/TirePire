import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Importer vos routes
import authRoutes from "./src/routes/auth.routes.js";
import groupsRoutes from "./src/routes/groups.routes.js";
import membershipsRoutes from "./src/routes/memberships.routes.js";
import dbConnect from "./src/config/db.js";

// Initialiser dotenv
dotenv.config({ path: "./.env" });
dbConnect();

const app = express();

// Middlewares globaux
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // parser JSON
app.use(express.urlencoded({ extended: true })); // parser urlencoded

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/groups/", groupsRoutes);
app.use("/api/memberships/", membershipsRoutes);

// Route par défaut
app.get("/", (req, res) => {
	res.send("API fonctionne !");
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
