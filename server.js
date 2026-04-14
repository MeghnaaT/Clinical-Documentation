const express = require("express");
const dotenv = require("dotenv");
const agentRoutes = require("./routes/agentRoutes");

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    service: "Clinical Documentation Agent",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/agent", agentRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(port, () => {
  console.log(`Clinical Documentation Agent listening on port ${port}`);
});
