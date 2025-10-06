import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// Importer vos routes
import userRoutes from "./routes/auth.routes.js";

// Initialiser dotenv
dotenv.config({ path: "/.env" });

const app = express();

// 1️⃣ Middlewares globaux
app.use(cors());
app.use(morgan("dev"));
app.use(express.json()); // parser JSON
app.use(express.urlencoded({ extended: true })); // parser urlencoded

// 2️⃣ Routes
app.use("/api/users", userRoutes);

// 3️⃣ Route par défaut
app.get("/", (req, res) => {
	res.send("API fonctionne !");
});

// 4️⃣ Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
