import express from "express";
import { prisma } from "./lib/prisma.js";
const app = express();

app.get("/api", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json({ message: "Hello from the API!", users });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});
