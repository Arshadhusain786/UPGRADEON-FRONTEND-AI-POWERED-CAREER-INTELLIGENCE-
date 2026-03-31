import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getHistory, getPackages, createOrder, verifyPayment } from '../api/creditApi';
import { 
  CreditCard, 
  History, 
  Zap, 
  Check, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const Credits = () => {
  const { user, credits, refreshCredits } = useAuth();
  const [packages, setPackages] = useState([]);
  const [history, setHistory] = useState(null);
  const [historyPage, setHistoryPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const fetchPackages = useCallback(async () => {
    try {
      const res = await getPackages();
      if (res.success) {
        setPackages(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch packages:', err);
    }
  }, []);

  const fetchHistory = useCallback(async (page = 0) => {
    try {
      const res = await getHistory(page);
      if (res.success) {
        setHistory(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchPackages(), fetchHistory(0)]);
      setLoading(false);
    };
    init();
  }, [fetchPackages, fetchHistory]);

  const handlePurchase = async (pkgName) => {
    setError('');
    setSuccessMsg('');
    try {
      const res = await createOrder(pkgName);
      if (res.success) {
        const orderData = res.data;
        
        // Load Razorpay Script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const options = {
            key: orderData.key,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Upgradon AI",
            description: orderData.packageName,
            order_id: orderData.orderId,
            handler: async (response) => {
              try {
                const verifyRes = await verifyPayment(
                  orderData.orderId,
                  response.razorpay_payment_id,
                  response.razorpay_signature
                );
                if (verifyRes.success) {
                  setSuccessMsg("Payment successful! Credits added to your account.");
                  await refreshCredits();
                  fetchHistory(0);
                }
              } catch (err) {
                setError(err.message || "Payment verification failed. Please contact support.");
              }
            },
            prefill: {
              name: user?.name,
              email: user?.email,
            },
            theme: {
              color: "#6366f1",
            },
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to initiate purchase.");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < (history?.totalPages || 1)) {
      setHistoryPage(newPage);
      fetchHistory(newPage);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* ── Header ── */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Credits & Billing</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Manage your AI usage quota and recharge credits.</p>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 p-4 rounded-2xl font-bold flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <Check size={20} />
          {successMsg}
        </div>
      )}
      <ErrorMessage message={error} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Balance Card ── */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-[32px] p-10 shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between transition-colors">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">Available Balance</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-black text-gray-900 dark:text-white transition-colors">{credits?.totalCredits || 0}</span>
                <span className="text-xl font-bold text-primary-500">Credits</span>
              </div>
            </div>
            <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-2xl text-primary-600 dark:text-primary-400 transition-colors">
              <Zap size={32} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[24px] transition-colors border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                <TrendingUp size={16} />
                <span className="text-xs font-black uppercase tracking-wider">Lifetime Earned</span>
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{credits?.totalEarned || 0}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-[24px] transition-colors border border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 mb-2">
                <Zap size={16} className="rotate-180" />
                <span className="text-xs font-black uppercase tracking-wider">Lifetime Spent</span>
              </div>
              <p className="text-2xl font-black text-gray-900 dark:text-white">{credits?.totalSpent || 0}</p>
            </div>
          </div>

          {/* Daily Refill Info */}
          <div className="bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/20 transition-colors">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                <Clock size={16} />
                <span className="text-sm font-bold">Daily Free Quota</span>
              </div>
              <span className="text-sm font-black text-blue-700 dark:text-blue-400">{credits?.freeTodayRemaining || 0} / 10 Left</span>
            </div>
            <div className="w-full bg-blue-200 dark:bg-blue-900/40 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 dark:bg-blue-500 h-full transition-all duration-1000" 
                style={{ width: `${(credits?.freeTodayRemaining || 0) * 10}%` }}
              />
            </div>
            <p className="text-[10px] text-blue-500 dark:text-blue-400/60 font-bold uppercase tracking-widest mt-3">Refills automatically at midnight</p>
          </div>
        </div>

        {/* ── Package Selection ── */}
        <div className="space-y-6">
          <h3 className="text-xl font-black text-gray-900 dark:text-white pl-2">Top Up Credits</h3>
          
          {packages.map((pkg) => (
             <div 
                key={pkg.name}
                className={`relative bg-white dark:bg-gray-900 rounded-[28px] p-6 shadow-sm border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${pkg.name === 'PRO' ? 'border-primary-500 ring-4 ring-primary-500/5' : 'border-gray-100 dark:border-gray-800'}`}
             >
                {pkg.name === 'PRO' && (
                  <div className="absolute -top-3 right-6 bg-primary-600 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg shadow-primary-500/30">
                    Most Popular
                  </div>
                )}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{pkg.displayName}</span>
                  <div className="bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-3 py-1 rounded-xl text-xs font-black">
                    {pkg.credits} Credits
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-3xl font-black text-gray-900 dark:text-white">{pkg.priceDisplay}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-sm font-bold ml-1">one-time</span>
                </div>
                <button 
                  onClick={() => handlePurchase(pkg.name)}
                  className="w-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 py-3.5 rounded-2xl font-black text-sm transition-all hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white active:scale-[0.98] shadow-lg shadow-gray-200 dark:shadow-none"
                >
                  Buy Now
                </button>
             </div>
          ))}
        </div>
      </div>

      {/* ── Transaction History ── */}
      <div className="bg-white dark:bg-gray-900 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden transition-colors">
        <div className="p-8 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-xl flex items-center justify-center text-gray-500 dark:text-gray-400">
              <History size={20} />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Transaction History</h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest transition-colors">
                <th className="px-8 py-4">Date & Time</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Description</th>
                <th className="px-8 py-4">Amount</th>
                <th className="px-8 py-4 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
              {history?.content?.length > 0 ? (
                history.content.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        {new Date(tx.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">
                        {new Date(tx.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                        tx.amount > 0 
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' 
                          : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}>
                        {tx.type.split('_')[0]}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{tx.description}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className={`flex items-center gap-1 font-black ${tx.amount > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tx.amount > 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
                        <span>{tx.amount > 0 ? `+${tx.amount}` : tx.amount}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <p className="text-sm font-black text-gray-900 dark:text-white transition-colors">{tx.balanceAfter}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <p className="text-gray-400 dark:text-gray-500 font-bold">No transactions found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {(history?.totalPages || 0) > 1 && (
          <div className="p-6 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between transition-colors border-t border-gray-50 dark:border-gray-800">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              Page {history.currentPage + 1} of {history.totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => handlePageChange(historyPage - 1)}
                disabled={historyPage === 0}
                className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 disabled:opacity-30 transition-all active:scale-90"
              >
                <ChevronLeft size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
              <button 
                onClick={() => handlePageChange(historyPage + 1)}
                disabled={historyPage >= history.totalPages - 1}
                className="p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 disabled:opacity-30 transition-all active:scale-90"
              >
                <ChevronRight size={20} className="text-gray-600 dark:text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Credits;
