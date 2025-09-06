import React, { useState, useEffect, useMemo } from 'react';
import {
    Play,
    Send,
    CheckCircle,
    AlertCircle,
    BarChart3,
    MessageSquare,
    Briefcase,
    Star,
    TrendingUp,
    RefreshCw,
    ChevronDown,
    Loader2,
    Crown,
    Zap,
    Shield,
    Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";

import { authApis, endpoints } from '@configs/APIs';
import { toast } from 'sonner';

const toSafeDate = (value) => {
    if (!value) return null;
    const str = typeof value === 'string' ? value.replace(' ', 'T') : value;
    const d = new Date(str);
    return isNaN(d) ? null : d;
};

const normalizeSession = (s) => {
    if (!s) return null;
    return {
        ...s,
        startedAt: s.startedAt ?? s.started_at ?? null,
        completedAt: s.completedAt ?? s.completed_at ?? null,
        status: s.status ?? 'IN_PROGRESS',
    };
};

const normalizeQuestion = (data) => {
    if (!data) return null;
    return {
        id: data.id || data.questionId,
        question: data.question || data.question_text,
        difficulty: data.difficulty,
        category: data.category,
        expectedSkills: data.expectedSkills || data.expected_skills || [],
    };
};

const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
};

const ScoreIcon = ({ score }) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
};

const LoadingSpinner = ({ size = "w-5 h-5", text = "" }) => (
    <div className="flex items-center justify-center">
        <Loader2 className={`${size} animate-spin text-blue-600 mr-2`} />
        {text && <span className="text-gray-600">{text}</span>}
    </div>
);

// Dialog Components
const Dialog = {
    Root: DialogPrimitive.Root,
    Trigger: DialogPrimitive.Trigger,
    Portal: DialogPrimitive.Portal,
    Overlay: (props) => <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-40" {...props} />,
    Content: ({ children, className = "", ...props }) => (
        <DialogPrimitive.Content
            className={`fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#2d2d2d] text-black dark:text-white p-8 shadow-xl z-50 max-h-[90vh] overflow-y-auto ${className}`}
            {...props}
        >
            {children}
        </DialogPrimitive.Content>
    ),
    Title: DialogPrimitive.Title,
    Close: DialogPrimitive.Close,
};

// Upgrade Dialog Component
const UpgradeDialog = ({ open, onClose, onUpgrade }) => (
    <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
                <div className="text-center">
                    <div className="mb-6">
                        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                            <Crown className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                            Nâng cấp gói Premium
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            Bạn cần gói Premium để sử dụng tính năng luyện tập phỏng vấn AI
                        </p>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-purple-800 dark:text-purple-300 text-lg">Premium</h4>
                                <span className="bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-semibold">
                                    Cần thiết
                                </span>
                            </div>
                            <span className="text-xl font-bold text-purple-600 dark:text-purple-400">115.000₫</span>
                        </div>
                        <ul className="text-sm text-purple-700 dark:text-purple-300 text-left space-y-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Mock interview với AI thông minh</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Phân tích chi tiết kỹ năng</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Phản hồi cá nhân hóa</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Tạo Cover Letter bằng AI</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 dark:bg-[#444] text-black dark:text-white hover:bg-gray-300 px-4 py-2 rounded-lg font-semibold transition"
                        >
                            Để sau
                        </button>
                        <button
                            onClick={onUpgrade}
                            className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition"
                        >
                            <Zap size={16} />
                            Nâng cấp Premium
                        </button>
                    </div>
                </div>
                <Dialog.Close asChild>
                    <button className="absolute right-4 top-4 hover:bg-gray-200 dark:hover:bg-[#444] p-2 rounded-md transition">
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

// Mapping cho độ khó và danh mục
const DIFFICULTY_MAP = {
    'JUNIOR': 'Cấp dễ',
    'MIDDLE': 'Trung bình',
    'SENIOR': 'Cao độ khó'
};

const CATEGORY_MAP = {
    'TECHNICAL': 'Kỹ thuật',
    'BEHAVIORAL': 'Hành vi',
    'SITUATIONAL': 'Tình huống',
    'GENERAL': 'Chung'
};

const STATUS_MAP = {
    'IN_PROGRESS': 'Đang tiến hành',
    'COMPLETED': 'Hoàn thành',
    'IDLE': 'Chờ'
};

const ApplicationSelector = ({ applications, selectedId, onSelect, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedApp = applications.find(app => app.id === selectedId);

    if (isLoading) {
        return (
            <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <LoadingSpinner text="Đang tải danh sách ứng tuyển..." />
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                <div className="flex items-center text-gray-500">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    Không có đơn ứng tuyển nào
                </div>
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 border-2 border-gray-200 rounded-xl bg-white hover:bg-gray-50 hover:border-blue-300 transition-all duration-200 flex items-center justify-between shadow-sm"
            >
                <div className="flex items-center">
                    <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="text-left">
                        {selectedApp ? (
                            <div>
                                <div className="font-semibold text-gray-900">{selectedApp.jobTitle || 'Vị trí không xác định'}</div>
                                <div className="text-sm text-gray-500">{selectedApp.companyName || 'Công ty không xác định'}</div>
                            </div>
                        ) : (
                            <span className="text-gray-500 font-medium">Chọn đơn ứng tuyển</span>
                        )}
                    </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {applications.map((app, index) => (
                            <button
                                key={app.id}
                                onClick={() => {
                                    onSelect(app.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full p-4 text-left hover:bg-blue-50 transition-colors ${index !== applications.length - 1 ? 'border-b border-gray-100' : ''
                                    }`}
                            >
                                <div className="font-semibold text-gray-900">{app.jobTitle || 'Vị trí không xác định'}</div>
                                <div className="text-sm text-gray-500">{app.companyName || 'Công ty không xác định'}</div>
                                {app.appliedDate && (
                                    <div className="text-xs text-gray-400 mt-1">
                                        Ứng tuyển: {new Date(app.appliedDate).toLocaleDateString('vi-VN')}
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const MockInterview = ({ userPackage, onUpgradeClick }) => {
    const [currentSession, setCurrentSession] = useState(null);
    const [sessionStatus, setSessionStatus] = useState('IDLE');
    const [currentAnswer, setCurrentAnswer] = useState('');
    const [turns, setTurns] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingQ, setIsLoadingQ] = useState(false);
    const [nextQuestion, setNextQuestion] = useState(null);
    const [sessionStats, setSessionStats] = useState(null);
    const [error, setError] = useState('');
    const [applications, setApplications] = useState([]);
    const [selectedApplicationId, setSelectedApplicationId] = useState(null);
    const [isLoadingApps, setIsLoadingApps] = useState(true);
    const [isCreatingSession, setIsCreatingSession] = useState(false);
    const [isCompletingSession, setIsCompletingSession] = useState(false);
    const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

    const token = useMemo(() => localStorage.getItem('token'), []);
    const authHeader = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

    // Check if user has AI access (Premium package)
    const checkAIAccess = () => {
        return userPackage?.isActive === true && userPackage?.package?.name === 'Premium';
    };

    const handleAIFeatureClick = (callback) => {
        if (checkAIAccess()) {
            callback();
        } else {
            if (onUpgradeClick) {
                onUpgradeClick();
            } else {
                setIsUpgradeDialogOpen(true);
            }
        }
    };

    const handleUpgradeRedirect = () => {
        console.log("🚀 Navigating to upgrade page...");
        setIsUpgradeDialogOpen(false);
        // Add navigation logic here
        window.location.href = "/candidate-upgrade";
    };

    useEffect(() => {
        const loadApplications = async () => {
            try {
                if (!token) return;
                setIsLoadingApps(true);
                const res = await authApis().get(endpoints['candidate-applied'], {
                    headers: authHeader,
                });
                const apps = Array.isArray(res.data) ? res.data : [];
                setApplications(apps);
                if (apps.length > 0 && !selectedApplicationId) {
                    setSelectedApplicationId(apps[0].id);
                }
            } catch (err) {
                console.error(err);
                toast.error('Không thể tải danh sách ứng tuyển!');
            } finally {
                setIsLoadingApps(false);
            }
        };
        loadApplications();
    }, [token, selectedApplicationId]);

    const createSession = async (applicationId) => {
        if (!applicationId) {
            setError('Vui lòng chọn đơn ứng tuyển!');
            return;
        }
        if (!token) {
            setError('Bạn chưa đăng nhập!');
            return;
        }
        try {
            setIsCreatingSession(true);
            setError('');

            const response = await authApis().post(
                endpoints['create-session'],
                { applicationId },
                { headers: authHeader }
            );

            const session = normalizeSession(response.data);
            setCurrentSession(session);
            setSessionStatus('IN_PROGRESS');
            setTurns([]);
            setSessionStats(null);

            if (session?.id) {
                await fetchCurrentQuestion(session.id);
            }
        } catch (err) {
            console.error('Create session error:', err);
            setError(
                'Không thể bắt đầu phiên phỏng vấn: ' +
                (err?.response?.data?.message || err?.message || 'Lỗi không xác định')
            );
        } finally {
            setIsCreatingSession(false);
        }
    };

    const fetchCurrentQuestion = async (sessionId) => {
        try {
            setIsLoadingQ(true);
            const res = await authApis().get(endpoints['current-question'](sessionId), {
                headers: authHeader,
            });
            setNextQuestion(normalizeQuestion(res?.data));
        } catch (err) {
            console.error(err);
            setError(
                'Không lấy được câu hỏi hiện tại: ' +
                (err?.response?.data?.message || err?.message || 'Lỗi không xác định')
            );
        } finally {
            setIsLoadingQ(false);
        }
    };

    const submitAnswer = async () => {
        if (!currentSession?.id) {
            setError('Chưa có phiên phỏng vấn hợp lệ.');
            return;
        }
        if (!currentAnswer.trim()) {
            setError('Vui lòng nhập câu trả lời.');
            return;
        }

        try {
            setIsSubmitting(true);
            setError('');

            const response = await authApis().post(
                endpoints['submit-answer'](currentSession.id),
                {
                    question: nextQuestion?.question,
                    answer: currentAnswer.trim(),
                    difficulty: nextQuestion?.difficulty,
                    category: nextQuestion?.category,
                },
                { headers: authHeader }
            );

            const result = response.data;
            if (result?.currentTurn) setTurns((prev) => [...prev, result.currentTurn]);
            setNextQuestion(result?.nextQuestion || null);
            setSessionStats(result?.sessionStats || null);
            setCurrentAnswer('');

            if (!result?.nextQuestion?.question) {
                await fetchCurrentQuestion(currentSession.id);
            }
        } catch (err) {
            console.error(err);
            setError(
                'Gửi câu trả lời thất bại: ' +
                (err?.response?.data?.message || err?.message || 'Lỗi không xác định')
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const completeSession = async () => {
        if (!currentSession?.id) return;
        try {
            setIsCompletingSession(true);
            const response = await authApis().put(
                endpoints['complete-session'](currentSession.id),
                {},
                { headers: authHeader }
            );
            const completedSession = normalizeSession(response.data);
            setCurrentSession(completedSession);
            setSessionStatus('COMPLETED');
            setNextQuestion(null);
        } catch (err) {
            console.error(err);
            setError(
                'Kết thúc phiên thất bại: ' +
                (err?.response?.data?.message || err?.message || 'Lỗi không xác định')
            );
        } finally {
            setIsCompletingSession(false);
        }
    };

    const resetSession = () => {
        setCurrentSession(null);
        setSessionStatus('IDLE');
        setCurrentAnswer('');
        setTurns([]);
        setNextQuestion(null);
        setSessionStats(null);
        setError('');
    };

    const selectedApp = applications.find(app => app.id === selectedApplicationId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl mr-4">
                            <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                            Luyện Tập Phỏng Vấn AI
                        </h1>
                        {checkAIAccess() && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-3 bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg"
                            >
                                <Crown className="w-5 h-5 text-white" />
                            </motion.div>
                        )}
                    </div>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Luyện tập kỹ năng phỏng vấn với phản hồi từ AI thông minh và cá nhân hóa
                    </p>
                </motion.div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-xl shadow-sm"
                        >
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                                <p className="text-red-700">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Left Column */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Idle State */}
                        {sessionStatus === 'IDLE' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                            >
                                <div className="text-center mb-8">
                                    <div className="relative mx-auto mb-6">
                                        <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto shadow-lg">
                                            <Play className="w-10 h-10 text-white ml-1" />
                                        </div>
                                        {checkAIAccess() && (
                                            <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2">
                                                <Sparkles className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                        {checkAIAccess() ? 'Sẵn sàng luyện tập với AI!' : 'Nâng cấp để sử dụng AI'}
                                    </h2>
                                    <p className="text-gray-600 mb-8 text-lg">
                                        {checkAIAccess()
                                            ? 'Chọn một đơn ứng tuyển và bắt đầu phiên luyện tập phỏng vấn với AI thông minh'
                                            : 'Bạn cần gói Premium để trải nghiệm tính năng luyện tập phỏng vấn AI'
                                        }
                                    </p>
                                </div>

                                {checkAIAccess() ? (
                                    <>
                                        {/* Application Selection */}
                                        <div className="mb-8">
                                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                Chọn đơn ứng tuyển để thực hành phỏng vấn
                                            </label>
                                            <ApplicationSelector
                                                applications={applications}
                                                selectedId={selectedApplicationId}
                                                onSelect={setSelectedApplicationId}
                                                isLoading={isLoadingApps}
                                            />

                                            {selectedApp && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="mt-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200"
                                                >
                                                    <div className="flex items-start">
                                                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                                            <Briefcase className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <h4 className="font-bold text-gray-800 text-lg">{selectedApp.jobTitle}</h4>
                                                            <p className="text-gray-600 font-medium">{selectedApp.companyName}</p>
                                                            {selectedApp.jobDescription && (
                                                                <p className="text-sm text-gray-500 mt-2 line-clamp-3">{selectedApp.jobDescription}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div className="text-center">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => createSession(selectedApplicationId)}
                                                disabled={isCreatingSession || !selectedApplicationId || isLoadingApps}
                                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center mx-auto shadow-lg"
                                            >
                                                {isCreatingSession ? (
                                                    <>
                                                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                                                        Đang khởi tạo phiên AI...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Play className="w-6 h-6 mr-3" />
                                                        Bắt Đầu Luyện Tập AI
                                                    </>
                                                )}
                                            </motion.button>

                                            {!selectedApplicationId && !isLoadingApps && applications.length > 0 && (
                                                <p className="text-sm text-red-500 mt-3">Vui lòng chọn đơn ứng tuyển trước khi bắt đầu</p>
                                            )}
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center">
                                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200 mb-6">
                                            <Shield className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                                            <h3 className="text-lg font-semibold text-purple-800 mb-2">Cần gói Premium</h3>
                                            <p className="text-purple-600 text-sm">
                                                Tính năng luyện tập phỏng vấn AI chỉ có trong gói Premium
                                            </p>
                                        </div>
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleAIFeatureClick(() => { })}
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center mx-auto shadow-lg"
                                        >
                                            <Crown className="w-5 h-5 mr-2" />
                                            Nâng cấp Premium
                                        </motion.button>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {/* Loading Question State */}
                        {sessionStatus === 'IN_PROGRESS' && isLoadingQ && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white rounded-2xl shadow-xl p-8"
                            >
                                <LoadingSpinner size="w-8 h-8" text="AI đang chuẩn bị câu hỏi cho bạn..." />
                            </motion.div>
                        )}

                        {/* In Progress */}
                        {sessionStatus === 'IN_PROGRESS' && !isLoadingQ && nextQuestion && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                            >
                                <div className="flex items-start justify-between mb-6">
                                    <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                                            <MessageSquare className="w-6 h-6 text-blue-600" />
                                        </div>
                                        Câu hỏi {turns.length + 1}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-500">
                                            {DIFFICULTY_MAP[nextQuestion.difficulty] || nextQuestion.difficulty}
                                        </span>
                                        <span className="text-sm font-medium text-gray-500">
                                            {CATEGORY_MAP[nextQuestion.category] || nextQuestion.category}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-gray-700 text-lg mb-6">{nextQuestion.question}</p>

                                <textarea
                                    rows={5}
                                    value={currentAnswer}
                                    onChange={(e) => setCurrentAnswer(e.target.value)}
                                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                                    placeholder="Nhập câu trả lời của bạn..."
                                />

                                <div className="flex justify-end mt-6 gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={submitAnswer}
                                        disabled={isSubmitting || !currentAnswer.trim()}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-md"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Đang gửi...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 mr-2" />
                                                Gửi câu trả lời
                                            </>
                                        )}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={completeSession}
                                        disabled={isCompletingSession}
                                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold transition flex items-center shadow-md"
                                    >
                                        {isCompletingSession ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Đang kết thúc...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                Kết thúc phiên
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}

                        {/* Completed Session */}
                        {sessionStatus === 'COMPLETED' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
                            >
                                <div className="text-center mb-8">
                                    <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle className="w-10 h-10 text-green-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                        Phiên phỏng vấn đã hoàn thành
                                    </h2>
                                    <p className="text-gray-600">
                                        Bạn có thể xem lại kết quả hoặc bắt đầu lại một phiên mới để luyện tập thêm.
                                    </p>
                                </div>

                                {sessionStats && (
                                    <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                        <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                            Thống kê phiên phỏng vấn
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex justify-between text-gray-700">
                                                <span>Tổng số câu hỏi:</span>
                                                <span className="font-semibold">{sessionStats.totalQuestions}</span>
                                            </li>
                                            <li className="flex justify-between text-gray-700">
                                                <span>Điểm trung bình:</span>
                                                <span
                                                    className={`font-semibold ${getScoreColor(sessionStats.averageScore)}`}
                                                >
                                                    {sessionStats.averageScore} / 100
                                                </span>
                                            </li>
                                            <li className="flex justify-between text-gray-700">
                                                <span>Điểm cao nhất:</span>
                                                <span className="font-semibold text-green-600">
                                                    {sessionStats.highestScore}
                                                </span>
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                <div className="flex justify-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={resetSession}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold shadow-md"
                                    >
                                        <RefreshCw className="w-5 h-5 mr-2 inline-block" />
                                        Bắt đầu lại
                                    </motion.button>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Previous Answers */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                Câu trả lời trước
                            </h3>
                            {turns.length === 0 ? (
                                <p className="text-gray-500 text-sm">Chưa có câu trả lời nào.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {turns.map((turn, idx) => (
                                        <li key={idx} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-700 mb-2">
                                                <span className="font-semibold">Q{idx + 1}:</span> {turn.question}
                                            </p>
                                            <p className="text-gray-700 mb-2">
                                                <span className="font-semibold">A:</span> {turn.answer}
                                            </p>
                                            {turn.aiScore !== undefined && (
                                                <div className="flex items-center gap-2">
                                                    <ScoreIcon score={turn.aiScore} />
                                                    <span className={`font-semibold ${getScoreColor(turn.aiScore)}`}>
                                                        {turn.aiScore} / 100
                                                    </span>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Upgrade Dialog */}
            <UpgradeDialog
                open={isUpgradeDialogOpen}
                onClose={() => setIsUpgradeDialogOpen(false)}
                onUpgrade={handleUpgradeRedirect}
            />
        </div>
    );
};

export default MockInterview;
