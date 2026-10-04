'use client'

import { useEffect, useRef, useState } from 'react'
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi'
import profile from '@/data/profile.json'
import styles from '@/styles/ui/MickyChat.module.css'

const WELCOME = `Hi, I'm Micky 👋 Ask me anything about ${profile.name.first}'s projects, skills, or certifications.`

export default function MickyChat() {
  const [isOpen, setIsOpen]     = useState(false)
  const [messages, setMessages] = useState([{ role: 'model', text: WELCOME }])
  const [input, setInput]       = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const listRef  = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages, isLoading])

  useEffect(() => {
    if (isOpen) inputRef.current?.focus()
  }, [isOpen])

  async function sendMessage(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    const nextMessages = [...messages, { role: 'user', text }]
    setMessages(nextMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: nextMessages.slice(0, -1),
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessages(m => [...m, { role: 'model', text: data.error || "Something went wrong — try again?", isError: true }])
      } else {
        setMessages(m => [...m, { role: 'model', text: data.reply }])
      }
    } catch {
      setMessages(m => [...m, { role: 'model', text: "Couldn't reach the server — check your connection and try again.", isError: true }])
    } finally {
      setIsLoading(false)
    }
  }

  // Keep the site's custom scroll-jacking from firing while interacting with the panel
  function stopPropagation(e) { e.stopPropagation() }

  return (
    <div className={styles.wrapper} onWheel={stopPropagation} onTouchStart={stopPropagation} onTouchEnd={stopPropagation}>
      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <span className={styles.dot} />
              <span className={styles.headerTitle}>Micky</span>
              <span className={styles.headerSub}>Portfolio assistant</span>
            </div>
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)} aria-label="Close chat">
              <FiX size={18} />
            </button>
          </div>

          <div className={styles.list} ref={listRef}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`${styles.bubbleRow} ${m.role === 'user' ? styles.bubbleRowUser : ''}`}
              >
                <div className={`${styles.bubble} ${m.role === 'user' ? styles.bubbleUser : styles.bubbleModel} ${m.isError ? styles.bubbleError : ''}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className={styles.bubbleRow}>
                <div className={`${styles.bubble} ${styles.bubbleModel}`}>
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                  <span className={styles.typingDot} />
                </div>
              </div>
            )}
          </div>

          <form className={styles.inputRow} onSubmit={sendMessage}>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about a project, skill, cert..."
              maxLength={800}
            />
            <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()} aria-label="Send">
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}

      <button
        className={styles.fab}
        onClick={() => setIsOpen(v => !v)}
        aria-label={isOpen ? 'Close Micky chat' : 'Open Micky chat'}
      >
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>
    </div>
  )
}
