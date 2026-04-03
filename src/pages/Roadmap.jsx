import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateRoadmap } from '../api/aiApi';
import { useAuth } from '../hooks/useAuth';
import { Map, Send, Sparkles, ChevronRight, Clock, AlertCircle, RefreshCw, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';

// ─────────────────────────────────────────────
// Tolerant field extractors — handles ANY AI shape
// ─────────────────────────────────────────────
const getPhaseTitle = (phase) =>
  phase?.phaseTitle || phase?.phase || phase?.title || phase?.name || 'Untitled Phase';

const getPhaseDuration = (phase) =>
  phase?.duration || phase?.timeframe || phase?.period || 'N/A';

const getPhaseItems = (phase) =>
  phase?.tasks || phase?.activities || phase?.steps || phase?.topics || [];

const getPhaseGoal = (phase) =>
  phase?.goal || phase?.objective || phase?.description || null;

const getPhaseSkills = (phase) =>
  phase?.skills || phase?.technologies || [];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
const Roadmap = () => {
  const [targetRole, setTargetRole] = useState('');
  const [currentSkills, setCurrentSkills] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('BEGINNER');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { refreshCredits } = useAuth();

  const validate = () => {
    if (!currentSkills.trim()) return 'Please enter your current skills';
    if (!targetRole.trim()) return 'Please enter your target role';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const vError = validate();
    if (vError) { 
      setError(vError); 
      toast.error(vError);
      return; 
    }

    setLoading(true);
    setError('');
    setRoadmap(null);

    try {
      const res = await generateRoadmap({
        currentSkills: currentSkills.trim(),
        targetRole: targetRole.trim(),
        experienceLevel,
      });

      // Debug: always log the raw response so issues are visible in console
      console.log('API RESPONSE:', res);

      // Backend wraps: { success, message, data: { title, summary, phases } }
      if (res.success) {
        toast.success('Roadmap generated successfully!');
        setRoadmap(res.data);
        await refreshCredits(); // Refresh balance after success
      } else {
        const errorMsg = res.message || 'Generation failed. Try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
      console.error('Roadmap API error:', err);
      // err is flattened by axiosInstance interceptor to { message, status, data }
      if (err.status === 402) {
        toast.error('Insufficient credits for this action.');
        setError(
          <span>
            Insufficient credits. <Link to="/credits" className="text-primary-500 underline font-bold">Buy more here →</Link>
          </span>
        );
      } else {
        const errorMsg = err.message || 'Failed to connect to AI service. Please check your connection and try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError('');
    setRoadmap(null);
  };

  return (
    <div className="space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-1">
            AI Career Roadmap
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            Strategic pathing based on your unique skills.
          </p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/30 shadow-sm">
          <Sparkles size={18} />
          <span>V2 Oracle Engine</span>
        </div>
      </div>

      {/* ── Input Form ── */}
      <div className="bg-white dark:bg-gray-900 rounded-[28px] shadow-sm border border-gray-100 dark:border-gray-800 p-8 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-end">

          {/* Current Skills */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Current Skills
            </label>
            <input
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-300 shadow-sm"
              placeholder="e.g. React, Java, SQL"
              value={currentSkills}
              onChange={(e) => setCurrentSkills(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Target Role */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Target Role
            </label>
            <input
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-300 shadow-sm"
              placeholder="e.g. Solution Architect"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {/* Experience Level */}
          <div className="space-y-1">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1">
              Current Level
            </label>
            <select
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:bg-white dark:focus:bg-gray-800 transition-all font-medium text-gray-700 dark:text-gray-300 shadow-sm"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              disabled={loading}
            >
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>

          {/* Submit */}
          <div className="lg:col-span-3 pt-2 space-y-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-primary-600 hover:bg-primary-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base rounded-2xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Generating Roadmap...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Build My Strategy
                </>
              )}
            </button>
            <p className="text-xs text-gray-400 dark:text-gray-500 text-center font-medium">
              This Strategic Roadmap will use <span className="text-primary-500 font-bold">5 credits</span>
            </p>
          </div>
        </form>
      </div>

      {/* ── Error State ── */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-5 flex items-start gap-4">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-red-700 dark:text-red-400 font-semibold">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm font-bold hover:underline flex-shrink-0"
          >
            <RefreshCw size={14} />
            Retry
          </button>
        </div>
      )}

      {/* ── Empty / Instruction State ── */}
      {!loading && !roadmap && !error && (
        <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-dashed border-gray-200 dark:border-gray-700 p-14 text-center transition-colors">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Map className="text-blue-500" size={28} />
          </div>
          <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
            Your Roadmap Will Appear Here
          </h3>
          <p className="text-gray-400 dark:text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
            Fill in your skills and target role above, then click <strong>Build My Strategy</strong> to generate a personalised career path.
          </p>
        </div>
      )}

      {/* ── Loading State ── */}
      {loading && (
        <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 p-14 flex flex-col items-center gap-5 transition-colors">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-blue-100 dark:border-blue-900/40" />
            <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin absolute inset-0" />
          </div>
          <div className="text-center">
            <p className="text-gray-900 dark:text-white font-bold text-lg">Generating your roadmap...</p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              The AI is crafting a personalised strategy for you
            </p>
          </div>
        </div>
      )}

      {/* ── Roadmap Result ── */}
      {!loading && roadmap && roadmap.title && (
        <div className="space-y-6">

          {/* Summary Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-[28px] p-8 shadow-xl shadow-blue-500/20 text-white">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-blue-200 text-sm font-semibold mb-2 uppercase tracking-wider">
                  <Map size={14} />
                  Career Roadmap
                </div>
                <h2 className="text-3xl font-black tracking-tight mb-3">{roadmap.title}</h2>
                {roadmap.summary && (
                  <p className="text-blue-100 leading-relaxed text-base">{roadmap.summary}</p>
                )}
              </div>
              {roadmap.estimatedDuration && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-5 py-3 text-center flex-shrink-0">
                  <Clock size={18} className="mx-auto mb-1 text-blue-200" />
                  <p className="text-xs text-blue-200 font-medium">Estimated</p>
                  <p className="text-white font-bold text-sm">{roadmap.estimatedDuration}</p>
                </div>
              )}
            </div>
          </div>

          {/* Phases Header */}
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-blue-500/30">
              <BookOpen className="text-white" size={15} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">
              {roadmap?.phases?.length || 0} Phase{roadmap?.phases?.length !== 1 ? 's' : ''}
            </h3>
          </div>

          {/* Phase Cards */}
          {roadmap?.phases?.length > 0 ? (
            <div className="relative ml-4 space-y-6">
              {/* Timeline line */}
              <div className="absolute left-0 top-6 bottom-6 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full opacity-30" />

              {roadmap.phases.map((phase, idx) => {
                const title  = getPhaseTitle(phase);
                const dur    = getPhaseDuration(phase);
                const items  = getPhaseItems(phase);
                const goal   = getPhaseGoal(phase);
                const skills = getPhaseSkills(phase);

                return (
                  <div key={idx} className="relative pl-10 group">
                    {/* Timeline dot */}
                    <div className="absolute -left-[5px] top-5 w-4 h-4 bg-white dark:bg-gray-950 border-4 border-blue-500 rounded-full z-10 group-hover:scale-125 transition-transform duration-300 shadow-sm" />

                    <div className="bg-white dark:bg-gray-900 rounded-[24px] p-7 border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-900/60 hover:shadow-xl transition-all duration-300">

                      {/* Phase Header */}
                      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                        <div>
                          <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1 block">
                            Phase {idx + 1}
                          </span>
                          <h4 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                            {title}
                          </h4>
                          {goal && (
                            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 leading-relaxed">
                              {goal}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0">
                          <Clock size={12} />
                          {dur}
                        </div>
                      </div>

                      {/* Skills Tags */}
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-5">
                          {skills.map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100 dark:border-indigo-900/40"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Tasks / Activities */}
                      {items.length > 0 ? (
                        <div className="space-y-2.5">
                          {items.map((item, iIdx) => (
                            <div
                              key={iIdx}
                              className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 p-3.5 rounded-xl border border-gray-100 dark:border-gray-700 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors"
                            >
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <ChevronRight className="text-blue-600 dark:text-blue-400" size={13} />
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm font-medium leading-relaxed">
                                {typeof item === 'string' ? item : JSON.stringify(item)}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 dark:text-gray-500 text-sm italic">
                          No tasks listed for this phase.
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-900 rounded-[28px] border border-gray-100 dark:border-gray-800 p-10 text-center">
              <p className="text-gray-400 dark:text-gray-500 font-medium">
                No phases available in this roadmap.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Roadmap;
