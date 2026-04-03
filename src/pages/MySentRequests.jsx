import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getSentRequests, cancelRequest, getJobDashboard } from '../api/connectionApi';
import { 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  Building2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Lock,
  History,
  MessageSquare
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';

const MySentRequests = () => {
  const { user, refreshCredits } = useAuth();
  const [requests, setRequests] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const [reqRes, dashRes] = await Promise.all([
        getSentRequests(p, 10),
        getJobDashboard()
      ]);
      
      if (reqRes.success) {
        setRequests(reqRes.data.content);
        setTotalPages(reqRes.data.totalPages);
      }
      if (dashRes.success) {
        setDashboard(dashRes.data);
      }
    } catch (err) {
      setError('Failed to load your sent requests.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData(page);
  }, [page, fetchData]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this connection request? Your locked credit (if any) will be refunded.')) return;
    try {
      const res = await cancelRequest(id);
      if (res.success) {
        toast.success('Request cancelled. Credit refunded if applicable.');
        fetchData();
        refreshCredits();
      }
    } catch (err) {
      toast.error('Failed to cancel request.');
    }
  };

  if (loading && requests.length === 0) return <Loader fullScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">My Connection Requests</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Track and manage connection requests you've sent.</p>
      </div>

      {/* Stats Row */}
      {dashboard && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatMiniCard 
             label="Total Sent" 
             value={dashboard.totalConnectionsSent} 
             icon={Send} 
             color="text-primary-600" 
             bg="bg-primary-50 dark:bg-primary-900/20" 
           />
           <StatMiniCard 
             label="Pending" 
             value={dashboard.pendingRequests} 
             icon={Clock} 
             color="text-amber-600" 
             bg="bg-amber-50 dark:bg-amber-900/20" 
           />
           <StatMiniCard 
             label="Accepted" 
             value={dashboard.acceptedConnections} 
             icon={CheckCircle2} 
             color="text-emerald-600" 
             bg="bg-emerald-50 dark:bg-emerald-900/20" 
           />
           <StatMiniCard 
             label="Free Remaining" 
             value={dashboard.freeConnectionsRemaining} 
             icon={ShieldCheck} 
             color="text-indigo-600" 
             bg="bg-indigo-50 dark:bg-indigo-900/20" 
           />
        </div>
      )}

      {/* List */}
      <div className="space-y-6">
        {requests.map((req) => (
          <SentRequestCard key={req.id} req={req} onCancel={() => handleCancel(req.id)} />
        ))}
        
        {requests.length === 0 && !loading && (
          <div className="py-24 text-center bg-white dark:bg-gray-900 rounded-[40px] border border-dashed border-gray-100 dark:border-gray-800 transition-colors shadow-sm">
             <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-gray-300 transition-colors">
                <History size={32} />
             </div>
             <p className="text-xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">No requests sent yet</p>
             <p className="text-gray-500 font-medium mb-8">Browse the Opportunity Board to connect with professionals.</p>
             <Link 
               to="/opportunities" 
               className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95"
             >
                Explore Opportunities
                <ExternalLink size={16} />
             </Link>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-8">
          <button 
            disabled={page === 0} 
            onClick={() => setPage(page - 1)}
            className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 transition-all hover:shadow-md"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-black text-gray-900 dark:text-white px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 transition-colors">
            {page + 1} / {totalPages}
          </span>
          <button 
            disabled={page >= totalPages - 1} 
            onClick={() => setPage(page + 1)}
            className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 transition-all hover:shadow-md"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Legal Footer */}
      <footer className="text-center pt-10">
        <p className="text-xs text-gray-400 italic max-w-2xl mx-auto leading-relaxed">
           "Upgradon connection requests are a platform feature for professional outreach. 
           Credits locked during pending requests are automatically returned if the request is declined or cancelled."
        </p>
      </footer>
    </div>
  );
};

const StatMiniCard = ({ label, value, icon: Icon, color, bg }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-5 transition-all hover:shadow-md">
    <div className={`${bg} ${color} w-14 h-14 rounded-2xl flex items-center justify-center transition-colors`}>
       <Icon size={24} />
    </div>
    <div>
       <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{label}</p>
       <p className="text-2xl font-black text-gray-900 dark:text-white transition-colors">{value}</p>
    </div>
  </div>
);

const SentRequestCard = ({ req, onCancel }) => {
  const isPending = req.status === 'PENDING';
  
  const getStatusStyle = (status) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/20';
      case 'ACCEPTED': return 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/20';
      case 'REJECTED': return 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/20';
      case 'HIRED': return 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/20';
      default: return 'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700';
    }
  };

  const getCreditIndicator = () => {
    if (req.isFreeRequest) return { label: 'Free ✅', color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 text-emerald-400' };
    if (req.status === 'PENDING' && req.creditLocked) return { label: '1 credit locked 🔒', color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 text-violet-400' };
    if (req.status === 'ACCEPTED') return { label: '1 credit used', color: 'bg-gray-50 text-gray-500 dark:bg-gray-800 text-gray-400' };
    if (['REJECTED', 'CANCELLED', 'EXPIRED'].includes(req.status) && req.creditLocked) return { label: '1 credit refunded ↩', color: 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 text-primary-400' };
    return null;
  };

  const creditInfo = getCreditIndicator();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-xl group relative overflow-hidden">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
             <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 transition-colors shrink-0 border border-gray-100 dark:border-gray-700">
                <Building2 size={24} />
             </div>
             <div className="space-y-1">
                <div className="flex items-center gap-3">
                   <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight leading-none transition-colors">
                     {req.post?.company || 'Deleted Company'}
                   </h4>
                   {req.post && (
                     <Link to={`/opportunities`} className="p-1 px-2.5 bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-primary-600 rounded-lg transition-all group/link">
                        <ExternalLink size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                     </Link>
                   )}
                </div>
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 italic transition-colors">
                  {req.post?.title || 'Job Post No Longer Available'}
                </p>
                <div className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-tighter pt-1 transition-colors">
                   <span>POSTED BY</span>
                   <span className="text-primary-600 dark:text-primary-400">{req.post?.posterName || 'System'}</span>
                </div>
             </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
             {creditInfo && (
               <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${creditInfo.color} transition-colors`}>
                  {creditInfo.label}
               </span>
             )}
             <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(req.status)} transition-colors`}>
                {req.status}
             </span>
          </div>
       </div>

       <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-8 border-t border-gray-50 dark:border-gray-800 transition-colors">
          <div className="flex-1 space-y-3">
             <div className="flex items-center gap-2 text-gray-400">
                <MessageSquare size={14} />
                <span className="text-[10px] font-black uppercase tracking-widest">My Message</span>
             </div>
             <p className="text-sm text-gray-600 dark:text-gray-400 font-medium italic line-clamp-2 leading-relaxed">
               {req.message || 'No message provided.'}
             </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 shrink-0">
             {isPending && (
               <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                  <Clock size={16} />
                  <span className="text-xs font-black uppercase tracking-tighter">Expires in 7 days</span>
               </div>
             )}
             
             {isPending && (
               <button 
                  onClick={onCancel}
                  className="flex items-center gap-2 px-8 py-3 bg-red-50 dark:bg-red-900/10 text-red-600 hover:bg-red-600 hover:text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-sm active:scale-95"
               >
                  <Trash2 size={16} />
                  <span>Cancel Request</span>
               </button>
             )}
             {!isPending && (
               <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-2xl text-gray-400 transition-colors">
                  <CheckCircle2 size={24} />
               </div>
             )}
          </div>
       </div>
       
       <div className="absolute top-0 left-0 w-1 h-full bg-primary-600 transition-colors opacity-0 group-hover:opacity-100"></div>
    </div>
  );
};

export default MySentRequests;
