import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Heart, HeartOff } from "lucide-react";
import RadixSelect from "@components/RadixSelect";
import { useNavigate } from "react-router-dom";

/* ----------------- UI PRIMITIVES ----------------- */
const Card = ({ className = "", children, ...props }) => (
  <div
    className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 shadow hover:shadow-lg hover:scale-[1.02] transition-all ${className}`}
    {...props}
  >
    {children}
  </div>
);

const Button = ({ children, variant = "default", className = "", ...props }) => {
  const base = "rounded-lg px-3 py-1 text-xs font-medium flex items-center gap-1 transition";
  const variants = {
    default: "bg-gray-100 dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-neutral-700",
    ghost: "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white",
    pagination: "px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600",
  };
  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = "gray" }) => {
  const colors = {
    green: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
    gray: "bg-gray-100 text-gray-700 dark:bg-neutral-800 dark:text-gray-300",
  };
  return <span className={`text-xs px-2 py-1 rounded-full ${colors[color]}`}>{children}</span>;
};

const FilterPopover = ({ triggerLabel, options, selected, onToggle }) => (
  <Popover.Root>
    <Popover.Trigger className="px-4 py-2 rounded-full text-sm border bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white shadow-sm hover:shadow-md transition">
      {selected.length > 0 ? selected.join(", ") : triggerLabel}
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content
        sideOffset={5}
        className="bg-white dark:bg-neutral-900 border dark:border-gray-700 p-4 rounded shadow-md w-64 max-h-64 overflow-y-auto relative"
      >
        {options.map((opt) => (
          <label
            key={opt}
            className="flex items-center gap-2 mb-2 cursor-pointer text-gray-800 dark:text-gray-100"
          >
            <input type="checkbox" checked={selected.includes(opt)} onChange={() => onToggle(opt)} />
            <span>{opt}</span>
          </label>
        ))}
        <Popover.Close className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
          <Cross2Icon />
        </Popover.Close>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>
);

const Pagination = ({ currentPage, totalPages, onPrev, onNext }) => (
  <div className="mt-8 flex justify-center items-center gap-4 text-sm text-gray-800 dark:text-white">
    <Button
      variant="pagination"
      onClick={onPrev}
      disabled={currentPage === 1}
    >
      ←
    </Button>
    <span>
      {currentPage} / {totalPages}
    </span>
    <Button
      variant="pagination"
      onClick={onNext}
      disabled={currentPage === totalPages}
    >
      →
    </Button>
  </div>
);

/* ----------------- FEATURE COMPONENT ----------------- */
export default function JobPostList() {
  const [jobPosts, setJobPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedSalary, setSelectedSalary] = useState("Tất cả");
  const [selectedJobType, setSelectedJobType] = useState("Tất cả");
  const [expandedJobIds, setExpandedJobIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/job-posts")
      .then((res) => res.json())
      .then((data) => {
        setJobPosts(data);
        setFilteredPosts(data);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    let posts = jobPosts;

    if (!(selectedLocations.length === 0 || selectedLocations.includes("Tất cả"))) {
      posts = posts.filter((job) => selectedLocations.includes(job.location));
    }

    if (selectedSalary !== "Tất cả") {
      const salaryRanges = {
        "Dưới 10 triệu": [0, 10],
        "10 - 20 triệu": [10, 20],
        "20 - 30 triệu": [20, 30],
        "30 - 50 triệu": [30, 50],
        "Trên 50 triệu": [50, Infinity],
      };
      const [min, max] = salaryRanges[selectedSalary];
      posts = posts.filter((job) => {
        if (!job.salaryMin && !job.salaryMax) return false;
        const salaryMin = job.salaryMin || 0;
        const salaryMax = job.salaryMax || Infinity;
        return salaryMin <= max && salaryMax >= min;
      });
    }

    if (selectedJobType !== "Tất cả") {
      posts = posts.filter((job) => job.jobType === selectedJobType);
    }

    setFilteredPosts(posts);
    setCurrentPage(1);
  }, [selectedLocations, selectedSalary, selectedJobType, jobPosts]);

  const formatSalary = (min, max) => {
    if (!min && !max) return "Thoả thuận";
    if (!min) return `Tới ${max} triệu`;
    if (!max) return `Từ ${min} triệu`;
    return `${min} - ${max} triệu`;
  };

  const locations = [
    "Tất cả",
    ...Array.from(new Set(jobPosts.map((job) => job.location).filter(Boolean))),
  ];

  const salaryOptions = [
    "Tất cả",
    "Dưới 10 triệu",
    "10 - 20 triệu",
    "20 - 30 triệu",
    "30 - 50 triệu",
    "Trên 50 triệu",
  ];

  const jobTypeOptions = [
    "Tất cả",
    ...Array.from(new Set(jobPosts.map((job) => job.jobType).filter(Boolean))),
  ];

  const handleLocationToggle = (loc) => {
    if (loc === "Tất cả") {
      setSelectedLocations(["Tất cả"]);
    } else {
      setSelectedLocations((prev) => {
        const updated = prev.includes(loc)
          ? prev.filter((l) => l !== loc)
          : [...prev.filter((l) => l !== "Tất cả"), loc];
        return updated;
      });
    }
  };

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleExpand = (id) => {
    setExpandedJobIds((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  const goToJobDetail = (id) => {
    navigate(`/job-posts/${id}`);
  };

  return (
    <div className="p-2">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3 items-center">
        <FilterPopover
          triggerLabel="Chọn tỉnh/thành"
          options={locations}
          selected={selectedLocations}
          onToggle={handleLocationToggle}
        />
        <RadixSelect
          value={selectedSalary}
          onValueChange={setSelectedSalary}
          options={salaryOptions}
          placeholder="Mức lương"
        />
        <RadixSelect
          value={selectedJobType}
          onValueChange={setSelectedJobType}
          options={jobTypeOptions}
          placeholder="Loại công việc"
        />
      </div>

      {/* Job Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedPosts.map((job) => (
          <Card key={job.id} className="p-5 flex flex-col cursor-pointer" onClick={() => goToJobDetail(job.id)}>
            {/* Company logo & title */}
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full mr-3 flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-neutral-800">
                {job.avatar ? (
                  <img src={job.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {job.companyName?.[0]}
                  </span>
                )}
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-800 dark:text-white">{job.title}</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{job.companyName}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 text-xs mb-4">
              <Badge color="green">{formatSalary(job.salaryMin, job.salaryMax)}</Badge>
              {job.location && <Badge color="yellow">{job.location}</Badge>}
              {job.jobType && <Badge color="blue">{job.jobType}</Badge>}
            </div>

            {/* Expandable description */}
            {expandedJobIds.includes(job.id) && job.description && (
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 border-t pt-3">
                {job.description}
              </div>
            )}

            {/* Save & Expand buttons */}
            <div className="mt-auto flex justify-between items-center">
              <Button
                onClick={(e) => e.stopPropagation()}
              >
                <Heart className="w-4 h-4" /> Lưu tin
              </Button>
              <Button
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(job.id);
                }}
              >
                {expandedJobIds.includes(job.id) ? "Ẩn bớt" : "Xem thêm"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPrev={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          onNext={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        />
      )}
    </div>
  );
}
