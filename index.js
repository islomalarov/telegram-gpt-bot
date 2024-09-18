import TelegramBot from 'node-telegram-bot-api';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (chatId === -1001454021013) {
    if (text && text.toLowerCase().includes('#gpt')) {
      const query = text.replace(/#gpt/i, '').trim();

      if (query.length > 0) {
        try {
          const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: query }],
            model: 'gpt-4o',
          });

          const reply = chatCompletion.choices[0].message.content;
          bot.sendMessage(chatId, reply, {
            reply_to_message_id: msg.message_id,
            parse_mode: 'Markdown',
          });
        } catch (error) {
          if (error.code === 'insufficient_quota') {
            bot.sendMessage(
              chatId,
              'Извините, достигнут лимит использования API OpenAI. Пожалуйста, попробуйте позже.',
            );
          } else {
            bot.sendMessage(chatId, 'Произошла ошибка при обработке запроса.');
          }
          console.error('Ошибка при взаимодействии с OpenAI:', error);
        }
      } else {
        bot.sendMessage(chatId, 'Пожалуйста, введите сообщение после хэштега #gpt.');
      }
    }
  } else {
    bot.sendMessage(
      chatId,
      `Kechirasiz, ushbu bot buyurtma asosida tayyorlangani uchun faqatgina dasturchi tomonidan ruhsat berilgan guruhlarda ishlaydi.
    Agar sizga ham shunday bot kerak bo'lsa men bilan bog'laning: @islomalarov`,
    );
  }
});
