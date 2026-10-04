import { NextResponse } from 'next/server'
import profile from '@/data/profile.json'

// This route runs on the SERVER only. The Gemini key is read from an
// environment variable here and never sent to the browser. The client
// (components/ui/MickyChat.jsx) only ever talks to this route, never to
// Google's API directly.

const GEMINI_MODEL = 'gemini-flash-latest' // Google-maintained alias -> always a current fast model
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

const MAX_MESSAGE_LEN = 800
const MAX_HISTORY_TURNS = 8

function buildPortfolioContext() {
  const p = profile
  const lines = []

  lines.push(`Name: ${p.name.full}`)
  lines.push(`Role: ${p.roles.detailed}`)
  lines.push(`Location: ${p.location.based} (${p.location.availability})`)
  lines.push(`Tagline: ${p.tagline}`)
  lines.push(`Bio: ${p.bio}`)

  lines.push(`\nStats: ${p.stats.map(s => `${s.value} ${s.label}`).join(', ')}`)
  lines.push(`\nSkills: ${p.skills.join(', ')}`)

  lines.push(`\nEducation:`)
  p.experience.forEach(e => {
    lines.push(`- ${e.role}, ${e.company} (${e.period}${e.periodEnd ? ' - ' + e.periodEnd : ''}). ${e.desc}`)
  })

  lines.push(`\nProjects:`)
  p.projects.forEach(proj => {
    lines.push(`- "${proj.title}" (${proj.type}): ${proj.desc} Tech: ${proj.tech.join(', ')}. Link: ${proj.link}`)
  })

  lines.push(`\nCertifications:`)
  p.publications.forEach(c => {
    lines.push(`- ${c.title} — ${c.platform}${c.year ? ' (' + c.year + ')' : ''}`)
  })

  lines.push(`\nContact: ${p.email}`)
  p.socials.forEach(s => lines.push(`${s.label}: ${s.href}`))

  return lines.join('\n')
}

const SYSTEM_INSTRUCTION = `You are Micky, the friendly AI assistant embedded in ${profile.name.full}'s portfolio website.

Your job: help visitors quickly find and understand information about ${profile.name.first} — his skills, certifications, education, and projects (especially MLOps.dev, his own startup).

Rules:
- Answer ONLY using the portfolio information provided below. Do not invent facts, dates, employers, or numbers that aren't given.
- If asked something the portfolio data doesn't cover, say you don't have that detail and suggest the visitor reach out directly via the contact links.
- Keep answers short and conversational — 2-4 sentences for most questions. Use a bullet list only when comparing multiple items (e.g. listing several projects or skills).
- Be warm and enthusiastic about the work, but factual — never exaggerate beyond what's stated.
- If asked who you are, say you're Micky, a small assistant built into this portfolio to help people explore it.

Portfolio data:
${buildPortfolioContext()}`

function getFallbackReply(message) {
  const q = (message || '').toLowerCase()
  const p = profile

  if (q.includes('skill') || q.includes('stack') || q.includes('tech') || q.includes('tool') || q.includes('language') || q.includes('framework')) {
    return `${p.name.first}'s core skills include: ${p.skills.join(', ')}. He focuses heavily on production MLOps, containerization, and scalable model serving.`
  }

  if (q.includes('project') || q.includes('work') || q.includes('built') || q.includes('mlops.dev') || q.includes('mlopsdev') || q.includes('startup')) {
    const list = p.projects.map(pr => `• ${pr.title} (${pr.type}): ${pr.desc}`).join('\n')
    return `Here are some of ${p.name.first}'s key projects:\n\n${list}\n\nYou can view code and live demos in the Projects section or on GitHub!`
  }

  if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('reach') || q.includes('message') || q.includes('connect')) {
    const linkedin = p.socials.find(s => s.label === 'LinkedIn')?.href || 'https://linkedin.com'
    const github = p.socials.find(s => s.label === 'GitHub')?.href || 'https://github.com'
    return `You can reach ${p.name.first} directly via email at ${p.email}, or connect on LinkedIn (${linkedin}) and GitHub (${github}).`
  }

  if (q.includes('cert') || q.includes('license') || q.includes('publication') || q.includes('credential')) {
    const certs = p.publications.slice(0, 4).map(c => `• ${c.title} (${c.platform})`).join('\n')
    return `${p.name.first} holds industry credentials including:\n\n${certs}\n\n...plus several more in the Certifications section!`
  }

  if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('university') || q.includes('study')) {
    const edu = p.experience.map(e => `${e.role} at ${e.company} (${e.period})`).join(', ')
    return `${p.name.first} is currently pursuing his ${edu}. He is open to AI/ML and MLOps engineering opportunities.`
  }

  if (q.includes('who are you') || q.includes('what are you') || q.includes('your name') || q.includes('micky')) {
    return `I'm Micky, an AI assistant built into ${p.name.first}'s portfolio! I can help you explore his projects, technical skills, certifications, and background. What would you like to know?`
  }

  if (q.includes('who is') || q.includes('about') || q.includes('bio') || q.includes('background') || q.includes('tell me about')) {
    return `${p.name.full} is an ${p.roles.detailed} based in ${p.location.based}. He specializes in architecting end-to-end ML lifecycles, CI/CD automation, and cloud infrastructure with sub-100ms inference latency.`
  }

  return `Thanks for asking! ${p.name.full} is an ${p.roles.primary} specializing in MLOps, cloud infrastructure, and production ML systems. You can ask me about his projects (like MLOps.dev), technical skills, certifications, or how to contact him!`
}

export async function POST(req) {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim()

  let body
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const message = typeof body?.message === 'string' ? body.message.trim() : ''
  const history = Array.isArray(body?.history) ? body.history : []

  if (!message) {
    return NextResponse.json({ error: 'Message is required.' }, { status: 400 })
  }
  if (message.length > MAX_MESSAGE_LEN) {
    return NextResponse.json(
      { error: `Message is too long (max ${MAX_MESSAGE_LEN} characters).` },
      { status: 400 }
    )
  }

  // If Gemini key is missing or not a standard Google AI Studio key, respond with grounded fallback
  if (!apiKey || !apiKey.startsWith('AIzaSy')) {
    return NextResponse.json({ reply: getFallbackReply(message) })
  }

  // Keep only the last N turns, and only well-formed ones
  const trimmedHistory = history
    .filter(h => h && (h.role === 'user' || h.role === 'model') && typeof h.text === 'string')
    .slice(-MAX_HISTORY_TURNS)
    .map(h => ({ role: h.role, parts: [{ text: h.text.slice(0, MAX_MESSAGE_LEN) }] }))

  const contents = [...trimmedHistory, { role: 'user', parts: [{ text: message }] }]

  try {
    const geminiRes = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 300,
        },
      }),
    })

    if (!geminiRes.ok) {
      const errText = await geminiRes.text().catch(() => '')
      console.warn('Gemini API returned error', geminiRes.status, errText, '- using grounded profile fallback')
      return NextResponse.json({ reply: getFallbackReply(message) })
    }

    const data = await geminiRes.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ||
      getFallbackReply(message)

    return NextResponse.json({ reply })
  } catch (err) {
    console.warn('Chat route error:', err?.message, '- using grounded profile fallback')
    return NextResponse.json({ reply: getFallbackReply(message) })
  }
}
