import { useState, useRef, useEffect } from 'react'
import './App.css'
import { chatIconSVG, userIconSVG, botIconSVG, sendIconSVG, plusIconSVG, menuIconSVG } from './assets/icons'

function App() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [input])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim()) return

    // Add user message
    const userMessage = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: input
      })

      const data = await response.text()

      // Add bot message
      setMessages(prev => [...prev, { role: 'assistant', content: data }])

    } catch (error) {
      console.error('Error fetching response:', error)
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong. Try again.' }
      ])
    }

    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
//cd "C:\Users\Bharat\OneDrive\Desktop\New folder\ConversationalUI\ConversationalHistory-UI"; npm install; npm run dev
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  const startNewChat = () => setMessages([])

  return (
    <div className="chat-container">
      <div className={`chat-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-toggle" onClick={toggleSidebar} dangerouslySetInnerHTML={{ __html: menuIconSVG }} />
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo" dangerouslySetInnerHTML={{ __html: chatIconSVG }} />
            <div className="app-title">KITFLIK BOT</div>
          </div>
          <button className="new-chat-btn" onClick={startNewChat}>
            <span dangerouslySetInnerHTML={{ __html: plusIconSVG }} />
            New Conversation
          </button>
        </div>
      </div>

      <div className="chat-main">
        <div className="chat-header">
          <h2>KITFLIK BOT</h2>
        </div>

        <div className="messages-container">
          {messages.length === 0 ? (
            <div className="welcome-container">
              <div className="welcome-logo" dangerouslySetInnerHTML={{ __html: chatIconSVG }} />
              <h1>Welcome to BHARAT GPT</h1>
              <p>Your intelligent assistant powered by Spring AI. Ask anything!</p>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} className={`message ${m.role}`}>
                <div className="message-avatar">
                  <div dangerouslySetInnerHTML={{ __html: m.role === 'user' ? userIconSVG : botIconSVG }} />
                </div>
                <div className="message-content">{m.content}</div>
              </div>
            ))
          )}

          {loading && (
            <div className="message assistant">
              <div className="message-avatar">
                <div dangerouslySetInnerHTML={{ __html: botIconSVG }} />
              </div>
              <div className="message-content">
                <div className="loading-dots"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <form onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything..."
              className="message-input"
              rows="1"
            />
            <button type="submit" className="send-button" disabled={!input.trim() || loading}>
              <div dangerouslySetInnerHTML={{ __html: sendIconSVG }} />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
