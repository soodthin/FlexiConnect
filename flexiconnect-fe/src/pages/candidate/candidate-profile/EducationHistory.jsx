import { useEffect, useState } from "react";
import { authApis, endpoints } from "@configs/APIs";
import {
  Dialog as RadixDialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogOverlay,
  DialogClose,
} from "@radix-ui/react-dialog";
import {
  Cross2Icon,
  Pencil2Icon,
  TrashIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-neutral-50 dark:bg-[#2f2f2f] rounded-xl shadow-sm px-6 py-5 border dark:border-neutral-700 ${className}`}
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

const Dialog = ({ open, onOpenChange, title, children }) => (
  <RadixDialog open={open} onOpenChange={onOpenChange}>
    <DialogOverlay className="fixed inset-0 bg-black/40 z-40" />
    <DialogContent className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white dark:bg-[#2d2d2d] text-[#111] dark:text-beige p-8 shadow-xl border border-neutral-200 dark:border-neutral-700 z-50 focus:outline-none">
      <DialogTitle className="text-2xl font-bold mb-4">{title}</DialogTitle>
      {children}
      <DialogClose asChild>
        <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-[#444]">
          <Cross2Icon />
        </button>
      </DialogClose>
    </DialogContent>
  </RadixDialog>
);

export default function EducationHistory() {
  const [educations, setEducations] = useState([]);
  const [school, setSchool] = useState("");
  const [major, setMajor] = useState("");
  const [degree, setDegree] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingEdu, setEditingEdu] = useState(null);
  const [open, setOpen] = useState(false);
  const [reload, setReload] = useState(0);

  const loadEducations = async () => {
    try {
      let res = await authApis().get(endpoints["education"]);
      setEducations(Array.isArray(res.data) ? res.data : []);
    } catch {
      setEducations([]);
    }
  };

  useEffect(() => {
    loadEducations();
  }, [reload]);

  const resetForm = () => {
    setSchool("");
    setMajor("");
    setDegree("");
    setStartDate("");
    setEndDate("");
    setEditingEdu(null);
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEdu) {
        await authApis().put(endpoints["education-id"](editingEdu.id), {
          school,
          major,
          degree,
          startDate,
          endDate,
        });
      } else {
        await authApis().post(endpoints["education"], {
          school,
          major,
          degree,
          startDate,
          endDate,
        });
      }
      resetForm();
      setReload((prev) => prev + 1);
    } catch {}
  };

  const deleteEducation = async (id) => {
    try {
      await authApis().delete(endpoints["education-id"](id));
      setReload((prev) => prev + 1);
    } catch {}
  };

  const startEdit = (edu) => {
    setSchool(edu.school || "");
    setMajor(edu.major || "");
    setDegree(edu.degree || "");
    setStartDate(edu.startDate ? edu.startDate.slice(0, 10) : "");
    setEndDate(edu.endDate ? edu.endDate.slice(0, 10) : "");
    setEditingEdu(edu);
    setOpen(true);
  };

  return (
    <div className="w-full bg-white dark:bg-[#232323] text-[#111] dark:text-beige rounded-xl shadow p-6 text-[16px] leading-relaxed">
      <RadixDialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="bg-neutral-900 dark:bg-beige dark:text-black text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-neutral-800 dark:hover:bg-[#f5f5dc] mb-4">
            <PlusCircledIcon className="w-5 h-5" /> Thêm học vấn
          </Button>
        </DialogTrigger>
        <Dialog open={open} onOpenChange={setOpen} title="Học vấn">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              placeholder="Trường học"
              value={school}
              onChange={(e) => setSchool(e.target.value)}
              required
              className="w-full rounded-lg border px-4 py-2 bg-white dark:bg-[#3b3b3b] border-neutral-300 dark:border-neutral-600"
            />
            <input
              placeholder="Ngành học"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 bg-white dark:bg-[#3b3b3b] border-neutral-300 dark:border-neutral-600"
            />
            <input
              placeholder="Bằng cấp"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              className="w-full rounded-lg border px-4 py-2 bg-white dark:bg-[#3b3b3b] border-neutral-300 dark:border-neutral-600"
            />
            <div className="flex gap-3">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="w-1/2 rounded-lg border px-4 py-2 bg-white dark:bg-[#3b3b3b] border-neutral-300 dark:border-neutral-600"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-1/2 rounded-lg border px-4 py-2 bg-white dark:bg-[#3b3b3b] border-neutral-300 dark:border-neutral-600"
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-neutral-900 dark:bg-beige text-white dark:text-black py-2 hover:bg-neutral-800 dark:hover:bg-[#f5f5dc]"
              >
                {editingEdu ? "Cập nhật" : "Thêm mới"}
              </Button>
              {editingEdu && (
                <Button
                  onClick={resetForm}
                  type="button"
                  className="flex-1 bg-neutral-100 dark:bg-[#444] text-neutral-900 dark:text-beige py-2 hover:bg-neutral-200 dark:hover:bg-[#555]"
                >
                  Huỷ
                </Button>
              )}
            </div>
          </form>
        </Dialog>
      </RadixDialog>

      <div className="space-y-5 w-full">
        {educations.length === 0 && (
          <div className="text-center text-neutral-400 dark:text-neutral-300 rounded-xl py-10 bg-neutral-50 dark:bg-[#2f2f2f] border dark:border-neutral-700">
            Chưa có thông tin học vấn.
          </div>
        )}
        {educations.map((edu) => (
          <Card
            key={edu.id}
            className="hover:shadow-md transition flex flex-col gap-2"
          >
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <h4 className="text-lg font-semibold">{edu.school}</h4>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {edu.major} - {edu.degree}
                </span>
              </div>
              <div className="text-sm text-neutral-500 dark:text-gray-400">
                {edu.startDate?.slice(0, 10)} - {edu.endDate?.slice(0, 10)}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button
                onClick={() => startEdit(edu)}
                className="p-2 rounded-lg bg-neutral-100 dark:bg-[#3d3d3d] hover:bg-yellow-200 dark:hover:bg-yellow-600 border dark:border-neutral-600"
              >
                <Pencil2Icon />
              </Button>
              <Button
                onClick={() => deleteEducation(edu.id)}
                className="p-2 rounded-lg bg-neutral-100 dark:bg-[#3d3d3d] hover:bg-red-400 dark:hover:bg-red-600 hover:text-white border dark:border-neutral-600"
              >
                <TrashIcon />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
