import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Mic,
  MicOff,
  Copy,
  Check,
  StickyNote,
  ExternalLink,
  Bot,
  User,
  Zap,
  Terminal,
  FolderKanban,
  FileText,
  HelpCircle,
  Volume2,
} from 'lucide-react';
import { useOS } from '../../context/OSContext';
import { PROFILE_INFO } from '../../data/initialData';
import { AppId } from '../../types';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    action: () => void;
    appId?: AppId;
  };
}

export const AiAssistantApp: React.FC = () => {
  const { openApp, projects, skills, experiences, education, certifications, updateSettings } = useOS();
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: `Hello! I am Abhishek AI, your interactive workstation copilot.\n\nI answer from the portfolio data loaded in this OS: projects, experience, skills, education, and contact details. You can ask a portfolio question or command me to navigate the OS (e.g., "Open projects", "Show resume", "Launch terminal").`,
      timestamp: 'Just now',
    },
  ]);

  // Check speech recognition support
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSendQuery(transcript);
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice toggle
  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  // Safe OS command allowlist evaluator
  const evaluateOsCommands = (query: string): { text: string; action?: { label: string; action: () => void; appId?: AppId } } | null => {
    const q = query.toLowerCase().trim();

    if (q.includes('open browser') || q.includes('launch browser')) {
      return {
        text: 'Opening Abhishek Browser for you now...',
        action: { label: 'Open Browser', action: () => openApp('browser'), appId: 'browser' },
      };
    }
    if (q.includes('open resume') || q.includes('show resume') || q.includes('view resume')) {
      return {
        text: 'Launching Abhishek’s PDF Resume Viewer...',
        action: { label: 'Open Resume', action: () => openApp('resume'), appId: 'resume' },
      };
    }
    if (q.includes('open terminal') || q.includes('launch terminal') || q.includes('open powershell')) {
      return {
        text: 'Opening PowerShell Developer Terminal...',
        action: { label: 'Open Terminal', action: () => openApp('terminal'), appId: 'terminal' },
      };
    }
    if (q.includes('open projects') || q.includes('show projects') || q.includes('show me his projects')) {
      return {
        text: `Opening Projects Explorer showcasing Abhishek's ${projects.length} verified production solutions...`,
        action: { label: 'Open Projects Explorer', action: () => openApp('projects'), appId: 'projects' },
      };
    }
    if (q.includes('open code') || q.includes('open editor') || q.includes('code studio')) {
      return {
        text: 'Launching Abhishek Code Studio IDE...',
        action: { label: 'Open Code Editor', action: () => openApp('code-editor'), appId: 'code-editor' },
      };
    }
    if (q.includes('open git') || q.includes('git studio') || q.includes('git graph')) {
      return {
        text: 'Launching Abhishek Git Studio with visual graph and staging area...',
        action: { label: 'Open Git Studio', action: () => openApp('git'), appId: 'git' },
      };
    }
    if (q.includes('open api') || q.includes('api tester') || q.includes('api lab')) {
      return {
        text: 'Opening Abhishek API Lab REST client...',
        action: { label: 'Open API Lab', action: () => openApp('api-tester'), appId: 'api-tester' },
      };
    }
    if (q.includes('open writer') || q.includes('document editor')) {
      return {
        text: 'Launching Abhishek Writer document processor...',
        action: { label: 'Open Writer', action: () => openApp('writer'), appId: 'writer' },
      };
    }
    if (q.includes('open sheets') || q.includes('spreadsheet')) {
      return {
        text: 'Opening Abhishek Sheets spreadsheet calculation engine...',
        action: { label: 'Open Sheets', action: () => openApp('sheets'), appId: 'sheets' },
      };
    }
    if (q.includes('launch snake') || q.includes('play game') || q.includes('open arcade') || q.includes('games')) {
      return {
        text: 'Launching Abhishek Arcade Center with retro Snake, Minesweeper, and Solitaire...',
        action: { label: 'Open Arcade', action: () => openApp('arcade'), appId: 'arcade' },
      };
    }
    if (q.includes('open settings') || q.includes('personalization')) {
      return {
        text: 'Opening Workstation Settings...',
        action: { label: 'Open Settings', action: () => openApp('settings'), appId: 'settings' },
      };
    }
    if (q.includes('recruiter mode')) {
      return {
        text: 'Switching Workstation to Recruiter Fast-Track Mode...',
        action: {
          label: 'Activate Recruiter Mode',
          action: () => {
            updateSettings({ recruiterMode: true });
            openApp('resume');
          },
          appId: 'resume',
        },
      };
    }

    return null;
  };

  // Portfolio RAG Knowledge Retriever
  const retrievePortfolioAnswer = (query: string): { text: string; action?: { label: string; action: () => void; appId?: AppId } } => {
    const q = query.toLowerCase();

    // Check allowlisted OS actions first
    const osCmd = evaluateOsCommands(query);
    if (osCmd) {
      if (osCmd.action) {
        osCmd.action.action();
      }
      return osCmd;
    }

    const projectDetails = (project: typeof projects[number]) =>
      `**${project.title}** (${project.year})\n\n${project.long_description || project.short_description}\n\n• **Category:** ${project.category}\n• **Technologies:** ${project.technologies.join(', ')}\n• **Status:** ${project.status}`;

    // Explicit portfolio intents are checked before broad skill/experience
    // matching so questions such as "React projects" return project data.
    if (q.includes('cover letter') || q.includes('coverletter')) {
      const role = query.match(/(?:for|as)\s+(.+)$/i)?.[1] || 'a software engineering role';
      return {
        text: `**Cover letter for ${role}**\n\nDear Hiring Team,\n\nI am Abhishek Kuntare, a Software Developer with experience building React and TypeScript interfaces and AI-enabled full-stack products. My verified portfolio includes ${projects.slice(0, 2).map(p => p.title).join(' and ')}, and my professional experience includes ${experiences.map(e => `${e.role} at ${e.company}`).join('; ')}.\n\nI would welcome the opportunity to discuss how this experience could help your team. My education is a ${education.degree} in ${education.field} from ${education.institution} (${education.cgpa} CGPA).\n\nSincerely,\nAbhishek Kuntare`,
        action: { label: 'Open Resume', action: () => openApp('resume'), appId: 'resume' },
      };
    }

    if (q.includes('summarize experience') || q.includes('summary of experience') || q.includes('summarise experience')) {
      return {
        text: `**Experience summary**\n\n${experiences.map(e => `• **${e.role} — ${e.company}** (${e.start_date} – ${e.end_date}): ${e.description[0] || 'Details are recorded in the portfolio.'}\n  **Technologies:** ${e.technologies.join(', ')}`).join('\n\n')}`,
        action: { label: 'Open Experience', action: () => openApp('experience'), appId: 'experience' },
      };
    }

    if ((q.includes('react') || q.includes('ai')) && (q.includes('project') || q.includes('work'))) {
      const matches = projects.filter(p =>
        p.technologies.some(t => t.toLowerCase().includes('react') || t.toLowerCase().includes('ai') || t.toLowerCase().includes('gemini') || t.toLowerCase().includes('openai')) ||
        p.category.toLowerCase().includes('ai')
      );
      return {
        text: matches.length ? `**React / AI projects in the portfolio**\n\n${matches.map(projectDetails).join('\n\n')}` : 'No React or AI projects are currently recorded in the portfolio.',
        action: { label: 'Open Projects', action: () => openApp('projects'), appId: 'projects' },
      };
    }

    if (q.includes('compare') && projects.length >= 2) {
      const mentioned = projects.filter(p => q.includes(p.title.toLowerCase()) || q.includes(p.slug.toLowerCase()));
      const pair = (mentioned.length >= 2 ? mentioned : projects).slice(0, 2);
      return {
        text: `**Project comparison**\n\n${pair.map(p => `• **${p.title}:** ${p.category}; ${p.status}; ${p.technologies.join(', ')}. ${p.short_description}`).join('\n\n')}`,
        action: { label: 'Open Projects', action: () => openApp('projects'), appId: 'projects' },
      };
    }

    if (q.includes('search') && (q.includes('portfolio') || q.includes('project'))) {
      const term = q.replace(/search|portfolio|projects?|for|in/g, ' ').trim();
      const matches = projects.filter(p => `${p.title} ${p.category} ${p.short_description} ${p.technologies.join(' ')}`.toLowerCase().includes(term));
      return {
        text: matches.length ? `**Portfolio search results**\n\n${matches.map(projectDetails).join('\n\n')}` : `No verified portfolio project matched "${term}".`,
        action: { label: 'Open Projects', action: () => openApp('projects'), appId: 'projects' },
      };
    }

    // KrishiMitra AI project
    if (q.includes('krishimitra')) {
      const km = projects.find(p => p.slug.includes('krishi') || p.title.toLowerCase().includes('krishi'));
      return {
        text: km ? projectDetails(km) : 'KrishiMitra AI is not currently present in the loaded portfolio data.',
        action: {
          label: 'View KrishiMitra in Projects',
          action: () => openApp('projects'),
          appId: 'projects',
        },
      };
    }

    if (q.includes('technologies known') || q.includes('technology known') || q.includes('what technologies') || q === 'tech stack') {
      const all = Array.from(new Set([...skills.map(s => s.name), ...projects.flatMap(p => p.technologies), ...experiences.flatMap(e => e.technologies)])).sort();
      return {
        text: `**Technologies recorded in Abhishek's portfolio**\n\n${all.join(', ')}`,
        action: { label: 'Open Skills', action: () => openApp('skills'), appId: 'skills' },
      };
    }

    // Who is Abhishek / Background
    if (q.includes('who is abhishek') || q.includes('about abhishek') || q.includes('tell me about yourself') || q.includes('bio')) {
      const roles = experiences.map(e => `${e.role} at ${e.company}`).join('; ');
      return {
        text: `**${PROFILE_INFO.name || 'Abhishek Kuntare'}**\n\n• **Experience:** ${roles || 'No employment history is currently recorded.'}\n• **Education:** ${education.degree} in ${education.field} at ${education.institution} (${education.cgpa} CGPA).\n• **Location:** ${PROFILE_INFO.location}.\n• **Recorded technologies:** ${Array.from(new Set(skills.map(s => s.name))).join(', ') || 'None recorded.'}`,
        action: {
          label: 'Open About Window',
          action: () => openApp('about'),
          appId: 'about',
        },
      };
    }

    // Skills & Technologies
    if (q.includes('skill') || q.includes('technolog') || q.includes('stack') || q.includes('languages')) {
      const frontend = skills.filter(s => s.category === 'Frontend').map(s => s.name).join(', ');
      const backend = skills.filter(s => s.category === 'Backend & Database').map(s => s.name).join(', ');
      const ai = skills.filter(s => s.category === 'AI / API').map(s => s.name).join(', ');

      return {
        text: `**Abhishek’s Technical Proficiencies:**\n\n• **Frontend:** ${frontend || 'No frontend skills are currently recorded.'}\n• **Backend & DB:** ${backend || 'No backend or database skills are currently recorded.'}\n• **AI & Cloud:** ${ai || 'No AI/API skills are currently recorded.'}`,
        action: {
          label: 'View Full Skills Matrix',
          action: () => openApp('skills'),
          appId: 'skills',
        },
      };
    }

    // Experience / Work History
    if (q.includes('experience') || q.includes('work') || q.includes('company') || q.includes('videoit') || q.includes('job')) {
      return {
        text: `**Professional Experience Overview:**\n\n${experiences
          .map(
            e =>
              `• **${e.role}** at **${e.company}** (${e.start_date} – ${e.end_date})\n  ${e.description[0] || ''}\n  *Stack:* ${e.technologies.join(', ')}`
          )
          .join('\n\n')}`,
        action: {
          label: 'Explore Career Timeline',
          action: () => openApp('experience'),
          appId: 'experience',
        },
      };
    }

    // Education & University
    if (q.includes('education') || q.includes('college') || q.includes('degree') || q.includes('university') || q.includes('cgpa')) {
      return {
        text: `**Academic Credentials:**\n\n• **Degree:** ${education.degree} in ${education.field}\n• **Institution:** ${education.institution}\n• **Academic Standing:** **${education.cgpa} CGPA** (${education.start_date} – ${education.end_date})\n• **Coursework:** Data Structures, Algorithms, Database Management Systems, Software Engineering, Cloud Computing.`,
        action: {
          label: 'View Education Details',
          action: () => openApp('education'),
          appId: 'education',
        },
      };
    }

    // Contact info
    if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('reach')) {
      return {
        text: `**Contact & Collaboration:**\n\n• **Email:** ${PROFILE_INFO.email}\n• **Phone:** ${PROFILE_INFO.phone}\n• **GitHub:** [${PROFILE_INFO.github}](${PROFILE_INFO.github})\n• **LinkedIn:** [${PROFILE_INFO.linkedin}](${PROFILE_INFO.linkedin})\n• **Status:** Actively considering software developer opportunities.`,
        action: {
          label: 'Open Contact Form',
          action: () => openApp('contact'),
          appId: 'contact',
        },
      };
    }

    // Fallback search over projects
    const matchedProject = projects.find(
      p =>
        q.includes(p.title.toLowerCase()) ||
        p.technologies.some(t => q.includes(t.toLowerCase()))
    );

    if (matchedProject) {
      return {
        text: `**${matchedProject.title}** (${matchedProject.year})\n\n${matchedProject.short_description}\n\n• **Category:** ${matchedProject.category}\n• **Technologies:** ${matchedProject.technologies.join(', ')}\n• **Status:** ${matchedProject.status}`,
        action: {
          label: `Open ${matchedProject.title}`,
          action: () => openApp('projects'),
          appId: 'projects',
        },
      };
    }

    // Strict non-hallucination fallback
    return {
      text: `I don't have that specific information recorded in Abhishek's verified portfolio.\n\nYou can ask about the loaded projects, experience, technologies, education, resume, or command me to open a workstation application.`,
    };
  };

  const handleSendQuery = (textQuery: string) => {
    const trimmed = textQuery.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: trimmed,
      timestamp: 'Just now',
    };

    const retrieved = retrievePortfolioAnswer(trimmed);
    const aiMsg: Message = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      text: retrieved.text,
      timestamp: 'Just now',
      suggestedAction: retrieved.action,
    };

    setMessages(prev => [...prev, userMsg, aiMsg]);
    setInput('');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendQuery(input);
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Save to Notes application
  const saveToNotes = (msg: Message) => {
    try {
      const existingRaw = localStorage.getItem('ak_notes_app_data');
      const existing = existingRaw ? JSON.parse(existingRaw) : [];
      const newNote = {
        id: `note-ai-${Date.now()}`,
        title: `AI Note: ${msg.text.slice(0, 30)}...`,
        content: msg.text,
        category: 'Personal',
        updatedAt: 'Just now',
      };
      localStorage.setItem('ak_notes_app_data', JSON.stringify([newNote, ...existing]));
      setSavedNoteId(msg.id);
      setTimeout(() => setSavedNoteId(null), 2500);
    } catch (e) {
      console.error('Failed to save AI note:', e);
    }
  };

  const promptSuggestions = [
    'Summarize experience',
    'Show React and AI projects',
    'Explain KrishiMitra AI',
    'Compare projects',
    'What technologies are known?',
    'Write a cover letter',
    'Search portfolio for TypeScript',
    'Open his resume',
    'Open terminal',
  ];

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 select-none overflow-hidden font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Abhishek AI Copilot</span>
              <span className="px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono text-sky-400">
                Portfolio RAG + OS Agent
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Ground truth retrieval over verified portfolio credentials</p>
          </div>
        </div>

        {/* Voice status pill */}
        {speechSupported && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 border border-white/10 text-[11px]">
            <span
              className={`w-2 h-2 rounded-full ${
                isListening ? 'bg-rose-500 animate-pulse' : 'bg-slate-500'
              }`}
            />
            <span className="text-slate-300 font-mono text-[10px]">
              {isListening ? 'Listening...' : 'Voice Ready'}
            </span>
          </div>
        )}
      </div>

      {/* Chat messages viewport */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(msg => {
          const isAi = msg.sender === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                  isAi
                    ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-sm shadow-sky-500/20'
                    : 'bg-slate-800 text-slate-200'
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`flex flex-col space-y-2 p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isAi
                    ? 'bg-slate-900 border border-white/10 text-slate-200 shadow-sm'
                    : 'bg-sky-600 text-white shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap select-text">{msg.text}</div>

                {/* Suggested Action Pill */}
                {msg.suggestedAction && (
                  <div className="pt-2 border-t border-white/10">
                    <button
                      type="button"
                      onClick={msg.suggestedAction.action}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 font-bold border border-sky-500/30 transition-all active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 text-sky-400" />
                      <span>{msg.suggestedAction.label}</span>
                    </button>
                  </div>
                )}

                {/* Actions: Save to Notes, Copy */}
                {isAi && (
                  <div className="flex items-center gap-2 pt-1 border-t border-white/5 text-[11px] text-slate-400">
                    <button
                      type="button"
                      onClick={() => copyMessage(msg.id, msg.text)}
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      {copiedId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => saveToNotes(msg)}
                      className="flex items-center gap-1 hover:text-sky-300 transition-colors"
                    >
                      {savedNoteId === msg.id ? <Check className="w-3 h-3 text-emerald-400" /> : <StickyNote className="w-3 h-3" />}
                      <span>{savedNoteId === msg.id ? 'Saved to Notes' : 'Save to Notes'}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Queries Chips */}
      <div className="px-4 py-2 bg-slate-900/40 border-t border-white/5 overflow-x-auto no-scrollbar flex items-center gap-2 shrink-0">
        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 shrink-0">Try:</span>
        {promptSuggestions.map(prompt => (
          <button
            key={prompt}
            type="button"
            onClick={() => handleSendQuery(prompt)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/5 text-slate-300 hover:text-sky-300 text-[11px] whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleFormSubmit} className="p-3 bg-slate-900 border-t border-white/10 shrink-0 flex items-center gap-2">
        {speechSupported && (
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-xl transition-all ${
              isListening
                ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-500/30'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
            title={isListening ? 'Stop listening' : 'Voice Command (Mic)'}
          >
            {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>
        )}

        <div className="flex-1 flex items-center px-3 py-2 rounded-xl bg-slate-950 border border-white/10 focus-within:border-sky-500 transition-colors">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about projects, stack, experience, or give an OS command..."
            className="w-full bg-transparent text-slate-200 text-xs outline-none placeholder-slate-500"
          />
        </div>

        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20 transition-all active:scale-95 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
