import { Service, Professional, Appointment, TelegramSettings, DashboardStats } from '../types';

const API_BASE = '/api';

export async function getServices(): Promise<Service[]> {
  const res = await fetch(`${API_BASE}/services`);
  const data = await res.json();
  return data;
}

export async function saveService(service: Partial<Service>): Promise<Service> {
  const method = service.id ? 'PUT' : 'POST';
  const url = service.id ? `${API_BASE}/services/${service.id}` : `${API_BASE}/services`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(service)
  });
  return res.json();
}

export async function deleteService(id: string): Promise<void> {
  await fetch(`${API_BASE}/services/${id}`, { method: 'DELETE' });
}

export async function getProfessionals(): Promise<Professional[]> {
  const res = await fetch(`${API_BASE}/professionals`);
  return res.json();
}

export async function saveProfessional(prof: Partial<Professional>): Promise<Professional> {
  const method = prof.id ? 'PUT' : 'POST';
  const url = prof.id ? `${API_BASE}/professionals/${prof.id}` : `${API_BASE}/professionals`;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(prof)
  });
  return res.json();
}

export async function deleteProfessional(id: string): Promise<void> {
  await fetch(`${API_BASE}/professionals/${id}`, { method: 'DELETE' });
}

export async function getAvailability(date: string, serviceId: string, professionalId: string): Promise<string[]> {
  const res = await fetch(`${API_BASE}/appointments/availability?date=${date}&serviceId=${serviceId}&professionalId=${professionalId}`);
  return res.json();
}

export async function getAppointments(date?: string): Promise<Appointment[]> {
  const url = date ? `${API_BASE}/appointments?date=${date}` : `${API_BASE}/appointments`;
  const res = await fetch(url);
  return res.json();
}

export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Erro ao agendar');
  return json;
}

export async function updateAppointmentStatus(id: string, status: string): Promise<Appointment> {
  const res = await fetch(`${API_BASE}/appointments/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  return res.json();
}

export async function getTelegramSettings(): Promise<TelegramSettings> {
  const res = await fetch(`${API_BASE}/telegram/settings`);
  return res.json();
}

export async function saveTelegramSettings(settings: TelegramSettings): Promise<TelegramSettings> {
  const res = await fetch(`${API_BASE}/telegram/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return res.json();
}

export async function testTelegram(settings: TelegramSettings): Promise<{ success: boolean; message: string }> {
  const res = await fetch(`${API_BASE}/telegram/test`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings)
  });
  return res.json();
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/admin/stats`);
  return res.json();
}