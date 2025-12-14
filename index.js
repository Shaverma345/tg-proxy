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

const text = `
🛒 *Новый заказ №${order.id}*

👤 ${order.name}
📞 ${order.phone}
📍 ${order.address}

💰 *${order.total} грн*
🕒 ${order.created_at}
`;

const keyboard = {
  inline_keyboard: [
    [
      { text: "🟡 Принят", callback_data: `status:new:${order.id}` },
      { text: "🔵 В обработке", callback_data: `status:processing:${order.id}` }
    ],
    [
      { text: "🚚 Отправлен", callback_data: `status:shipped:${order.id}` },
      { text: "❌ Отменён", callback_data: `status:canceled:${order.id}` }
    ],
    [
      {
        text: "🔍 Открыть заказ",
        url: `https://egyptpharmacy.gt.tc/shop/admin/order.php?id=${order.id}`
      }
    ]
  ]
};

await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    chat_id: process.env.CHAT_ID,
    text,
    parse_mode: "Markdown",
    reply_markup: keyboard
  })
});
app.post("/telegram", async (req, res) => {
  const cb = req.body.callback_query;
  if (!cb) return res.sendStatus(200);

  const [_, status, orderId] = cb.data.split(":");

  // 🔐 защита: только ты
  if (cb.from.id.toString() !== process.env.ADMIN_TG_ID) {
    return res.sendStatus(403);
  }

  // 1️⃣ обновляем статус в БД
  await fetch(process.env.SITE_URL + "/shop/api/update_status.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ order_id: orderId, status })
  });

  // 2️⃣ ответ Telegram
  await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/answerCallbackQuery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      callback_query_id: cb.id,
      text: "Статус обновлён"
    })
  });

  res.sendStatus(200);
});
