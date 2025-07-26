import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/APIs";
import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon, Pencil2Icon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";

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
          school, major, degree, startDate, endDate,
        });
      } else {
        await authApis().post(endpoints["education"], {
          school, major, degree, startDate, endDate,
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
    <div className="w-full bg-white dark:bg-[#232323] rounded-xl shadow p-6 text-[16px] leading-relaxed">
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button className="flex items-center gap-2 bg-neutral-900 text-white px-5 py-3 rounded-xl font-semibold shadow hover:bg-neutral-800 mb-4">
            <PlusCircledIcon className="w-5 h-5" /> Thêm học vấn
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 max-h-[95vh] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-8 shadow-xl border border-neutral-200 z-50 focus:outline-none">
            <Dialog.Title className="text-2xl font-bold mb-2">Học vấn</Dialog.Title>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Trường học" value={school} onChange={(e) => setSchool(e.target.value)} required className="w-full rounded-lg border px-4 py-2" />
              <input placeholder="Ngành học" value={major} onChange={(e) => setMajor(e.target.value)} className="w-full rounded-lg border px-4 py-2" />
              <input placeholder="Bằng cấp" value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full rounded-lg border px-4 py-2" />
              <div className="flex gap-3">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-1/2 rounded-lg border px-4 py-2" />
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-1/2 rounded-lg border px-4 py-2" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 bg-neutral-900 text-white py-2 rounded-lg font-semibold"> {editingEdu ? "Cập nhật" : "Thêm mới"} </button>
                {editingEdu && <button onClick={resetForm} type="button" className="flex-1 bg-neutral-100 text-neutral-900 py-2 rounded-lg font-semibold">Huỷ</button>}
              </div>
            </form>
            <Dialog.Close asChild>
              <button className="absolute right-4 top-4 p-2 rounded-full hover:bg-neutral-200"><Cross2Icon /></button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="space-y-5 w-full">
        {educations.length === 0 && (
          <div className="text-center text-neutral-400 rounded-xl py-10 bg-neutral-50 border">Chưa có thông tin học vấn.</div>
        )}
        {educations.map((edu) => (
          <div key={edu.id} className="bg-neutral-50 rounded-xl shadow-sm px-6 py-5 border hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <h4 className="text-lg font-semibold">{edu.school}</h4>
                <span className="text-sm">{edu.major} - {edu.degree}</span>
              </div>
              <div className="text-sm text-neutral-500 font-roboto">{edu.startDate?.slice(0, 10)} - {edu.endDate?.slice(0, 10)}</div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <button onClick={() => startEdit(edu)} className="p-2 rounded-lg bg-neutral-100 hover:bg-yellow-200 border"><Pencil2Icon /></button>
              <button onClick={() => deleteEducation(edu.id)} className="p-2 rounded-lg bg-neutral-100 hover:bg-red-400 hover:text-white border"><TrashIcon /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
