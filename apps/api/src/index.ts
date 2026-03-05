import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";
import cors from "cors";
import type { CorsOptions } from "cors";

const app = express();

const allowedOrigins = [
  "http://localhost:3000",
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

// ✅ CORS must come BEFORE routes
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});
