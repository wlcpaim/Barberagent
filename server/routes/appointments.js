import { getDatabase, saveDatabase } from '../db/database.js';
import { getAvailableSlots, checkOverlap, calculateWalkInSlot } from '../services/scheduler.js';
import { sendTelegramNotification } from '../services/telegramService.js';

export function registerAppointmentsRoutes(app) {
  app.get('/api/appointments', (req, res) => {
    const db = getDatabase();
    res.json(db.appointments);
  });

  app.get('/api/availability', (req, res) => {
    const { date, serviceId, professionalId } = req.query;
    if (!date || !serviceId || !professionalId) {
      return res.status(400).json({ error: 'Parâmetros incompletos' });
    }
    const slots = getAvailableSlots(date, serviceId, professionalId);
    res.json(slots);
  });

  app.post('/api/appointments', async (req, res) => {
    const db = getDatabase();
    const { serviceId, professionalId, clientName, clientPhone, date, time, origin } = req.body;

    const service = db.services.find(s => s.id === serviceId);
    if (!service) return res.status(400).json({ error: 'Serviço inválido' });

    const isOverlap = checkOverlap(date, time, service.duration, professionalId);
    if (isOverlap) {
      return res.status(409).json({ error: 'Horário já ocupado. Escolha outro.' });
    }

    const newApt = {
      id: Date.now().toString(),
      serviceId,
      professionalId,
      clientName,
      clientPhone,
      date,
      time,
      status: 'scheduled',
      origin: origin || 'online',
      createdAt: new Date().toISOString()
    };

    db.appointments.push(newApt);
    saveDatabase(db);

    const prof = db.professionals.find(p => p.id === professionalId);
    const msg = `📅 <b>Novo Agendamento (${newApt.origin.toUpperCase()})</b>

👤 <b>Cliente:</b> ${clientName} (${clientPhone})
✂️ <b>Serviço:</b> ${service.name}
💈 <b>Profissional:</b> ${prof ? prof.name : 'N/A'}
📆 <b>Data:</b> ${date} às ${time}`;

    await sendTelegramNotification(msg, db.telegram);

    res.status(201).json(newApt);
  });

  app.post('/api/appointments/walk-in', async (req, res) => {
    const db = getDatabase();
    const { serviceId, professionalId, clientName, clientPhone } = req.body;

    const service = db.services.find(s => s.id === serviceId);
    if (!service) return res.status(400).json({ error: 'Serviço inválido' });

    const slot = calculateWalkInSlot(serviceId, professionalId);

    const newApt = {
      id: Date.now().toString(),
      serviceId,
      professionalId,
      clientName: clientName || 'Cliente Presencial',
      clientPhone: clientPhone || '00000000000',
      date: slot.date,
      time: slot.time,
      status: 'in_progress',
      origin: 'walk_in',
      createdAt: new Date().toISOString()
    };

    db.appointments.push(newApt);
    saveDatabase(db);

    const prof = db.professionals.find(p => p.id === professionalId);
    const msg = `⚡ <b>Novo Atendimento Presencial (Iniciado)</b>

👤 <b>Cliente:</b> ${newApt.clientName}
✂️ <b>Serviço:</b> ${service.name}
💈 <b>Profissional:</b> ${prof ? prof.name : 'N/A'}
⏰ <b>Início:</b> ${slot.time}`;

    await sendTelegramNotification(msg, db.telegram);

    res.status(201).json(newApt);
  });

  app.patch('/api/appointments/:id/status', async (req, res) => {
    const db = getDatabase();
    const { status } = req.body;
    const apt = db.appointments.find(a => a.id === req.params.id);
    if (!apt) return res.status(404).json({ error: 'Agendamento não encontrado' });

    apt.status = status;
    saveDatabase(db);

    const service = db.services.find(s => s.id === apt.serviceId);
    const prof = db.professionals.find(p => p.id === apt.professionalId);
    
    let statusText = status;
    if (status === 'in_progress') statusText = 'Em Andamento ⚡';
    if (status === 'completed') statusText = 'Finalizado ✅';
    if (status === 'cancelled') statusText = 'Cancelado ❌';

    const msg = `🔄 <b>Atualização de Atendimento</b>

<b>Status:</b> ${statusText}
👤 <b>Cliente:</b> ${apt.clientName}
✂️ <b>Serviço:</b> ${service ? service.name : 'N/A'}
💈 <b>Profissional:</b> ${prof ? prof.name : 'N/A'}
📆 <b>Horário:</b> ${apt.date} às ${apt.time}`;

    await sendTelegramNotification(msg, db.telegram);

    res.json(apt);
  });

  app.delete('/api/appointments/:id', async (req, res) => {
    const db = getDatabase();
    const apt = db.appointments.find(a => a.id === req.params.id);
    db.appointments = db.appointments.filter(a => a.id !== req.params.id);
    saveDatabase(db);

    if (apt) {
      const msg = `❌ <b>Agendamento Cancelado/Removido</b>

👤 <b>Cliente:</b> ${apt.clientName}
📆 <b>Data:</b> ${apt.date} às ${apt.time}`;
      await sendTelegramNotification(msg, db.telegram);
    }

    res.json({ success: true });
  });
}