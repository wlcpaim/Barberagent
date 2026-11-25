import express from 'express';
import cors from 'cors';
import { registerServicesRoutes } from './routes/services.js';
import { registerProfessionalsRoutes } from './routes/professionals.js';
import { registerAppointmentsRoutes } from './routes/appointments.js';
import { registerTelegramRoutes } from './routes/telegram.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Registrar rotas
registerServicesRoutes(app);
registerProfessionalsRoutes(app);
registerAppointmentsRoutes(app);
registerTelegramRoutes(app);

app.listen(PORT, () => {
  console.log(`🚀 SmartAgenda Backend rodando na porta ${PORT}`);
});