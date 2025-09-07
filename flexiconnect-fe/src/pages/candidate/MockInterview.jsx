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
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
};

// Components
const Card = ({ children, className = "" }) => (
    <div className={`rounded-xl shadow p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 ${className}`}>
        {children}
    </div>
);

const Button = ({ children, className = "", ...props }) => (
    <button {...props} className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${className}`}>
        {children}
    </button>
);

const ScoreIcon = ({ score }) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
    return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
};

const LoadingSpinner = ({ size = "w-5 h-5", text = "" }) => (
    <div className="flex items-center justify-center">
        <Loader2 className={`${size} animate-spin text-neutral-600 dark:text-neutral-400 mr-2`} />
        {text && <span className="text-neutral-600 dark:text-neutral-400">{text}</span>}
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
            className={`fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-8 shadow-xl z-50 max-h-[90vh] overflow-y-auto border border-neutral-200 dark:border-neutral-700 ${className}`}
            {...props}
        >
            {children}
        </DialogPrimitive.Content>
    ),
    Title: DialogPrimitive.Title,
    Close: DialogPrimitive.Close,
};

// Upgrade Dialog
const UpgradeDialog = ({ open, onClose, onUpgrade }) => (
    <Dialog.Root open={open} onOpenChange={onClose}>
        <Dialog.Portal>
            <Dialog.Overlay />
            <Dialog.Content>
                <div className="text-center">
                    <div className="mb-6">
                        <div className="mx-auto w-16 h-16 bg-neutral-800 dark:bg-neutral-700 rounded-full flex items-center justify-center mb-4">
                            <Crown className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                            Nâng cấp gói Premium
                        </h3>
                        <p className="text-neutral-600 dark:text-neutral-300">
                            Bạn cần gói Premium để sử dụng tính năng luyện tập phỏng vấn AI
                        </p>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700 mb-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-lg">Premium</h4>
                                <span className="bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded-full text-xs font-semibold">
                                    Cần thiết
                                </span>
                            </div>
                            <span className="text-xl font-bold text-neutral-800 dark:text-neutral-200">115.000₫</span>
                        </div>
                        <ul className="text-sm text-neutral-700 dark:text-neutral-300 text-left space-y-2">
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span>Mock interview với AI thông minh</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span>Phân tích chi tiết kỹ năng</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span>Phản hồi cá nhân hóa</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span>Tạo Cover Letter bằng AI</span>
                            </li>
                        </ul>
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={onClose}
                            className="flex-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-900 dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-600 px-4 py-2 rounded-lg font-semibold"
                        >
                            Để sau
                        </Button>
                        <Button
                            onClick={onUpgrade}
                            className="flex-1 bg-neutral-900 dark:bg-yellow-500 text-white dark:text-black font-semibold hover:bg-neutral-800 dark:hover:bg-yellow-600 flex items-center justify-center gap-2 px-4 py-2 rounded-lg"
                        >
                            <Zap size={16} />
                            Nâng cấp Premium
                        </Button>
                    </div>
                </div>
                <Dialog.Close asChild>
                    <button className="absolute right-4 top-4 hover:bg-neutral-200 dark:hover:bg-neutral-700 p-2 rounded-md transition">
                        <Cross2Icon />
                    </button>
                </Dialog.Close>
            </Dialog.Content>
        </Dialog.Portal>
    </Dialog.Root>
);

// Mappings
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

// Application Selector
const ApplicationSelector = ({ applications, selectedId, onSelect, isLoading }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedApp = applications.find(app => app.id === selectedId);

    if (isLoading) {
        return (
            <div className="w-full p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                <LoadingSpinner text="Đang tải danh sách ứng tuyển..." />
            </div>
        );
    }

    if (applications.length === 0) {
        return (
            <div className="w-full p-4 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl bg-neutral-50 dark:bg-neutral-800">
                <div className="flex items-center text-neutral-500 dark:text-neutral-400">
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
                className="w-full p-4 border-2 border-neutral-200 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-500 transition-all duration-200 flex items-center justify-between shadow-sm"
            >
                <div className="flex items-center">
                    <div className="bg-neutral-100 dark:bg-neutral-700 p-2 rounded-lg mr-3">
                        <Briefcase className="w-5 h-5 text-neutral-600 dark:text-neutral-300" />
                    </div>
                    <span className="text-left">
                        {selectedApp ? (
                            <div>
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100">{selectedApp.jobTitle || 'Vị trí không xác định'}</div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">{selectedApp.companyName || 'Công ty không xác định'}</div>
                            </div>
                        ) : (
                            <span className="text-neutral-500 dark:text-neutral-400 font-medium">Chọn đơn ứng tuyển</span>
                        )}
                    </span>
                </div>
                <ChevronDown className={`w-5 h-5 text-neutral-400 dark:text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 right-0 z-20 mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {applications.map((app, index) => (
                            <button
                                key={app.id}
                                onClick={() => {
                                    onSelect(app.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full p-4 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${index !== applications.length - 1 ? 'border-b border-neutral-100 dark:border-neutral-700' : ''
                                    }`}
                            >
                                <div className="font-semibold text-neutral-900 dark:text-neutral-100">{app.jobTitle || 'Vị trí không xác định'}</div>
                                <div className="text-sm text-neutral-500 dark:text-neutral-400">{app.companyName || 'Công ty không xác định'}</div>
                                {app.appliedDate && (
                                    <div className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
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

// Main Component
const MockInterview = ({ userPackage, onUpgradeClick }) => {
    // State management
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
    const [isLoadingPackage, setIsLoadingPackage] = useState(false);
    const [currentPackage, setCurrentPackage] = useState(userPackage ?? null);

    const checkAIAccess = (pkg) => {
        if (!pkg) return false;

        const isActive = pkg.isActive ?? pkg.is_active;
        const packageId = pkg.packageId?.id ?? pkg.package_id; // lấy id bên trong object
        const isPremium = Number(packageId) === 2; // 2 = Premium
        const endDate = pkg.endDate ? new Date(pkg.endDate) : null;
        const validDate = !endDate || endDate >= new Date();

        const hasAccess = isActive && isPremium && validDate;
        console.log('AI Access allowed?', hasAccess);
        return hasAccess;
    };



    // Memoized values
    const token = useMemo(() => localStorage.getItem('token'), []);
    const authHeader = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
    const hasAIAccess = useMemo(() => checkAIAccess(currentPackage), [currentPackage]);

    useEffect(() => {
        const fetchPackage = async () => {
            try {
                setIsLoadingPackage(true);
                const res = await authApis().get(endpoints['current-package'], { headers: authHeader });
                setCurrentPackage(res.data);
            } catch (err) {
                console.error('Load current package error:', err);
            } finally {
                setIsLoadingPackage(false);
            }
        };


        if (token) fetchPackage();
    }, [token, authHeader]);

    const handleAIFeatureClick = (callback) => {
        if (hasAIAccess) {
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
        window.location.href = "/candidate-upgrade";
    };

    // Load applications
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
    }, [token, authHeader, selectedApplicationId]);

    // API functions
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
            console.log('New turn:', result.currentTurn);

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
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-neutral-800 dark:bg-neutral-700 p-3 rounded-xl mr-4">
                            <MessageSquare className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100">
                            Luyện Tập Phỏng Vấn AI
                        </h1>
                        {checkAIAccess(userPackage) && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-3 bg-yellow-500 dark:bg-yellow-400 p-2 rounded-lg"
                            >
                                <Crown className="w-5 h-5 text-white dark:text-black" />
                            </motion.div>
                        )}
                    </div>
                    <p className="text-neutral-600 dark:text-neutral-400 text-lg max-w-2xl mx-auto">
                        Luyện tập kỹ năng phỏng vấn với phản hồi từ AI thông minh và cá nhân hóa
                    </p>
                </motion.div>

                {/* Error Display */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-500 p-4 mb-6 rounded-xl shadow-sm"
                        >
                            <div className="flex items-center">
                                <AlertCircle className="w-5 h-5 text-red-400 dark:text-red-500 mr-3" />
                                <p className="text-red-700 dark:text-red-300">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                    {/* Left Column - Main Content */}
                    <div className="xl:col-span-3 space-y-6">
                        {/* Idle State */}
                        {sessionStatus === 'IDLE' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Card className="p-8 text-center">
                                    <div className="relative mx-auto mb-6 w-20 h-20">
                                        <div className="bg-neutral-800 dark:bg-neutral-700 rounded-full w-full h-full flex items-center justify-center shadow-lg">
                                            <Play className="w-10 h-10 text-white ml-1" />
                                        </div>
                                        {hasAIAccess && (
                                            <div className="absolute -top-1 -right-1 bg-yellow-500 dark:bg-yellow-400 rounded-full p-2">
                                                <Sparkles className="w-4 h-4 text-white dark:text-black" />
                                            </div>
                                        )}
                                    </div>

                                    <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-3">
                                        {hasAIAccess ? 'Sẵn sàng luyện tập với AI!' : 'Nâng cấp để sử dụng AI'}
                                    </h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-lg">
                                        {hasAIAccess
                                            ? 'Chọn một đơn ứng tuyển và bắt đầu phiên luyện tập phỏng vấn với AI thông minh'
                                            : 'Bạn cần gói Premium để trải nghiệm tính năng luyện tập phỏng vấn AI'}
                                    </p>

                                    {hasAIAccess ? (
                                        <>
                                            <div className="mb-8">
                                                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
                                                    Chọn đơn ứng tuyển để thực hành phỏng vấn
                                                </label>
                                                <ApplicationSelector
                                                    applications={applications}
                                                    selectedId={selectedApplicationId}
                                                    onSelect={setSelectedApplicationId}
                                                    isLoading={isLoadingApps}
                                                />
                                            </div>

                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => createSession(selectedApplicationId)}
                                                disabled={isCreatingSession || !selectedApplicationId || isLoadingApps}
                                                className="bg-neutral-900 dark:bg-neutral-700 hover:bg-neutral-800 dark:hover:bg-neutral-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center mx-auto shadow-lg"
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
                                        </>
                                    ) : (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={handleUpgradeRedirect}
                                            className="bg-yellow-500 dark:bg-yellow-400 hover:bg-yellow-600 dark:hover:bg-yellow-500 text-black px-10 py-4 rounded-xl font-bold text-lg transition-all duration-200 flex items-center mx-auto shadow-lg"
                                        >
                                            <Crown className="w-6 h-6 mr-3" />
                                            Nâng Cấp Premium
                                        </motion.button>
                                    )}
                                </Card>
                            </motion.div>
                        )}


                        {/* In Progress State */}
                        {sessionStatus === 'IN_PROGRESS' && currentSession && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-6"
                            >
                                {/* Session Header */}
                                <Card className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center">
                                            <div className="bg-green-500 dark:bg-green-600 rounded-full w-12 h-12 flex items-center justify-center mr-4">
                                                <MessageSquare className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                                    Phiên Phỏng Vấn Đang Diễn Ra
                                                </h2>
                                                <p className="text-neutral-600 dark:text-neutral-400">
                                                    {selectedApp ? `${selectedApp.jobTitle} tại ${selectedApp.companyName}` : 'Đang luyện tập...'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={() => handleAIFeatureClick(completeSession)}
                                                disabled={isCompletingSession}
                                                className="bg-yellow-500 dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700 text-black dark:text-white"
                                            >
                                                {isCompletingSession ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <CheckCircle className="w-4 h-4" />
                                                )}
                                                Hoàn Thành
                                            </Button>
                                            <Button
                                                onClick={resetSession}
                                                className="bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                                Làm Lại
                                            </Button>
                                        </div>
                                    </div>
                                </Card>

                                {/* Current Question */}
                                <Card className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-blue-500 dark:bg-blue-600 rounded-lg p-2 mr-3">
                                            <MessageSquare className="w-5 h-5 text-white" />
                                        </div>
                                        <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                                            Câu Hỏi Hiện Tại
                                        </h3>
                                    </div>

                                    {isLoadingQ ? (
                                        <LoadingSpinner size="w-6 h-6" text="Đang tải câu hỏi..." />
                                    ) : nextQuestion ? (
                                        <div className="space-y-4">
                                            <div className="flex gap-2 mb-4">
                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                                                    {DIFFICULTY_MAP[nextQuestion.difficulty] || nextQuestion.difficulty}
                                                </span>
                                                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm font-medium">
                                                    {CATEGORY_MAP[nextQuestion.category] || nextQuestion.category}
                                                </span>
                                            </div>

                                            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 border border-neutral-200 dark:border-neutral-700">
                                                <p className="text-lg text-neutral-800 dark:text-neutral-100 leading-relaxed">
                                                    {nextQuestion.question}
                                                </p>
                                            </div>

                                            {nextQuestion.expectedSkills && nextQuestion.expectedSkills.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
                                                        Kỹ năng cần đánh giá:
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {nextQuestion.expectedSkills.map((skill, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded-lg text-sm"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <AlertCircle className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto mb-3" />
                                            <p className="text-neutral-600 dark:text-neutral-400">
                                                Không có câu hỏi nào để hiển thị
                                            </p>
                                        </div>
                                    )}
                                </Card>

                                {/* Answer Input */}
                                {nextQuestion && (
                                    <Card className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="bg-purple-500 dark:bg-purple-600 rounded-lg p-2 mr-3">
                                                <Send className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                                                Câu Trả Lời Của Bạn
                                            </h3>
                                        </div>

                                        <div className="space-y-4">
                                            <textarea
                                                value={currentAnswer}
                                                onChange={(e) => setCurrentAnswer(e.target.value)}
                                                placeholder="Nhập câu trả lời của bạn..."
                                                className="w-full p-4 border border-neutral-300 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent resize-none transition-all duration-200"
                                                rows={6}
                                                disabled={isSubmitting}
                                            />

                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                                                    {currentAnswer.length} ký tự
                                                </span>
                                                <Button
                                                    onClick={() => handleAIFeatureClick(submitAnswer)}
                                                    disabled={isSubmitting || !currentAnswer.trim()}
                                                    className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            Đang gửi...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-4 h-4" />
                                                            Gửi Câu Trả Lời
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                )}

                                {/* Previous Questions & Answers */}
                                {turns.length > 0 && (
                                    <Card className="p-6">
                                        <div className="flex items-center mb-6">
                                            <div className="bg-neutral-600 dark:bg-neutral-500 rounded-lg p-2 mr-3">
                                                <BarChart3 className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                                                Lịch Sử Câu Hỏi & Đánh Giá
                                            </h3>
                                        </div>

                                        <div className="space-y-6">
                                            {turns.map((turn, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 bg-neutral-50 dark:bg-neutral-800"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-lg">
                                                            Câu hỏi #{idx + 1}
                                                        </h4>
                                                        {turn.score !== undefined && (
                                                            <div className="flex items-center gap-2">
                                                                <ScoreIcon score={turn.score} />
                                                                <span className={`font-bold text-lg ${getScoreColor(turn.score)}`}>
                                                                    {turn.score}/100
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {turn.question && (
                                                        <div className="mb-4">
                                                            <div className="flex gap-2 mb-2">
                                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                                                                    {DIFFICULTY_MAP[turn.difficulty] || turn.difficulty}
                                                                </span>
                                                                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                                                                    {CATEGORY_MAP[turn.category] || turn.category}
                                                                </span>
                                                            </div>
                                                            <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600">
                                                                <strong>Câu hỏi:</strong> {turn.question}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {turn.answer && (
                                                        <div className="mb-4">
                                                            <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600">
                                                                <strong>Câu trả lời:</strong> {turn.answer}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {turn.feedback && (
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                                            <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                                                                <Star className="w-4 h-4" />
                                                                Phản hồi từ AI
                                                            </h5>
                                                            <p className="text-blue-700 dark:text-blue-300 whitespace-pre-line">
                                                                {turn.feedback}
                                                            </p>
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </motion.div>
                        )}

                        {/* Completed State */}
                        {sessionStatus === 'COMPLETED' && currentSession && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-6"
                            >
                                <Card className="p-8 text-center">
                                    <div className="mb-6">
                                        <div className="bg-green-500 dark:bg-green-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
                                            Hoàn Thành Phiên Phỏng Vấn!
                                        </h2>
                                        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                                            Bạn đã hoàn thành phiên luyện tập phỏng vấn
                                        </p>
                                        {currentSession.completedAt && (
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
                                                Hoàn thành lúc: {new Date(currentSession.completedAt).toLocaleString('vi-VN')}
                                            </p>
                                        )}
                                    </div>

                                    {sessionStats && (
                                        <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-6 mb-6 border border-neutral-200 dark:border-neutral-700">
                                            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                                                Thống Kê Phiên
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                                        {sessionStats.totalQuestions || turns.length}
                                                    </div>
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        Tổng câu hỏi
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className={`text-2xl font-bold ${getScoreColor(sessionStats.averageScore || 0)}`}>
                                                        {Math.round(sessionStats.averageScore || 0)}
                                                    </div>
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        Điểm trung bình
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                        {Math.floor((sessionStats.duration || 0) / 60000)}m
                                                    </div>
                                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                                        Thời gian
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex gap-4 justify-center">
                                        <Button
                                            onClick={resetSession}
                                            className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                            Luyện Tập Mới
                                        </Button>
                                        <Button
                                            onClick={() => window.location.reload()}
                                            className="bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white"
                                        >
                                            <BarChart3 className="w-4 h-4" />
                                            Xem Chi Tiết
                                        </Button>
                                    </div>
                                </Card>

                                {/* Show completed turns */}
                                {turns.length > 0 && (
                                    <Card className="p-6">
                                        <div className="flex items-center mb-6">
                                            <div className="bg-neutral-600 dark:bg-neutral-500 rounded-lg p-2 mr-3">
                                                <BarChart3 className="w-5 h-5 text-white" />
                                            </div>
                                            <h3 className="text-xl font-bold text-neutral-800 dark:text-neutral-100">
                                                Kết Quả Chi Tiết
                                            </h3>
                                        </div>

                                        <div className="space-y-6">
                                            {turns.map((turn, idx) => (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    className="border border-neutral-200 dark:border-neutral-700 rounded-xl p-6 bg-neutral-50 dark:bg-neutral-800"
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-lg">
                                                            Câu hỏi #{idx + 1}
                                                        </h4>
                                                        {turn.score !== undefined && (
                                                            <div className="flex items-center gap-2">
                                                                <ScoreIcon score={turn.score} />
                                                                <span className={`font-bold text-lg ${getScoreColor(turn.score)}`}>
                                                                    {turn.score}/100
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {turn.question && (
                                                        <div className="mb-4">
                                                            <div className="flex gap-2 mb-2">
                                                                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs font-medium">
                                                                    {DIFFICULTY_MAP[turn.difficulty] || turn.difficulty}
                                                                </span>
                                                                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs font-medium">
                                                                    {CATEGORY_MAP[turn.category] || turn.category}
                                                                </span>
                                                            </div>
                                                            <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600">
                                                                <strong>Câu hỏi:</strong> {turn.question}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {turn.answer && (
                                                        <div className="mb-4">
                                                            <p className="text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-900 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600">
                                                                <strong>Câu trả lời:</strong> {turn.answer}
                                                            </p>
                                                        </div>
                                                    )}

                                                    {turn.aiFeedback?.length > 0 && (
                                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                                                            <h5 className="font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center gap-2">
                                                                <Star className="w-4 h-4" />
                                                                Phản hồi từ AI
                                                            </h5>
                                                            <p className="text-blue-700 dark:text-blue-300 whitespace-pre-line">
                                                                {turn.aiFeedback}
                                                            </p>
                                                        </div>
                                                    )}



                                                </motion.div>
                                            ))}
                                        </div>
                                    </Card>
                                )}
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Session Stats Card */}
                        {(sessionStatus === 'IN_PROGRESS' || sessionStatus === 'COMPLETED') && sessionStats && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                            >
                                <Card className="p-6">
                                    <div className="flex items-center mb-4">
                                        <BarChart3 className="w-5 h-5 text-neutral-600 dark:text-neutral-400 mr-2" />
                                        <h3 className="font-bold text-neutral-800 dark:text-neutral-100">Thống Kê</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-neutral-600 dark:text-neutral-400">Câu hỏi:</span>
                                            <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                {sessionStats.totalQuestions || turns.length}
                                            </span>
                                        </div>
                                        {sessionStats.averageScore !== undefined && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">Điểm TB:</span>
                                                <span className={`font-semibold ${getScoreColor(sessionStats.averageScore)}`}>
                                                    {Math.round(sessionStats.averageScore)}
                                                </span>
                                            </div>
                                        )}
                                        {sessionStats.duration && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-neutral-600 dark:text-neutral-400">Thời gian:</span>
                                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                                                    {Math.floor(sessionStats.duration / 60000)}m
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {/* Tips Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="p-6">
                                <div className="flex items-center mb-4">
                                    <Star className="w-5 h-5 text-yellow-500 dark:text-yellow-400 mr-2" />
                                    <h3 className="font-bold text-neutral-800 dark:text-neutral-100">Mẹo Luyện Tập</h3>
                                </div>
                                <div className="space-y-3 text-sm text-neutral-600 dark:text-neutral-400">
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p>Trả lời rõ ràng và có cấu trúc</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p>Sử dụng ví dụ cụ thể từ kinh nghiệm</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-purple-500 dark:bg-purple-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p>Thể hiện sự hiểu biết về công việc</p>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="w-2 h-2 bg-orange-500 dark:bg-orange-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                                        <p>Đặt câu hỏi ngược lại khi phù hợp</p>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>

                        {/* Progress Card */}
                        {sessionStatus === 'IN_PROGRESS' && turns.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Card className="p-6">
                                    <div className="flex items-center mb-4">
                                        <CheckCircle className="w-5 h-5 text-green-500 dark:text-green-400 mr-2" />
                                        <h3 className="font-bold text-neutral-800 dark:text-neutral-100">Tiến Độ</h3>
                                    </div>
                                    <div className="space-y-3">
                                        {turns.map((turn, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
                                                <div className="flex items-center">
                                                    <div className="w-6 h-6 bg-green-500 dark:bg-green-600 rounded-full flex items-center justify-center mr-3">
                                                        <CheckCircle className="w-3 h-3 text-white" />
                                                    </div>
                                                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                        Câu {idx + 1}
                                                    </span>
                                                </div>
                                                {turn.score !== undefined && (
                                                    <span className={`text-sm font-bold ${getScoreColor(turn.score)}`}>
                                                        {turn.score}
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Upgrade Dialog */}
                <UpgradeDialog
                    open={isUpgradeDialogOpen}
                    onClose={() => setIsUpgradeDialogOpen(false)}
                    onUpgrade={handleUpgradeRedirect}
                />
            </div>
        </div>
    );
};

export default MockInterview;