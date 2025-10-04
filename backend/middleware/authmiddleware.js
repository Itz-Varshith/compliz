import jwt from "jsonwebtoken";
import fetch from "node-fetch";

export const supabaseAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "No token" });
    // Verify with Supabase’s public keys
    const response = await fetch(`https://oszpmexfdlszvhswzeve.supabase.co/auth/v1/jwks`,{
        headers:{
            "apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zenBtZXhmZGxzenZoc3d6ZXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk1MzU5ODgsImV4cCI6MjA3NTExMTk4OH0.pzaPaoNcYFwKpc5WrlvThvbuZdRkVE0eYYm1xJbLr1g"
        }
    });
    const { keys } = await response.json();
    const signingKey = keys[0]; // take first key

    jwt.verify(token, signingKey, { algorithms: ["RS256"] }, (err, decoded) => {
      if (err) return res.status(401).json({ error: "Invalid token" });
      console.log(decoded)
      req.user = decoded;
      next();
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
