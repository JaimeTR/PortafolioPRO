import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const defaultSystemPromptEs = `Eres {bot_name}, el asistente virtual de {user_name}. Ayuda a clientes respondiendo dudas sobre su experiencia y servicios. Sé amigable, profesional y breve (1-3 líneas). Usa emojis. NO inventes datos.`;
const defaultSystemPromptEn = `You are {bot_name}, the virtual assistant of {user_name}. Help clients with questions about their experience and services. Be friendly, professional and brief (1-3 lines). Use emojis. Do NOT make up data.`;

async function getUserByUsername(username) {
  try {
    const { data } = await supabase.from('users').select('*').eq('username', username).eq('is_active', true).single();
    return data;
  } catch { return null; }
}

async function getChatbotConfig(userId) {
  try {
    const { data } = await supabase.from('chatbot_configs').select('*').eq('user_id', userId).single();
    return data;
  } catch { return null; }
}

async function getProfileData(userId) {
  try {
    const { data } = await supabase.from('profiles').select('*').eq('user_id', userId).single();
    return data;
  } catch { return null; }
}

function buildSystemPrompt(config, profileData, language) {
  const isEn = language === 'en';
  const botName = config?.bot_name || 'AsistenteIA';

  let basePrompt = isEn
    ? (config?.system_prompt_en || defaultSystemPromptEn)
    : (config?.system_prompt_es || defaultSystemPromptEs);

  basePrompt = basePrompt
    .replace(/\{bot_name\}/g, botName)
    .replace(/\{user_name\}/g, profileData?.name_es || 'el profesional');

  const trainingData = config?.training_data || '';
  if (trainingData.trim()) {
    basePrompt += '\n\n--- DATOS DEL PROFESIONAL ---\n' + trainingData + '\n--- FIN DATOS ---';
  }

  if (profileData) {
    basePrompt += '\n\n--- CONTACTO ---\n';
    basePrompt += `Email: ${profileData?.email || 'No especificado'}\n`;
    if (profileData?.phone || profileData?.whatsapp) basePrompt += `Teléfono: ${profileData.whatsapp || profileData.phone}\n`;
    if (profileData?.about_me_paragraphs?.length) {
      const summary = profileData.about_me_paragraphs[0];
      basePrompt += `Resumen: ${isEn ? (summary.en || summary.es || '') : (summary.es || summary.en || '')}\n`;
    }
  }

  return basePrompt;
}

export async function POST(req) {
  try {
    const { messages, language = 'es', username } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Mensajes inválidos' }, { status: 400 });
    }

    let user = null;
    if (username) {
      user = await getUserByUsername(username);
    }

    // If username provided, check premium
    if (username && user) {
      if (user.plan !== 'premium') {
        return NextResponse.json({
          reply: language === 'es'
            ? 'El chatbot IA es una funcionalidad premium. ¡Actualiza tu plan para habilitarlo!'
            : 'The AI chatbot is a premium feature. Upgrade your plan to enable it!',
          upgrade: true
        });
      }
    }

    // Use user-specific config or fallback
    let chatbotConfig = null;
    let profileData = null;

    if (user) {
      [chatbotConfig, profileData] = await Promise.all([
        getChatbotConfig(user.id),
        getProfileData(user.id)
      ]);
    }

    // Block if chatbot is disabled for this user
    if (user && chatbotConfig?.is_enabled === false) {
      return NextResponse.json({ reply: 'El asistente virtual está desactivado.' }, { status: 403 });
    }

    const systemPrompt = buildSystemPrompt(chatbotConfig, profileData, language);
    const systemMessage = { role: 'system', content: systemPrompt };
    const fullMessages = [systemMessage, ...messages];

    const provider = chatbotConfig?.provider || 'groq';
    const model = chatbotConfig?.model || 'llama-3.1-8b-instant';
    const temperature = chatbotConfig?.temperature ?? 0.7;
    const maxTokens = chatbotConfig?.max_tokens ?? 150;
    let reply;

    switch (provider) {
      case 'openai': {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({ model, messages: fullMessages, temperature, max_tokens: maxTokens });
        reply = response.choices[0].message.content;
        break;
      }
      case 'gemini': {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const gModel = genAI.getGenerativeModel({ model });
        const sysMsg = fullMessages.find(m => m.role === 'system');
        const chatMsgs = fullMessages.filter(m => m.role !== 'system');
        const history = chatMsgs.slice(0, -1).map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));
        const chat = gModel.startChat({ history, systemInstruction: sysMsg?.content, generationConfig: { temperature, maxOutputTokens: maxTokens } });
        const result = await chat.sendMessage(chatMsgs[chatMsgs.length - 1].content);
        reply = result.response.text();
        break;
      }
      case 'groq':
      default: {
        const groq = new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: 'https://api.groq.com/openai/v1' });
        const response = await groq.chat.completions.create({ model, messages: fullMessages, temperature, max_tokens: maxTokens });
        reply = response.choices[0].message.content;
        break;
      }
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
