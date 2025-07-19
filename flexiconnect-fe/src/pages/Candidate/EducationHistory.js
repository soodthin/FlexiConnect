import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/APIs";

export default function EducationHistory() {
  const [educations, setEducations] = useState([]);
  const [form, setForm] = useState({
    school: "",
    major: "",
    degree: "",
    startDate: "",
    endDate: "",
  });
  const [editingId, setEditingId] = useState(null);

  const loadData = async () => {
    try {
      const res = await authApis().get(endpoints["education"]);
      console.log("Education API data:", res.data);

      // Đảm bảo `res.data` là array
      if (Array.isArray(res.data)) {
        setEducations(res.data);
      } else if (Array.isArray(res.data.educations)) {
        setEducations(res.data.educations);
      } else {
        setEducations([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await authApis().put(endpoints["education-id"](editingId), form);
      } else {
        await authApis().post(endpoints["education"], form);
      }
      setForm({ school: "", major: "", degree: "", startDate: "", endDate: "" });
      setEditingId(null);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (edu) => {
    setForm({
      school: edu.school,
      major: edu.major,
      degree: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
    });
    setEditingId(edu.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xác nhận xoá?")) {
      await authApis().delete(endpoints["education-id"](id));
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
        <input name="school" value={form.school} onChange={(e) => setForm({ ...form, school: e.target.value })} placeholder="Trường học" className="border rounded px-3 py-2" />
        <input name="major" value={form.major} onChange={(e) => setForm({ ...form, major: e.target.value })} placeholder="Ngành học" className="border rounded px-3 py-2" />
        <input name="degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="Bằng cấp" className="border rounded px-3 py-2" />
        <input name="startDate" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="border rounded px-3 py-2" />
        <input name="endDate" type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="border rounded px-3 py-2" />
        <button type="submit" className="col-span-2 bg-black text-white rounded py-2">{editingId ? "Cập nhật" : "Thêm mới"}</button>
      </form>

      <div className="space-y-4">
        {Array.isArray(educations) && educations.map((edu) => (
          <div key={edu.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
            <div>
              <div className="font-semibold">{edu.school} ({edu.startDate} - {edu.endDate})</div>
              <p>Ngành: {edu.major} | Bằng: {edu.degree}</p>
            </div>
            <div className="space-x-2">
              <button onClick={() => handleEdit(edu)} className="text-blue-600 text-sm">Sửa</button>
              <button onClick={() => handleDelete(edu.id)} className="text-red-500 text-sm">Xoá</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
