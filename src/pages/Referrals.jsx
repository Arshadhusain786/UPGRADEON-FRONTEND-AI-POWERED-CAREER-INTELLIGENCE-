import React, { useState, useEffect } from 'react';
import { getReferralStats, getReferralsList } from '../api/referralApi';
import { Copy, Share2, Users, Gift, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';

const Referrals = () => {
  const { isDarkMode } = useTheme();
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchStats();
    fetchReferrals(page);
  }, [page]);

  const fetchStats = async () => {
    try {
      const res = await getReferralStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
      toast.error('Failed to load referral stats.');
    }
  };

  const fetchReferrals = async (pageIndex) => {
    setLoading(true);
    try {
      const res = await getReferralsList(pageIndex, 10);
      if (res.success) {
        setReferrals(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching referrals list:', error);
      toast.error('Failed to load referrals list.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (stats?.referralLink) {
      navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      toast.success('Referral link copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOnWhatsApp = () => {
    if (stats?.referralLink && stats?.referralCode) {
      const text = `Join Upgradon and get +70 credits bonus! Use my code ${stats.referralCode} or sign up here: ${stats.referralLink}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Gift className="text-indigo-500 w-8 h-8" />
            Referral Program
          </h1>
          <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} max-w-2xl`}>
            Invite your friends to Upgradon and earn extra AI credits. They get a joining bonus, and you get rewarded when they sign up!
          </p>
        </div>

        {/* Hero Card & Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hero Card */}
          <div className={`col-span-1 lg:col-span-2 rounded-2xl p-8 relative overflow-hidden shadow-sm border ${isDarkMode ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border-indigo-500/20' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100'}`}>
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Your Unique Code</h2>
                <p className={`mb-6 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-800'}`}>Share this code or your referral link directly.</p>
              </div>
              
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-4 rounded-xl border ${isDarkMode ? 'bg-black/40 border-indigo-500/30' : 'bg-white border-indigo-200'} backdrop-blur-sm`}>
                  <span className="text-2xl font-mono tracking-widest font-semibold">{stats?.referralCode || (loading ? 'LOADING...' : 'GENERATING...')}</span>
                  <button 
                    onClick={() => {
                        if (stats?.referralCode) {
                            navigator.clipboard.writeText(stats.referralCode);
                            toast.success('Code copied!');
                        }
                    }}
                    className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'}`}
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={copyToClipboard}
                    className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 ${isDarkMode ? 'bg-white text-indigo-900 shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:bg-gray-100' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700'}`}
                  >
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />} {copied ? 'Link Copied!' : 'Copy Invite Link'}
                  </button>
                  <button
                    onClick={shareOnWhatsApp}
                    className="flex-1 py-3 px-4 rounded-xl font-medium transition-all transform hover:scale-[1.02] bg-[#25D366] text-white shadow-lg shadow-green-200/20 hover:bg-[#20bd5c] flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" /> Share on WhatsApp
                  </button>
                </div>
              </div>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
          </div>

          {/* Stats Cards */}
          <div className="col-span-1 space-y-6">
            <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-5 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                <Users className="w-8 h-8" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Referrals</p>
                <h3 className="text-3xl font-bold">{stats?.totalReferrals || 0}</h3>
              </div>
            </div>
            <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-5 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-yellow-500/10 text-yellow-400' : 'bg-yellow-50 text-yellow-600'}`}>
                <Award className="w-8 h-8" />
              </div>
              <div>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Credits Earned</p>
                <h3 className="text-3xl font-bold">{stats?.totalEarned || 0}</h3>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className={`mt-12 p-8 rounded-2xl border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
          <h2 className="text-xl font-bold mb-8 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold ${isDarkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-indigo-50 text-indigo-600'}`}>1</div>
              <h3 className="font-semibold text-lg">Share Link</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Send your unique code or link to a friend who needs an AI career boost.</p>
            </div>
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold ${isDarkMode ? 'bg-purple-900/50 text-purple-300' : 'bg-purple-50 text-purple-600'}`}>2</div>
              <h3 className="font-semibold text-lg">They Join</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>They sign up using your code and instantly receive 70 bonus credits.</p>
            </div>
            <div className="text-center space-y-4">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>3</div>
              <h3 className="font-semibold text-lg">You Earn</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>You get rewarded with 20 credits the moment they complete registration.</p>
            </div>
          </div>
        </div>

        {/* Referral History Table */}
        <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-6 py-5 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
            <h2 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
              Referral History
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={isDarkMode ? 'bg-gray-900/50 text-gray-400' : 'bg-gray-50 text-gray-500'}>
                  <th className="py-4 px-6 font-medium text-sm w-1/3">Friend</th>
                  <th className="py-4 px-6 font-medium text-sm w-1/3">Joined Date</th>
                  <th className="py-4 px-6 font-medium text-sm text-right">Reward</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-sm text-gray-400">Loading history...</td>
                  </tr>
                ) : referrals.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Users className={`w-12 h-12 ${isDarkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                        <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>No referrals yet. Share your code to get started!</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  referrals.map((ref, idx) => (
                    <tr key={idx} className={`border-b last:border-0 transition-colors ${isDarkMode ? 'border-gray-700 hover:bg-gray-700/30' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <td className="py-4 px-6">
                        <div className="font-medium">{ref.name}</div>
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{ref.email}</div>
                      </td>
                      <td className={`py-4 px-6 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {new Date(ref.joinedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                      </td>
                      <td className="py-4 px-6 text-right font-medium text-emerald-500">
                        +{ref.rewardCredits} Credits
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`px-6 py-4 border-t flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
              <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Page {page + 1} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${page === 0 ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  Previous
                </button>
                <button 
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${page >= totalPages - 1 ? 'opacity-50 cursor-not-allowed' : ''} ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'}`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Referrals;
