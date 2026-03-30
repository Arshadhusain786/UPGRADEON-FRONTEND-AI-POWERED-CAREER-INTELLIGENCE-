import React, { useState } from 'react';
import { analyzeSkillGap } from '../api/aiApi';
import ErrorMessage from '../components/ErrorMessage';
import Input from '../components/Input';
import Button from '../components/Button';
import { Target, CheckCircle2, AlertTriangle, Sparkles, Plus, X } from 'lucide-react';

const SkillGap = () => {
  const [targetRole, setTargetRole] = useState('');
  const [skillInput, setSkillInput] = useState('');
  const [currentSkills, setCurrentSkills] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addSkill = () => {
    if (skillInput.trim() && !currentSkills.includes(skillInput.trim())) {
      setCurrentSkills([...currentSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setCurrentSkills(currentSkills.filter(s => s !== skill));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (currentSkills.length === 0) return setError('Please add at least one skill');
    if (!targetRole.trim()) return setError('Target role is required');
    
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await analyzeSkillGap({ 
        currentSkills: currentSkills.join(", "), 
        targetRole: targetRole.trim()
      });

      console.log("SKILL GAP API RESPONSE:", res.data);

      // Backend wraps: { success, message, data: { missingSkills, strengths, recommendations } }
      const raw = res?.data?.data;

      if (!raw) {
        setError("No data received from AI engine");
        return;
      }

      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      setResult(parsed);
    } catch (err) {
      console.error('SkillGap API error:', err);
      setError(err?.response?.data?.message || 'Error connecting to AI service. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 transition-colors duration-300">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Skill Gap Analysis</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Delta measurement vs industry standards.</p>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-900/20 px-4 py-2 rounded-2xl flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-100 dark:border-indigo-900/30 shadow-sm transition-colors duration-300">
          <Sparkles size={20} />
          <span>V3 Precision Engine</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 p-10 transition-colors duration-300">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input
              label="Target Role"
              placeholder="e.g. Senior Software Architect"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              disabled={loading}
            />
            <div className="space-y-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 ml-1 transition-colors">Current Skills</label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 focus:bg-white dark:focus:bg-gray-800 transition-all outline-none font-medium text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-sm"
                  placeholder="Type a skill and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="p-3 bg-primary-600 text-white rounded-2xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
                >
                  <Plus size={24} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {currentSkills.map(skill => (
              <span key={skill} className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-bold flex items-center space-x-2 border border-gray-200 dark:border-gray-700 transition-colors">
                <span>{skill}</span>
                <button type="button" onClick={() => removeSkill(skill)} className="hover:text-red-500 dark:hover:text-red-400 transition-colors">
                  <X size={14} />
                </button>
              </span>
            ))}
            {currentSkills.length === 0 && <p className="text-gray-400 dark:text-gray-500 text-sm italic ml-1">No skills added yet.</p>}
          </div>

          <Button type="submit" loading={loading} icon={Target} fullWidth disabled={loading}>
            Run Critical Analysis
          </Button>
        </form>
      </div>

      <ErrorMessage message={error} />

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-in slide-in-from-bottom-8 duration-700">
          <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-xl border border-emerald-50 dark:border-emerald-900/20 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-emerald-500 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white">
                <CheckCircle2 size={24} />
                <h3 className="text-xl font-black uppercase tracking-wider transition-colors">Strengths</h3>
              </div>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-3">
                {result?.strengths && Array.isArray(result.strengths) && result.strengths.length > 0 ? result.strengths.map((skill, i) => (
                  <span key={i} className="px-5 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm font-black border border-emerald-100 dark:border-emerald-900/30 shadow-sm transition-colors">
                    {skill}
                  </span>
                )) : null}
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-xl border border-red-50 dark:border-red-900/20 overflow-hidden transform hover:-translate-y-1 transition-all duration-300">
            <div className="bg-red-500 px-8 py-6 flex items-center justify-between">
              <div className="flex items-center space-x-3 text-white">
                <AlertTriangle size={24} />
                <h3 className="text-xl font-black uppercase tracking-wider transition-colors">Missing Skills</h3>
              </div>
            </div>
            <div className="p-8">
              <div className="flex flex-wrap gap-3">
                {result?.missingSkills && Array.isArray(result.missingSkills) && result.missingSkills.length > 0 ? result.missingSkills.map((skill, i) => (
                  <span key={i} className="px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-2xl text-sm font-black border border-red-100 dark:border-red-900/30 shadow-sm transition-colors">
                    {skill}
                  </span>
                )) : null}
              </div>
            </div>
          </div>

          {result?.recommendations && (
            <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-primary-800 dark:from-indigo-900 dark:to-primary-950 rounded-[32px] shadow-2xl p-12 text-white relative overflow-hidden transition-all duration-500">
              <div className="relative z-10">
                <h3 className="text-3xl font-black mb-8 flex items-center space-x-3">
                  <div className="w-1.5 h-10 bg-white rounded-full"></div>
                  <span className="tracking-tight transition-colors">Strategic Growth Recommendations</span>
                </h3>
                <div className="bg-white/10 backdrop-blur-md rounded-[28px] p-8 border border-white/20 leading-relaxed text-lg font-medium transition-colors">
                  {result.recommendations}
                </div>
              </div>
              <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillGap;
