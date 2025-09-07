import { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import * as RadixDialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { toast } from "sonner";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-xl shadow p-6 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700 ${className}`}
  >
    {children}
  </div>
);

const Button = ({ children, className = "", ...props }) => (
  <button
    {...props}
    className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition ${className}`}
  >
    {children}
  </button>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-yellow-500 ${className}`}
  />
);

const Select = ({ children, className = "", ...props }) => (
  <select
    {...props}
    className={`w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-neutral-900 dark:focus:ring-yellow-500 ${className}`}
  >
    {children}
  </select>
);

const Dialog = ({ open, onOpenChange, title, description, children }) => (
  <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
    <RadixDialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
    <RadixDialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-8 shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 focus:outline-none">
      <RadixDialog.Title className="text-2xl font-bold mb-2">{title}</RadixDialog.Title>
      {description && (
        <RadixDialog.Description className="mb-4 text-neutral-500 dark:text-neutral-400">
          {description}
        </RadixDialog.Description>
      )}
      {children}
      <RadixDialog.Close asChild>
        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700">
          <Cross2Icon />
        </button>
      </RadixDialog.Close>
    </RadixDialog.Content>
  </RadixDialog.Root>
);

const DialogTrigger = RadixDialog.Trigger;

export default function CandidateSkillList() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);
  const [savedJobCount, setSavedJobCount] = useState(0);
  const navigate = useNavigate();

  const loadSkills = async () => {
    try {
      let res = await authApis().get(endpoints["skills"]);
      setSkills(Array.isArray(res.data) ? res.data : []);
    } catch {
      setSkills([]);
    }
  };

  useEffect(() => {
    loadSkills();
  }, [reload]);

  const resetForm = () => {
    setName("");
    setLevel("");
    setEditingSkill(null);
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await authApis().put(`${endpoints["skills"]}/${editingSkill.id}`, { skillName: name, level });
      } else {
        await authApis().post(endpoints["skills"], { skillName: name, level });
      }
      resetForm();
      setReload((prev) => prev + 1);
      toast.success(`Kỹ năng đã được ${editingSkill ? "cập nhật" : "thêm"}!`);
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await authApis().delete(`${endpoints["skills"]}/${id}`);
      setReload((prev) => prev + 1);
      toast.success("Kỹ năng đã được xoá!");
    } catch {}
  };

  const startEdit = (skill) => {
    setName(skill.skillName || "");
    setLevel(skill.level);
    setEditingSkill(skill);
    setOpen(true);
  };

  useEffect(() => {
    const loadSavedJobCount = async () => {
      try {
        const res = await authApis().get(endpoints["saved-jobs-count"]);
        if (res.data.success) setSavedJobCount(res.data.count);
      } catch (err) {
        console.error("Lấy số job đã lưu thất bại:", err);
      }
    };
    loadSavedJobCount();
  }, []);

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left - Skills list */}
      <Card>
        <RadixDialog.Root open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button className="bg-neutral-900 dark:bg-beige text-white dark:text-black px-5 py-3 rounded-xl font-semibold shadow hover:bg-neutral-800 dark:hover:bg-gray-200 mb-4">
      <PlusCircledIcon className="w-5 h-5" /> Thêm kỹ năng
    </Button>
  </DialogTrigger>
  <Dialog
    open={open}
    onOpenChange={setOpen}
    title="Kỹ năng"
    description={editingSkill ? "Chỉnh sửa kỹ năng." : "Thêm kỹ năng mới."}
  >
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input placeholder="Tên kỹ năng" value={name} onChange={(e) => setName(e.target.value)} />
      <Input placeholder="Cấp độ (VD: Thành thạo)" value={level} onChange={(e) => setLevel(e.target.value)} />
      <div className="flex gap-2">
        <Button
          type="submit"
          className="flex-1 bg-neutral-900 dark:bg-beige text-white dark:text-black py-2 rounded-lg font-semibold hover:bg-neutral-800 dark:hover:bg-gray-200"
        >
          {editingSkill ? "Cập nhật" : "Thêm mới"}
        </Button>
        {editingSkill && (
          <Button
            onClick={resetForm}
            type="button"
            className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white py-2 rounded-lg font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-600"
          >
            Huỷ
          </Button>
        )}
      </div>
    </form>
  </Dialog>
</RadixDialog.Root>


        <div className="space-y-5 w-full">
          {skills.length === 0 && (
            <div className="text-center text-neutral-400 rounded-xl py-10 bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
              Chưa có kỹ năng nào.
            </div>
          )}
          {skills.map((skill) => (
            <Card
              key={skill.id}
              className="bg-neutral-50 dark:bg-neutral-800 shadow-sm px-6 py-5 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-500 transition"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-semibold">{skill.skillName}</h4>
                  <span className="inline-block px-3 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-white rounded-full text-sm w-fit">
                    {skill.level}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <Button
                  title="Sửa"
                  onClick={() => startEdit(skill)}
                  className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-yellow-200 dark:hover:bg-yellow-600 border border-neutral-200 dark:border-neutral-600"
                >
                  <Pencil2Icon className="w-4 h-4" />
                </Button>
                <Button
                  title="Xoá"
                  onClick={() => handleDelete(skill.id)}
                  className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-red-400 dark:hover:bg-red-600 hover:text-white border border-neutral-200 dark:border-neutral-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Right - Saved Jobs */}
      <Card className="flex flex-col gap-4 items-center justify-center text-center p-6 rounded-2xl bg-white dark:bg-neutral-900 shadow-lg dark:shadow-gray-700 transition-colors relative">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">JOB ĐÃ LƯU</h3>
        <div className="relative">
          <Bookmark className="w-16 h-16 text-yellow-500 dark:text-yellow-400" />
          {savedJobCount > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold shadow-md">
              {savedJobCount}
            </div>
          )}
        </div>

        <Button
          onClick={() => navigate("/saved-jobs")}
          className="mt-2 w-32 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-2 rounded-lg font-semibold shadow-md transition-all duration-200 dark:from-yellow-400 dark:to-yellow-500 dark:hover:from-yellow-500 dark:hover:to-yellow-600"
        >
          Xem chi tiết
        </Button>
      </Card>
    </div>
  );
}
