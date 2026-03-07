import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
import type { CorsOptions } from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost",
  "http://127.0.0.1",
  "https://your-production-domain.com",
];

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/users", userRoutes);

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, "0.0.0.0", (error) => {
  console.log(`API server is running on port ${PORT}`);
});
