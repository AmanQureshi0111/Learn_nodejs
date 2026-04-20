require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { randomBytes } = require('crypto');

if (!process.env.DISCORD_TOKEN) {
  throw new Error('DISCORD_TOKEN is missing. Set it in your environment before running.');
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const urlStore = new Map();

function generateShortId(length = 7) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = '';

  while (id.length < length) {
    const randomIndex = randomBytes(1)[0] % alphabet.length;
    id += alphabet[randomIndex];
  }

  return id;
}

async function safeReply(message, text) {
  const content = String(text || '').slice(0, 1900);
  try {
    return await message.reply({ content });
  } catch (error) {
    console.error('Reply failed:', error);
    return null;
  }
}

async function generateAiReply(userPrompt) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is missing. Add it to your .env file.');
  }
  if (typeof fetch !== 'function') {
    throw new Error('Your Node.js version does not support fetch. Use Node.js 18+.');
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `You are a helpful and concise Discord assistant.\n\nUser: ${userPrompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${errorText.slice(0, 500)}`);
  }

  const data = await response.json();
  const parts = data?.candidates?.[0]?.content?.parts;
  const text = Array.isArray(parts) ? parts.map((part) => part?.text || '').join('').trim() : '';
  if (!text) {
    throw new Error('Gemini returned an empty response.');
  }

  return text;
}

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  console.log(`[message] ${message.author.tag}: ${message.content}`);

  if (message.content.startsWith('create')) {
    const url = message.content.replace(/^create\s*/, '').trim();

    if (!url) {
      return safeReply(message, 'Please provide a URL. Example: create https://example.com');
    }

    try {
      new URL(url);
    } catch {
      return safeReply(message, 'Invalid URL. Please use a full URL like https://example.com');
    }

    let shortId = generateShortId();
    while (urlStore.has(shortId)) {
      shortId = generateShortId();
    }
    urlStore.set(shortId, url);

    return safeReply(message, `Short ID for ${url} is: ${shortId}`);
  }

  if (message.content.startsWith('open')) {
    const shortId = message.content.replace(/^open\s*/, '').trim();

    if (!shortId) {
      return safeReply(message, 'Please provide a short ID. Example: open Ab3xYz1');
    }

    const originalUrl = urlStore.get(shortId);
    if (!originalUrl) {
      return safeReply(message, `No URL found for short ID: ${shortId}`);
    }

    return safeReply(message, `Original URL: ${originalUrl}`);
  }

  if (message.content.startsWith('ask')) {
    const prompt = message.content.replace(/^ask\s*/, '').trim();

    if (!prompt) {
      return safeReply(message, 'Please provide a prompt. Example: ask explain event loop in Node.js');
    }

    try {
      const aiReply = await generateAiReply(prompt);
      return safeReply(message, aiReply);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      return safeReply(message, `AI error: ${errorMessage}`);
    }
  }

  return safeReply(message, 'Use: create <url> | open <shortId> | ask <your question>');
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!!');
  }
});

client.login(process.env.DISCORD_TOKEN);
