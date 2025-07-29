import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Utility: format salary
const getSalaryText = (min, max) => {
    if (min && max) return `${min} - ${max} triệu`;
    return "Thương lượng";
};

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`http://localhost:8080/api/job-posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setJob(data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
                alert("Không tìm thấy tin tuyển dụng hoặc xảy ra lỗi.");
                navigate("/job-posts");
            });
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="w-full flex justify-center py-12 text-gray-700 dark:text-white">
                Đang tải...
            </div>
        );
    }
    if (!job) return null;

    const daysLeft = (() => {
        if (!job.expiredAt) return null;
        const today = new Date();
        const expired = new Date(`${job.expiredAt}T00:00:00`);
        const diff = Math.ceil((expired.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    })();
    const salaryText = getSalaryText(job.salaryMin, job.salaryMax);

    return (
        <div className="flex w-full justify-center py-8 bg-neutral-100 dark:bg-neutral-900 min-h-screen">
            <div className="flex w-full max-w-6xl gap-8">
                {/* Main Content */}
                <div className="flex-1 space-y-6">
                    {/* Job Header Card */}
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg px-10 py-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                                    {job.title}
                                </h1>
                                <div className="text-orange-500 font-semibold mb-1 text-base">
                                    {salaryText === "Thương lượng" ? "Negotiable" : salaryText}
                                </div>
                                <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400 text-sm mb-3">
                                    {daysLeft !== null && (
                                        <span className="flex items-center gap-2">
                                            <i className="fa-regular fa-clock" />
                                            Expires in {daysLeft} days
                                        </span>
                                    )}
                                    <span className="flex items-center gap-2">
                                        <i className="fa-solid fa-users" />
                                        {job.viewCount ?? 0} views
                                    </span>
                                    <span className="flex items-center gap-2">
                                        <i className="fa-solid fa-location-dot" />
                                        {job.location}
                                    </span>
                                </div>
                            </div>
                            <button className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full transition">
                                <i className="fa-solid fa-ellipsis text-gray-600 dark:text-gray-300 text-lg" />
                            </button>
                        </div>
                        <div className="flex gap-3 mt-5">
                            <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 font-semibold text-lg transition">
                                Apply job
                            </button>
                            <button className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-white rounded-lg py-3 font-semibold text-lg flex items-center justify-center gap-2 transition">
                                <i className="fa-regular fa-heart" /> Save this job
                            </button>
                        </div>
                        {/* Competitive Advantage */}
                        <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl flex items-center p-5 mt-7 gap-4 border border-purple-100 dark:border-purple-900/40">
                            <img src="/icon-benefit.svg" alt="" className="w-14 h-14" />
                            <div className="flex-1">
                                <div className="font-semibold text-gray-900 dark:text-white mb-1 text-lg">
                                    Maximize your competitive advantage before applying
                                </div>
                                <div className="text-gray-500 dark:text-gray-300 text-sm mb-1">
                                    View matching analysis and compare to other applicants
                                </div>
                                <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                                    Over 90% of users are satisfied
                                </div>
                            </div>
                            <button className="border border-purple-500 text-purple-600 dark:text-purple-300 px-5 py-2 rounded-lg font-semibold hover:bg-purple-100 dark:hover:bg-purple-800/30 transition">
                                View analysis now
                            </button>
                        </div>
                    </div>
                    {/* Job Description Card */}
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg px-10 py-8">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Job description</h2>
                        <div className="prose dark:prose-invert text-gray-800 dark:text-gray-300 mb-6 whitespace-pre-line">
                            {job.description}
                        </div>
                        {job.requirement && (
                            <>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Requirements</h2>
                                <div className="prose dark:prose-invert text-gray-800 dark:text-gray-300 mb-3 whitespace-pre-line">
                                    {job.requirement}
                                </div>
                            </>
                        )}
                        <button className="mt-4 w-full border border-blue-500 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/30 transition">
                            View full job description
                        </button>
                    </div>
                </div>
                {/* Sidebar */}
                <div className="w-96 flex-shrink-0 space-y-6">
                    <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg px-6 pt-12 pb-5 mb-2 overflow-hidden">
                        {/* Cover Image */}
                        {job.companyCover && (
                            <img
                                src={job.companyCover}
                                alt="Company cover"
                                className="absolute top-0 left-0 w-full h-24 object-cover rounded-t-2xl"
                                style={{ zIndex: 0 }}
                            />
                        )}
                        {/* Avatar */}
                        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                            <div className="w-20 h-20 rounded-xl shadow-lg overflow-hidden bg-white flex items-center justify-center border border-gray-200 dark:border-gray-700">
                                {job.avatar ? (
                                    <img
                                        src={job.avatar}
                                        alt="Company logo"
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-lg font-bold text-gray-600">
                                        {job.companyName?.[0] || "?"}
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Company Info */}
                        <div className="text-center mb-3 mt-20">
                            <div className="font-semibold text-lg dark:text-white">{job.companyName}</div>
                            {job.companyWebsite && (
                                <button
                                    className="text-blue-600 dark:text-blue-400 text-xs hover:underline mt-1"
                                    onClick={() => window.open(job.companyWebsite, "_blank")}
                                >
                                    Company culture page <i className="fa-solid fa-arrow-up-right-from-square ml-1" />
                                </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2">
                                <i className="fa-solid fa-location-dot mr-1" />
                                <span>{job.companyAddress}</span>
                                {job.companyMap && (
                                    <a
                                        className="text-xs text-blue-600 hover:underline ml-2"
                                        href={job.companyMap}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        (View map)
                                    </a>
                                )}
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2">
                                <i className="fa-solid fa-users mr-1" />
                                <span>{job.companySize}</span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2">
                                <i className="fa-solid fa-phone mr-1" />
                            </div>
                            {/* Website */}
                            {job.website && (
                                <div className="flex justify-center mt-2">
                                    <a
                                        href={job.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 dark:text-blue-400 text-sm font-medium inline-flex items-center gap-1 hover:underline"
                                    >
                                        Website công ty
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M13.5 4.5H19.5M19.5 4.5V10.5M19.5 4.5L10.5 13.5"
                                            />
                                        </svg>
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}