import React from 'react';
import { Key, FileText, Copy, Check } from 'lucide-react';

export default function SummaryResults({ summary }) {
  const [copiedSection, setCopiedSection] = React.useState('');

  const copyToClipboard = async (text, section) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(''), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
          <Check className="w-4 h-4 mr-2" />
          Summary Generated Successfully
        </div>
      </div>

      {/* Key Points */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-emerald-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Key className="w-6 h-6 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">Key Points</h2>
            </div>
            <button
              onClick={() => copyToClipboard(summary.keyPoints.join('\n• '), 'keyPoints')}
              className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              {copiedSection === 'keyPoints' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="p-8">
          <ul className="space-y-4">
            {summary.keyPoints.map((point, index) => (
              <li key={index} className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-full flex items-center justify-center mr-4 mt-1">
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                </div>
                <p className="text-gray-800 leading-relaxed">{point}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Full Summary */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="w-6 h-6 text-white mr-3" />
              <h2 className="text-2xl font-bold text-white">Full Summary</h2>
            </div>
            <button
              onClick={() => copyToClipboard(summary.summary, 'summary')}
              className="flex items-center space-x-2 bg-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-colors"
            >
              {copiedSection === 'summary' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>
        <div className="p-8">
          <div className="prose prose-lg max-w-none">
            {summary.summary.split('\n').map((paragraph, index) => (
              paragraph.trim() && (
                <p key={index} className="text-gray-800 leading-relaxed mb-4">
                  {paragraph}
                </p>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      {summary.statistics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {summary.statistics.originalLength}
            </div>
            <div className="text-gray-600">Original Characters</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {summary.statistics.summaryLength}
            </div>
            <div className="text-gray-600">Summary Characters</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {Math.round(summary.statistics.compressionRatio)}%
            </div>
            <div className="text-gray-600">Compression Ratio</div>
          </div>
        </div>
      )}
    </div>
  );
}