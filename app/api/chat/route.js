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

export async function POST(req) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chat is not configured yet — missing GEMINI_API_KEY on the server.' },
      { status: 500 }
    )
  }

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
      console.error('Gemini API error', geminiRes.status, errText)
      return NextResponse.json(
        { error: `Micky is having trouble responding right now (upstream ${geminiRes.status}).` },
        { status: 502 }
      )
    }

    const data = await geminiRes.json()
    const reply =
      data?.candidates?.[0]?.content?.parts?.map(p => p.text).join('') ??
      "Sorry, I couldn't come up with a response to that — try rephrasing?"

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('Chat route error', err)
    return NextResponse.json(
      { error: 'Something went wrong reaching Micky. Please try again in a moment.' },
      { status: 500 }
    )
  }
}
