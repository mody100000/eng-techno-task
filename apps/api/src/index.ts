import express from "express";
import taskRoutes from "./routes/taskRoutes.js";
import commentsRoutes from "./routes/commentsRoutes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});
