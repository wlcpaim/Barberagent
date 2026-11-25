import React, { useState, useEffect } from 'react';
import { Scissors, Clock, MapPin, Phone, Calendar, Shield, Award, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Service, Professional } from '../types';
import { getServices, getProfessionals } from '../services/api';
import { BookingModal } from '../components/BookingModal';

export function LandingPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getServices(), getProfessionals()])
      .then(([sData, pData]) => {
        setServices(sData);
        setProfessionals(pData.filter(p => p.active));
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenBooking = (service?: Service) => {
    if (service) {
      setSelectedService(service);
    } else if (services.length > 0) {
      setSelectedService(services[0]);
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f9fafb] selection:bg-red-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#141414]/90 backdrop-blur border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shadow-lg shadow-red-600/30">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider uppercase bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">SMARTAGENDA</span>
              <span className="block text-[10px] text-red-500 font-semibold tracking-widest uppercase">Barbearia Premium</span>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-neutral-300">
            <a href="#services" className="hover:text-red-500 transition">Serviços</a>
            <a href="#professionals" className="hover:text-red-500 transition">Profissionais</a>
            <a href="#about" className="hover:text-red-500 transition">Sobre</a>
          </div>

          <div className="flex items-center space-x-4">
            <a
              href="/admin"
              className="text-xs font-semibold px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-700 transition"
            >
              Área Admin
            </a>
            <button
              onClick={() => handleOpenBooking()}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-red-600/20 transition flex items-center space-x-2 text-sm"
            >
              <Calendar className="w-4 h-4" />
              <span>Agendar Agora</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 lg:py-32 border-b border-neutral-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.1),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-semibold mb-6">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Agendamento online rápido e sem cadastro</span>
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
              ESTILO E PRECISÃO <span className="text-red-600">SEM FILAS</span>
            </h1>
            <p className="text-lg sm:text-xl text-neutral-400 mb-8 max-w-2xl">
              Garanta seu horário com os melhores profissionais da região em poucos cliques. Escolha o serviço, data e horário em tempo real.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleOpenBooking()}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-xl shadow-xl shadow-red-600/30 transition flex items-center justify-center space-x-3 text-base"
              >
                <span>Fazer Agendamento Online</span>
                <ChevronRight className="w-5 h-5" />
              </button>
              <a
                href="#services"
                className="bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-white font-semibold px-8 py-4 rounded-xl transition text-center text-base"
              >
                Ver Tabela de Preços
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 mt-16 pt-16 border-t border-neutral-800/60">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">100%</div>
                <div className="text-xs text-neutral-400 mt-1">Horários em tempo real</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">0 min</div>
                <div className="text-xs text-neutral-400 mt-1">Espera na barbearia</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">4.9 ★</div>
                <div className="text-xs text-neutral-400 mt-1">Avaliação dos clientes</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-[#141414]/40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Nossos Serviços</h2>
            <p className="text-neutral-400">
              Trabalhamos com cortes clássicos, modernos, barbas alinhadas e tratamentos especiais.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-neutral-500">Carregando serviços...</div>
          ) : services.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">Nenhum serviço cadastrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div
                  key={service.id}
                  className="bg-[#141414] border border-neutral-800 hover:border-red-600/50 rounded-2xl p-6 transition flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition">
                        <Scissors className="w-6 h-6" />
                      </div>
                      <span className="text-xl font-bold text-white">
                        R$ {service.price.toFixed(2)}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 group-hover:text-red-500 transition">
                      {service.name}
                    </h3>
                    <div className="flex items-center text-xs text-neutral-400 space-x-4 mb-6">
                      <span className="flex items-center">
                        <Clock className="w-3.5 h-3.5 mr-1 text-red-500" />
                        {service.duration} minutos
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleOpenBooking(service)}
                    className="w-full bg-neutral-900 border border-neutral-800 hover:bg-red-600 hover:border-red-600 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center space-x-2 text-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Agendar Este Serviço</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Professionals Section */}
      <section id="professionals" className="py-20 border-t border-neutral-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Nossa Equipe</h2>
            <p className="text-neutral-400">
              Profissionais altamente qualificados prontos para cuidar do seu visual.
            </p>
          </div>

          {professionals.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">Nenhum profissional disponível no momento.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {professionals.map(prof => (
                <div key={prof.id} className="bg-[#141414] border border-neutral-800 rounded-2xl p-6 text-center">
                  <img
                    src={prof.avatar}
                    alt={prof.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-2 border-red-600/40"
                  />
                  <h3 className="text-lg font-bold text-white mb-1">{prof.name}</h3>
                  <p className="text-xs text-neutral-400 mb-4">Barbeiro Master</p>
                  <button
                    onClick={() => handleOpenBooking()}
                    className="w-full text-xs font-semibold py-2.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-red-600 hover:border-red-600 text-white transition"
                  >
                    Agendar com {prof.name.split(' ')[0]}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#141414] border-t border-neutral-800 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
                <Scissors className="w-4 h-4" />
              </div>
              <span className="text-lg font-black tracking-wider uppercase">SMARTAGENDA</span>
            </div>
            <p className="text-sm text-neutral-400">
              Plataforma inteligente de agendamentos para barbearias e estabelecimentos de excelência.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contato & Endereço</h4>
            <p className="text-sm text-neutral-400 flex items-center mb-2">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              Av. Paulista, 1000 - São Paulo, SP
            </p>
            <p className="text-sm text-neutral-400 flex items-center">
              <Phone className="w-4 h-4 mr-2 text-red-500" />
              (11) 99999-9999
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Horário de Funcionamento</h4>
            <p className="text-sm text-neutral-400 mb-1">Segunda a Sábado: 09:00 - 20:00</p>
            <p className="text-sm text-neutral-500">Domingo: Fechado</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 pt-8 border-t border-neutral-800 text-center text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} SmartAgenda. Todos os direitos reservados. Sistema Protegido.
        </div>
      </footer>

      {/* Booking Modal */}
      {isModalOpen && (
        <BookingModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          services={services}
          professionals={professionals}
          initialService={selectedService || services[0]}
        />
      )}
    </div>
  );
}
