import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import authRoutes from "./routes/auth.routes";
import animalRoutes from "./routes/animal.routes";
import userRoutes from "./routes/user.routes";
// import { auth } from "./middlewares/auth";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Pet Adoption Platform API is running 🐾");
});

app.use("/user", userRoutes);
app.use("/animal", animalRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});