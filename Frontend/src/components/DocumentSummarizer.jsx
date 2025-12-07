import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FileUpload from './FileUpload';
import TextInput from './TextInput';
import SummaryResults from './SummaryResults';
import { FileText, Type, Sparkles } from 'lucide-react';
import { summarizeContent, healthCheck } from '../services/api';

// Professional, minimal hero + subtle motion. Uses Tailwind utility classes and Framer Motion for smooth, lightweight animations.
export default function DocumentSummarizer() {
  const [inputMode, setInputMode] = useState('file');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    let mounted = true;
    const checkBackend = async () => {
      try {
        await healthCheck();
        if (!mounted) return;
        setBackendStatus('online');
      } catch (err) {
        if (!mounted) return;
        setBackendStatus('offline');
        setError('Backend server is not running. Please start the FastAPI server on http://localhost:8000');
      }
    };

    checkBackend();
    return () => { mounted = false; };
  }, []);

  const handleSummarize = async (content, files) => {
    if (backendStatus === 'offline') {
      setError('Backend server is not available. Please start the server first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setSummary(null);

    try {
      const result = await summarizeContent(content, files);
      setSummary(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during summarization');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6 lg:px-12">

      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Left: Text */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm border border-gray-100">
                <Sparkles className="w-5 h-5 text-sky-600" />
                <span className="text-sm font-medium text-slate-700">Easy Summarization</span>
              </div>

              <h1 className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Multi-Document Summarize.
              </h1>

              <p className="mt-4 text-lg text-slate-600 max-w-2xl">
                Upload multiple documents or paste text and get a clean, actionable summary with key points, highlights, and recommended next steps.
              </p>

              {/* CTA + status */}
              <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setInputMode('file')}
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
                      inputMode === 'file' ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                    Upload Files
                  </button>

                  <button
                    onClick={() => setInputMode('text')}
                    className={`inline-flex items-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 shadow-sm ${
                      inputMode === 'text' ? 'bg-sky-600 text-white' : 'bg-white border border-gray-200 text-slate-700 hover:bg-gray-50'
                    }`}
                  >
                    <Type className="w-4 h-4" />
                    Enter Text
                  </button>
                </div>

                <div className="mt-3 sm:mt-0 sm:ml-4">
                  <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
                    backendStatus === 'online' ? 'bg-emerald-50 text-emerald-700' : backendStatus === 'offline' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      backendStatus === 'online' ? 'bg-emerald-600' : backendStatus === 'offline' ? 'bg-rose-600' : 'bg-amber-500 animate-pulse'
                    }`} />
                    <span className="whitespace-nowrap">
                      {backendStatus === 'online' && 'Server online'}
                      {backendStatus === 'offline' && 'Server offline'}
                      {backendStatus === 'checking' && 'Checking…'}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Illustration */}
          <motion.div
            className="flex-1 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Professional, neutral illustration composed with SVG shapes. Replace src with your vector/PNG if you have one. */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-start gap-6">
                <div className="flex-1">
                  <svg viewBox="0 0 480 320" className="w-full h-auto" role="img" aria-label="Illustration showing documents and insights">
                    <defs>
                      <linearGradient id="g1" x1="0" x2="1">
                        <stop offset="0%" stopColor="#EFF6FF" />
                        <stop offset="100%" stopColor="#ECFDF5" />
                      </linearGradient>
                      <linearGradient id="g2" x1="0" x2="1">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#34D399" />
                      </linearGradient>
                      <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.06" />
                      </filter>
                    </defs>

                    <rect x="8" y="8" width="464" height="304" rx="18" fill="url(#g1)" />

                    {/* Document stack */}
                    <g transform="translate(44,46)" filter="url(#soft)">
                      <rect x="200" y="-8" width="196" height="136" rx="10" fill="#fff" stroke="#E6EDF3" />
                      <rect x="192" y="16" width="36" height="8" rx="3" fill="#E6EEF9" />
                      <rect x="236" y="16" width="120" height="8" rx="3" fill="#F8FAFC" />
                      <rect x="236" y="36" width="160" height="8" rx="3" fill="#F8FAFC" />
                      <rect x="236" y="56" width="110" height="8" rx="3" fill="#F8FAFC" />

                      <rect x="6" y="22" width="180" height="120" rx="8" fill="url(#g2)" opacity="0.12" />
                      <rect x="12" y="28" width="92" height="8" rx="4" fill="#fff" />
                      <rect x="12" y="46" width="140" height="8" rx="4" fill="#fff" />
                      <circle cx="80" cy="96" r="28" fill="#fff" opacity="0.95" />
                    </g>

                    {/* Insight badge */}
                    <g transform="translate(320,200)">
                      <rect x="0" y="0" width="120" height="56" rx="12" fill="#fff" stroke="#E6EDF3" />
                      <text x="14" y="22" fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto" fontSize="12" fill="#0f172a" fontWeight="600">Key Insights</text>
                      <text x="14" y="40" fontFamily="Inter, system-ui, -apple-system, 'Segoe UI', Roboto" fontSize="11" fill="#475569">3 highlights • 1 action</text>
                    </g>

                  </svg>
                </div>

                {/* Compact panel with short bullets */}
                <div className="w-40">
                  <div className="text-sm font-semibold text-slate-800">What you get</div>
                  <ul className="mt-3 text-sm text-slate-600 space-y-2">
                    <li>• Executive summary</li>
                    <li>• Key highlights</li>
                    <li>• Actionable bullets</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* small caption */}
            <p className="mt-3 text-xs text-slate-500">Designed for clarity — fast, private, and production-ready.</p>
          </motion.div>
        </div>

        {/* Card container */}
        <div className="mt-10 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-6">
          <div className="max-w-4xl mx-auto">
            {/* Input area */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-6">
                {inputMode === 'file' ? (
                  <FileUpload onSummarize={handleSummarize} isLoading={isLoading} />
                ) : (
                  <TextInput onSummarize={handleSummarize} isLoading={isLoading} />
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="mt-6 bg-rose-50 border border-rose-100 rounded-lg p-4">
                  <div className="text-rose-800 font-medium">{error}</div>
                </div>
              )}

              {/* Results */}
              {summary && (
                <div className="mt-6">
                  <SummaryResults summary={summary} />
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
