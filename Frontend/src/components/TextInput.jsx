import React, { useState } from 'react';
import { Type } from 'lucide-react';

export default function TextInput({ onSummarize, isLoading }) {
  const [text, setText] = useState('');

  const handleSummarize = async () => {
    if (text.trim()) {
      await onSummarize(text.trim());
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <div className="bg-blue-100 p-3 rounded-xl mr-4">
          <Type className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-900">Enter Text</h3>
          <p className="text-gray-600">Paste or type your content below</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Content to Summarize
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter your text here... You can paste articles, documents, or any content you want to summarize."
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
          />
          <div className="mt-2 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {text.length} characters
            </p>
            {text.length > 0 && (
              <p className="text-sm text-gray-500">
                ~{Math.ceil(text.split(' ').length)} words
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleSummarize}
            disabled={!text.trim() || isLoading}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Summary...</span>
              </div>
            ) : (
              'Generate Summary'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}