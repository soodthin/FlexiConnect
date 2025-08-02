import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";
import RadixSelect from "@components/RadixSelect";
import { useNavigate } from "react-router-dom";

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
        "Trên 50 triệu": [50, Infinity]
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
    ...Array.from(new Set(jobPosts.map((job) => job.location).filter(Boolean)))
  ];

  const salaryOptions = [
    "Tất cả",
    "Dưới 10 triệu",
    "10 - 20 triệu",
    "20 - 30 triệu",
    "30 - 50 triệu",
    "Trên 50 triệu"
  ];

  const jobTypeOptions = [
    "Tất cả",
    ...Array.from(new Set(jobPosts.map((job) => job.jobType).filter(Boolean)))
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
    <div className="p-4">
      {/* Filter section */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        {/* Location filter */}
        <Popover.Root>
          <Popover.Trigger className="px-4 py-1 rounded-full text-sm border bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white">
            {selectedLocations.length > 0 ? selectedLocations.join(", ") : "Chọn tỉnh/thành"}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={5}
              className="bg-white dark:bg-neutral-900 border dark:border-gray-700 p-4 rounded shadow-md w-64 max-h-64 overflow-y-auto"
            >
              {locations.map((loc) => (
                <label key={loc} className="flex items-center gap-2 mb-2 cursor-pointer text-gray-800 dark:text-gray-100">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => handleLocationToggle(loc)}
                  />
                  <span>{loc}</span>
                </label>
              ))}
              <Popover.Close className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white">
                <Cross2Icon />
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>

        {/* Salary filter */}
        <RadixSelect
          value={selectedSalary}
          onValueChange={setSelectedSalary}
          options={salaryOptions}
          placeholder="Mức lương"
        />

        {/* JobType filter */}
        <RadixSelect
          value={selectedJobType}
          onValueChange={setSelectedJobType}
          options={jobTypeOptions}
          placeholder="Loại công việc"
        />
      </div>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedPosts.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-neutral-900 p-4 shadow-md hover:shadow-lg transition duration-200 flex flex-col cursor-pointer"
            onClick={() => goToJobDetail(job.id)}
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 rounded-full mr-3 flex items-center justify-center overflow-hidden bg-gray-100 dark:bg-neutral-800">
                {job.avatar ? (
                  <img
                    src={job.avatar}
                    alt="avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    {job.companyName?.[0]}
                  </span>
                )}
              </div>

              <div>
                <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
                  {job.title}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">{job.companyName}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs mb-3">
              <span className="bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white px-2 py-1 rounded-full">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>

              {job.location && (
                <span className="bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-white px-2 py-1 rounded-full">
                  {job.location}
                </span>
              )}
              {job.jobType && (
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full">
                  {job.jobType}
                </span>
              )}
            </div>

            <div className="mt-auto flex justify-between items-center">
              <button
                className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-neutral-800 rounded-xl px-3 py-1 text-gray-600 dark:text-gray-300 hover:text-red-500 text-xs flex items-center transition-all duration-200"
                onClick={(e) => e.stopPropagation()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="white"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.015-4.5-4.5-4.5S12 5.765 12 8.25c0-2.485-2.015-4.5-4.5-4.5S3 5.765 3 8.25c0 3.75 4.5 6.75 9 11.25 4.5-4.5 9-7.5 9-11.25z"
                  />
                </svg>
                Lưu tin
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(job.id);
                }}
                className="text-xs text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white flex items-center"
              >

              </button>
            </div>

            {expandedJobIds.includes(job.id) && job.description && (
              <div className="mt-3 text-sm text-gray-600 dark:text-gray-300 border-t dark:border-gray-600 pt-3">
                {job.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4 text-sm text-gray-800 dark:text-white">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
        >
          ←
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50 dark:border-gray-600"
        >
          →
        </button>
      </div>
    </div>
  );
}
