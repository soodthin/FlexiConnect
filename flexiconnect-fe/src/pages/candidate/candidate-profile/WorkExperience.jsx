import { useEffect, useState, useRef } from "react";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon, MagicWandIcon } from "@radix-ui/react-icons";
import { Crown, Zap } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-dark-bg-secondary rounded-xl shadow p-5 border border-transparent dark:border-dark-border-primary/50 ${className}`}>
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-lg font-semibold transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const IconButton = ({ children, className = "", ...props }) => (
  <button
    className={`p-2 rounded-md transition ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Dialog = {
  Root: DialogPrimitive.Root,
  Trigger: DialogPrimitive.Trigger,
  Portal: DialogPrimitive.Portal,
  Overlay: (props) => <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 z-40" {...props} />,
  Content: ({ children, className = "", ...props }) => (
    <DialogPrimitive.Content
      className={`fixed left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-dark-bg-elevated text-black dark:text-white p-8 shadow-xl z-50 max-h-[90vh] overflow-y-auto ${className}`}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  ),
  Title: DialogPrimitive.Title,
  Close: DialogPrimitive.Close,
};

// Upgrade Dialog Component
const UpgradeDialog = ({ open, onClose, onUpgrade }) => (
  <Dialog.Root open={open} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay />
      <Dialog.Content>
        <div className="text-center">
          <div className="mb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
              Nâng cấp tài khoản AI
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              Bạn cần nâng cấp tài khoản để sử dụng tính năng AI
            </p>
          </div>

          <div className="grid gap-4 mb-6">
            {/* Basic Package */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4 border border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-blue-800 dark:text-blue-300">Basic</h4>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">55.000₫</span>
              </div>
              <ul className="text-sm text-blue-700 dark:text-blue-300 text-left space-y-1">
                <li>• Đánh giá CV tự động bằng AI</li>
                <li>• Gợi ý chỉnh sửa CV</li>
                <li>• AI viết lại mô tả công việc</li>
              </ul>
            </div>

            {/* Premium Package */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4 border border-purple-200 dark:border-purple-700">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-purple-800 dark:text-purple-300">Premium</h4>
                  <span className="bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-200 px-2 py-1 rounded-full text-xs font-semibold">
                    Phổ biến
                  </span>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">115.000₫</span>
              </div>
              <ul className="text-sm text-purple-700 dark:text-purple-300 text-left space-y-1">
                <li>• Tất cả tính năng Basic</li>
                <li>• Mock interview với AI</li>
                <li>• Tạo Cover Letter bằng AI</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              className="flex-1 bg-neutral-200 dark:bg-dark-bg-elevated text-black dark:text-white hover:bg-neutral-300 dark:hover:bg-neutral-700"
            >
              Để sau
            </Button>
            <Button
              onClick={onUpgrade}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold hover:from-purple-600 hover:to-pink-600 flex items-center justify-center gap-2"
            >
              <Zap size={16} />
              Nâng cấp ngay
            </Button>
          </div>
        </div>
        <Dialog.Close asChild>
          <IconButton className="absolute right-4 top-4 hover:bg-neutral-200 dark:hover:bg-dark-bg-elevated" aria-label="Close dialog">
            <Cross2Icon aria-hidden="true" />
          </IconButton>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

const formatDate = (dateStr) => {
  if (!dateStr) return "Hiện tại";
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
};

const ExperienceCard = ({ exp, onEdit, onDelete, hasAIAccess }) => (
  <Card>
    <div className="flex justify-between items-start">
      <div>
        <h4 className="font-bold text-lg">{exp.company}</h4>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">{exp.position}</p>
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
    </div>
    {exp.description && (
      <p className="text-sm mt-3 pt-3 border-t border-neutral-200 dark:border-dark-border-primary/50 whitespace-pre-wrap">
        {exp.description}
      </p>
    )}
    {exp.descriptionAiSuggestion && hasAIAccess && (
      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-md">
        <p className="text-sm text-blue-800 dark:text-blue-300 italic whitespace-pre-wrap">
          <span className="font-semibold not-italic"> Gợi ý từ AI:</span> {exp.descriptionAiSuggestion}
        </p>
      </div>
    )}
    <div className="flex justify-end gap-2 mt-4">
      <IconButton onClick={onEdit} className="hover:bg-neutral-100 dark:hover:bg-neutral-600">
        <Pencil2Icon />
      </IconButton>
      <IconButton onClick={onDelete} className="hover:bg-red-100 dark:hover:bg-red-500/50">
        <TrashIcon />
      </IconButton>
    </div>
  </Card>
);

export default function WorkExperience({ userPackage, onUpgradeClick }) {
  const navigate = useNavigate();
  const [experiences, setExperiences] = useState([]);
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionAiSuggestion, setDescriptionAiSuggestion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingExp, setEditingExp] = useState(null);
  const [open, setOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const [reload, setReload] = useState(0);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteExpId, setDeleteExpId] = useState(null);
  const firstInputRef = useRef(null);

  const checkAIAccess = () => userPackage?.isActive === true;

  const handleAIFeatureClick = (callback) => {
    if (checkAIAccess()) {
      callback();
    } else {
      setOpen(false); 
      if (onUpgradeClick) {
        onUpgradeClick();
      } else {
        setIsUpgradeDialogOpen(true);
      }
    }
  };

  const handleUpgradeRedirect = () => {
    setIsUpgradeDialogOpen(false);
    try {
      navigate("/candidate-upgrade", { replace: true });
    } catch {
      window.location.href = "/candidate-upgrade";
    }
  };

  useEffect(() => {
    const loadExperiences = async () => {
      try {
        const res = await authApis().get(endpoints["workexperience"]);
        setExperiences(Array.isArray(res.data) ? res.data : []);
      } catch {
        setExperiences([]);
      }
    };
    loadExperiences();
  }, [reload]);

  const resetForm = () => {
    setCompany("");
    setPosition("");
    setDescription("");
    setDescriptionAiSuggestion("");
    setStartDate("");
    setEndDate("");
    setEditingExp(null);
    setOpen(false);
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
        toast.success(" AI đã tạo gợi ý!");
      }
    } catch {
      toast.error(" Lỗi tạo gợi ý, vui lòng thử lại.");
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
      setReload(prev => prev + 1);
      resetForm();
    } catch {
      toast.error("Thao tác thất bại.");
    }
  };

  const startEdit = (exp) => {
    setCompany(exp.company || "");
    setPosition(exp.position || "");
    setDescription(exp.description || "");
    setDescriptionAiSuggestion(exp.descriptionAiSuggestion || "");
    setStartDate(exp.startDate?.slice(0, 10) || "");
    setEndDate(exp.endDate?.slice(0, 10) || "");
    setEditingExp(exp);
    setOpen(true);
  };

  // Dialog Xóa
  const confirmDeleteExperience = (id) => {
    setDeleteExpId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteExperience = async () => {
    try {
      await authApis().delete(`${endpoints["workexperience"]}/${deleteExpId}`);
      toast.success("✅ Đã xóa kinh nghiệm!");
      setReload(prev => prev + 1);
    } catch {
      toast.error("❌ Xóa thất bại.");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteExpId(null);
    }
  };

  return (
    <div className="w-full">
      {/* Thêm/Sửa Dialog */}
      <Dialog.Root open={open} onOpenChange={(isOpen) => !isOpen && resetForm()}>
        <Dialog.Trigger asChild>
          <Button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black shadow hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <PlusCircledIcon /> Thêm kinh nghiệm
          </Button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Dialog.Title className="text-2xl font-bold mb-4">
                Kinh nghiệm làm việc
                {checkAIAccess() && <Crown size={20} className="inline ml-2 text-yellow-500" />}
              </Dialog.Title>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input ref={firstInputRef} placeholder="Công ty" className="w-full px-4 py-2 rounded-lg border dark:border-dark-border-subtle bg-white dark:bg-dark-bg-tertiary" value={company} onChange={(e) => setCompany(e.target.value)} required />
                <input placeholder="Vị trí" className="w-full px-4 py-2 rounded-lg border dark:border-dark-border-subtle bg-white dark:bg-dark-bg-tertiary" value={position} onChange={(e) => setPosition(e.target.value)} required />
                <input type="date" className="w-full px-4 py-2 rounded-lg border dark:border-dark-border-subtle bg-white dark:bg-dark-bg-tertiary" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                <input type="date" className="w-full px-4 py-2 rounded-lg border dark:border-dark-border-subtle bg-white dark:bg-dark-bg-tertiary" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Mô tả công việc</label>
                <textarea
                  placeholder="Nhập các ý chính về công việc và thành tựu của bạn..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border dark:border-dark-border-subtle bg-white dark:bg-dark-bg-tertiary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <Button
                  type="button"
                  onClick={() => handleAIFeatureClick(handleGetSuggestion)}
                  disabled={isSuggesting}
                  className={`w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-lg shadow ${
                    checkAIAccess()
                      ? "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white hover:opacity-90"
                      : "bg-neutral-200 dark:bg-dark-bg-elevated text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
                  } disabled:opacity-60`}
                >
                  {isSuggesting ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Đang xử lý...</>
                  ) : checkAIAccess() ? (
                    <><MagicWandIcon /> Viết lại với AI</>
                  ) : (
                    <><Crown size={16} />  Nâng cấp để dùng AI</>
                  )}
                </Button>
                {descriptionAiSuggestion && checkAIAccess() && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-dark-bg-elevated border border-blue-300 dark:border-blue-700 rounded-xl p-4 shadow-inner"
                  >
                    <p className="text-sm text-blue-900 dark:text-blue-200 font-medium mb-2 flex items-center gap-2">
                      <MagicWandIcon className="text-blue-600 dark:text-blue-300" /> Gợi ý từ AI
                    </p>
                    <p className="text-sm italic text-blue-800 dark:text-blue-300 whitespace-pre-wrap">
                      {descriptionAiSuggestion}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Button
                        type="button"
                        onClick={() => {
                          setDescription(descriptionAiSuggestion);
                          setDescriptionAiSuggestion("");
                        }}
                        className="flex-1 bg-blue-600 text-white text-xs py-1 hover:bg-blue-700"
                      >
                        Dùng gợi ý
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setDescriptionAiSuggestion("")}
                        className="flex-1 bg-neutral-200 dark:bg-dark-bg-elevated text-black dark:text-white text-xs py-1 hover:bg-neutral-300 dark:hover:bg-neutral-700"
                      >
                        Bỏ qua
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1 bg-blue-600 text-white py-2.5 hover:bg-blue-700">
                  {editingExp ? "Cập nhật" : "Thêm mới"}
                </Button>
                <Dialog.Close asChild>
                  <Button type="button" className="flex-1 bg-neutral-200 dark:bg-dark-bg-elevated py-2.5">
                    Huỷ
                  </Button>
                </Dialog.Close>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Danh sách trải nghiệm */}
      <div className="grid gap-4 mt-6">
        {experiences.map((exp) => (
          <ExperienceCard
            key={exp.id}
            exp={exp}
            hasAIAccess={checkAIAccess()}
            onEdit={() => startEdit(exp)}
            onDelete={() => confirmDeleteExperience(exp.id)}
          />
        ))}
      </div>

      {/* Dialog nâng cấp */}
      {isUpgradeDialogOpen && (
        <UpgradeDialog
          open={isUpgradeDialogOpen}
          onClose={() => setIsUpgradeDialogOpen(false)}
          onUpgrade={handleUpgradeRedirect}
        />
      )}

      {/* Dialog xóa */}
      <Dialog.Root open={deleteDialogOpen} onOpenChange={(open) => !open && setDeleteDialogOpen(false)}>
        <Dialog.Portal>
          <Dialog.Overlay />
          <Dialog.Content>
            <div className="text-center">
              <p className="text-lg font-medium mb-4">Bạn có chắc muốn xóa kinh nghiệm này?</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleDeleteExperience} className="bg-red-600 text-white flex-1">
                  Xóa
                </Button>
                <Button onClick={() => setDeleteDialogOpen(false)} className="bg-neutral-200 dark:bg-dark-bg-elevated flex-1">
                  Hủy
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
