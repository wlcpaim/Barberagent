import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, Scissors, DollarSign, Send, LogOut, Plus, Clock, CheckCircle, AlertCircle, Play, Square } from 'lucide-react';
import { DashboardStats, Service, Professional, Appointment } from '../types';
import { getDashboardStats, getServices, getProfessionals, getAppointments, saveService, saveProfessional, deleteService, deleteProfessional } from '../services/api';
import { AdminSchedule } from '../components/AdminSchedule';
import { WalkInControl } from '../components/WalkInControl';
import { TelegramConfig } from '../components/TelegramConfig';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'walkin' | 'services' | 'professionals' | 'telegram'>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // Service form state
  const [serviceModal, setServiceModal] = useState(false);
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [serviceDuration, setServiceDuration] = useState('30');
  const [serviceInterval, setServiceInterval] = useState('10');

  // Professional form state
  const [profModal, setProfModal] = useState(false);
  const [profName, setProfName] = useState('');
  const [profAvatar, setProfAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      getDashboardStats(),
      getServices(),
      getProfessionals(),
      getAppointments()
    ])
      .then(([statsData, sData, pData, aData]) => {
        setStats(statsData);
        setServices(sData);
        setProfessionals(pData);
        setAppointments(aData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName || !servicePrice) return;
    await saveService({
      id: 'srv_' + Date.now(),
      name: serviceName,
      price: parseFloat(servicePrice),
      duration: parseInt(serviceDuration),
      interval: parseInt(serviceInterval)
    });
    setServiceModal(false);
    setServiceName('');
    setServicePrice('');
    loadData();
  };

  const handleSaveProf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName) return;
    await saveProfessional({
      id: 'prof_' + Date.now(),
      name: profName,
      avatar: profAvatar,
      active: true
    });
    setProfModal(false);
    setProfName('');
    loadData();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f9fafb] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#141414] border-r border-neutral-800 flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-neutral-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-black tracking-wider uppercase text-sm">SMARTAGENDA</h1>
              <span className="text-[10px] text-red-500 font-semibold">Painel Administrativo</span>
            </div>
          </div>

          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'overview' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'schedule' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Agenda Geral</span>
            </button>

            <button
              onClick={() => setActiveTab('walkin')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'walkin' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Atendimento Presencial</span>
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'services' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Scissors className="w-4 h-4" />
              <span>Serviços & Preços</span>
            </button>

            <button
              onClick={() => setActiveTab('professionals')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'professionals' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Profissionais</span>
            </button>

            <button
              onClick={() => setActiveTab('telegram')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition ${
                activeTab === 'telegram' ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Send className="w-4 h-4" />
              <span>Integração Telegram</span>
            </button>
          </nav>
        </div>

        <div className="p-4 border-t border-neutral-800">
          <a
            href="/"
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-neutral-400 hover:text-white hover:bg-neutral-900 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Ver Site (Landing Page)</span>
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar for mobile */}
        <header className="bg-[#141414] border-b border-neutral-800 p-4 md:hidden flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-bold">
              <Scissors className="w-4 h-4" />
            </div>
            <span className="font-black uppercase text-sm">SMARTAGENDA</span>
          </div>
          <a href="/" className="text-xs bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-white">
            Ver Site
          </a>
        </header>

        {/* Mobile Nav Tabs */}
        <div className="flex md:hidden bg-[#141414] border-b border-neutral-800 overflow-x-auto p-2 space-x-2">
          <button onClick={() => setActiveTab('overview')} className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'overview' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}>Dashboard</button>
          <button onClick={() => setActiveTab('schedule')} className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'schedule' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}>Agenda</button>
          <button onClick={() => setActiveTab('walkin')} className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'walkin' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}>Presencial</button>
          <button onClick={() => setActiveTab('services')} className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'services' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}>Serviços</button>
          <button onClick={() => setActiveTab('professionals')} className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'professionals' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}>Profissionais</button>
          <button onClick={() => setActiveTab('telegram')} className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap ${activeTab === 'telegram' ? 'bg-red-600 text-white' : 'text-neutral-400'}`}>Telegram</button>
        </div>

        <div className="p-6 lg:p-10">
          {loading ? (
            <div className="text-center py-24 text-neutral-500">Carregando dados do painel...</div>
          ) : (
            <>
              {activeTab === 'overview' && stats && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-bold mb-1">Visão Geral do Estabelecimento</h2>
                    <p className="text-sm text-neutral-400">Acompanhe os principais indicadores e movimentação de hoje.</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Agendamentos Hoje</span>
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 text-red-500 flex items-center justify-center">
                          <Calendar className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-white">{stats.todayAppointments}</div>
                      <div className="text-xs text-neutral-500 mt-2">Atualizado em tempo real</div>
                    </div>

                    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Faturamento do Dia</span>
                        <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-600/20 text-emerald-500 flex items-center justify-center">
                          <DollarSign className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-white">R$ {stats.todayRevenue.toFixed(2)}</div>
                      <div className="text-xs text-emerald-500 mt-2 font-medium">+12% comparado à ontem</div>
                    </div>

                    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Clientes Atendidos</span>
                        <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 text-blue-500 flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-white">{stats.totalClients}</div>
                      <div className="text-xs text-neutral-500 mt-2">Base total cadastrada</div>
                    </div>

                    <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">Serviços Ativos</span>
                        <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-600/20 text-purple-500 flex items-center justify-center">
                          <Scissors className="w-5 h-5" />
                        </div>
                      </div>
                      <div className="text-3xl font-extrabold text-white">{stats.activeServices}</div>
                      <div className="text-xs text-neutral-500 mt-2">Disponíveis no site</div>
                    </div>
                  </div>

                  {/* Recent Appointments table */}
                  <div className="bg-[#141414] border border-neutral-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Agendamentos Recentes</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-neutral-900/50 text-neutral-400 uppercase text-xs border-b border-neutral-800">
                          <tr>
                            <th className="p-3">Cliente</th>
                            <th className="p-3">Telefone</th>
                            <th className="p-3">Data / Hora</th>
                            <th className="p-3">Origem</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800">
                          {appointments.slice(0, 5).map(apt => (
                            <tr key={apt.id} className="hover:bg-neutral-900/30">
                              <td className="p-3 font-medium text-white">{apt.clientName}</td>
                              <td className="p-3 text-neutral-400">{apt.clientPhone}</td>
                              <td className="p-3 text-neutral-300">{apt.date} às {apt.time}</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                                  apt.origin === 'online' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                                }`}>
                                  {apt.origin}
                                </span>
                              </td>
                              <td className="p-3">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                  apt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                  apt.status === 'in_progress' ? 'bg-yellow-500/10 text-yellow-400' :
                                  apt.status === 'cancelled' ? 'bg-red-500/10 text-red-400' : 'bg-neutral-800 text-neutral-300'
                                }`}>
                                  {apt.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <AdminSchedule appointments={appointments} professionals={professionals} services={services} onUpdate={loadData} />
              )}

              {activeTab === 'walkin' && (
                <WalkInControl professionals={professionals} services={services} onUpdate={loadData} />
              )}

              {activeTab === 'services' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Gerenciamento de Serviços</h2>
                      <p className="text-sm text-neutral-400">Cadastre e edite os serviços oferecidos pela barbearia.</p>
                    </div>
                    <button
                      onClick={() => setServiceModal(true)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Serviço</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {services.map(srv => (
                      <div key={srv.id} className="bg-[#141414] border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-lg font-bold text-white">{srv.name}</h3>
                            <span className="text-lg font-extrabold text-red-500">R$ {srv.price.toFixed(2)}</span>
                          </div>
                          <div className="text-xs text-neutral-400 space-y-1 mb-6">
                            <p>Duração: {srv.duration} min</p>
                            <p>Intervalo: {srv.interval} min</p>
                          </div>
                        </div>
                        <button
                          onClick={async () => {
                            await deleteService(srv.id);
                            loadData();
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 hover:bg-red-600 hover:border-red-600 text-white text-xs font-semibold py-2.5 rounded-xl transition"
                        >
                          Excluir Serviço
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'professionals' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">Profissionais</h2>
                      <p className="text-sm text-neutral-400">Gerencie a equipe de barbeiros e horários.</p>
                    </div>
                    <button
                      onClick={() => setProfModal(true)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-xl text-sm flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Novo Profissional</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {professionals.map(prof => (
                      <div key={prof.id} className="bg-[#141414] border border-neutral-800 rounded-2xl p-6 text-center">
                        <img src={prof.avatar} alt={prof.name} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border border-red-600/40" />
                        <h3 className="text-lg font-bold text-white mb-1">{prof.name}</h3>
                        <p className="text-xs text-neutral-400 mb-6">Barbeiro Master</p>
                        <button
                          onClick={async () => {
                            await deleteProfessional(prof.id);
                            loadData();
                          }}
                          className="w-full bg-neutral-900 border border-neutral-800 hover:bg-red-600 hover:border-red-600 text-white text-xs font-semibold py-2 rounded-xl transition"
                        >
                          Remover
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'telegram' && (
                <TelegramConfig />
              )}
            </>
          )}
        </div>
      </main>

      {/* Service Modal */}
      {serviceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Novo Serviço</h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Nome do Serviço</label>
                <input
                  type="text"
                  required
                  value={serviceName}
                  onChange={e => setServiceName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                  placeholder="Ex: Corte Degradê"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={servicePrice}
                  onChange={e => setServicePrice(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                  placeholder="45.00"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Duração (min)</label>
                  <input
                    type="number"
                    value={serviceDuration}
                    onChange={e => setServiceDuration(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-400 mb-1">Intervalo (min)</label>
                  <input
                    type="number"
                    value={serviceInterval}
                    onChange={e => setServiceInterval(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setServiceModal(false)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 text-white font-semibold py-3 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl text-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Professional Modal */}
      {profModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-[#141414] border border-neutral-800 rounded-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Novo Profissional</h3>
            <form onSubmit={handleSaveProf} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">Nome do Barbeiro</label>
                <input
                  type="text"
                  required
                  value={profName}
                  onChange={e => setProfName(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                  placeholder="Ex: Carlos Silva"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-400 mb-1">URL do Avatar</label>
                <input
                  type="text"
                  value={profAvatar}
                  onChange={e => setProfAvatar(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-red-600"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setProfModal(false)}
                  className="flex-1 bg-neutral-900 border border-neutral-800 text-white font-semibold py-3 rounded-xl text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl text-sm"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
