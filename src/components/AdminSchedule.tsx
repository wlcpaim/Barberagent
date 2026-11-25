import React, { useState, useEffect } from 'react';
import { Appointment, Professional } from '../types';
import { getAppointments, updateAppointmentStatus, getProfessionals } from '../services/api';
import { Calendar as CalendarIcon, Clock, User, CheckCircle, XCircle, Play, Phone, Scissors } from 'lucide-react';

export const AdminSchedule: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [appts, profs] = await Promise.all([
        getAppointments(selectedDate),
        getProfessionals()
      ]);
      setAppointments(appts);
      setProfessionals(profs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleStatusChange = async (id: string, status: string) => {
    await updateAppointmentStatus(id, status);
    loadData();
  };

  const getProfName = (id: string) => professionals.find(p => p.id === id)?.name || 'Profissional';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#141414] p-5 rounded-2xl border border-neutral-800">
        <div>
          <h2 className="text-xl font-bold">Agenda Operacional</h2>
          <p className="text-sm text-neutral-400">Gerencie agendamentos e atendimentos do dia</p>
        </div>
        <div className="flex items-center space-x-3">
          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-red-600"
          />
          <button onClick={loadData} className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-sm font-medium rounded-xl transition-all">
            Atualizar
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-neutral-500">Carregando agenda...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-16 bg-[#141414] rounded-2xl border border-neutral-800">
          <CalendarIcon className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
          <h3 className="font-bold text-lg text-neutral-300">Nenhum atendimento para esta data</h3>
          <p className="text-sm text-neutral-500">Novos agendamentos e walk-ins aparecerão aqui.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {appointments.map(appt => (
            <div key={appt.id} className="bg-[#141414] border border-neutral-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-700 transition-all">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    appt.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    appt.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse' :
                    appt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {appt.status === 'scheduled' ? 'Agendado' :
                     appt.status === 'in_progress' ? 'Em Atendimento' :
                     appt.status === 'completed' ? 'Concluído' : 'Cancelado'}
                  </span>
                  <span className="text-xs text-neutral-400 uppercase font-medium bg-neutral-900 px-2.5 py-1 rounded-lg">
                    {appt.origin === 'online' ? '🌐 Online' : '🚶 Presencial'}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex items-center space-x-2 text-red-500 font-bold text-lg">
                    <Clock className="w-5 h-5" />
                    <span>{appt.time}</span>
                  </div>
                  <h3 className="font-bold text-white text-base mt-1">{appt.clientName}</h3>
                  <p className="text-xs text-neutral-400 flex items-center gap-1 mt-1">
                    <Phone className="w-3.5 h-3.5" /> {appt.clientPhone}
                  </p>
                </div>

                <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1">
                  <p className="flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-neutral-500" /> {appt.serviceName || 'Serviço'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-neutral-500" /> {getProfName(appt.professionalId)}
                  </p>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                {appt.status === 'scheduled' && (
                  <button
                    onClick={() => handleStatusChange(appt.id, 'in_progress')}
                    className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" /> Iniciar
                  </button>
                )}
                {appt.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusChange(appt.id, 'completed')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Finalizar
                  </button>
                )}
                {appt.status !== 'cancelled' && appt.status !== 'completed' && (
                  <button
                    onClick={() => handleStatusChange(appt.id, 'cancelled')}
                    className="px-3 py-2 bg-neutral-800 hover:bg-red-600/20 hover:text-red-400 text-neutral-400 font-medium text-xs rounded-xl transition-all"
                    title="Cancelar"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};