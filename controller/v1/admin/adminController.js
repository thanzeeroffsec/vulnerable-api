const fs = require("fs");
const path = require("path");

exports.userRoleUpdate = async (req, res) => {
  try {
    const { email } = req.body;
    const { userId } = req.body;
    if (!email || !userId) {
      return res.status(400).json({ message: "Role and user id are required" });
    }
    const request = await fetch(`https://dummyjson.com/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });
    const data = await request.json();
    return res.json(data);
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};

exports.showLogs = (req, res) => {
  try {
    // Path to the log file (adjust based on your setup)
    const logFilePath = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "logs",
      "server.log"
    );

    // Read the log file content
    const logs = fs.readFileSync(logFilePath, "utf8");

    // Split logs into lines and get the last 100 lines
    const logLines = logs.trim().split("\n");
    const last100Lines = logLines.slice(-100).join("\n");

    // Return logs to the user
    res.status(200).json({ logs: last100Lines });
  } catch (error) {
    // Handle error (e.g., log file not found)
    res.status(500).json({
      error: "Unable to retrieve logs.",
      details: error.message, // Exposing error details (for CTF purposes)
    });
  }
};
