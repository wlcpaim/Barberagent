export async function sendTelegramNotification(message, settings) {
  if (!settings || !settings.enabled || !settings.botToken || !settings.ownerChatId) {
    return false;
  }

  try {
    const url = `https://api.telegram.org/bot${settings.botToken}/sendMessage`;
    
    // Envia para o proprietário
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: settings.ownerChatId,
        text: message,
        parse_mode: 'HTML'
      })
    });

    // Se houver canal configurado, envia também
    if (settings.channelId) {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: settings.channelId,
          text: message,
          parse_mode: 'HTML'
        })
      });
    }

    return true;
  } catch (err) {
    console.error('Erro ao enviar notificação Telegram:', err);
    return false;
  }
}

export async function testTelegramConnection(token, chatId) {
  if (!token || !chatId) return false;
  try {
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '<b>SMARTAGENDA:</b> Conexão com Telegram estabelecida com sucesso! 🚀',
        parse_mode: 'HTML'
      })
    });
    const data = await res.json();
    return data.ok === true;
  } catch (err) {
    console.error('Erro ao testar Telegram:', err);
    return false;
  }
}