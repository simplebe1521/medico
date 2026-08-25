/* ========================================
   ImmersiMed v2 — AI Client
   Talks to a real LLM (Claude or ChatGPT) for
   freeform student questions in the tutor panel.

   ⚠️ IMPORTANT — READ BEFORE DEPLOYING:
   This calls the provider's API directly from the
   browser using a key the student pastes into
   Settings. That's fine for a personal prototype
   running on your own machine, but it means the
   key is visible in the browser (devtools/network
   tab) to anyone using that browser session.

   Before you put this in front of real students,
   replace `callAI()`'s fetch target with your OWN
   backend endpoint (e.g. POST /api/tutor) that
   holds the real API key server-side and forwards
   the request. Everything else in this file can
   stay the same — you'd just change the URL/headers
   in `_callOpenAI` / `_callAnthropic`.
   ======================================== */

const CONFIG_KEY = 'immersimed_ai_config';

export function getAIConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { /* ignore */ }
  return { provider: 'openai', apiKey: '', model: '' };
}

export function saveAIConfig(cfg) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
  } catch (e) { /* ignore */ }
}

export function hasAPIKey() {
  const cfg = getAIConfig();
  return !!cfg.apiKey;
}

const DEFAULT_MODELS = {
  openai: 'gpt-4o-mini',
  anthropic: 'claude-sonnet-4-5-20250929',
};

const SYSTEM_PROMPT = `You are a clinical anatomy tutor embedded inside a 3D virtual cadaver simulation called ImmersiMed, used by medical students. Answer medical/anatomy/physiology questions clearly and accurately, at the level of a 2nd-year medical student. Use short paragraphs. When useful, mention clinical relevance. Keep answers focused — 2-5 sentences unless the student is clearly asking for depth. If a question is outside anatomy/medicine, answer briefly and redirect to the topic at hand. If asked about a specific structure the student currently has selected, ground your answer in that structure.`;

export async function callAI(messages, organContext) {
  const cfg = getAIConfig();
  if (!cfg.apiKey) {
    throw new Error('NO_API_KEY');
  }

  const sys = organContext ? `${SYSTEM_PROMPT}\n\n${organContext}` : SYSTEM_PROMPT;

  if (cfg.provider === 'anthropic') {
    return _callAnthropic(cfg, sys, messages);
  }
  return _callOpenAI(cfg, sys, messages);
}

async function _callOpenAI(cfg, systemPrompt, messages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${cfg.apiKey}`,
    },
    body: JSON.stringify({
      model: cfg.model || DEFAULT_MODELS.openai,
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      max_tokens: 500,
      temperature: 0.4,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`OpenAI error ${res.status}: ${errBody.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || '(No response)';
}

async function _callAnthropic(cfg, systemPrompt, messages) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: cfg.model || DEFAULT_MODELS.anthropic,
      system: systemPrompt,
      messages,
      max_tokens: 500,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    throw new Error(`Anthropic error ${res.status}: ${errBody.slice(0, 200)}`);
  }
  const data = await res.json();
  return data.content?.map(b => b.text || '').join('').trim() || '(No response)';
}
