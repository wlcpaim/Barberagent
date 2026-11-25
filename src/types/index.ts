export type Service = {
  id: string;
  name: string;
  price: number;
  duration: number;
  interval: number;
};

export type Professional = {
  id: string;
  name: string;
  avatar: string;
  active: boolean;
};

export type Appointment = {
  id: string;
  serviceId: string;
  serviceName?: string;
  professionalId: string;
  professionalName?: string;
  clientName: string;
  clientPhone: string;
  date: string;
  time: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  origin: 'online' | 'walk_in';
  createdAt: string;
};

export type TelegramSettings = {
  botToken: string;
  ownerChatId: string;
  channelId: string;
  enabled: boolean;
};

export type DashboardStats = {
  revenueToday: number;
  appointmentsToday: number;
  completedCount: number;
  activeNow: number;
};