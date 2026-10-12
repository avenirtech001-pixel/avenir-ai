import React, { useState } from 'react';
import { useCodex } from '../../context/CodexContext';
import { Key, CheckCircle, AlertCircle, ExternalLink, X, ShieldCheck } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ApiKeyModal: React.FC<Props> = ({ onClose }) => {
  const { apiKey, setApiKey, hasEnvKey, selectedModel } = useCodex();
  const [inputVal, setInputVal] = useState(apiKey);
  const [testingStatus, setTestingStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSave = async () => {
    setTestingStatus('testing');
    setErrorMsg('');

    try {
      // Test the API key with a ping request to /api/agent/chat
      const res = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'ping test key',
          model: selectedModel,
          customApiKey: inputVal.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setApiKey(inputVal.trim());
        setTestingStatus('success');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setTestingStatus('error');
        setErrorMsg(data.message || 'Verification failed. Please verify key format.');
      }
    } catch (err: any) {
      setTestingStatus('error');
      setErrorMsg(err.message || 'Network error verifying key.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12151c] border border-zinc-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Key className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-zinc-100">Gemini AI API Configuration</h3>
              <p className="text-xs text-zinc-400">Connect your Gemini API key to power Codex</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {hasEnvKey && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex items-start gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              <div>
                <span className="font-semibold">System API Key Detected:</span> An API key is already configured in the server environment. You can enter an override key below or leave blank to use the default.
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="w-full bg-[#0a0c10] border border-zinc-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 font-mono outline-none transition-all placeholder:text-zinc-600"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1.5">
              Your key is transmitted securely to your local backend session only.
            </p>
          </div>

          <div className="p-3 bg-zinc-900/60 border border-zinc-800/80 rounded-xl text-xs space-y-1.5 text-zinc-400">
            <div className="flex items-center justify-between">
              <span className="text-zinc-300 font-medium">Need an API Key?</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium text-[11px]"
              >
                <span>Get Gemini Key</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Google AI Studio provides free Gemini 3.8 Flash & Gemini 3.1 Pro API keys for coding and autonomous tool execution.
            </p>
          </div>

          {testingStatus === 'error' && (
            <div className="p-3 bg-rose-950/30 border border-rose-800/50 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {testingStatus === 'success' && (
            <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
              <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>API key validated! Connecting Codex engine...</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-zinc-900/40 border-t border-zinc-800/80 flex items-center justify-between">
          <button
            onClick={() => {
              setApiKey('');
              setInputVal('');
            }}
            className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            Clear Key
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={testingStatus === 'testing'}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm shadow-emerald-900/40 transition-all disabled:opacity-50"
            >
              {testingStatus === 'testing' ? 'Verifying...' : 'Save & Connect'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
