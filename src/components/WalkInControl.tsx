import React, { useState, useEffect } from 'react';
import { Service, Professional, Appointment } from '../types';
import { getServices, getProfessionals, createAppointment, getAppointments, updateAppointmentStatus } from '../services/api';
import { UserPlus, Zap, Play, CheckCircle, Clock, Scissors, User, Phone } from 'lucide-react';

export const WalkInControl: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [walkIns, setWalkIns] = useState<Appointment[]>([]);
  
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const loadInitialData = async () => {
    try {
      const [sList, pList, appts] = await Promise.all([
        getServices(),
        getProfessionals(),
        getAppointments(new Date().toISOString().split('T')[0])
      ]);
      setServices(sList);
      setProfessionals(pList);
      if (sList[0]) setServiceId(sList[0].id);
      if (pList[0]) setProfessionalId(pList[0].id);
      
      setWalkIns(appts.filter(a => a.origin === 'walk_in' || a.status === 'in_progress'));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleQuickCut = () => {
    if (services[0]) setServiceId(services[0].id);
    if (professionals[0]) setProfessionalId(professionals[0].id);
    setClientName('Cliente Rápido Presencial');
    setClientPhone('(00) 00000-0000');
  };

  const handleCreateWalkIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone || !serviceId || !professionalId) {
      setError('Preencha todos os campos.');
      return;
    }

    setLoading(true);
    setError('');

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    try {
      await createAppointment({
        serviceId,
        professionalId,
        clientName,
        clientPhone,
        date: now.toISOString().split('T')[0],
        time: timeStr,
        origin: 'walk_in'
      });

      setClientName('');
      setClientPhone('');
      loadInitialData();
    } catch (err: any) {
      setError(err.message || 'Erro ao registrar cliente presencial.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (id: string, status: string) => {
    await updateAppointmentStatus(id, status);
    loadInitialData();
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-[#141414] border border-neutral-800 rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-red-500" /> Novo Atendimento
          </h3>
          <button
            type="button"
            onClick={handleQuickCut}
            className="px-3 py-1.5 bg-red-600/10 text-red-500 border border-red-600/20 rounded-xl text-xs font-semibold flex items-center gap-1 hover:bg-red-600/20"
          >
            <Zap className="w-3.5 h-3.5" /> Corte Rápido
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleCreateWalkIn} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 uppercase mb-1.5">Nome do Cliente</label>
            <input
              type="text"
              placeholder="Nome completo"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 uppercase mb-1.5">Telefone / WhatsApp</label>
            <input
              type="tel"
              placeholder="(00) 00000-0000"
              value={clientPhone}
              onChange={e => setClientPhone(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 uppercase mb-1.5">Serviço</label>
            <select
              value={serviceId}
              onChange={e => setServiceId(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
            >
              {services.map(s => (
                <option key={s.id} value={s.id}>{s.name} - R$ {s.price.toFixed(2)}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 uppercase mb-1.5">Profissional</label>
            <select
              value={professionalId}
              onChange={e => setProfessionalId(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
            >
              {professionals.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all"
          >
            {loading ? 'Registrando...' : 'Adicionar à Fila Presencial'}
          </button>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-6">
          <h3 className="font-bold text-lg mb-4">Atendimentos e Fila Atual</h3>
          {walkIns.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              Nenhum cliente presencial na fila no momento.
            </div>
          ) : (
            <div className="space-y-3">
              {walkIns.map(w => (
                <div key={w.id} className="bg-[#1a1a1a] border border-neutral-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                        w.status === 'scheduled' ? 'bg-blue-500/10 text-blue-400' :
                        w.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400 animate-pulse' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {w.status === 'scheduled' ? 'Na Fila' : w.status === 'in_progress' ? 'Em Andamento' : 'Concluído'}
                      </span>
                      <span className="text-xs text-neutral-400">Horário: {w.time}</span>
                    </div>
                    <h4 className="font-bold text-white text-base">{w.clientName}</h4>
                    <p className="text-xs text-neutral-400">{w.serviceName || 'Serviço'} • Profissional ID: {w.professionalId}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {w.status === 'scheduled' && (
                      <button
                        onClick={() => handleStatus(w.id, 'in_progress')}
                        className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5" /> Iniciar
                      </button>
                    )}
                    {w.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatus(w.id, 'completed')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> Finalizar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};