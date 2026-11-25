import { getDatabase, saveDatabase } from '../db/database.js';
import { testTelegramConnection, sendTelegramNotification } from '../services/telegramService.js';

export function registerTelegramRoutes(app) {
  app.get('/api/telegram', (req, res) => {
    const db = getDatabase();
    // Ocultar token por segurança se desejado, mas mantemos para config no admin
    res.json(db.telegram);
  });

  app.post('/api/telegram', (req, res) => {
    const db = getDatabase();
    db.telegram = { ...db.telegram, ...req.body };
    saveDatabase(db);
    res.json(db.telegram);
  });

  app.post('/api/telegram/test', async (req, res) => {
    const { botToken, ownerChatId } = req.body;
    const success = await testTelegramConnection(botToken, ownerChatId);
    res.json({ success });
  });
}