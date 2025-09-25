import React, { useState } from 'react';
import FileUpload from './FileUpload';
import TextInput from './TextInput';
import SummaryResults from './SummaryResults';
import { FileText, Type, Sparkles } from 'lucide-react';
import { summarizeContent, healthCheck } from '../services/api';

export default function DocumentSummarizer() {
  const [inputMode, setInputMode] = useState('file');
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState('checking');

  // Check backend status on component mount
  React.useEffect(() => {
    const checkBackend = async () => {
      try {
        await healthCheck();
        setBackendStatus('online');
      } catch (err) {
        setBackendStatus('offline');
        setError('Backend server is not running. Please start the FastAPI server on http://localhost:8000');
      }
    };
    
    checkBackend();
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
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-emerald-600 p-3 rounded-2xl">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Multi Document Summarizer
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Transform lengthy documents and text into concise summaries with key insights. 
          Upload files or paste text to get started.
        </p>
        
        {/* Backend Status Indicator */}
        <div className="mt-4 flex items-center justify-center">
          <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            backendStatus === 'online' 
              ? 'bg-green-100 text-green-800' 
              : backendStatus === 'offline'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              backendStatus === 'online' 
                ? 'bg-green-600' 
                : backendStatus === 'offline'
                ? 'bg-red-600'
                : 'bg-yellow-600 animate-pulse'
            }`}></div>
            {backendStatus === 'online' && 'Server Online'}
            {backendStatus === 'offline' && 'Server Offline'}
            {backendStatus === 'checking' && 'Checking Server...'}
          </div>
        </div>
      </div>

      {/* Input Mode Toggle */}
      <div className="max-w-md mx-auto mb-8">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setInputMode('file')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                inputMode === 'file'
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <FileText className="w-4 h-4" />
              Upload Files
            </button>
            <button
              onClick={() => setInputMode('text')}
              className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                inputMode === 'text'
                  ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <Type className="w-4 h-4" />
              Enter Text
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {inputMode === 'file' ? (
            <FileUpload onSummarize={handleSummarize} isLoading={isLoading} />
          ) : (
            <TextInput onSummarize={handleSummarize} isLoading={isLoading} />
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center">
              <div className="bg-red-100 rounded-full p-2 mr-3">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              </div>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {summary && (
          <div className="mt-8">
            <SummaryResults summary={summary} />
          </div>
        )}
      </div>
    </div>
  );
}