import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyPosts, createPost, updatePost, closePost, boostPost } from '../api/opportunityApi';
import { getReceivedRequests, respondRequest, markHired } from '../api/connectionApi';
import { 
  Building2, 
  Users, 
  Plus, 
  Edit, 
  Power, 
  Zap, 
  Check, 
  X, 
  Clock, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  MessageSquare,
  Award,
  MoreVertical,
  HelpCircle,
  Eye
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loader from '../components/Loader';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';

const MyOpportunities = () => {
  const { user, refreshCredits } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    roleType: 'FULL_TIME',
    location: '',
    description: '',
    skillsRequired: '',
    experienceRequired: '',
    maxConnections: 50
  });
  const [showDeclineModal, setShowDeclineModal] = useState(null);
  const [declineNote, setDeclineNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchMyPosts = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getMyPosts(p, 10);
      if (res.success) {
        setPosts(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      setError('Failed to load your posts.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  const fetchRequests = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await getReceivedRequests(p, 10);
      if (res.success) {
        setRequests(res.data.content);
        setTotalPages(res.data.totalPages);
      }
    } catch (err) {
      setError('Failed to load received connections.');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchMyPosts(0);
    } else {
      fetchRequests(0);
    }
    setPage(0);
  }, [activeTab, fetchMyPosts, fetchRequests]);

  useEffect(() => {
    if (activeTab === 'posts') fetchMyPosts(page);
    else fetchRequests(page);
  }, [page, activeTab, fetchMyPosts, fetchRequests]);

  const handleCreateOrUpdate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = editingPost 
        ? await updatePost(editingPost.id, formData)
        : await createPost(formData);
      
      if (res.success) {
        toast.success(editingPost ? 'Post updated!' : 'Opportunity posted! 🚀');
        setShowCreateModal(false);
        setEditingPost(null);
        setFormData({ title: '', company: '', roleType: 'FULL_TIME', location: '', description: '', skillsRequired: '', experienceRequired: '', maxConnections: 50 });
        fetchMyPosts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save post');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClosePost = async (id) => {
    if (!window.confirm('Are you sure you want to close this opportunity? It will no longer be visible to others.')) return;
    try {
      const res = await closePost(id);
      if (res.success) {
        toast.success('Opportunity closed.');
        fetchMyPosts();
      }
    } catch (err) {
      toast.error('Failed to close post.');
    }
  };

  const handleBoost = async (id) => {
    try {
      const res = await boostPost(id);
      if (res.success) {
        toast.success('Post boosted for 7 days! ⚡');
        fetchMyPosts();
        refreshCredits();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to boost post';
      toast.error(msg);
      if (err.response?.status === 402) navigate('/credits');
    }
  };

  const handleResponse = async (id, action, note = '') => {
    try {
      const res = await respondRequest(id, action, note);
      if (res.success) {
        toast.success(action === 'ACCEPTED' ? 'Connection accepted! ✓' : 'Request declined. Credit refunded.');
        setShowDeclineModal(null);
        setDeclineNote('');
        fetchRequests();
        if (action === 'REJECTED') refreshCredits();
      }
    } catch (err) {
      toast.error('Failed to record response.');
    }
  };

  const handleMarkHired = async (id) => {
    if (!window.confirm('Confirm this person was hired? You will earn +5 platform reward credits as a top contributor acknowledgment.')) return;
    try {
      const res = await markHired(id);
      if (res.success) {
        toast.success('🎉 Marked as hired! +5 credits added.');
        fetchRequests();
        refreshCredits();
      }
    } catch (err) {
      toast.error('Failed to mark as hired.');
    }
  };

  const openEditModal = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      company: post.company,
      roleType: post.roleType,
      location: post.location,
      description: post.description,
      skillsRequired: post.skillsRequired,
      experienceRequired: post.experienceRequired,
      maxConnections: post.maxConnections
    });
    setShowCreateModal(true);
  };

  if (loading && posts.length === 0 && requests.length === 0) return <Loader fullScreen />;

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight mb-2">My Opportunities</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Manage your posts and incoming connection requests.</p>
        </div>
        <Button 
          onClick={() => { setEditingPost(null); setShowCreateModal(true); }}
          className="bg-primary-600 hover:bg-primary-700 text-white flex items-center gap-2 group px-6 py-3 rounded-2xl shadow-lg shadow-primary-500/20 font-black uppercase text-sm tracking-widest"
        >
          <Plus size={18} />
          <span>New Post</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-white dark:bg-gray-900 p-1.5 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm w-fit transition-colors">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'posts' 
              ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          My Posts
        </button>
        <button 
          onClick={() => setActiveTab('connections')}
          className={`px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all ${
            activeTab === 'connections' 
              ? 'bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 shadow-sm' 
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          Received Connections
        </button>
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {activeTab === 'posts' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <MyPostCard 
                key={post.id} 
                post={post} 
                onEdit={() => openEditModal(post)} 
                onClose={() => handleClosePost(post.id)}
                onBoost={() => handleBoost(post.id)}
                onViewConnections={() => { setActiveTab('connections'); setPage(0); }}
              />
            ))}
            {posts.length === 0 && !loading && (
              <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-[32px] border border-dashed border-gray-100 dark:border-gray-800 transition-colors">
                <Building2 size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="text-gray-500 font-bold">You haven't posted any opportunities yet.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-[32px] border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm transition-colors">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
                 <thead>
                   <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-[10px] font-black text-gray-400 uppercase tracking-widest transition-colors">
                      <th className="px-8 py-5">Seeker</th>
                      <th className="px-8 py-5">Opportunity</th>
                      <th className="px-8 py-5 min-w-[200px]">Message</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 dark:divide-gray-800 transition-colors">
                    {requests.map((req) => (
                      <ConnectionRow 
                        key={req.id} 
                        req={req} 
                        onAccept={() => handleResponse(req.id, 'ACCEPTED')}
                        onDecline={() => setShowDeclineModal(req.id)}
                        onMarkHired={() => handleMarkHired(req.id)}
                      />
                    ))}
                    {requests.length === 0 && !loading && (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center">
                           <Users size={40} className="mx-auto text-gray-200 mb-4" />
                           <p className="text-gray-500 font-bold">No connection requests received yet.</p>
                        </td>
                      </tr>
                    )}
                 </tbody>
               </table>
             </div>
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
        <p className="text-[10px] text-gray-400 italic max-w-2xl mx-auto">
          "Upgradon does not sell referrals or job placements. Platform rewards are recognition for top contributors. Connections are optional and independent."
        </p>
      </footer>

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-gray-900 rounded-[40px] p-10 max-w-2xl w-full shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in duration-300 overflow-y-auto max-h-[90vh]">
            <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-8 tracking-tighter">
              {editingPost ? 'Edit Opportunity' : 'Post New Opportunity'}
            </h3>
            
            <form onSubmit={handleCreateOrUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Title*</label>
                  <input 
                    required type="text" value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Company*</label>
                  <input 
                    required type="text" value={formData.company} 
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="e.g. Tech Corp"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Type*</label>
                  <select 
                    value={formData.roleType} 
                    onChange={(e) => setFormData({...formData, roleType: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-semibold appearance-none"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="REMOTE">Remote</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Location</label>
                  <input 
                    type="text" value={formData.location} 
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g. San Francisco, US"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Description*</label>
                <textarea 
                  required value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Deep-dive into the role, team, and expectations..."
                  className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-gray-900 dark:text-white min-h-[120px] outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                />
                <div className="flex justify-between items-center mt-1 px-1">
                  <p className={`text-xs font-bold ${formData.description.length < 20 ? 'text-amber-500' : 'text-emerald-500'}`}>
                    {formData.description.length < 20 ? '⚠️ Description too short (min 20 chars)' : '✅ Description length OK'}
                  </p>
                  <span className="text-xs text-gray-400">{formData.description.length} characters</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Skills (comma-separated)</label>
                  <input 
                    type="text" value={formData.skillsRequired} 
                    onChange={(e) => setFormData({...formData, skillsRequired: e.target.value})}
                    placeholder="React, Java, AWS"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Experience Level</label>
                  <input 
                    type="text" value={formData.experienceRequired} 
                    onChange={(e) => setFormData({...formData, experienceRequired: e.target.value})}
                    placeholder="e.g. 5+ years"
                    className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl px-5 py-4 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500 transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 text-gray-500 dark:text-gray-400 font-black uppercase tracking-widest hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-all"
                >
                  Cancel
                </button>
                <Button 
                  type="submit"
                  loading={submitting}
                  disabled={formData.description.length < 20}
                  className={`flex-1 rounded-2xl shadow-xl shadow-black/10 transition-all font-black ${
                    formData.description.length < 20 
                    ? 'bg-gray-200 dark:bg-zinc-800 text-gray-400 cursor-not-allowed opacity-50' 
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                  }`}
                >
                  {editingPost ? 'Update Post' : 'Post Opportunity'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white dark:bg-gray-900 rounded-[32px] p-10 max-w-md w-full shadow-2xl animate-in zoom-in duration-300 border border-gray-100 dark:border-gray-800">
             <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Decline Connection</h3>
             <p className="text-gray-500 mb-6 font-medium">Explain why you're declining this request (optional).</p>
             
             <textarea 
               value={declineNote}
               onChange={(e) => setDeclineNote(e.target.value)}
               placeholder="e.g. Profile doesn't match requirements..."
               className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl p-5 text-gray-900 dark:text-white h-32 outline-none focus:ring-2 focus:ring-red-500 transition-all font-medium"
             />

             <div className="flex gap-4 mt-8">
               <button onClick={() => setShowDeclineModal(null)} className="flex-1 py-4 text-gray-500 font-bold uppercase tracking-widest hover:bg-gray-50 rounded-2xl transition-all">Cancel</button>
               <button 
                  onClick={() => handleResponse(showDeclineModal, 'REJECTED', declineNote)}
                  className="flex-1 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 transition-all"
               >
                 Confirm Decline
               </button>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};

const MyPostCard = ({ post, onEdit, onClose, onBoost, onViewConnections }) => {
  const isBoosted = post.isBoosted;
  
  return (
    <div className={`
      bg-white dark:bg-gray-900 rounded-[32px] p-8 border hover:shadow-xl transition-all duration-300 group relative overflow-hidden
      ${isBoosted ? 'border-primary-100 dark:border-primary-900/50' : 'border-gray-100 dark:border-gray-800'}
    `}>
       <div className="flex justify-between items-start mb-6">
          <div className="space-y-1">
             <p className="text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest">{post.company}</p>
             <h4 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">{post.title}</h4>
          </div>
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
            post.status === 'ACTIVE' || post.status === 'BOOSTED' 
              ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800/20' 
              : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-700'
          }`}>
             {post.status}
          </div>
       </div>

       <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
             <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Connections</p>
             <div className="flex items-center gap-2">
                <Users size={14} className="text-primary-600" />
                <span className="font-black text-gray-900 dark:text-white">{post.connectionCount}</span>
             </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
             <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Views</p>
             <div className="flex items-center gap-2">
                <Eye size={14} className="text-blue-500" />
                <span className="font-black text-gray-900 dark:text-white">{post.viewCount}</span>
             </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 transition-colors">
             <p className="text-[9px] font-black text-gray-400 uppercase mb-1">Limit</p>
             <span className="font-black text-gray-900 dark:text-white">{post.maxConnections}</span>
          </div>
       </div>

       <div className="flex flex-wrap gap-2 pt-6 border-t border-gray-50 dark:border-gray-800 transition-colors">
          <button onClick={onEdit} className="p-3 bg-gray-50 dark:bg-gray-800 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl text-gray-500 hover:text-primary-600 transition-all">
             <Edit size={18} />
          </button>
          <button 
             onClick={onBoost} 
             disabled={isBoosted}
             className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
               isBoosted 
                 ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20 ring-2 ring-primary-100 dark:ring-primary-900/30' 
                 : 'bg-violet-50 dark:bg-violet-900/20 text-violet-600 hover:bg-violet-600 hover:text-white'
             }`}
          >
             <Zap size={14} />
             {isBoosted ? 'Boosted • 7d Left' : 'Boost — 3 Credits'}
          </button>
          <button 
             onClick={onViewConnections}
             className="px-5 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md"
          >
             View Requests
          </button>
          <button onClick={onClose} className="p-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-600 hover:text-white rounded-xl text-red-500 transition-all">
             <Power size={18} />
          </button>
       </div>
    </div>
  );
};

const ConnectionRow = ({ req, onAccept, onDecline, onMarkHired }) => {
  const statusColors = {
    PENDING: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800/30',
    ACCEPTED: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30',
    REJECTED: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30',
    HIRED: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30',
    EXPIRED: 'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700'
  };

  return (
    <tr className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/20 transition-all">
       <td className="px-8 py-6">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-black shrink-0 transition-colors">
               {req.seeker.name[0]}
             </div>
             <div className="overflow-hidden">
                <p className="text-sm font-black text-gray-900 dark:text-white truncate transition-colors">{req.seeker.name}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter transition-colors">{req.seeker.role}</p>
             </div>
          </div>
       </td>
       <td className="px-8 py-6">
          <p className="text-xs font-black text-gray-900 dark:text-white transition-colors">{req.post.company}</p>
          <p className="text-[10px] font-bold text-gray-400 transition-colors line-clamp-1">{req.post.title}</p>
       </td>
       <td className="px-8 py-6">
           <div className="flex items-start gap-2 max-w-sm">
              <MessageSquare size={14} className="text-gray-300 shrink-0 mt-1" />
              <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 italic font-medium">
                {req.message || 'No personal message provided.'}
              </p>
           </div>
       </td>
       <td className="px-8 py-6">
          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-colors ${statusColors[req.status]}`}>
            {req.status}
          </span>
       </td>
       <td className="px-8 py-6 text-right">
          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {req.status === 'PENDING' && (
              <>
                 <button onClick={onAccept} title="Accept" className="p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-xl transition-all shadow-sm"><Check size={18} /></button>
                 <button onClick={onDecline} title="Decline" className="p-2.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all shadow-sm"><X size={18} /></button>
              </>
            )}
            {req.status === 'ACCEPTED' && (
               <button onClick={onMarkHired} className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white hover:bg-purple-700 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20 active:scale-95">
                  <Award size={16} />
                  Mark Hired (+5)
               </button>
            )}
            {['HIRED', 'REJECTED', 'EXPIRED', 'CANCELLED'].includes(req.status) && (
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700 transition-colors">Locked</span>
            )}
          </div>
       </td>
    </tr>
  );
};

export default MyOpportunities;
