import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { FileText, X, Send, Eye, Sparkles } from "lucide-react";
import { authApis, endpoints } from "@configs/APIs";
import cookie from "react-cookies";

/* ----------------- UI PRIMITIVES ----------------- */
const Button = ({ children, variant = "default", className = "", ...props }) => {
    const base =
        "px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition";
    const variants = {
        default:
            "bg-orange-500 text-white hover:bg-orange-600 disabled:bg-orange-300",
        outline:
            "border border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-neutral-600 dark:text-gray-300 dark:hover:bg-neutral-700",
        icon: "p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-neutral-700",
    };
    return (
        <button className={`${base} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const IconButton = ({ icon: Icon, label, ...props }) => (
    <button
        className="absolute bottom-2 right-2 text-orange-500 hover:text-orange-700 disabled:opacity-50"
        title={label}
        {...props}
    >
        <Icon className="w-5 h-5" />
    </button>
);

const Textarea = ({ ...props }) => (
    <textarea
        className="w-full border rounded-lg p-3 min-h-[120px] text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
        {...props}
    />
);

const InputFile = ({ ...props }) => (
    <input
        type="file"
        accept=".pdf"
        className="block w-full text-sm text-gray-500 border rounded-lg cursor-pointer
             file:mr-4 file:py-2 file:px-4
             file:rounded-l-lg file:border-0
             file:text-sm file:font-semibold
             file:bg-orange-50 file:text-orange-600
             hover:file:bg-orange-100 dark:text-gray-400 dark:bg-neutral-700 dark:border-neutral-600 dark:file:bg-neutral-600 dark:file:text-orange-400"
        {...props}
    />
);

const DialogContainer = ({ isOpen, setIsOpen, children }) => (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Portal forceMount>
            <AnimatePresence>
                {isOpen && (
                    <>
                        <Dialog.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 bg-black/50 z-40"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            />
                        </Dialog.Overlay>
                        <Dialog.Content asChild forceMount>
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                                {children}
                            </div>
                        </Dialog.Content>
                    </>
                )}
            </AnimatePresence>
        </Dialog.Portal>
    </Dialog.Root>
);

/* ----------------- FEATURE COMPONENT ----------------- */
export default function ApplyDialog({ jobId, isOpen, setIsOpen, hasApplied }) {
    const [coverLetter, setCoverLetter] = useState("");
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    React.useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleUpload = (e) => {
        const uploadedFile = e.target.files[0];
        if (uploadedFile) {
            setFile(uploadedFile);
            if (previewUrl) URL.revokeObjectURL(previewUrl);
            setPreviewUrl(URL.createObjectURL(uploadedFile));
        }
    };

    const handleSuggest = async () => {
        setLoading(true);
        try {
            const res = await authApis().post(endpoints["ai-cover-letter"], { jobId });
            setCoverLetter(res.data.suggestion);
        } catch {
            toast.error("Không thể gợi ý thư giới thiệu");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = cookie.load("token");
        if (!token) {
            toast.error("⚠️ Bạn chưa đăng nhập hoặc phiên đã hết hạn");
            return;
        }

        if (hasApplied) {
            toast.warning("📝 Bạn đã ứng tuyển công việc này rồi");
            return;
        }

        if (!file) {
            toast.error("Vui lòng tải lên CV của bạn");
            return;
        }

        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("resumeFile", file);
            formData.append("jobPostId", jobId);

            await authApis().post(endpoints["apply-job"], formData);

            toast.success("🎉 Bạn đã ứng tuyển thành công!");
            setIsOpen(false);
        } catch (error) {
            const status = error?.response?.status;
            console.error("Upload failed:", error?.response?.data || error.message);

            if (status === 401) {
                toast.error("⚠️ Bạn chưa đăng nhập hoặc phiên đã hết hạn");
            } else if (status === 409) {
                toast.warning("📝 Bạn đã ứng tuyển vào công việc này rồi");
            } else {
                toast.error("🚨 Gửi CV thất bại, vui lòng thử lại sau");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <DialogContainer isOpen={isOpen} setIsOpen={setIsOpen}>
            <motion.form
                onSubmit={handleSubmit}
                className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-800"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <Dialog.Title className="text-xl font-bold text-gray-800 dark:text-white">
                        Ứng tuyển công việc
                    </Dialog.Title>
                    <Dialog.Close asChild>
                        <Button type="button" variant="icon" aria-label="Đóng">
                            <X className="w-5 h-5" />
                        </Button>
                    </Dialog.Close>
                </div>

                {/* Body */}
                <div className="space-y-4">
                    {/* Cover letter */}
                    <div>
                        <label
                            htmlFor="coverLetter"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Thư giới thiệu (tùy chọn)
                        </label>
                        <div className="relative">
                            <Textarea
                                id="coverLetter"
                                value={coverLetter}
                                onChange={(e) => setCoverLetter(e.target.value)}
                                placeholder="Viết vài dòng ấn tượng để gây chú ý với nhà tuyển dụng..."
                                disabled={hasApplied}
                            />
                            <IconButton
                                icon={Sparkles}
                                label="Gợi ý bằng AI"
                                type="button"
                                onClick={handleSuggest}
                                disabled={loading || hasApplied}
                            />
                        </div>
                    </div>

                    {/* Resume file */}
                    <div>
                        <label
                            htmlFor="resumeFile"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Tải lên CV (PDF)
                        </label>
                        <InputFile id="resumeFile" onChange={handleUpload} disabled={hasApplied} />
                        {file && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                <FileText className="w-4 h-4 flex-shrink-0" />
                                <span className="truncate max-w-[200px]">{file.name}</span>
                                <a
                                    href={previewUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1 ml-auto"
                                >
                                    <Eye className="w-4 h-4" /> Xem
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <Dialog.Close asChild>
                            <Button type="button" variant="outline">
                                Hủy
                            </Button>
                        </Dialog.Close>
                        <Button type="submit" disabled={loading || hasApplied}>
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 
                       0 5.373 0 12h4zm2 5.291A7.962 
                       7.962 0 014 12H0c0 3.042 1.135 
                       5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                            Gửi CV
                        </Button>
                    </div>
                </div>
            </motion.form>
        </DialogContainer>
    );
}
