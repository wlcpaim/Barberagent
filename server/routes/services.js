import { getDatabase, saveDatabase } from '../db/database.js';

export function registerServicesRoutes(app) {
  app.get('/api/services', (req, res) => {
    const db = getDatabase();
    res.json(db.services);
  });

  app.post('/api/services', (req, res) => {
    const db = getDatabase();
    const newService = {
      id: Date.now().toString(),
      name: req.body.name,
      price: Number(req.body.price),
      duration: Number(req.body.duration),
      interval: Number(req.body.interval || 10)
    };
    db.services.push(newService);
    saveDatabase(db);
    res.status(201).json(newService);
  });

  app.put('/api/services/:id', (req, res) => {
    const db = getDatabase();
    const index = db.services.findIndex(s => s.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Serviço não encontrado' });

    db.services[index] = { ...db.services[index], ...req.body };
    saveDatabase(db);
    res.json(db.services[index]);
  });

  app.delete('/api/services/:id', (req, res) => {
    const db = getDatabase();
    db.services = db.services.filter(s => s.id !== req.params.id);
    saveDatabase(db);
    res.json({ success: true });
  });
}