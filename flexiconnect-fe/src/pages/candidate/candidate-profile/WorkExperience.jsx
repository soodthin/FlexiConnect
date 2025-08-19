import { useEffect, useState, useRef } from "react";
import { authApis, endpoints } from "@configs/APIs";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const formatDate = (dateStr) => {
    if (!dateStr) return "Hiện tại";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const ExperienceCard = ({ exp, onEdit, onDelete }) => (
    <div className="bg-white dark:bg-[#232323] rounded-xl shadow p-5 border border-transparent dark:border-neutral-700/50">
        <div className="flex justify-between items-start">
            <div>
                <h4 className="font-bold text-lg">{exp.company}</h4>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">{exp.position}</p>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
        </div>
        {exp.description && (
            <p className="text-sm mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700/50 whitespace-pre-wrap">
                {exp.description}
            </p>
        )}
        {/* ✨ PHẦN HIỂN THỊ GỢI Ý AI TRONG CARD ĐƯỢC GIỮ LẠI */}
        {exp.descriptionAiSuggestion && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-md">
                <p className="text-sm text-blue-800 dark:text-blue-300 italic whitespace-pre-wrap"><span className="font-semibold not-italic">🤖 Gợi ý từ AI:</span> {exp.descriptionAiSuggestion}</p>
            </div>
        )}
        <div className="flex justify-end gap-2 mt-4">
            <button onClick={onEdit} className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-600"><Pencil2Icon /></button>
            <button onClick={onDelete} className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-500/50"><TrashIcon /></button>
        </div>
    </div>
);

export default function WorkExperience() {
    const [experiences, setExperiences] = useState([]);
    const [company, setCompany] = useState("");
    const [position, setPosition] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionAiSuggestion, setDescriptionAiSuggestion] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [editingExp, setEditingExp] = useState(null);
    const [open, setOpen] = useState(false);
    const [reload, setReload] = useState(0);
    const [isSuggesting, setIsSuggesting] = useState(false);
    const firstInputRef = useRef(null);

    useEffect(() => {
        const loadExperiences = async () => {
            try {
                const res = await authApis().get(endpoints["workexperience"]);
                setExperiences(Array.isArray(res.data) ? res.data : []);
            } catch (err) { setExperiences([]); }
        };
        loadExperiences();
    }, [reload]);

    const resetForm = () => {
        setCompany(""); setPosition(""); setDescription("");
        setDescriptionAiSuggestion(""); setStartDate(""); setEndDate("");
        setEditingExp(null); setOpen(false);
    };

    const handleGetSuggestion = async () => {
        if (!description) {
            toast.info("Vui lòng nhập mô tả công việc.");
            return;
        }
        setIsSuggesting(true);
        try {
            const res = await authApis().post(endpoints["cv-suggestion"], { originalInput: description });
            if (res.data?.aiSuggestion) {
                setDescriptionAiSuggestion(res.data.aiSuggestion);
                toast.success("✅ AI đã tạo gợi ý!");
            }
        } catch (err) {
            toast.error("❌ Lỗi tạo gợi ý.");
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { company, position, description, descriptionAiSuggestion, startDate, endDate };
        try {
            if (editingExp) {
                await authApis().put(`${endpoints["workexperience"]}/${editingExp.id}`, data);
                toast.success("Cập nhật thành công!");
            } else {
                await authApis().post(endpoints["workexperience"], data);
                toast.success("Thêm mới thành công!");
            }
            setReload((prev) => prev + 1);
            // ✨ THAY ĐỔI CHÍNH: Đóng dialog ngay sau khi submit
            resetForm();
        } catch (err) {
            toast.error("Thao tác thất bại.");
        }
    };

    const startEdit = (exp) => {
        setCompany(exp.company || ""); setPosition(exp.position || "");
        setDescription(exp.description || ""); setDescriptionAiSuggestion(exp.descriptionAiSuggestion || "");
        setStartDate(exp.startDate?.slice(0, 10) || ""); setEndDate(exp.endDate?.slice(0, 10) || "");
        setEditingExp(exp); 
        setOpen(true);
    };

    const deleteExperience = (id) => {
        if (window.confirm("Bạn có chắc muốn xóa kinh nghiệm này?")) {
            authApis().delete(`${endpoints["workexperience"]}/${id}`)
                .then(() => {
                    toast.success("Đã xóa kinh nghiệm.");
                    setReload(prev => prev + 1);
                })
                .catch(() => toast.error("Xóa thất bại."));
        }
    };

    return (
        <div className="w-full">
            <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && resetForm()}>
                <Dialog.Trigger asChild>
                    <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-800 dark:hover:bg-gray-200 transition">
                        <PlusCircledIcon /> Thêm kinh nghiệm
                    </button>
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
                    <Dialog.Content
                        className="fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#2d2d2d] text-black dark:text-white p-8 shadow-xl z-50 max-h-[90vh] overflow-y-auto"
                    >
                        {/* ✨ THAY ĐỔI CHÍNH: Bỏ AnimatePresence và logic 2 bước */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Dialog.Title className="text-2xl font-bold mb-4">Kinh nghiệm làm việc</Dialog.Title>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input ref={firstInputRef} placeholder="Công ty" className="w-full px-4 py-2 rounded-lg border dark:border-neutral-600 bg-white dark:bg-[#3a3a3a]" value={company} onChange={(e) => setCompany(e.target.value)} required />
                                <input placeholder="Vị trí" className="w-full px-4 py-2 rounded-lg border dark:border-neutral-600 bg-white dark:bg-[#3a3a3a]" value={position} onChange={(e) => setPosition(e.target.value)} required />
                                <input type="date" className="w-full px-4 py-2 rounded-lg border dark:border-neutral-600 bg-white dark:bg-[#3a3a3a]" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                                <input type="date" className="w-full px-4 py-2 rounded-lg border dark:border-neutral-600 bg-white dark:bg-[#3a3a3a]" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium">Mô tả công việc</label>
                                <textarea
                                    placeholder="Nhập các ý chính về công việc và thành tựu của bạn..."
                                    rows={4}
                                    className="w-full px-4 py-2 rounded-lg border dark:border-neutral-600 bg-white dark:bg-[#3a3a3a]"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleGetSuggestion}
                                    disabled={isSuggesting}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90 disabled:opacity-60 transition shadow"
                                >
                                    {isSuggesting ? (
                                        <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Đang xử lý...</>
                                    ) : (
                                        <><MagicWandIcon /> ✨ Viết lại với AI</>
                                    )}
                                </button>
                                {/* ✨ GIỮ LẠI: Box gợi ý với 2 nút "Dùng gợi ý" và "Bỏ qua" */}
                                {descriptionAiSuggestion && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mt-3 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-[#2d2d2d] border border-blue-300 dark:border-blue-700 rounded-xl p-4 shadow-inner"
                                    >
                                        <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-2 flex items-center gap-2">
                                            <MagicWandIcon className="text-blue-600 dark:text-blue-300" /> Gợi ý từ AI
                                        </p>
                                        <p className="text-sm italic text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                                            {descriptionAiSuggestion}
                                        </p>
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setDescription(descriptionAiSuggestion);
                                                    setDescriptionAiSuggestion("");
                                                }}
                                                className="flex-1 bg-blue-600 text-white text-xs py-1 rounded-lg hover:bg-blue-700"
                                            >
                                                Dùng gợi ý
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setDescriptionAiSuggestion("")}
                                                className="flex-1 bg-gray-200 dark:bg-[#444] text-black dark:text-white text-xs py-1 rounded-lg hover:bg-gray-300"
                                            >
                                                Bỏ qua
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-700">
                                    {editingExp ? "Cập nhật" : "Thêm mới"}
                                </button>
                                <Dialog.Close asChild>
                                    <button type="button" className="flex-1 bg-gray-200 dark:bg-[#444] py-2.5 rounded-lg font-semibold">Huỷ</button>
                                </Dialog.Close>
                            </div>
                        </form>
                        <Dialog.Close asChild>
                            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-[#444]"><Cross2Icon /></button>
                        </Dialog.Close>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>

            <div className="space-y-4 mt-6">
                <AnimatePresence>
                    {experiences.map((exp) => (
                        <motion.div key={exp.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            <ExperienceCard exp={exp} onEdit={() => startEdit(exp)} onDelete={() => deleteExperience(exp.id)} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}