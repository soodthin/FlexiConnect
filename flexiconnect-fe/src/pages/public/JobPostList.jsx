import React, { useEffect, useState, useMemo, useCallback } from "react";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authApis, endpoints } from "@/configs/APIs";
import { JobCard, JobCardRow, JobCardSplit, JobCardSkeleton, getDaysRemaining } from "@/components/jobs/JobCard";
import JobPreviewPanel from "@/components/jobs/JobPreviewPanel";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Search,
  SlidersHorizontal,
  X,
  MapPin,
  Banknote,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
  SearchX,
  Sparkles,
  LayoutGrid,
  List,
  Columns2,
  ArrowUpDown,
  Flame,
} from "lucide-react";



// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = useMemo(() => {
    const items = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push("...");

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) items.push(i);

      if (currentPage < totalPages - 2) items.push("...");
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  return (
    <div className="flex items-center justify-center gap-2 mt-10 mb-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="h-9 w-9"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      {pages.map((page, idx) => (
        page === "..." ? (
          <span key={`ellipsis-${idx}`} className="px-2 text-muted-foreground">...</span>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "ghost"}
            size="sm"
            onClick={() => onPageChange(page)}
            className="h-9 w-9 p-0"
          >
            {page}
          </Button>
        )
      ))}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="h-9 w-9"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
};

// Job Type Labels
const jobTypeLabels = {
  FULLTIME: "Toàn thời gian",
  PARTTIME: "Bán thời gian",
  REMOTE: "Làm từ xa",
  FREELANCE: "Freelance",
  INTERNSHIP: "Thực tập",
};

// Salary Options
const salaryOptions = [
  { value: "all", label: "Tất cả mức lương" },
  { value: "under10", label: "Dưới 10 triệu", range: [0, 10] },
  { value: "10to20", label: "10 - 20 triệu", range: [10, 20] },
  { value: "20to30", label: "20 - 30 triệu", range: [20, 30] },
  { value: "30to50", label: "30 - 50 triệu", range: [30, 50] },
  { value: "over50", label: "Trên 50 triệu", range: [50, Infinity] },
];

export default function JobPostList() {
  const [jobPosts, setJobPosts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState("all");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list' | 'split'
  const [sortBy, setSortBy] = useState("newest"); // 'newest' | 'salaryHigh' | 'salaryLow' | 'popular'
  const [quickFilter, setQuickFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);

  const itemsPerPage = viewMode === "split" ? 10 : 9;
  const navigate = useNavigate();

  // Load job posts
  useEffect(() => {
    const loadJobPosts = async () => {
      try {
        setLoading(true);
        const res = await authApis().get(endpoints["job-posts"]);
        setJobPosts(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadJobPosts();
  }, []);

  // Extract unique locations from job posts
  const locations = useMemo(() => {
    return Array.from(
      new Set(
        jobPosts
          .map((job) => {
            if (!job.location) return null;
            const parts = job.location.split(",");
            return parts[parts.length - 1].trim();
          })
          .filter(Boolean)
      )
    ).sort();
  }, [jobPosts]);

  // Extract unique job types from job posts
  const jobTypes = useMemo(() => {
    return Array.from(
      new Set(jobPosts.map((job) => job.jobType).filter(Boolean))
    );
  }, [jobPosts]);

  // Filter jobs
  const filteredPosts = useMemo(() => {
    let posts = jobPosts;

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      posts = posts.filter(
        (job) =>
          job.title?.toLowerCase().includes(term) ||
          job.companyName?.toLowerCase().includes(term) ||
          job.location?.toLowerCase().includes(term)
      );
    }

    // Location filter
    if (selectedLocations.length > 0) {
      posts = posts.filter((job) => {
        if (!job.location) return false;
        return selectedLocations.some((city) => job.location.endsWith(city));
      });
    }

    // Salary filter
    if (selectedSalary !== "all") {
      const option = salaryOptions.find((o) => o.value === selectedSalary);
      if (option?.range) {
        const [min, max] = option.range;
        posts = posts.filter((job) => {
          if (!job.salaryMin && !job.salaryMax) return false;
          const salaryMin = job.salaryMin || 0;
          const salaryMax = job.salaryMax || Infinity;
          return salaryMin <= max && salaryMax >= min;
        });
      }
    }

    // Job type filter
    if (selectedJobTypes.length > 0) {
      posts = posts.filter((job) => selectedJobTypes.includes(job.jobType));
    }

    return posts;
  }, [jobPosts, searchTerm, selectedLocations, selectedSalary, selectedJobTypes]);

  // Quick filter & Sorting
  const processedPosts = useMemo(() => {
    let posts = [...filteredPosts];

    // Quick filter chips
    if (quickFilter === 'urgent') {
      posts = posts.filter(job => {
        const days = getDaysRemaining(job.expiredAt || job.expirationDate);
        return days !== null && days <= 7;
      });
    } else if (quickFilter === 'highSalary') {
      posts = posts.filter(job => (job.salaryMax || 0) >= 15 || (job.salaryMin || 0) >= 15);
    } else if (quickFilter === 'topCompany') {
      posts = posts.filter(job => {
        const name = (job.companyName || '').toLowerCase();
        return name.includes('viettel') || name.includes('masan') || name.includes('misa') || 
               name.includes('kiotviet') || name.includes('fpt') || name.includes('vinamilk') ||
               name.includes('shopee') || name.includes('vng') || name.includes('hoa sen');
      });
    } else if (quickFilter === 'remote') {
      posts = posts.filter(job => job.jobType === 'REMOTE');
    }

    // Sort
    if (sortBy === 'salaryHigh') {
      posts.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0));
    } else if (sortBy === 'salaryLow') {
      posts.sort((a, b) => (a.salaryMin || a.salaryMax || 0) - (b.salaryMin || b.salaryMax || 0));
    } else if (sortBy === 'popular') {
      posts.sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0));
    } else {
      // Newest
      posts.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return posts;
  }, [filteredPosts, quickFilter, sortBy]);

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return processedPosts.slice(start, start + itemsPerPage);
  }, [processedPosts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(processedPosts.length / itemsPerPage);

  // Sync selectedJob for Split View
  useEffect(() => {
    if (paginatedPosts.length > 0) {
      if (!selectedJob || !paginatedPosts.some(p => p.id === selectedJob.id)) {
        setSelectedJob(paginatedPosts[0]);
      }
    }
  }, [paginatedPosts, selectedJob]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocations, selectedSalary, selectedJobTypes, quickFilter, sortBy]);

  // Filter handlers
  const handleLocationToggle = useCallback((loc) => {
    setSelectedLocations((prev) =>
      prev.includes(loc)
        ? prev.filter((l) => l !== loc)
        : [...prev, loc]
    );
  }, []);

  const handleJobTypeToggle = useCallback((type) => {
    setSelectedJobTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  }, []);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedLocations([]);
    setSelectedSalary("all");
    setSelectedJobTypes([]);
  }, []);

  const activeFiltersCount = selectedLocations.length + selectedJobTypes.length + (selectedSalary !== "all" ? 1 : 0);



  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24">
      {/* Search & Horizontal Filter Hero Bar */}
      <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 shadow-soft-sm mb-6 space-y-3.5">
        {/* Row 1: Search Input & Reset Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm việc làm theo chức danh, từ khóa, tên công ty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-sm sm:text-base rounded-xl border-border bg-muted/20 focus:bg-card transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <Button
              variant="outline"
              onClick={resetFilters}
              className="h-12 px-4 rounded-xl gap-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/20 border-rose-200 dark:border-rose-900/40 font-semibold shrink-0"
            >
              <RotateCcw className="w-4 h-4" />
              Xóa bộ lọc ({activeFiltersCount})
            </Button>
          )}
        </div>

        {/* Row 2: Horizontal Dropdowns (Location, Salary, Job Type) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-border/60">
          {/* Location Dropdown */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 bg-muted/20 hover:border-beige-400 focus-within:border-beige-500 transition-all">
            <MapPin className="w-4 h-4 text-beige-600 shrink-0" />
            <select
              value={selectedLocations[0] || ""}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedLocations(val ? [val] : []);
              }}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground focus:outline-none cursor-pointer py-1"
            >
              <option value="">Tất cả địa điểm ({locations.length})</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Dropdown */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 bg-muted/20 hover:border-beige-400 focus-within:border-beige-500 transition-all">
            <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
            <select
              value={selectedSalary}
              onChange={(e) => setSelectedSalary(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground focus:outline-none cursor-pointer py-1"
            >
              {salaryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type Dropdown */}
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 bg-muted/20 hover:border-beige-400 focus-within:border-beige-500 transition-all">
            <Briefcase className="w-4 h-4 text-blue-500 shrink-0" />
            <select
              value={selectedJobTypes[0] || ""}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedJobTypes(val ? [val] : []);
              }}
              className="w-full bg-transparent text-xs sm:text-sm font-semibold text-foreground focus:outline-none cursor-pointer py-1"
            >
              <option value="">Tất cả hình thức</option>
              {jobTypes.map((type) => (
                <option key={type} value={type}>
                  {jobTypeLabels[type] || type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Badges */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-border/40">
            {selectedLocations.map((loc) => (
              <Badge
                key={loc}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-muted text-xs font-semibold py-1"
                onClick={() => handleLocationToggle(loc)}
              >
                <MapPin className="w-3 h-3 text-beige-600" />
                {loc}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {selectedSalary !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-muted text-xs font-semibold py-1"
                onClick={() => setSelectedSalary("all")}
              >
                <Banknote className="w-3 h-3 text-emerald-600" />
                {salaryOptions.find((o) => o.value === selectedSalary)?.label}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {selectedJobTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-muted text-xs font-semibold py-1"
                onClick={() => handleJobTypeToggle(type)}
              >
                <Briefcase className="w-3 h-3 text-blue-500" />
                {jobTypeLabels[type] || type}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Main Full-Width Content Area */}
      <div className="w-full min-w-0">
          {/* Top Control Bar: Heading, Count, Quick Filters, Sort & View Modes */}
          <div className="space-y-3.5 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-black text-foreground">
                  Khám phá việc làm
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-beige-100 text-beige-800 dark:bg-beige-950/60 dark:text-beige-300">
                  {loading ? '...' : `${processedPosts.length} việc làm`}
                </span>
              </div>

              {/* Right Controls: Sort & View Modes */}
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-card border border-border/80 rounded-xl px-2.5 py-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-semibold text-foreground focus:outline-none cursor-pointer"
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="salaryHigh">Lương cao nhất</option>
                    <option value="salaryLow">Lương thấp nhất</option>
                    <option value="popular">Nổi bật nhất</option>
                  </select>
                </div>

                {/* View mode toggle */}
                <div className="flex items-center bg-muted/60 p-1 rounded-xl border border-border/60">
                  <button
                    onClick={() => setViewMode('grid')}
                    title="Dạng lưới thẻ (Grid)"
                    className={cn(
                      'p-1.5 rounded-lg transition-all',
                      viewMode === 'grid'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    title="Dạng danh sách (List)"
                    className={cn(
                      'p-1.5 rounded-lg transition-all',
                      viewMode === 'list'
                        ? 'bg-card text-foreground shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('split')}
                    title="Xem nhanh JD 2 cột (Split View)"
                    className={cn(
                      'p-1.5 rounded-lg transition-all flex items-center gap-1 text-xs font-bold px-2',
                      viewMode === 'split'
                        ? 'bg-card text-beige-700 dark:text-beige-300 shadow-xs'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Columns2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Xem nhanh</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'urgent', label: 'Tuyển gấp' },
                { id: 'highSalary', label: 'Lương > 15 Tr' },
                { id: 'topCompany', label: 'Tập đoàn lớn' },
                { id: 'remote', label: 'Làm từ xa' },
              ].map((chip) => (
                <button
                  key={chip.id}
                  onClick={() => setQuickFilter(chip.id)}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border',
                    quickFilter === chip.id
                      ? 'bg-beige-600 text-white border-beige-600 shadow-xs'
                      : 'bg-card text-muted-foreground border-border/80 hover:border-beige-400 hover:text-foreground'
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Layout Body based on viewMode */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchTerm}-${selectedLocations.join(",")}-${selectedSalary}-${selectedJobTypes.join(",")}-${currentPage}-${viewMode}-${quickFilter}-${sortBy}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className={cn(
                  viewMode === 'grid' && "grid gap-5 sm:grid-cols-2 xl:grid-cols-3",
                  viewMode === 'list' && "flex flex-col gap-3.5",
                  viewMode === 'split' && "flex flex-col lg:flex-row gap-6"
                )}>
                  {Array.from({ length: itemsPerPage }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : processedPosts.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="Không tìm thấy việc làm"
                  description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả."
                  action={resetFilters}
                  actionLabel="Xóa bộ lọc"
                />
              ) : viewMode === 'grid' ? (
                /* 1. GRID VIEW */
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {paginatedPosts.map((job, index) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      onClick={() => navigate(`/job-posts/${job.id}`)}
                      variant={index === 0 && currentPage === 1 ? "featured" : "default"}
                    />
                  ))}
                </div>
              ) : viewMode === 'list' ? (
                /* 2. LIST VIEW */
                <div className="flex flex-col gap-3.5">
                  {paginatedPosts.map((job) => (
                    <JobCardRow
                      key={job.id}
                      job={job}
                      onClick={() => navigate(`/job-posts/${job.id}`)}
                    />
                  ))}
                </div>
              ) : (
                /* 3. SPLIT VIEW (LinkedIn / Indeed modern layout) */
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Left Column: Job Cards List */}
                  <div className="w-full lg:w-5/12 flex flex-col gap-2.5 max-h-[calc(100vh-7rem)] overflow-y-auto pr-1">
                    {paginatedPosts.map((job) => (
                      <JobCardSplit
                        key={job.id}
                        job={job}
                        isSelected={selectedJob?.id === job.id}
                        onClick={() => setSelectedJob(job)}
                      />
                    ))}
                  </div>

                  {/* Right Column: Live Interactive JD Preview Panel */}
                  <div className="w-full lg:w-7/12">
                    <JobPreviewPanel job={selectedJob || paginatedPosts[0]} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
    </div>
  );
}
