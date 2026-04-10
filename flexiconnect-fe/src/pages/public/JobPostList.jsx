import React, { useEffect, useState, useMemo, useCallback } from "react";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { authApis, endpoints } from "@/configs/APIs";
import { JobCard, JobCardSkeleton } from "@/components/jobs/JobCard";
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
} from "lucide-react";

// Filter Section Component
const FilterSection = ({ title, icon: Icon, children, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left mb-3 group"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
          {Icon && <Icon className="w-4 h-4 text-beige-600 dark:text-beige-400" />}
          {title}
        </span>
        <ChevronRight className={cn(
          "w-4 h-4 text-muted-foreground transition-transform",
          isOpen && "rotate-90"
        )} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Checkbox Filter Item
const FilterCheckbox = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 py-1.5 cursor-pointer group">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 rounded border-border text-beige-600 focus:ring-beige-500 dark:bg-dark-bg-tertiary"
    />
    <span className={cn(
      "text-sm transition-colors",
      checked ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
    )}>
      {label}
    </span>
  </label>
);

// Radio Filter Item
const FilterRadio = ({ name, label, checked, onChange }) => (
  <label className="flex items-center gap-2 py-1.5 cursor-pointer group">
    <input
      type="radio"
      name={name}
      checked={checked}
      onChange={onChange}
      className="w-4 h-4 border-border text-beige-600 focus:ring-beige-500 dark:bg-dark-bg-tertiary"
    />
    <span className={cn(
      "text-sm transition-colors",
      checked ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"
    )}>
      {label}
    </span>
  </label>
);

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
    <div className="flex items-center justify-center gap-2 mt-8">
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

  const itemsPerPage = 9;
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

  // Paginated posts
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPosts.slice(start, start + itemsPerPage);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocations, selectedSalary, selectedJobTypes]);

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

  // Filter sidebar content
  const FilterContent = () => (
    <div className="space-y-1">
      {/* Reset Filters */}
      {activeFiltersCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground mb-4"
        >
          <RotateCcw className="w-4 h-4" />
          Xóa bộ lọc ({activeFiltersCount})
        </Button>
      )}

      {/* Location Filter */}
      <FilterSection title="Địa điểm" icon={MapPin}>
        <ScrollArea className="max-h-48">
          <div className="space-y-1">
            {locations.map((loc) => (
              <FilterCheckbox
                key={loc}
                label={loc}
                checked={selectedLocations.includes(loc)}
                onChange={() => handleLocationToggle(loc)}
              />
            ))}
          </div>
        </ScrollArea>
      </FilterSection>

      {/* Salary Filter */}
      <FilterSection title="Mức lương" icon={Banknote}>
        <div className="space-y-1">
          {salaryOptions.map((opt) => (
            <FilterRadio
              key={opt.value}
              name="salary"
              label={opt.label}
              checked={selectedSalary === opt.value}
              onChange={() => setSelectedSalary(opt.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Job Type Filter */}
      <FilterSection title="Loại công việc" icon={Briefcase}>
        <div className="space-y-1">
          {jobTypes.map((type) => (
            <FilterCheckbox
              key={type}
              label={jobTypeLabels[type] || type}
              checked={selectedJobTypes.includes(type)}
              onChange={() => handleJobTypeToggle(type)}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <div className="relative">
      {/* Search Header */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Tìm việc, công ty, địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>

          {/* Mobile Filter Toggle */}
          <Button
            variant="outline"
            className="lg:hidden h-12 gap-2"
            onClick={() => setShowMobileFilter(true)}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </div>

        {/* Active Filters Tags */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {selectedLocations.map((loc) => (
              <Badge
                key={loc}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-muted"
                onClick={() => handleLocationToggle(loc)}
              >
                <MapPin className="w-3 h-3" />
                {loc}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
            {selectedSalary !== "all" && (
              <Badge
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-muted"
                onClick={() => setSelectedSalary("all")}
              >
                <Banknote className="w-3 h-3" />
                {salaryOptions.find((o) => o.value === selectedSalary)?.label}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {selectedJobTypes.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="gap-1 cursor-pointer hover:bg-muted"
                onClick={() => handleJobTypeToggle(type)}
              >
                <Briefcase className="w-3 h-3" />
                {jobTypeLabels[type] || type}
                <X className="w-3 h-3 ml-1" />
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
              <Filter className="w-5 h-5 text-beige-600 dark:text-beige-400" />
              <h3 className="font-semibold text-foreground">Bộ lọc</h3>
            </div>
            <FilterContent />
          </div>
        </aside>

        {/* Job Grid */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              {loading ? (
                "Đang tải..."
              ) : (
                <>
                  Tìm thấy <span className="font-medium text-foreground">{filteredPosts.length}</span> việc làm
                </>
              )}
            </p>
          </div>

          {/* Job Cards Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${searchTerm}-${selectedLocations.join(",")}-${selectedSalary}-${selectedJobTypes.join(",")}-${currentPage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {loading ? (
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: itemsPerPage }).map((_, i) => (
                    <JobCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredPosts.length === 0 ? (
                <EmptyState
                  icon={SearchX}
                  title="Không tìm thấy việc làm"
                  description="Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc để xem thêm kết quả."
                  action={resetFilters}
                  actionLabel="Xóa bộ lọc"
                />
              ) : (
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

      {/* Mobile Filter Drawer */}
      <AnimatePresence>
        {showMobileFilter && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setShowMobileFilter(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[calc(100vw-3rem)] bg-card border-l border-border z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Filter className="w-5 h-5 text-beige-600 dark:text-beige-400" />
                  Bộ lọc
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowMobileFilter(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(100vh-8rem)] p-4">
                <FilterContent />
              </ScrollArea>
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
                <Button
                  className="w-full"
                  onClick={() => setShowMobileFilter(false)}
                >
                  Xem {filteredPosts.length} kết quả
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
