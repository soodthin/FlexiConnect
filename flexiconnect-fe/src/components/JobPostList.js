import React, { useEffect, useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { Cross2Icon } from "@radix-ui/react-icons";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

export default function JobPostList() {
  const [jobPosts, setJobPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [expandedJobIds, setExpandedJobIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
    if (selectedLocations.length === 0 || selectedLocations.includes("Tất cả")) {
      setFilteredPosts(jobPosts);
    } else {
      setFilteredPosts(
        jobPosts.filter((job) => selectedLocations.includes(job.location))
      );
    }
    setCurrentPage(1);
  }, [selectedLocations, jobPosts]);

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

  const toggleExpand = (id) => {
    setExpandedJobIds((prev) =>
      prev.includes(id) ? prev.filter((jobId) => jobId !== id) : [...prev, id]
    );
  };

  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-4">
      {/* Location filter */}
      <div className="mb-4 flex flex-wrap gap-2 items-center">
        <Popover.Root>
          <Popover.Trigger className="px-4 py-1 rounded-full text-sm border bg-gray-100 text-gray-800">
            {selectedLocations.length > 0 ? selectedLocations.join(", ") : "Chọn tỉnh/thành"}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              sideOffset={5}
              className="bg-white border p-4 rounded shadow-md w-64 max-h-64 overflow-y-auto"
            >
              {locations.map((loc) => (
                <label key={loc} className="flex items-center gap-2 mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => handleLocationToggle(loc)}
                  />
                  <span>{loc}</span>
                </label>
              ))}
              <Popover.Close className="absolute top-2 right-2 text-gray-500 hover:text-black">
                <Cross2Icon />
              </Popover.Close>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>

      {/* Job cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedPosts.map((job) => (
          <div
            key={job.id}
            className="rounded-2xl border border-gray-200 bg-white p-4 shadow-md hover:shadow-lg transition duration-200 flex flex-col"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gray-100 rounded mr-3 flex items-center justify-center text-sm font-semibold">
                {job.companyName[0]}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  {job.title}
                </h2>
                <p className="text-xs text-gray-500">{job.companyName}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs mb-3">
              <span className="bg-gray-100 px-2 py-1 rounded-full">
                {formatSalary(job.salaryMin, job.salaryMax)}
              </span>

              {job.location && (
                <span className="bg-gray-100 px-2 py-1 rounded-full">
                  {job.location}
                </span>
              )}
              {job.jobType && (
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                  {job.jobType}
                </span>
              )}
            </div>

            <div className="mt-auto flex justify-between items-center">
              <button
                className="border border-gray-300 bg-gray-100 rounded-xl px-3 py-1 text-gray-600 hover:text-red-500 text-xs flex items-center transition-all duration-200"
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
                onClick={() => toggleExpand(job.id)}
                className="text-xs text-gray-500 hover:text-black flex items-center"
              >
                {expandedJobIds.includes(job.id) ? (
                  <>
                    Ẩn bớt <ChevronUpIcon className="ml-1" />
                  </>
                ) : (
                  <>
                    Xem thêm <ChevronDownIcon className="ml-1" />
                  </>
                )}
              </button>
            </div>

            {expandedJobIds.includes(job.id) && job.description && (
              <div className="mt-3 text-sm text-gray-600 border-t pt-3">
                {job.description}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center items-center gap-4 text-sm">
        <button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          ←
        </button>
        <span>{currentPage} / {totalPages}</span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          →
        </button>
      </div>
    </div>
  );
}
