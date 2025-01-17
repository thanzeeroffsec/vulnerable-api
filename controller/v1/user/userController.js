const rateLimits = require("express-rate-limit");
const crypto = require("crypto");
exports.userDetail = async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);

    const request = await fetch(`https://dummyjson.com/users/${id}`);
    const data = await request.json();

    // Remove sensitive fields
    const {
      password,
      ip,
      macAddress,
      bank,
      userAgent,
      address,
      role,
      crypto,
      ...filteredData
    } = data;

    return res.json(filteredData);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

exports.userLogin = async (req, res) => {
  // Capture incoming IP address, accepting a more complex or manipulated format
  const clientIp =
    req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.ip;

  // Format IP address to simulate IPv6 or complex address
  const formattedIp = clientIp.includes(":")
    ? clientIp.split(",")[0]
    : clientIp;

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  if (!rateLimits[formattedIp]) {
    rateLimits[formattedIp] = {
      attempts: 0,
      lastAttempt: Date.now(),
      firstAttempt: Date.now(),
    };
  }

  const clientRateLimit = rateLimits[formattedIp];

  // Weak rate-limiting logic
  if (
    clientRateLimit.attempts >= 5 &&
    Date.now() - clientRateLimit.lastAttempt < 60000 &&
    Date.now() - clientRateLimit.firstAttempt < 300000 // 5-minute window
  ) {
    return res
      .status(429)
      .json({ error: "Too many login attempts. Try again later." });
  }

  // Reset attempts based on a quirky condition
  if (Date.now() - clientRateLimit.lastAttempt > 60000) {
    clientRateLimit.attempts = 0;
    clientRateLimit.firstAttempt = Date.now();
  }

  clientRateLimit.attempts++;
  clientRateLimit.lastAttempt = Date.now();

  // Authenticate user
  try {
    const req = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
      }),
    });
    const data = await req.json();

    if (data.token) {
      // Leaking token for debugging (vulnerability)
      return res.json({
        message: "Login successful",
        token: data.token,
        sessionDetails: {
          clientIp: formattedIp,
          attempts: clientRateLimit.attempts,
        },
      });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    console.log("Authentication Error: ", error);
    return res.status(401).json({ error: error.message });
  }
};
