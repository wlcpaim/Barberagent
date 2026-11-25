import { getDatabase } from '../db/database.js';

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
}

export function checkOverlap(date, time, duration, professionalId, excludeAppointmentId = null) {
  const db = getDatabase();
  const requestedStart = timeToMinutes(time);
  const requestedEnd = requestedStart + duration;

  for (const apt of db.appointments) {
    if (apt.date !== date || apt.professionalId !== professionalId) continue;
    if (apt.status === 'cancelled') continue;
    if (excludeAppointmentId && apt.id === excludeAppointmentId) continue;

    const service = db.services.find(s => s.id === apt.serviceId);
    const aptDuration = service ? service.duration : 30;
    const aptStart = timeToMinutes(apt.time);
    const aptEnd = aptStart + aptDuration;

    if (requestedStart < aptEnd && requestedEnd > aptStart) {
      return true; // Conflito encontrado
    }
  }
  return false;
}

export function getAvailableSlots(date, serviceId, professionalId) {
  const db = getDatabase();
  const service = db.services.find(s => s.id === serviceId);
  if (!service) return [];

  const duration = service.duration;
  const interval = service.interval;
  const totalSlotTime = duration + interval;

  const workStart = timeToMinutes(db.settings?.workStart || '09:00');
  const workEnd = timeToMinutes(db.settings?.workEnd || '19:00');

  const slots = [];
  let currentTime = workStart;

  while (currentTime + duration <= workEnd) {
    const timeStr = minutesToTime(currentTime);
    const isConflict = checkOverlap(date, timeStr, duration, professionalId);
    
    // Se for hoje, não mostrar horários passados
    const todayStr = new Date().toISOString().split('T')[0];
    if (date === todayStr) {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      if (currentTime <= currentMinutes) {
        currentTime += totalSlotTime;
        continue;
      }
    }

    if (!isConflict) {
      slots.push(timeStr);
    }

    currentTime += totalSlotTime;
  }

  return slots;
}

export function calculateWalkInSlot(serviceId, professionalId) {
  const db = getDatabase();
  const service = db.services.find(s => s.id === serviceId);
  const duration = service ? service.duration : 30;
  const today = new Date().toISOString().split('T')[0];
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const workStart = timeToMinutes(db.settings?.workStart || '09:00');
  
  let startMinutes = Math.max(currentMinutes, workStart);
  let timeStr = minutesToTime(startMinutes);

  while (checkOverlap(today, timeStr, duration, professionalId)) {
    startMinutes += 5;
    timeStr = minutesToTime(startMinutes);
  }

  return { date: today, time: timeStr };
}