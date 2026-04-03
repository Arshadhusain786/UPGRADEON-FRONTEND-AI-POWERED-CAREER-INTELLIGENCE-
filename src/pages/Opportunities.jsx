import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getPosts, getPost } from '../api/opportunityApi';
import { sendRequest, getJobDashboard } from '../api/connectionApi';
import { createOrder, verifyPayment } from '../api/creditApi';
import { 
  Briefcase, 
  MapPin, 
  Users, 
  Eye, 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';

const Opportunities = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [modalMessage, setModalMessage] = useState('');
  const [sending, setSending] = useState(false);
  
  // Connection Refill States
  const [limitModal, setLimitModal] = useState(false);
  const [purchasing, setPurchasing] = useState(false);

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await getJobDashboard();
      if (res.success) {
        setDashboard(res.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err);
    }
  }, []);

  const fetchPosts = useCallback(async (p = page, s = search, t = typeFilter) => {
    setLoading(true);
    try {
      const res = await getPosts(p, 10, s, t);
      if (res.success) {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      setError('Failed to load opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, search, typeFilter]);

  useEffect(() => {
    fetchDashboard();
    const delayDebounceFn = setTimeout(() => {
      fetchPosts(0, search, typeFilter);
      setPage(0);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [search, typeFilter, fetchPosts, fetchDashboard]);

  useEffect(() => {
    fetchPosts(page, search, typeFilter);
  }, [page, fetchPosts]);

  const handleConnect = (post) => {
    setSelectedPost(post);
    setShowModal(true);
  };

  const submitRequest = async () => {
    setSending(true);
    try {
      const res = await sendRequest(selectedPost.id, modalMessage);
      if (res.success) {
        toast.success('Connection request sent! 🎉');
        setShowModal(false);
        setModalMessage('');
        fetchPosts();
        fetchDashboard();
      }
    } catch (err) {
      const msg = err.message || 'Failed to send request';
      if (err.status === 402 || msg.includes('LIMIT_EXCEEDED')) {
        setShowModal(false);
        setLimitModal(true);
      } else {
        toast.error(msg);
      }
    } finally {
      setSending(false);
    }
  };

  const handlePurchaseRefill = async () => {
    setPurchasing(true);
    try {
      const { data: orderData } = await createOrder('CONNECTION_REFILL');
      if (orderData?.orderId) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const options = {
            key: orderData.key,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Upgradon",
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
                  toast.success("Refill successful! You have +3 Connections.");
                  setLimitModal(false);
                  fetchDashboard();
                }
              } catch (err) {
                toast.error(err.message || "Verification failed. Contact support.");
              } finally {
                setPurchasing(false);
              }
            },
            prefill: {
              name: user?.name,
              email: user?.email,
            },
            theme: { color: "#6366f1" },
            modal: { ondismiss: () => setPurchasing(false) }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        script.onerror = () => {
          toast.error("Failed to load payment gateway.");
          setPurchasing(false);
        };
        document.body.appendChild(script);
      }
    } catch (err) {
      toast.error("Failed to initiate refill. Please try again.");
      setPurchasing(false);
    }
  };

  if (loading && posts.length === 0) return <Loader fullScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">Opportunity Board</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Discover and connect with top career opportunities.</p>
        </div>
        <Button 
          onClick={() => navigate('/my-opportunities')}
          className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 group px-6 py-3 rounded-2xl shadow-lg shadow-primary-500/20 transition-all font-black"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span>Post an Opportunity</span>
        </Button>
      </div>

      {/* Stats / Free Banner */}
      {dashboard && (
        <div className="bg-white dark:bg-gray-900 rounded-[32px] p-8 border border-gray-100 dark:border-gray-800 shadow-sm flex flex-col md:flex-row items-center gap-8 transition-colors overflow-hidden relative">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-primary-600 dark:text-primary-400">
                <Sparkles size={20} />
                <span className="text-sm font-black uppercase tracking-widest">Weekly Free Connections</span>
              </div>
              <span className="text-sm font-black text-gray-900 dark:text-white">
                {dashboard.freeConnectionsRemaining} / 3 Left
              </span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-3 rounded-full overflow-hidden border border-gray-50 dark:border-gray-700">
              <div 
                className="bg-gradient-to-r from-primary-500 to-indigo-500 h-full transition-all duration-1000 ease-out"
                style={{ width: `${(dashboard.freeConnectionsRemaining / 3) * 100}%` }}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-violet-50 dark:bg-violet-900/20 px-6 py-4 rounded-2xl border border-violet-100 dark:border-violet-800/50">
               <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 mb-1">
                 <Lock size={14} />
                 <span className="text-[10px] font-black uppercase tracking-wider">Credits Locked</span>
               </div>
               <p className="text-2xl font-black text-gray-900 dark:text-white">{dashboard.lockedCredits}</p>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 px-6 py-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/50">
               <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-1">
                 <Briefcase size={14} />
                 <span className="text-[10px] font-black uppercase tracking-wider">Total Posts</span>
               </div>
               <p className="text-2xl font-black text-gray-900 dark:text-white">{dashboard.totalPostsCreated}</p>
            </div>
          </div>
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary-50 dark:bg-primary-900/10 rounded-full blur-3xl opacity-50"></div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by title, company, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-6 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all shadow-sm"
          />
        </div>
        <div className="relative md:w-64">
           <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
           <select 
             value={typeFilter}
             onChange={(e) => setTypeFilter(e.target.value)}
             className="w-full bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-4 pl-12 pr-6 text-gray-900 dark:text-white appearance-none outline-none focus:ring-2 focus:ring-primary-500 transition-all shadow-sm font-semibold"
           >
             <option value="">All Types</option>
             <option value="FULL_TIME">Full Time</option>
             <option value="PART_TIME">Part Time</option>
             <option value="INTERNSHIP">Internship</option>
             <option value="FREELANCE">Freelance</option>
             <option value="CONTRACT">Contract</option>
             <option value="REMOTE">Remote</option>
           </select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {posts
          .filter(post => post.poster.id !== user?.id)
          .map((post) => (
            <OpportunityCard key={post.id} post={post} user={user} onConnect={() => handleConnect(post)} />
          ))}
        {posts.length === 0 && !loading && (
          <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-[32px] border border-dashed border-gray-200 dark:border-gray-800">
            <Briefcase size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-bold text-lg">No opportunities found matching your criteria.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-8">
          <button 
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ChevronLeft size={24} />
          </button>
          <span className="font-black text-gray-900 dark:text-white px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            {page + 1} / {totalPages}
          </span>
          <button 
            disabled={page >= totalPages - 1}
            onClick={() => setPage(page + 1)}
            className="p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      )}

      {/* Footer Legal */}
      <footer className="text-center pt-10 pb-4">
        <p className="text-xs text-gray-400 italic font-medium leading-relaxed max-w-2xl mx-auto">
          "Upgradon does not sell referrals or job placements. Credits are used for platform
          features such as visibility and connection priority. Connections are completely
          optional and independent. Hiring decisions are made solely by companies."
        </p>
      </footer>

      {/* Connect Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[32px] p-10 max-w-lg w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-300">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Connect at {selectedPost?.company}</h3>
            <p className="text-gray-500 dark:text-gray-400 font-bold mb-6 italic">{selectedPost?.title}</p>
            
            <div className="bg-primary-50 dark:bg-primary-900/20 p-5 rounded-2xl border border-primary-100 dark:border-primary-800/50 mb-8">
              {dashboard?.freeConnectionsRemaining > 0 ? (
                <div className="flex items-center gap-3 text-primary-700 dark:text-primary-400">
                  <ShieldCheck size={20} />
                  <p className="text-sm font-black uppercase tracking-tight">✅ Uses 1 of your {dashboard.freeConnectionsRemaining} free weekly connections — no credits needed</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-indigo-700 dark:text-indigo-400">
                  <Lock size={20} />
                  <p className="text-sm font-black uppercase tracking-tight">💎 Locks 1 credit temporarily (refunded if declined)</p>
                </div>
              )}
            </div>

            <div className="space-y-4 mb-10">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest pl-1">Personal Message (Optional)</label>
              <textarea 
                placeholder="Briefly explain why you're interested in this opportunity..."
                value={modalMessage}
                onChange={(e) => setModalMessage(e.target.value)}
                maxLength={500}
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-5 text-gray-900 dark:text-white min-h-[150px] outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
              />
              <p className="text-[10px] text-right text-gray-400 font-bold">{modalMessage.length} / 500 characters</p>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setShowModal(false)}
                className="flex-1 py-4 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all"
              >
                Cancel
              </button>
              <Button 
                onClick={submitRequest}
                loading={sending}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white rounded-2xl shadow-xl shadow-primary-500/30 transition-all"
              >
                Send Request
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Limit Exceeded Refill Modal ── */}
      {limitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 dark:bg-black/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-800 p-8 sm:p-12 relative flex flex-col items-center text-center">
            
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-3xl flex items-center justify-center mb-6 shadow-inner animate-bounce-subtle">
              <Lock className="text-rose-500" size={32} />
            </div>
            
            <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight leading-tight">Limit Reached</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium mb-8">
              You've exhausted your 3 free connections for this week.
            </p>

            <div className="w-full bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-[24px] p-6 mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-bl-xl shadow-lg">
                 Refill Pack
               </div>
               <div className="flex justify-between items-center text-left">
                  <div>
                    <h3 className="text-indigo-900 dark:text-indigo-300 font-black tracking-tight mb-1">+3 Connections</h3>
                    <p className="text-indigo-500 dark:text-indigo-400/70 text-xs font-bold uppercase tracking-widest">Instant Unlock</p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">₹20</span>
                  </div>
               </div>
            </div>

            <div className="flex gap-4 w-full">
              <button 
                onClick={() => setLimitModal(false)}
                className="flex-1 py-4 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all"
                disabled={purchasing}
              >
                Cancel
              </button>
              <Button 
                onClick={handlePurchaseRefill}
                loading={purchasing}
                className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-xl shadow-indigo-500/30 transition-all font-black text-sm uppercase tracking-widest"
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

const OpportunityCard = ({ post, user, onConnect }) => {
  const isMyPost = post.poster.id === user.id;

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'FULL_TIME': return 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/30';
      case 'INTERNSHIP': return 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/30';
      case 'REMOTE': return 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/30';
      case 'FREELANCE': return 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-800/30';
      default: return 'bg-gray-50 dark:bg-gray-800/50 text-gray-600 dark:text-gray-400 border-gray-100 dark:border-gray-700';
    }
  };

  const skills = post.skillsRequired ? post.skillsRequired.split(',').map(s => s.trim()) : [];

  return (
    <div className={`
      bg-white dark:bg-gray-900 rounded-[32px] p-8 border hover:shadow-2xl transition-all duration-500 group overflow-hidden relative
      ${post.isBoosted ? 'border-primary-200 dark:border-primary-900/50 ring-2 ring-primary-50 dark:ring-primary-900/10' : 'border-gray-100 dark:border-gray-800'}
    `}>
      {/* Boosted Tag */}
      {post.isBoosted && (
        <div className="absolute top-0 right-0 px-6 py-2 bg-primary-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl shadow-lg flex items-center gap-2">
          <Sparkles size={12} fill="white" />
          Priority
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col h-full gap-6">
        <div className="flex flex-wrap gap-2">
           <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${getTypeBadgeColor(post.roleType)}`}>
             {post.roleType?.replace('_', ' ') || 'OPPORTUNITY'}
           </span>
           {post.location && (
             <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-700 flex items-center gap-1.5 transition-colors">
               <MapPin size={12} />
               {post.location}
             </span>
           )}
        </div>

        <div className="space-y-2 flex-1">
          <p className="text-sm font-black text-primary-600 dark:text-primary-400 uppercase tracking-tighter transition-colors">{post.company}</p>
          <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight tracking-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{post.title}</h3>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.slice(0, 4).map((skill, idx) => (
              <span key={idx} className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-lg text-[10px] font-bold border border-gray-100 dark:border-gray-700 transition-colors">
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-[10px] font-bold text-gray-400 flex items-center px-1">+{skills.length - 4} more</span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800 transition-colors">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-black text-sm uppercase transition-colors shrink-0">
                {post.poster.name.charAt(0)}
             </div>
             <div className="overflow-hidden">
               <p className="text-xs font-black text-gray-900 dark:text-white transition-colors truncate">{post.poster.name}</p>
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter transition-colors">{post.poster.role}</p>
             </div>
           </div>

           <div className="flex items-center gap-5 text-gray-400 transition-colors">
              <div className="flex items-center gap-1.5">
                 <Eye size={16} />
                 <span className="text-xs font-black">{post.viewCount}</span>
              </div>
              <div className="flex items-center gap-1.5">
                 <Users size={16} />
                 <span className="text-xs font-black">{post.connectionCount}</span>
              </div>
           </div>
        </div>

        <div className="flex items-center justify-between gap-4">
           <div className="flex items-center gap-2 text-gray-400">
             <Clock size={14} />
             <span className="text-[10px] font-bold uppercase tracking-tight">Active for 30 days</span>
           </div>
           
           {isMyPost ? (
             <button disabled className="px-8 py-3.5 bg-gray-50 dark:bg-gray-800 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest cursor-not-allowed transition-colors">
               Your Post
             </button>
           ) : post.hasRequested ? (
             <button disabled className="px-8 py-3.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
               <ShieldCheck size={16} />
               <span>Requested</span>
             </button>
           ) : (
             <button 
                onClick={onConnect}
                className="px-8 py-3.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 dark:hover:bg-primary-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-black/5 dark:shadow-none"
             >
               Connect Now
             </button>
           )}
        </div>
      </div>
      
      {/* Decorative Blob */}
      <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-primary-100 dark:bg-primary-900/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
    </div>
  );
};

export default Opportunities;
