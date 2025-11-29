import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 10000;

// === ТЕСТОВЫЙ РОУТ ===
// Чтобы проверить, что сервер жив
app.get("/test", (req, res) => {
    res.send("OK");
});

// === Настройки ===
const TELEGRAM_TOKEN = "8594017134:AAErZWjCCpVECDe1GjM427M4f_ZMkdTMxWM"; // твой бот
const CHAT_ID = "1252968307";                                            // твой chat_id
const SECURE_KEY = "EBANAYA_SECURE_KEY_123456";                          // твой ключ

// Разрешаем CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
});

// === GET-прокси ===
// Пример вызова:
// https://tg-proxy-akpz.onrender.com/send?key=EBANAYA_SECURE_KEY_123456&msg=Привет
app.get("/send", async (req, res) => {
    const key = req.query.key;
    const msg = req.query.msg;

    // Проверка ключа
    if (!key || key !== SECURE_KEY) {
        return res.json({ error: "Invalid key" });
    }

    // Проверка текста
    if (!msg) {
        return res.json({ error: "Message is empty" });
    }

    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

    try {
        const tgResponse = await fetch(tgUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: msg,
                parse_mode: "HTML"
            })
        });

        const data = await tgResponse.json();
        res.json(data);

    } catch (e) {
        res.json({ error: e.toString() });
    }
});

// === Запуск сервера ===
app.listen(PORT, () => {
    console.log("TG Proxy started on port " + PORT);
});
