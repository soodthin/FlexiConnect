import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/APIs";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";

export default function CandidateSkillList() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);

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
        await authApis().put(`${endpoints["skills"]}/${editingSkill.id}`, {
          skillName: name,
          level,
        });
      } else {
        await authApis().post(endpoints["skills"], {
          skillName: name,
          level,
        });
      }
      resetForm();
      setReload((prev) => prev + 1);
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await authApis().delete(`${endpoints["skills"]}/${id}`);
      setReload((prev) => prev + 1);
    } catch {}
  };

  const startEdit = (skill) => {
    setName(skill.skillName || "");
    setLevel(skill.level);
    setEditingSkill(skill);
    setOpen(true);
  };

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Left - Skills list */}
      <div className="bg-white dark:bg-[#232323] rounded-xl shadow p-6 text-[16px] leading-relaxed">
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-neutral-800 mb-4">
              <PlusCircledIcon className="w-5 h-5" /> Thêm kỹ năng
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
            <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8 shadow-xl border border-neutral-200 z-50 focus:outline-none">
              <Dialog.Title className="text-2xl font-bold mb-2">Kỹ năng</Dialog.Title>
              <Dialog.Description className="mb-4 text-neutral-500">
                {editingSkill ? "Chỉnh sửa kỹ năng." : "Thêm kỹ năng mới."}
              </Dialog.Description>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  placeholder="Tên kỹ năng"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 focus:ring-2 focus:ring-neutral-900"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  placeholder="Cấp độ (VD: Thành thạo)"
                  className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 focus:ring-2 focus:ring-neutral-900"
                  value={level}
                  onChange={(e) => setLevel(e.target.value)}
                />
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-neutral-900 text-white py-2 rounded-lg font-semibold hover:bg-neutral-800">
                    {editingSkill ? "Cập nhật" : "Thêm mới"}
                  </button>
                  {editingSkill && (
                    <button
                      onClick={resetForm}
                      type="button"
                      className="flex-1 bg-neutral-100 text-neutral-900 py-2 rounded-lg font-semibold hover:bg-neutral-200"
                    >
                      Huỷ
                    </button>
                  )}
                </div>
              </form>
              <Dialog.Close asChild>
                <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200">
                  <Cross2Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="space-y-5 w-full">
          {skills.length === 0 && (
            <div className="text-center text-neutral-400 rounded-xl py-10 bg-neutral-50 border border-neutral-300">
              Chưa có kỹ năng nào.
            </div>
          )}
          {skills.map((skill) => (
            <div key={skill.id} className="bg-neutral-50 rounded-xl shadow-sm px-6 py-5 border border-neutral-200 hover:shadow-md hover:border-neutral-300 transition">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2">
                  <h4 className="text-lg font-semibold text-neutral-900">{skill.skillName}</h4>
                  <span className="inline-block px-3 py-0.5 bg-neutral-200 text-neutral-700 rounded-full text-sm w-fit">
                    {skill.level}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  title="Sửa"
                  className="p-2 rounded-lg bg-neutral-100 hover:bg-yellow-200 text-neutral-800 border border-neutral-200"
                  onClick={() => startEdit(skill)}
                >
                  <Pencil2Icon className="w-4 h-4" />
                </button>
                <button
                  title="Xoá"
                  className="p-2 rounded-lg bg-neutral-100 hover:bg-red-400 hover:text-white text-neutral-800 border border-neutral-200"
                  onClick={() => handleDelete(skill.id)}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right - AI Suggestion placeholder */}
      <div className="bg-white dark:bg-[#232323] rounded-xl shadow p-6 text-[16px] leading-relaxed flex flex-col gap-4 border border-neutral-200">
        <h3 className="text-xl font-bold text-neutral-900">Gợi ý từ AI</h3>
        <p className="text-neutral-600">
          (Tuỳ chọn) Chọn tính năng AI để gợi ý kỹ năng phù hợp với CV của bạn.
        </p>
        <select className="rounded-lg border border-neutral-300 bg-white px-4 py-2 focus:ring-2 focus:ring-neutral-900">
          <option>Chọn lĩnh vực AI...</option>
          <option>Web Development</option>
          <option>Machine Learning</option>
          <option>UI/UX Design</option>
          <option>Marketing Digital</option>
        </select>
        <button className="mt-auto bg-neutral-900 text-white py-2 rounded-lg font-semibold hover:bg-neutral-800">
          Áp dụng gợi ý AI
        </button>
      </div>
    </div>
  );
}
