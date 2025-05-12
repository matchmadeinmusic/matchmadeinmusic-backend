// Load environment variables from .env file
require("dotenv").config();

// Import required libraries
const express = require("express");
const axios = require("axios");
const cors = require("cors");

// Create Express app
const app = express();

// Enable CORS for frontend requests
app.use(cors());
app.use(express.json());

// Load Spotify credentials from .env
const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, REDIRECT_URI } = process.env;

// Endpoint to exchange Spotify "code" for access_token & refresh_token
app.post("/token", async (req, res) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).json({ error: "Missing code" });
  }

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Token exchange failed" });
  }
});

// Start the server on port 3000 (local dev)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
