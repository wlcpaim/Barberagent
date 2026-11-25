import fs from 'fs';
import path from 'path';

const DB_FILE = path.resolve('server/db/smartagenda.json');

const defaultData = {
  services: [
    { id: '1', name: 'Corte Clássico', price: 45, duration: 30, interval: 10 },
    { id: '2', name: 'Barba Modelada', price: 35, duration: 25, interval: 5 },
    { id: '3', name: 'Corte + Barba', price: 75, duration: 50, interval: 10 }
  ],
  professionals: [
    { id: '1', name: 'Carlos Silva', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', active: true },
    { id: '2', name: 'Marcos Oliveira', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', active: true }
  ],
  appointments: [
    {
      id: '101',
      serviceId: '1',
      professionalId: '1',
      clientName: 'Roberto Carlos',
      clientPhone: '11988887777',
      date: new Date().toISOString().split('T')[0],
      time: '10:00',
      status: 'scheduled',
      origin: 'online',
      createdAt: new Date().toISOString()
    }
  ],
  telegram: {
    botToken: '',
    ownerChatId: '',
    channelId: '',
    enabled: false
  },
  settings: {
    workStart: '09:00',
    workEnd: '19:00'
  }
};

export function getDatabase() {
  if (!fs.existsSync(path.dirname(DB_FILE))) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
  }
  const fileData = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(fileData);
}

export function saveDatabase(data) {
  if (!fs.existsSync(path.dirname(DB_FILE))) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}