import React, { useState, useEffect } from 'react';
import { Service, Professional } from '../types';
import { getAvailability, createAppointment } from '../services/api';
import { X, Calendar, Clock, User, Scissors, CheckCircle, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  service: Service;
  professionals: Professional[];
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ service, professionals, onClose, onSuccess }) => {
  const [selectedProf, setSelectedProf] = useState<string>(professionals[0]?.id || '');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [clientName, setClientName] = useState<string>('');
  const [clientPhone, setClientPhone] = useState<string>('');
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (selectedProf && date) {
      fetchSlots();
    }
  }, [selectedProf, date]);

  const fetchSlots = async () => {
    setLoadingSlots(true);
    setError('');
    try {
      const available = await getAvailability(date, service.id, selectedProf);
      setSlots(available);
      setSelectedTime('');
    } catch (err) {
      setError('Erro ao carregar horários disponíveis.');
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTime || !clientName || !clientPhone) {
      setError('Preencha todos os campos e selecione um horário.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await createAppointment({
        serviceId: service.id,
        professionalId: selectedProf,
        clientName,
        clientPhone,
        date,
        time: selectedTime,
        origin: 'online'
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar agendamento.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-[#141414] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-[#1a1a1a]">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-600/10 text-red-500 rounded-lg">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{service.name}</h3>
              <p className="text-xs text-neutral-400">R$ {service.price.toFixed(2)} • {service.duration} min</p>
            </div>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold">Agendamento Confirmado!</h4>
            <p className="text-sm text-neutral-400">Enviamos os detalhes e notificações. Te esperamos!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-400 uppercase mb-2">Profissional</label>
              <div className="grid grid-cols-2 gap-2">
                {professionals.map(p => (
                  <button
                    type="button"
                    key={p.id}
                    onClick={() => setSelectedProf(p.id)}
                    className={`flex items-center space-x-3 p-3 rounded-xl border text-left transition-all ${
                      selectedProf === p.id
                        ? 'border-red-600 bg-red-600/10 text-white'
                        : 'border-neutral-800 bg-[#1a1a1a] text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-medium text-sm truncate">{p.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-neutral-400 uppercase mb-2">Data</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="date"
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-400 uppercase mb-2">Seu Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-neutral-500" />
                  <input
                    type="text"
                    placeholder="Nome completo"
                    value={clientName}
                    onChange={e => setClientName(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-3 pl-11 text-white text-sm focus:outline-none focus:border-red-600"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 uppercase mb-2">WhatsApp / Telefone</label>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                value={clientPhone}
                onChange={e => setClientPhone(e.target.value)}
                className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 uppercase mb-2">Horários Disponíveis</label>
              {loadingSlots ? (
                <div className="text-center py-6 text-neutral-500 text-sm">Carregando horários...</div>
              ) : slots.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 text-sm bg-[#1a1a1a] rounded-xl border border-neutral-800">
                  Nenhum horário disponível para esta data.
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
                  {slots.map(slot => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                        selectedTime === slot
                          ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                          : 'bg-[#1a1a1a] border border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !selectedTime}
              className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all"
            >
              {submitting ? 'Confirmando...' : 'Confirmar Agendamento'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};