import React, { useState, useEffect } from 'react';
import { TelegramSettings } from '../types';
import { getTelegramSettings, saveTelegramSettings, testTelegram } from '../services/api';
import { Send, CheckCircle, AlertCircle, Shield } from 'lucide-react';

export const TelegramConfig: React.FC = () => {
  const [settings, setSettings] = useState<TelegramSettings>({
    botToken: '',
    ownerChatId: '',
    channelId: '',
    enabled: false
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    getTelegramSettings().then(data => {
      setSettings(data);
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await saveTelegramSettings(settings);
      setSettings(updated);
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      alert('Erro ao salvar configurações');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testTelegram(settings);
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, message: 'Erro na requisição de teste' });
    } finally {
      setTesting(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-neutral-500">Carregando configurações...</div>;

  return (
    <div className="max-w-2xl bg-[#141414] border border-neutral-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-red-600/10 text-red-500 rounded-xl">
          <Send className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Integração Telegram Bot API</h3>
          <p className="text-xs text-neutral-400">Receba notificações automáticas de agendamentos e status</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-xl border border-neutral-800">
          <div>
            <h4 className="font-semibold text-sm">Ativar Notificações</h4>
            <p className="text-xs text-neutral-400">Enviar alertas via Telegram para novos agendamentos</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.enabled}
              onChange={e => setSettings({ ...settings, enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-neutral-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-400 uppercase mb-1.5">Bot Token (BotFather)</label>
          <input
            type="password"
            placeholder="123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ"
            value={settings.botToken}
            onChange={e => setSettings({ ...settings, botToken: e.target.value })}
            className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-400 uppercase mb-1.5">Owner Chat ID</label>
            <input
              type="text"
              placeholder="@seu_usuario ou ID numérico"
              value={settings.ownerChatId}
              onChange={e => setSettings({ ...settings, ownerChatId: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-400 uppercase mb-1.5">Channel ID (Opcional)</label>
            <input
              type="text"
              placeholder="@canal_notificacoes"
              value={settings.channelId}
              onChange={e => setSettings({ ...settings, channelId: e.target.value })}
              className="w-full bg-[#1a1a1a] border border-neutral-800 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-600"
            />
          </div>
        </div>

        {testResult && (
          <div className={`flex items-center space-x-2 p-3 rounded-xl text-sm ${
            testResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
          }`}>
            {testResult.success ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
            <span>{testResult.message}</span>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all"
          >
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
          <button
            type="button"
            onClick={handleTest}
            disabled={testing || !settings.botToken}
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-sm rounded-xl transition-all"
          >
            {testing ? 'Testando...' : 'Testar Conexão'}
          </button>
        </div>
      </form>
    </div>
  );
};