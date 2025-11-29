import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// === Настройки ===
const TELEGRAM_TOKEN = "8594017134:AAErZWjCCpVECDe1GjM427M4f_ZMkdTMxWM";
const CHAT_ID = "1252968307";
const SECURE_KEY = "EBANAYA_SECURE_KEY_123456"; // твой ключ

// CORS (разрешаем всем)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// === GET-прокси ===
app.get("/send", async (req, res) => {
    const key = req.query.key;
    const msg = req.query.msg;

    if (!key || key !== SECURE_KEY) {
        return res.json({ error: "Invalid key" });
    }

    if (!msg) {
        return res.json({ error: "Message is empty" });
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const r = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: msg,
                parse_mode: "HTML"
            })
        });

        const data = await r.json();
        res.json(data);

    } catch (e) {
        res.json({ error: e.toString() });
    }
});


// Тестовый маршрут
app.get("/test", (req, res) => {
    res.send("OK");
});


// === Старт сервера ===
app.listen(PORT, () => {
    console.log("TG Proxy started on port " + PORT);
});


