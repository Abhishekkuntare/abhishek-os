import React, { useState } from 'react';
import {
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  Download,
  Clock,
  Database,
  History,
  Code2,
  FolderOpen,
  Sparkles,
  Layers,
  Globe,
  AlertCircle,
} from 'lucide-react';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface KeyValueItem {
  id: string;
  key: string;
  value: string;
  enabled: boolean;
}

interface RequestHistoryItem {
  id: string;
  method: HttpMethod;
  url: string;
  status: number;
  timeMs: number;
  timestamp: string;
}

const PRESET_REQUESTS = [
  {
    name: 'GitHub Profile (Abhishek)',
    method: 'GET' as HttpMethod,
    url: 'https://api.github.com/users/abhishekkuntare',
    headers: [{ id: '1', key: 'Accept', value: 'application/vnd.github.v3+json', enabled: true }],
  },
  {
    name: 'GitHub Repositories',
    method: 'GET' as HttpMethod,
    url: 'https://api.github.com/users/abhishekkuntare/repos?per_page=5',
    headers: [{ id: '1', key: 'Accept', value: 'application/vnd.github.v3+json', enabled: true }],
  },
  {
    name: 'JSONPlaceholder (Sample Post)',
    method: 'GET' as HttpMethod,
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    headers: [],
  },
  {
    name: 'Create Post (JSONPlaceholder)',
    method: 'POST' as HttpMethod,
    url: 'https://jsonplaceholder.typicode.com/posts',
    headers: [{ id: '1', key: 'Content-Type', value: 'application/json', enabled: true }],
    body: JSON.stringify(
      {
        title: 'Abhishek OS Production Release',
        body: 'Interactive developer workstation running full-stack React 19 + TypeScript.',
        userId: 1,
      },
      null,
      2
    ),
  },
];

export const ApiTesterApp: React.FC = () => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [url, setUrl] = useState<string>('https://api.github.com/users/abhishekkuntare');
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth'>('params');

  // Request configs
  const [params, setParams] = useState<KeyValueItem[]>([
    { id: 'p1', key: '', value: '', enabled: true },
  ]);
  const [headers, setHeaders] = useState<KeyValueItem[]>([
    { id: 'h1', key: 'Accept', value: 'application/json', enabled: true },
    { id: 'h2', key: 'User-Agent', value: 'AbhishekOS-Client/3.0', enabled: true },
  ]);
  const [bodyContent, setBodyContent] = useState<string>('{\n  "client": "Abhishek OS API Lab",\n  "version": "3.0"\n}');
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'apikey'>('none');
  const [bearerToken, setBearerToken] = useState<string>('');

  // Response state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState<string>('');
  const [responseTime, setResponseTime] = useState<number | null>(null);
  const [responseSize, setResponseSize] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [responseHeaders, setResponseHeaders] = useState<Record<string, string>>({});
  const [responseTab, setResponseTab] = useState<'pretty' | 'raw' | 'headers'>('pretty');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedResponse, setCopiedResponse] = useState<boolean>(false);

  // History state
  const [history, setHistory] = useState<RequestHistoryItem[]>([
    {
      id: 'h-init',
      method: 'GET',
      url: 'https://api.github.com/users/abhishekkuntare',
      status: 200,
      timeMs: 142,
      timestamp: 'Today, 10:30 AM',
    },
  ]);

  const handleSend = async () => {
    if (!url.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setResponseStatus(null);
    setResponseData(null);

    // Build URL with params
    let finalUrl = url.trim();
    const activeParams = params.filter(p => p.enabled && p.key.trim());
    if (activeParams.length > 0) {
      const urlObj = new URL(finalUrl.startsWith('http') ? finalUrl : `https://${finalUrl}`);
      activeParams.forEach(p => urlObj.searchParams.set(p.key, p.value));
      finalUrl = urlObj.toString();
    }

    // Build headers
    const reqHeaders: Record<string, string> = {};
    headers.filter(h => h.enabled && h.key.trim()).forEach(h => {
      reqHeaders[h.key] = h.value;
    });

    if (authType === 'bearer' && bearerToken.trim()) {
      reqHeaders['Authorization'] = `Bearer ${bearerToken.trim()}`;
    }

    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method,
        headers: reqHeaders,
      };

      if (['POST', 'PUT', 'PATCH'].includes(method) && bodyContent.trim()) {
        options.body = bodyContent;
      }

      const res = await fetch(finalUrl, options);
      const endTime = performance.now();
      const elapsed = Math.round(endTime - startTime);

      setResponseStatus(res.status);
      setResponseStatusText(res.statusText || (res.status === 200 ? 'OK' : ''));
      setResponseTime(elapsed);

      // Collect headers
      const resHeaderMap: Record<string, string> = {};
      res.headers.forEach((val, key) => {
        resHeaderMap[key] = val;
      });
      setResponseHeaders(resHeaderMap);

      const text = await res.text();
      setResponseSize(`${(new Blob([text]).size / 1024).toFixed(2)} KB`);

      try {
        const json = JSON.parse(text);
        setResponseData(JSON.stringify(json, null, 2));
      } catch {
        setResponseData(text);
      }

      // Add to history
      const newHistoryEntry: RequestHistoryItem = {
        id: `req-${Date.now()}`,
        method,
        url: finalUrl,
        status: res.status,
        timeMs: elapsed,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setHistory(prev => [newHistoryEntry, ...prev.slice(0, 19)]);
    } catch (err: any) {
      const endTime = performance.now();
      setResponseTime(Math.round(endTime - startTime));
      setResponseStatus(0);
      setResponseStatusText('Network Error');
      setErrorMessage(
        err.message?.includes('Failed to fetch')
          ? 'Network / CORS Error: The target server did not return CORS headers (Access-Control-Allow-Origin). In modern browsers, cross-origin requests require the remote API to permit CORS.'
          : err.message || 'Request failed'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (preset: (typeof PRESET_REQUESTS)[0]) => {
    setMethod(preset.method);
    setUrl(preset.url);
    if (preset.headers) {
      setHeaders(preset.headers);
    }
    if (preset.body) {
      setBodyContent(preset.body);
    }
  };

  const copyResponseText = () => {
    if (!responseData) return;
    navigator.clipboard?.writeText(responseData);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 2000);
  };

  const downloadResponse = () => {
    if (!responseData) return;
    const blob = new Blob([responseData], { type: 'application/json' });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `response_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-950 text-slate-200 select-none overflow-hidden font-sans">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-sm shadow-amber-500/20">
            <Send className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">Abhishek API Lab</span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                REST Client
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Developer HTTP workbench with real-time response inspection</p>
          </div>
        </div>

        {/* Preset Collections Menu */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 hidden sm:inline">Presets:</span>
          {PRESET_REQUESTS.map(p => (
            <button
              key={p.name}
              type="button"
              onClick={() => loadPreset(p)}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] font-medium transition-colors"
            >
              {p.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Request Form & Omnibar */}
      <div className="p-3 bg-slate-900/60 border-b border-white/10 shrink-0 space-y-3">
        <div className="flex items-center gap-2">
          {/* Method Selector */}
          <select
            value={method}
            onChange={e => setMethod(e.target.value as HttpMethod)}
            className={`px-3 py-2 rounded-xl font-bold font-mono text-xs border outline-hidden transition-all cursor-pointer ${
              method === 'GET'
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : method === 'POST'
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : method === 'PUT'
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : method === 'PATCH'
                ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                : 'bg-rose-500/20 border-rose-500/40 text-rose-300'
            }`}
          >
            <option value="GET" className="bg-slate-900 text-emerald-400">GET</option>
            <option value="POST" className="bg-slate-900 text-sky-400">POST</option>
            <option value="PUT" className="bg-slate-900 text-amber-400">PUT</option>
            <option value="PATCH" className="bg-slate-900 text-purple-400">PATCH</option>
            <option value="DELETE" className="bg-slate-900 text-rose-400">DELETE</option>
          </select>

          {/* URL Input */}
          <div className="flex-1 flex items-center px-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 focus-within:border-sky-500 transition-colors">
            <Globe className="w-4 h-4 text-slate-500 mr-2 shrink-0" />
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://api.example.com/v1/endpoint"
              className="w-full bg-transparent text-slate-200 font-mono text-xs outline-hidden placeholder-slate-600"
            />
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !url.trim()}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-bold text-xs shadow-md shadow-sky-500/20 transition-all active:scale-95 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Sending...' : 'Send'}</span>
          </button>
        </div>

        {/* Sub-tabs: Params, Headers, Body, Auth */}
        <div className="flex items-center gap-1 border-b border-white/5 pb-1">
          {(['params', 'headers', 'body', 'auth'] as const).map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-slate-800 text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Center Layout: Request Configuration & Response Inspector */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Sub-Panel: Request Config (Params / Headers / Body / Auth) */}
        <div className="w-full md:w-1/2 border-r border-white/10 flex flex-col bg-slate-950 overflow-y-auto p-3">
          {activeTab === 'params' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Query Parameters</span>
                <button
                  type="button"
                  onClick={() => setParams(prev => [...prev, { id: `p-${Date.now()}`, key: '', value: '', enabled: true }])}
                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Param
                </button>
              </div>
              {params.map((p, idx) => (
                <div key={p.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={p.enabled}
                    onChange={e => {
                      const updated = [...params];
                      updated[idx].enabled = e.target.checked;
                      setParams(updated);
                    }}
                    className="accent-sky-500 rounded"
                  />
                  <input
                    type="text"
                    value={p.key}
                    onChange={e => {
                      const updated = [...params];
                      updated[idx].key = e.target.value;
                      setParams(updated);
                    }}
                    placeholder="Key"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 outline-hidden focus:border-sky-500"
                  />
                  <input
                    type="text"
                    value={p.value}
                    onChange={e => {
                      const updated = [...params];
                      updated[idx].value = e.target.value;
                      setParams(updated);
                    }}
                    placeholder="Value"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 outline-hidden focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setParams(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'headers' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Request Headers</span>
                <button
                  type="button"
                  onClick={() => setHeaders(prev => [...prev, { id: `h-${Date.now()}`, key: '', value: '', enabled: true }])}
                  className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Header
                </button>
              </div>
              {headers.map((h, idx) => (
                <div key={h.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={h.enabled}
                    onChange={e => {
                      const updated = [...headers];
                      updated[idx].enabled = e.target.checked;
                      setHeaders(updated);
                    }}
                    className="accent-sky-500 rounded"
                  />
                  <input
                    type="text"
                    value={h.key}
                    onChange={e => {
                      const updated = [...headers];
                      updated[idx].key = e.target.value;
                      setHeaders(updated);
                    }}
                    placeholder="Header Key"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 outline-hidden focus:border-sky-500"
                  />
                  <input
                    type="text"
                    value={h.value}
                    onChange={e => {
                      const updated = [...headers];
                      updated[idx].value = e.target.value;
                      setHeaders(updated);
                    }}
                    placeholder="Header Value"
                    className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs font-mono text-slate-200 outline-hidden focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setHeaders(prev => prev.filter((_, i) => i !== idx))}
                    className="p-1 rounded text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'body' && (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Raw JSON Body</span>
                <span className="font-mono text-[11px] text-sky-400">Content-Type: application/json</span>
              </div>
              <textarea
                value={bodyContent}
                onChange={e => setBodyContent(e.target.value)}
                rows={12}
                className="w-full flex-1 p-3 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-slate-200 focus:outline-none focus:border-sky-500 resize-none leading-relaxed"
              />
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">Authentication Method</div>
              <div className="flex items-center gap-2">
                {(['none', 'bearer', 'apikey'] as const).map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAuthType(type)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                      authType === type ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {type === 'none' ? 'No Auth' : type === 'bearer' ? 'Bearer Token' : 'API Key'}
                  </button>
                ))}
              </div>

              {authType === 'bearer' && (
                <div className="space-y-2">
                  <label className="text-xs text-slate-300 font-medium">Bearer Token</label>
                  <input
                    type="password"
                    value={bearerToken}
                    onChange={e => setBearerToken(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 font-mono text-xs text-slate-200 outline-none focus:border-sky-500"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Sub-Panel: Response Inspector */}
        <div className="w-full md:w-1/2 flex flex-col bg-slate-900/30 overflow-y-auto">
          {/* Response Status Bar */}
          <div className="px-4 py-2.5 bg-slate-900 border-b border-white/10 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Response</span>
              {responseStatus !== null && (
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-bold font-mono ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : responseStatus >= 400
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {responseStatus} {responseStatusText}
                  </span>
                  {responseTime !== null && (
                    <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-sky-400" />
                      {responseTime} ms
                    </span>
                  )}
                  {responseSize && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {responseSize}
                    </span>
                  )}
                </div>
              )}
            </div>

            {responseData && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyResponseText}
                  className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  {copiedResponse ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedResponse ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  type="button"
                  onClick={downloadResponse}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                  title="Download JSON"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* Response Payload Viewer */}
          <div className="flex-1 p-3 overflow-y-auto">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-slate-400 text-xs">
                <div className="w-8 h-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin mb-3" />
                <span>Dispatching HTTP request...</span>
              </div>
            ) : errorMessage ? (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>Request Error</span>
                </div>
                <p className="leading-relaxed">{errorMessage}</p>
              </div>
            ) : responseData ? (
              <pre className="font-mono text-[11px] leading-relaxed text-slate-200 bg-slate-950 p-4 rounded-xl border border-white/5 overflow-x-auto select-text">
                {responseData}
              </pre>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs space-y-2">
                <Database className="w-8 h-8 text-slate-600 mb-1" />
                <p className="font-semibold text-slate-400">No response payload yet</p>
                <p className="text-[11px] max-w-xs">
                  Enter an API endpoint and click Send, or click one of the preset requests above to inspect response data.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
