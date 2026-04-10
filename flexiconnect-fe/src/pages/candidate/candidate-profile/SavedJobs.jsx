import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import { cn } from "@/utils/cn";
import {
    Bookmark,
    MapPin,
    Calendar,
    DollarSign,
    Clock,
    Building2,
    Eye,
    Heart,
    ChevronLeft,
    ChevronRight,
    Briefcase,
    Filter,
    Search,
    BookmarkX
} from "lucide-react";

const Card = ({ children, className = "", onClick }) => (
    <div
        className={cn(
            "group relative bg-white dark:bg-dark-bg-secondary rounded-2xl shadow-sm border border-neutral-100 dark:border-dark-border-primary",
            "hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-400/20",
            "hover:-translate-y-1 transition-all duration-300 ease-out cursor-pointer",
            "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r before:from-blue-500/5 before:to-purple-500/5",
            "before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-100",
            "h-full flex flex-col",
            className
        )}
        onClick={onClick}
    >
        <div className="relative z-10 p-6 flex-1 flex flex-col">
            {children}
        </div>
    </div>
);

const Button = ({ children, className = "", variant = "primary", size = "md", ...props }) => {
    const variants = {
        primary: "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40",
        secondary: "bg-neutral-100 dark:bg-dark-bg-elevated text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-dark-bg-tertiary",
        outline: "border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-blue-400 dark:text-blue-400",
        danger: "bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/40"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-6 py-3",
        lg: "px-8 py-4 text-lg"
    };

    return (
        <button
            {...props}
            className={cn(
                "flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed",
                "transform hover:scale-105 active:scale-95",
                variants[variant],
                sizes[size],
                className
            )}
        >
            {children}
        </button>
    );
};

const Badge = ({ children, variant = "default", className = "" }) => {
    const variants = {
        default: "bg-neutral-100 text-neutral-800 dark:bg-dark-bg-elevated dark:text-neutral-200",
        success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200",
        warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
        danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200",
        info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200"
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
};

const JobCard = ({ job, onViewDetails, onUnsave }) => {
    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'success';
            case 'closed': return 'danger';
            case 'hidden': return 'warning';
            default: return 'default';
        }
    };

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'Đang tuyển';
            case 'closed': return 'Đã đóng';
            case 'hidden': return 'Ẩn';
            default: return status || 'N/A';
        }
    };

    return (
        <Card>
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0"> {/* Thêm min-w-0 để tránh overflow */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
                        {job.jobTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300 mb-3">
                        <Building2 size={16} className="flex-shrink-0" />
                        <span className="font-medium truncate">{job.companyName || 'Công ty chưa cập nhật'}</span>
                    </div>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onUnsave(job.jobPostId);
                    }}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg flex-shrink-0"
                    aria-label="Unsave job"
                >
                    <BookmarkX size={18} aria-hidden="true" />
                </button>
            </div>

            {/* Job Details - Phần này sẽ mở rộng để fill không gian */}
            <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="text-blue-500 flex-shrink-0" />
                    <span className="truncate">{job.jobLocation || 'Chưa cập nhật'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <Briefcase size={16} className="text-green-500 flex-shrink-0" />
                    <span className="truncate">{job.jobType || 'Full-time'}</span>
                </div>

                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                    <DollarSign size={16} className="text-yellow-500 flex-shrink-0" />
                    <span className="truncate">
                        {job.salaryMin && job.salaryMax
                            ? `${job.salaryMin} - ${job.salaryMax} triệu`
                            : 'Thương lượng'
                        }
                    </span>
                </div>

                {/* Status and Dates */}
                <div className="flex items-center justify-between pt-2">
                    <Badge variant={getStatusVariant(job.jobStatus)}>
                        {getStatusText(job.jobStatus)}
                    </Badge>

                    <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
                        <div className="flex items-center gap-1 mb-1">
                            <Calendar size={12} />
                            <span>Hết hạn: {job.jobExpiredAt ? new Date(job.jobExpiredAt).toLocaleDateString('vi-VN') : 'Không có'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart size={12} className="text-red-400" />
                            <span>Lưu: {job.savedAt ? new Date(job.savedAt).toLocaleDateString('vi-VN') : '-'}</span>
                        </div>
                    </div>
                </div>

                {/* Job Description Preview - Cố định chiều cao */}
                {job.jobDescription && (
                    <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[4rem]">
                            {job.jobDescription}
                        </p>
                    </div>
                )}
            </div>

            {/* Action Button - Luôn ở cuối */}
            <div className="mt-6">
                <Button
                    onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails(job.jobPostId);
                    }}
                    className="w-full"
                    size="md"
                >
                    <Eye size={16} />
                    Xem chi tiết
                </Button>
            </div>
        </Card>
    );
};

const EmptyState = () => {
    const navigate = useNavigate();
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
            <div className="relative mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                    <Bookmark size={40} className="text-blue-500 dark:text-blue-400" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">0</span>
                </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Chưa có job nào được lưu
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                Khi bạn lưu các job yêu thích, chúng sẽ hiển thị ở đây để bạn dễ dàng theo dõi và ứng tuyển sau.
            </p>
            <Button className="mt-6" onClick={() => navigate("/candidate-dashboard")}>
                <Search size={16} />
                Khám phá việc làm
            </Button>
        </div>
    );
}

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8">
            <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-lg"
            >
                <ChevronLeft size={16} />
            </Button>

            {getVisiblePages().map((page, index) => (
                <button
                    key={`page-${index}-${page}`}
                    onClick={() => page !== '...' && onPageChange(page - 1)}
                    disabled={page === '...'}
                    aria-label={page === '...' ? 'More pages' : `Go to page ${page}`}
                    className={cn(
                        "w-10 h-10 rounded-lg font-semibold transition-all duration-200",
                        page === currentPage + 1
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-110"
                            : page === '...'
                                ? "cursor-default text-neutral-400"
                                : "bg-neutral-100 dark:bg-dark-bg-elevated text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-dark-bg-tertiary hover:scale-105"
                    )}
                >
                    {page}
                </button>
            ))}

            <Button
                variant="secondary"
                size="sm"
                disabled={currentPage + 1 >= totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-lg"
            >
                <ChevronRight size={16} />
            </Button>
        </div>
    );
};

export default function SavedJobs() {
    const [savedJobs, setSavedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [size] = useState(12);
    const [totalElements, setTotalElements] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterJobType, setFilterJobType] = useState("all");
    const [filterExpired, setFilterExpired] = useState("all"); // all, notExpired, expired
    const navigate = useNavigate();

    const loadSavedJobs = async () => {
        setLoading(true);
        try {
            const res = await authApis().get(endpoints["saved-jobs-list"], {
                params: { page, size },
            });
            if (res.data.success) {
                setSavedJobs(res.data.data);
                setTotalElements(res.data.totalElements);
            }
        } catch (err) {
            console.error("Lấy danh sách job đã lưu thất bại:", err);
            setSavedJobs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSavedJobs();
    }, [page]);

    const handleGoToJob = (jobId) => {
        navigate(`/job-posts/${jobId}`);
    };

    const handleUnsaveJob = async (jobId) => {
        try {
            const res = await authApis().delete(endpoints["unsaved-job"], {
                data: { jobPostId: jobId },
            });

            if (res.data.success) {
                loadSavedJobs();
            } else {
                console.error("Bỏ lưu job thất bại:", res.data.message);
                alert(res.data.message);
            }
        } catch (err) {
            console.error("Bỏ lưu job thất bại:", err);
            alert("Có lỗi xảy ra khi bỏ lưu job!");
        }
    };

    const filteredJobs = savedJobs.filter(job => {
        const matchesSearch = !searchTerm ||
            job.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.jobLocation?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesJobType = filterJobType === "all" || job.jobType === filterJobType;

        const matchesExpired = filterExpired === "all" ||
            (filterExpired === "notExpired" && job.jobExpiredAt && new Date(job.jobExpiredAt) >= new Date()) ||
            (filterExpired === "expired" && job.jobExpiredAt && new Date(job.jobExpiredAt) < new Date());

        return matchesSearch && matchesJobType && matchesExpired;
    });

    const totalPages = Math.ceil(totalElements / size);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-64 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {Array.from({ length: 8 }).map((_, i) => (
                                <div key={i} className="h-80 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
            <div className="max-w-7xl mx-auto p-6">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg">
                            <Bookmark size={32} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Job đã lưu
                            </h1>
                            <p className="text-gray-600 dark:text-gray-300 mt-1">
                                {totalElements} việc làm đã được lưu
                            </p>
                        </div>
                    </div>

                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6">
                        <div className="relative flex-1">
                            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo tên công việc, công ty, địa điểm..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            />
                        </div>

                        {/* Job Type Filter */}
                        <div className="relative">
                            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={filterJobType}
                                onChange={(e) => setFilterJobType(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                            >
                                <option value="all">Tất cả loại công việc</option>
                                <option value="FULLTIME">FULLTIME</option>
                                <option value="PARTTIME">PARTTIME</option>
                                <option value="REMOTE">REMOTE</option>
                                <option value="FREELANCE">FREELANCE</option>
                                <option value="INTERNSHIP">INTERNSHIP</option>
                            </select>
                        </div>

                        {/* Expired Filter */}
                        <div className="relative">
                            <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <select
                                value={filterExpired}
                                onChange={(e) => setFilterExpired(e.target.value)}
                                className="pl-10 pr-8 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none cursor-pointer"
                            >
                                <option value="all">Tất cả trạng thái hết hạn</option>
                                <option value="notExpired">Chưa hết hạn</option>
                                <option value="expired">Đã hết hạn</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Jobs Grid */}
                {filteredJobs.length === 0 ? (
                    <div className="grid grid-cols-1">
                        <EmptyState />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                            {filteredJobs.map((job) => (
                                <JobCard
                                    key={job.jobPostId}
                                    job={job}
                                    onViewDetails={handleGoToJob}
                                    onUnsave={handleUnsaveJob}
                                />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}