import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { scoreResume } from '../api/aiApi';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import { FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

const ResumeScore = () => {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshCredits } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      const errorMsg = 'Resume text is required';
      setError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const payload = { resumeText: resumeText.trim() };
      if (targetRole.trim()) {
        payload.targetRole = targetRole.trim();
      }
      const res = await scoreResume(payload);

      console.log('RESUME SCORE API RESPONSE:', res);

      // Backend wraps: { success, message, data: { score, improvements, weaknesses, ... } }
      if (res.success) {
        toast.success('Resume scored successfully!');
        setResult(res.data);
        await refreshCredits(); // Refresh balance
      } else {
        const errorMsg = res.message || 'Scoring failed. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('ResumeScore API error:', err);
      if (err?.response?.status === 402) {
        toast.error('Insufficient credits for this action.');
        setError(
          <span>
            Insufficient credits. <Link to="/credits" className="text-primary-500 underline font-bold">Buy more here →</Link>
          </span>
        );
      } else {
        const errorMsg = err.message || 'Failed to connect to AI engine. Try again later.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">AI Resume Optimizer</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Instant deep-analysis of your resume.</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-900/20 px-4 py-2 rounded-2xl flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-100 dark:border-emerald-900/30 shadow-sm transition-colors">
          <Sparkles size={20} />
          <span>V4 Impact Engine</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-sm border border-gray-100 dark:border-gray-800 p-12 mb-8 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest transition-colors tracking-widest block mb-2 ml-1">Target Role (Optional)</label>
            <input
              type="text"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none text-gray-900 dark:text-white placeholder:text-gray-400"
              placeholder="e.g. Frontend Developer"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-3 ml-1">
              <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-widest transition-colors tracking-widest">Resume Full Text</label>
              <span className="text-xs text-gray-400 dark:text-gray-500 font-bold">{resumeText.length} Characters</span>
            </div>
            <textarea
              required
              rows={10}
              className="w-full px-8 py-6 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[32px] focus:border-emerald-500 focus:ring-8 focus:ring-emerald-500/5 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none resize-none leading-relaxed font-mono text-sm shadow-inner text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
              placeholder="Paste your resume contents..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="space-y-3">
            <Button type="submit" loading={loading} icon={Sparkles} fullWidth disabled={loading}>
              Analyze Performance
            </Button>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center font-medium">
              This In-depth Report will use <span className="text-primary-500 font-bold">4 credits</span>
            </p>
          </div>
        </form>
      </div>

      <ErrorMessage message={error} />

      {result && (
        <div className="space-y-10 animate-in slide-in-from-bottom-8 duration-700">

          {/* Score Ring */}
          <div className="bg-white dark:bg-gray-900 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col lg:flex-row transition-colors">
            <div className="lg:w-[35%] bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 dark:from-emerald-900 dark:via-emerald-950 dark:to-teal-950 p-16 text-white flex flex-col items-center justify-center text-center relative overflow-hidden transition-all duration-500">
              <span className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-6 z-10">Impact Vector</span>
              <div className="relative z-10">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-white/20" />
                  <circle
                    cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent"
                    strokeDasharray={552.92}
                    strokeDashoffset={552.92 * (1 - (result?.score || 0) / 100)}
                    strokeLinecap="round"
                    className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black tracking-tighter">{result?.score || 0}</span>
                  <span className="text-sm font-bold opacity-80 uppercase tracking-widest">/ 100</span>
                </div>
              </div>
            </div>

            <div className="lg:w-[65%] p-12 bg-white dark:bg-gray-900 transition-colors space-y-8">

              {/* Improvements */}
              {result?.improvements?.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <div className="w-2.5 h-8 bg-emerald-500 rounded-full" />
                    Critical Improvements
                  </h3>
                  <div className="space-y-3">
                    {result.improvements.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-900/30">
                        <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Weaknesses */}
              {result?.weaknesses?.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <div className="w-2.5 h-8 bg-red-500 rounded-full" />
                    Weaknesses
                  </h3>
                  <div className="space-y-3">
                    {result.weaknesses.map((item, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 bg-red-50/50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                        <FileText size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold leading-relaxed">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ATS Suggestions */}
              {result?.atsSuggestions?.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <div className="w-2.5 h-8 bg-blue-500 rounded-full" />
                    ATS Suggestions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.atsSuggestions.map((item, i) => (
                      <span key={i} className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Strengths */}
              {result?.strengths?.length > 0 && (
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                    <div className="w-2.5 h-8 bg-indigo-500 rounded-full" />
                    Strengths
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.strengths.map((item, i) => (
                      <span key={i} className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 text-xs font-bold px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeScore;
