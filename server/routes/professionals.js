import { getDatabase, saveDatabase } from '../db/database.js';

export function registerProfessionalsRoutes(app) {
  app.get('/api/professionals', (req, res) => {
    const db = getDatabase();
    res.json(db.professionals);
  });

  app.post('/api/professionals', (req, res) => {
    const db = getDatabase();
    const newProf = {
      id: Date.now().toString(),
      name: req.body.name,
      avatar: req.body.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      active: true
    };
    db.professionals.push(newProf);
    saveDatabase(db);
    res.status(201).json(newProf);
  });

  app.put('/api/professionals/:id', (req, res) => {
    const db = getDatabase();
    const index = db.professionals.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Profissional não encontrado' });

    db.professionals[index] = { ...db.professionals[index], ...req.body };
    saveDatabase(db);
    res.json(db.professionals[index]);
  });

  app.delete('/api/professionals/:id', (req, res) => {
    const db = getDatabase();
    db.professionals = db.professionals.filter(p => p.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });
}