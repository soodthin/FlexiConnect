import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ApplyDialog from "@applicationForms/ApplyDialog";

const getSalaryText = (min, max) => {
    if (min && max) return `${min} - ${max} triệu`;
    return "Thương lượng";
};

export default function JobDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isApplyOpen, setIsApplyOpen] = useState(false);

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

    if (loading) return <div className="w-full text-center p-10 text-gray-700 dark:text-white">Đang tải...</div>;
    if (!job) return null;

    const salaryText = getSalaryText(job.salaryMin, job.salaryMax);
    const daysLeft = (() => {
        if (!job.expiredAt) return null;
        const today = new Date();
        const expired = new Date(`${job.expiredAt}T00:00:00`);
        const diff = Math.ceil((expired - today) / (1000 * 60 * 60 * 24));
        return diff > 0 ? diff : 0;
    })();

    return (
        // Bọc toàn bộ component trong React Fragment <>
        <>
            <div className="flex w-full justify-center py-8 bg-neutral-100 dark:bg-neutral-900 min-h-screen">
                <div className="flex w-full max-w-6xl gap-8">
                    {/* Job content section */}
                    <div className="flex-1 space-y-6">
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg px-10 py-8">
                            {/* Header */}
                            <div className="flex items-start justify-between">
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{job.title}</h1>
                                    <div className="text-orange-500 font-semibold mb-1 text-base">
                                        {salaryText === "Thương lượng" ? "Negotiable" : salaryText}
                                    </div>
                                    <div className="flex items-center gap-5 text-gray-500 dark:text-gray-400 text-sm mb-3">
                                        {daysLeft !== null && (
                                            <span className="flex items-center gap-2">
                                                <i className="fa-regular fa-clock" /> Hết hạn sau {daysLeft} ngày
                                            </span>
                                        )}
                                        <span className="flex items-center gap-2">
                                            <i className="fa-solid fa-users" /> {job.viewCount ?? 0} lượt xem
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <i className="fa-solid fa-location-dot" /> {job.location}
                                        </span>
                                    </div>
                                </div>
                                <button className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-700 rounded-full transition">
                                    <i className="fa-solid fa-ellipsis text-gray-600 dark:text-gray-300 text-lg" />
                                </button>
                            </div>

                            {/* Apply buttons */}
                            <div className="flex gap-3 mt-5">
                                <button
                                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 font-semibold text-lg transition"
                                    onClick={() => {
                                        const token = localStorage.getItem("token");
                                        if (!token) {
                                            alert("Vui lòng đăng nhập trước khi ứng tuyển.");
                                            navigate("/login");
                                        } else {
                                            setIsApplyOpen(true);
                                        }
                                    }}
                                >
                                    Ứng tuyển ngay
                                </button>
                                <button className="flex-1 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-neutral-700 text-gray-700 dark:text-white rounded-lg py-3 font-semibold text-lg">
                                    <i className="fa-regular fa-heart" /> Lưu tin
                                </button>
                            </div>
                        </div>

                        {/* Job description card */}
                        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg px-10 py-8">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mô tả công việc</h2>
                            <div className="text-gray-800 dark:text-gray-300 whitespace-pre-line mb-6">
                                {job.description}
                            </div>
                            {job.requirement && (
                                <>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Yêu cầu</h2>
                                    <div className="text-gray-800 dark:text-gray-300 whitespace-pre-line">
                                        {job.requirement}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Sidebar section */}
                    <div className="w-96 space-y-6">
                        <div className="relative bg-white dark:bg-neutral-800 rounded-2xl shadow-lg px-6 pt-12 pb-5 overflow-hidden">
                            {job.companyCover && (
                                <img
                                    src={job.companyCover}
                                    alt="cover"
                                    className="absolute top-0 left-0 w-full h-24 object-cover rounded-t-2xl"
                                />
                            )}
                            <div className="absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                                <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    {job.avatar ? (
                                        <img src={job.avatar} alt="logo" className="w-full h-full object-contain" />
                                    ) : (
                                        <div className="text-lg font-bold text-gray-600">
                                            {job.companyName?.[0] || "?"}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="text-center mt-20 mb-2">
                                <div className="font-semibold text-lg dark:text-white">{job.companyName}</div>
                                {job.companyWebsite && (
                                    <button
                                        className="text-blue-600 dark:text-blue-400 text-xs hover:underline"
                                        onClick={() => window.open(job.companyWebsite, "_blank")}
                                    >
                                        Company culture page <i className="fa-solid fa-arrow-up-right-from-square ml-1" />
                                    </button>
                                )}
                            </div>
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-location-dot" />
                                    <span>{job.companyAddress}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-users" />
                                    <span>{job.companySize}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*ApplyDialog*/}
            <ApplyDialog
                isOpen={isApplyOpen}
                setIsOpen={setIsApplyOpen}
                jobId={job.id}
            />
        </>
    );
}