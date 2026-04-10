import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, Check, ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getPackages, createOrder, verifyPayment } from '../api/creditApi';

const CreditModal = () => {
    const { isCreditModalOpen, setIsCreditModalOpen, credits, refreshCredits, user } = useAuth();
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [purchasing, setPurchasing] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isCreditModalOpen) {
            fetchPackages();
        }
    }, [isCreditModalOpen]);

    const fetchPackages = async () => {
        try {
            setLoading(true);
            const res = await getPackages();
            if (res.success) setPackages(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (pkgName) => {
        setError('');
        setPurchasing(pkgName);
        try {
            const res = await createOrder(pkgName);
            if (res.success) {
                const orderData = res.data;
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
                                await refreshCredits();
                                setIsCreditModalOpen(false);
                            }
                        } catch (err) {
                            setError("Payment verification failed.");
                        } finally {
                            setPurchasing(null);
                        }
                    },
                    prefill: { name: user?.name, email: user?.email },
                    theme: { color: "#22d3ee" },
                    modal: { ondismiss: () => setPurchasing(null) }
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            }
        } catch (err) {
            setError("Failed to initiate purchase.");
            setPurchasing(null);
        }
    };

    return (
        <AnimatePresence>
            {isCreditModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsCreditModalOpen(false)}
                        className="absolute inset-0 bg-[#030712]/80 backdrop-blur-xl"
                    />

                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="relative w-full max-w-2xl bg-gray-900/50 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl glass p-6 md:p-8"
                    >
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsCreditModalOpen(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors z-10"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col lg:flex-row gap-8 md:gap-10">
                            {/* Left Side: Info */}
                            <div className="flex-1">
                                <div className="mb-6 md:mb-8">
                                    <h2 className="text-2xl md:text-3xl font-black text-white mb-2 tracking-tight">Top Up Credits</h2>
                                    <p className="text-sm md:text-base text-gray-400 font-medium">Power your career with AI roadmaps & resume optimization.</p>
                                </div>

                                <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-5 md:p-6 mb-6 md:mb-8">
                                    <p className="text-[9px] md:text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Current Balance</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl md:text-3xl font-black text-white">{credits?.totalCredits || 0}</span>
                                        <Zap className="text-cyan-400 fill-cyan-400" size={18} md:size={20} />
                                    </div>
                                </div>

                                <ul className="hidden md:block space-y-4">
                                    {['Full AI Access', 'Instant Roadmap Generation', 'ATS Resume Scoring', 'Priority Support'].map((feat, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-gray-300">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <Check size={12} className="text-emerald-400" />
                                            </div>
                                            {feat}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Right Side: Packages */}
                            <div className="flex-1 space-y-4">
                                {loading ? (
                                    <div className="h-64 flex flex-col items-center justify-center text-gray-500 gap-3">
                                        <Loader2 className="animate-spin text-cyan-400" size={32} />
                                        <p className="text-xs font-bold uppercase tracking-widest">Loading Packages...</p>
                                    </div>
                                ) : (
                                    packages.map((pkg, i) => (
                                        <motion.div
                                            key={pkg.name}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`group relative bg-white/5 border transition-all duration-300 rounded-2xl p-5 cursor-pointer hover:bg-white/10 ${pkg.name === 'PRO' ? 'border-cyan-500/50' : 'border-white/10'}`}
                                            onClick={() => handlePurchase(pkg.name)}
                                        >
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{pkg.displayName}</span>
                                                {pkg.name === 'PRO' && (
                                                    <span className="bg-cyan-500 text-gray-900 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]">Popular</span>
                                                )}
                                            </div>
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="text-xl font-black text-white">{pkg.credits} Credits</p>
                                                    <p className="text-xs text-gray-500 font-bold">{pkg.priceDisplay}</p>
                                                </div>
                                                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500 group-hover:text-gray-900 transition-all">
                                                    {purchasing === pkg.name ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {error && (
                            <p className="mt-6 text-center text-red-400 text-xs font-bold uppercase tracking-widest italic">{error}</p>
                        )}

                        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-6 opacity-30">
                            <div className="flex items-center gap-2 grayscale text-white">
                                <ShieldCheck size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Secure Payments</span>
                            </div>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4 grayscale invert" alt="Razorpay" />
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CreditModal;
