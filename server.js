import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Importer vos routes
import authRoutes from "./src/routes/auth.routes.js";
import dbConnect from "./src/config/db.js";

// Initialiser dotenv
dbConnect();

const app = express();

// 1️⃣ Middlewares globaux
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // parser JSON
app.use(express.urlencoded({ extended: true })); // parser urlencoded

// 2️⃣ Routes
app.use("/api/auth", authRoutes);

// 3️⃣ Route par défaut
app.get("/", (req, res) => {
	res.send("API fonctionne !");
});

// 4️⃣ Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
