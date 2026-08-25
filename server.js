const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files in local development mode
if (!process.env.VERCEL) {
  app.use(express.static(path.join(__dirname)));
}

// Safe data storage directory (use /tmp in serverless environments like Vercel)
const dataDir = process.env.VERCEL ? path.join('/tmp', 'medsim-data') : path.join(__dirname, 'data');
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
} catch (err) {
  console.warn('Data directory creation skipped:', err.message);
}

const getFilePath = (filename) => path.join(dataDir, filename);

const readData = (filename, defaultVal) => {
  try {
    const fp = getFilePath(filename);
    if (fs.existsSync(fp)) {
      return JSON.parse(fs.readFileSync(fp, 'utf-8'));
    }
  } catch (err) {
    console.warn(`Error reading ${filename}:`, err.message);
  }
  return defaultVal;
};

const writeData = (filename, data) => {
  try {
    fs.writeFileSync(getFilePath(filename), JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn(`Error writing ${filename}:`, err.message);
  }
};

/* ══════════════════════════════════
   API ROUTES
   ══════════════════════════════════ */

// 1. Google Gemini API Proxy
app.post('/api/chat', async (req, res) => {
  const { messages, context } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Gemini API key not configured on server.' });
  }

  const currentDateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  // Construct system prompt with context and real-time date
  let systemPrompt = `You are a helpful, professional AI Medical Assistant in MEDSIM, a virtual simulation platform for medical students.
Today's date is ${currentDateStr}.
Your goal is to explain concepts clearly, ask Socratic questions when appropriate, and provide clinical context.
Keep responses concise (under 300 words). Use medical terminology but explain it.
ALWAYS remind the user that this is for educational purposes only and not a substitute for clinical judgment.`;

  if (context) {
    systemPrompt += `\n\nCURRENT STUDENT CONTEXT:\n- Subject: ${context.subject || 'N/A'}\n- Topic: ${context.topic || 'N/A'}\n- Simulation Mode: ${context.mode || 'N/A'}`;
    if (context.structure) {
      systemPrompt += `\n- Currently viewing structure: ${context.structure}`;
    }
  }

  // Build conversation history for Gemini
  const chatHistory = (messages || []).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }));

  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-3.6-flash',
      systemInstruction: systemPrompt
    });

    const chat = model.startChat({ history: chatHistory.slice(0, -1) });
    const lastMessage = chatHistory[chatHistory.length - 1];
    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const response = result.response.text();

    res.json({ message: response });
  } catch (error) {
    console.error('Gemini Error:', error.message || error);
    res.status(500).json({ error: 'Failed to communicate with AI Assistant. ' + (error.message || '') });
  }
});

// 2. Notes API
app.get('/api/notes', (req, res) => {
  res.json(readData('notes.json', []));
});

app.post('/api/notes', (req, res) => {
  const notes = readData('notes.json', []);
  const newNote = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
  notes.push(newNote);
  writeData('notes.json', notes);
  res.json(newNote);
});

app.delete('/api/notes/:id', (req, res) => {
  let notes = readData('notes.json', []);
  notes = notes.filter(n => n.id !== req.params.id);
  writeData('notes.json', notes);
  res.json({ success: true });
});

// 3. Progress API
app.get('/api/progress', (req, res) => {
  res.json(readData('progress.json', {}));
});

app.post('/api/progress', (req, res) => {
  // Update progress dict
  const progress = readData('progress.json', {});
  const updates = req.body;
  const newProgress = { ...progress, ...updates };
  writeData('progress.json', newProgress);
  res.json({ success: true, progress: newProgress });
});

// Fallback route for SPA in local development mode
if (!process.env.VERCEL) {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
}

// Start server locally if not in Vercel serverless environment
if (!process.env.VERCEL && require.main === module) {
  app.listen(PORT, () => {
    console.log(`MEDSIM Backend running on http://localhost:${PORT}`);
  });
}

module.exports = app;
