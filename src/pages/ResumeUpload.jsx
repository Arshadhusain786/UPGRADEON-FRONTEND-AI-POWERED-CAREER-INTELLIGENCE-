import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { uploadResume } from '../api/aiApi';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import toast from 'react-hot-toast';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const { refreshCredits } = useAuth();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a file first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // uploadResume uses axiosInstance which returns response.data (ApiResponse)
      const response = await uploadResume(file, targetRole || null);

      if (response.success) {
        setResult(response.data);
        toast.success('Resume analyzed via file upload!');
        if (refreshCredits) await refreshCredits();
      } else {
        setError(response.message || 'Analysis failed');
        toast.error(response.message || 'Analysis failed');
      }
    } catch (err) {
      const msg = err.message || 'Parsing failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">Resume Upload Scanner</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg">Upload PDF/DOCX for AI extraction. For best results, ensure your PDF is text-selectable, not a scanned image.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-[40px] p-12 shadow-sm border border-gray-100 dark:border-gray-800">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-3xl hover:border-emerald-500 transition-colors bg-gray-50 dark:bg-gray-800/50"
          >
            <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
            <p className="font-bold text-gray-700 dark:text-gray-200">Drag and drop your resume here</p>
            <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, DOCX, TXT (Max 10MB)</p>
            
            <input 
              type="file" 
              accept=".pdf,.docx,.txt" 
              className="hidden" 
              id="file-upload" 
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
              Browse Files
            </label>
            
            {file && (
              <div className="mt-6 flex items-center gap-2 text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-4 py-2 rounded-lg">
                <FileText size={18} />
                <span className="font-semibold">{file.name}</span>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-black text-gray-700 dark:text-gray-300 block mb-2">Target Role (Optional)</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Data Scientist"
              className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-4 dark:border-gray-700 dark:text-white outline-none"
            />
          </div>

          <Button type="submit" loading={loading} fullWidth disabled={!file || loading}>
            Analyze Resume (4 Credits)
          </Button>
        </form>
      </div>

      <ErrorMessage message={error} />

      {result && (
        <div className="bg-white dark:bg-gray-900 rounded-[40px] p-12 shadow-sm border border-gray-100 dark:border-gray-800 space-y-8 animate-in slide-in-from-bottom-8">
          <div className="text-center">
            <h2 className="text-6xl font-black text-emerald-500 mb-2">{result.score}/100</h2>
            <p className="font-bold text-gray-500 uppercase tracking-widest">Overall Score</p>
          </div>

          {result.extractedSkills && result.extractedSkills.length > 0 && (
            <div>
              <h3 className="text-xl font-black mb-4 flex items-center gap-2"><CheckCircle2 className="text-emerald-500"/> AI Extracted Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.extractedSkills.map((s, i) => (
                  <span key={i} className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 border border-indigo-100 px-3 py-1 rounded-lg text-sm font-semibold">{s}</span>
                ))}
              </div>
            </div>
          )}

          {result.improvements && result.improvements.length > 0 && (
             <div>
               <h3 className="text-xl font-black mb-4">Critical Improvements</h3>
               <ul className="space-y-2">
                 {result.improvements.map((im, i) => (
                   <li key={i} className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl text-emerald-800 dark:text-emerald-400 font-medium">{im}</li>
                 ))}
               </ul>
             </div>
          )}

          {result.weaknesses && result.weaknesses.length > 0 && (
             <div>
               <h3 className="text-xl font-black mb-4">Weaknesses</h3>
               <ul className="space-y-2">
                 {result.weaknesses.map((w, i) => (
                   <li key={i} className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl text-red-800 dark:text-red-400 font-medium">{w}</li>
                 ))}
               </ul>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeUpload;
