import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const FOCUSABLE_SELECTOR = 'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const WELCOME_MESSAGE = 'Hi, I am Lumi Glow AI. I can help with recommendations, shipping, offers, and order tracking.';

const FAQS = [
  {
    id: 'track',
    label: 'Track my order',
    response: 'Open tracking and enter your order number from the confirmation message.',
    link: '/track-order'
  },
  {
    id: 'concierge',
    label: 'Suggest best products',
    response: 'Tell me your goal in one line and I will suggest a focused set for quick results.',
    link: '/products'
  },
  {
    id: 'shipping',
    label: 'Shipping and returns',
    response: 'Typical delivery is 3 to 5 business days, and return help is available from support.',
    link: '/faq'
  },
  {
    id: 'offers',
    label: 'Current offers',
    response: 'Use GLOW15 for first-order savings and check bundles for the best value.',
    link: '/products'
  }
];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(true);
  const scrollRef = useRef(null);
  const windowRef = useRef(null);
  const inputRef = useRef(null);
  const toggleRef = useRef(null);
  const prevFocusRef = useRef(null);

  const addMessage = (msg) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now() }]);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (messages.length === 0) {
        addMessage({ text: WELCOME_MESSAGE, type: 'bot' });
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [messages.length]);

  useEffect(() => {
    const openFromPage = () => setIsOpen(true);
    window.addEventListener('open-dh-concierge', openFromPage);
    return () => window.removeEventListener('open-dh-concierge', openFromPage);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    prevFocusRef.current = document.activeElement;
    const dialog = windowRef.current;
    if (!dialog) return;

    const focusables = Array.from(dialog.querySelectorAll(FOCUSABLE_SELECTOR));
    const first = inputRef.current || focusables[0] || dialog;
    const last = focusables[focusables.length - 1] || first;

    first.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setIsOpen(false);
        return;
      }

      if (event.key !== 'Tab' || focusables.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (prevFocusRef.current instanceof HTMLElement) prevFocusRef.current.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const generateReply = (input) => {
    const text = input.toLowerCase();

    if (text.includes('track') || text.includes('order')) {
      return { text: 'I can route you directly to tracking now.', link: '/track-order' };
    }
    if (text.includes('ship') || text.includes('return') || text.includes('delivery')) {
      return { text: 'Delivery is usually quick and return rules are available in FAQ.', link: '/faq' };
    }
    if (text.includes('offer') || text.includes('discount') || text.includes('price')) {
      return { text: 'Apply GLOW15 at checkout and review bundle options for maximum value.', link: '/products' };
    }
    if (text.includes('acne') || text.includes('dry') || text.includes('bright') || text.includes('recommend') || text.includes('routine')) {
      return { text: 'Great, I can help with that. Open products and I will suggest a minimal, high-impact routine.', link: '/products' };
    }

    return { text: 'Ask me about products, offers, shipping, or tracking and I will guide your next best step.' };
  };

  const handleOptionClick = (option) => {
    addMessage({ text: option.label, type: 'user' });
    setShowOptions(false);
    
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ text: option.response, type: 'bot', link: option.link });
      setTimeout(() => setShowOptions(true), 500);
    }, 1000);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const input = draft.trim();
    if (!input) return;

    addMessage({ text: input, type: 'user' });
    setDraft('');
    setShowOptions(false);
    setIsTyping(true);

    const reply = generateReply(input);
    setTimeout(() => {
      setIsTyping(false);
      addMessage({ text: reply.text, type: 'bot', link: reply.link });
      setShowOptions(true);
    }, 850);
  };

  const toggleChat = () => setIsOpen(!isOpen);

  return (
    <div className={`chatbot-wrapper ${isOpen ? 'active' : ''}`}>
      {/* Floating Toggle Button */}
      <button ref={toggleRef} className="chatbot-toggle" onClick={toggleChat} aria-label="Toggle Chat">
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        )}
        {!isOpen && <span className="chatbot-badge">1</span>}
      </button>

      {/* Chat Window */}
      <div ref={windowRef} className="chatbot-window" role="dialog" aria-modal="true" aria-labelledby="chatbot-title" aria-hidden={!isOpen} tabIndex={-1}>
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <div className="chatbot-avatar">AI</div>
            <div>
              <h3 id="chatbot-title">Lumi Glow Concierge</h3>
              <p>Online • Adaptive AI</p>
            </div>
          </div>
          <button className="chat-close" onClick={() => setIsOpen(false)} aria-label="Close chat">×</button>
        </div>

        <div className="chatbot-messages" ref={scrollRef}>
          {messages.map(m => (
            <div key={m.id} className={`chat-bubble-wrap ${m.type}`}>
              <div className="chat-bubble">
                {m.text}
                {m.link && (
                  <Link to={m.link} className="chat-link" onClick={() => setIsOpen(false)}>
                    View Page →
                  </Link>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-bubble-wrap bot">
              <div className="chat-bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
        </div>

        {showOptions && (
          <div className="chatbot-options">
            {FAQS.map(option => (
              <button 
                key={option.id} 
                className="chat-option-btn"
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}

        <form className="chatbot-footer" onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Ask about products, offers, shipping, or tracking..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
          />
          <button className="chat-send-btn" type="submit" aria-label="Send">
             <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
          </button>
        </form>
      </div>
    </div>
  );
}
