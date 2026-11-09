import express from "express";

const app = express();
const PORT = 4000;

// Parse incoming JSON requests
app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    console.log("Signup request:", { username });

    // Your signup/database logic goes here

    return res.status(200).json({
      message: "Signup request received",
    });
  } catch (error) {
    console.error("Signup error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`HTTP server running on port ${PORT}`);
});