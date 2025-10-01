import axios from "axios";

const JUDGE0_URL = "https://judge0-extra-ce.p.rapidapi.com/submissions";
const RAPIDAPI_KEY = "f3d1f6ff3fmsh79b2f7c81c667afp178068jsnc83724e53be9";
const RAPIDAPI_HOST = "judge0-extra-ce.p.rapidapi.com";

const pollSubmission = async (token, interval = 1000, maxAttempts = 20) => {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const res = await axios.get(`${JUDGE0_URL}/${token}`, {
        params: { base64_encoded: "true", fields: "*" },
        headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": RAPIDAPI_HOST },
      });

      const statusId = res.data.status.id;
      if (statusId >= 3) {
        console.log("Submission finished:", res.data);
        return res.data; 
      }
    } catch (err) {
      console.error("Error fetching submission:", err.message);
    }

    attempts++;
    await new Promise((r) => setTimeout(r, interval));
  }

  console.warn("Polling timed out for token:", token);
  return null;
};

const codeSubmitHandler = async (req, res) => {
  try {
    const code = `#include <bits/stdc++.h>
using namespace std;
int main() {
    cout << "Hello World" << endl;
    return 0;
}`;
    const base64 = Buffer.from(code, "utf-8").toString("base64");

    
    const submission = await axios.post(
      JUDGE0_URL,
      { language_id: 2, source_code: base64, stdin: "" },
      {
        params: { base64_encoded: "true", wait: "false", fields: "*" },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
          "Content-Type": "application/json",
        },
      }
    );

    const token = submission.data.token;


    pollSubmission(token).catch((err) => console.error(err));

    return res.json({
      success: true,
      message: "Submission sent successfully. Results will be logged once ready.",
      token,
    });
  } catch (error) {
    console.error("Submission error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error while submitting code",
    });
  }
};

export { codeSubmitHandler };
