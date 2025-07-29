import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/APIs";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";

const formatDate = (dateStr) => {
  if (!dateStr) return "??";
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

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

  const loadExperiences = async () => {
    try {
      let res = await authApis().get(endpoints["workexperience"]);
      setExperiences(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setExperiences([]);
    }
  };

  useEffect(() => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExp) {
        await authApis().put(`${endpoints["workexperience"]}/${editingExp.id}`, {
          company,
          position,
          description,
          descriptionAiSuggestion,
          startDate,
          endDate,
        });
      } else {
        await authApis().post(endpoints["workexperience"], {
          company,
          position,
          description,
          descriptionAiSuggestion,
          startDate,
          endDate,
        });
      }
      resetForm();
      setReload((prev) => prev + 1);
    } catch (err) { }
  };

  const deleteExperience = async (id) => {
    try {
      await authApis().delete(`${endpoints["workexperience"]}/${id}`);
      setReload((prev) => prev + 1);
    } catch (err) { }
  };

  const startEdit = (exp) => {
    setCompany(exp.company || "");
    setPosition(exp.position || "");
    setDescription(exp.description || "");
    setDescriptionAiSuggestion(exp.descriptionAiSuggestion || "");
    setStartDate(exp.startDate ? exp.startDate.slice(0, 10) : "");
    setEndDate(exp.endDate ? exp.endDate.slice(0, 10) : "");
    setEditingExp(exp);
    setOpen(true);
  };

  return (
  <div className="w-full bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white rounded-xl shadow p-6 text-[16px] leading-relaxed">
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="flex items-center gap-2 bg-neutral-900 dark:bg-beige dark:text-black text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-neutral-800 dark:hover:bg-[#f5f5dc] mb-4">
          <PlusCircledIcon className="w-5 h-5" />
          Thêm kinh nghiệm
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white p-8 shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 focus:outline-none">
          <Dialog.Title className="text-2xl font-bold mb-2">Kinh nghiệm</Dialog.Title>
          <Dialog.Description className="mb-5 text-neutral-500 dark:text-neutral-400">
            {editingExp ? "Chỉnh sửa kinh nghiệm làm việc." : "Thêm mới kinh nghiệm làm việc."}
          </Dialog.Description>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                placeholder="Công ty"
                className="w-1/2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-neutral-900"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
              <input
                placeholder="Vị trí"
                className="w-1/2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-neutral-900"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-3">
              <input
                type="date"
                placeholder="Ngày bắt đầu"
                className="w-1/2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-neutral-900"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
              <input
                type="date"
                placeholder="Ngày kết thúc"
                className="w-1/2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-2 focus:ring-2 focus:ring-neutral-900"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <textarea
              placeholder="Mô tả công việc"
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-neutral-900 min-h-[80px]"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <textarea
              placeholder="Gợi ý AI"
              className="w-full rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white px-4 py-3 focus:ring-2 focus:ring-neutral-900 min-h-[60px]"
              value={descriptionAiSuggestion}
              onChange={(e) => setDescriptionAiSuggestion(e.target.value)}
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                className="flex-1 bg-neutral-900 text-white py-2 rounded-lg font-semibold hover:bg-neutral-800"
              >
                {editingExp ? "Cập nhật" : "Thêm mới"}
              </button>
              {editingExp && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white py-2 rounded-lg font-semibold hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  Huỷ
                </button>
              )}
            </div>
          </form>
          <Dialog.Close asChild>
            <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700">
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>

    <div className="space-y-5 w-full">
      {experiences.length === 0 && (
        <div className="text-center text-neutral-400 rounded-xl py-10 text-base w-full bg-neutral-50 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700">
          Chưa có kinh nghiệm nào.
        </div>
      )}
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="bg-neutral-50 dark:bg-neutral-800 rounded-xl shadow-sm px-6 py-5 border border-neutral-200 dark:border-neutral-700 hover:shadow-md hover:border-neutral-300 dark:hover:border-neutral-500 transition flex flex-col gap-3"
        >
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2">
              <h4 className="text-lg font-semibold text-neutral-900 dark:text-white">{exp.company}</h4>
              <span className="inline-block px-3 py-0.5 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-white rounded-full text-sm w-fit">
                {exp.position}
              </span>
            </div>
            <div className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-nowrap font-roboto">
              {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
            </div>
          </div>

          {exp.description && (
            <p className="text-[15px] text-neutral-700 dark:text-neutral-300 leading-6">
              {exp.description}
            </p>
          )}
          {exp.descriptionAiSuggestion && (
            <div className="text-[15px] text-blue-600 dark:text-blue-400 italic flex items-center gap-2">
              <span>🤖</span> {exp.descriptionAiSuggestion}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              title="Sửa"
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-yellow-200 dark:hover:bg-yellow-600 text-neutral-800 dark:text-white border border-neutral-200 dark:border-neutral-600"
              onClick={() => startEdit(exp)}
            >
              <Pencil2Icon className="w-4 h-4" />
            </button>
            <button
              title="Xoá"
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700 hover:bg-red-400 dark:hover:bg-red-600 hover:text-white text-neutral-800 dark:text-white border border-neutral-200 dark:border-neutral-600"
              onClick={() => deleteExperience(exp.id)}
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

}
