import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/APIs";

export default function CandidateSkillList() {
  const [skills, setSkills] = useState([]);
  const [name, setName] = useState("");
  const [level, setLevel] = useState("");
  const [editingSkill, setEditingSkill] = useState(null);

  const loadSkills = async () => {
    try {
      let res = await authApis().get(endpoints["candidate-skills"]);
      setSkills(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const addSkill = async () => {
    try {
      await authApis().post(endpoints["candidate-skills"], {
        skillName: name,
        level,
      });
      setName("");
      setLevel("");
      loadSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const updateSkill = async () => {
    try {
      await authApis().put(`${endpoints["candidate-skills"]}/${editingSkill.id}`, {
        skillName: name,
        level,
      });
      setName("");
      setLevel("");
      setEditingSkill(null);
      loadSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteSkill = async (id) => {
    try {
      await authApis().delete(`${endpoints["candidate-skills"]}/${id}`);
      loadSkills();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (skill) => {
    setName(skill.skillName || "");
    setLevel(skill.level);
    setEditingSkill(skill);
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Quản lý kỹ năng</h1>

      <div className="flex space-x-2">
        <input
          className="border p-2 flex-1"
          placeholder="Tên kỹ năng"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="border p-2 w-24"
          placeholder="Level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        />
        {editingSkill ? (
          <button className="bg-yellow-500 text-white px-4" onClick={updateSkill}>
            Cập nhật
          </button>
        ) : (
          <button className="bg-blue-500 text-white px-4" onClick={addSkill}>
            Thêm
          </button>
        )}
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">#</th>
            <th className="border p-2">Tên kỹ năng</th>
            <th className="border p-2">Cấp độ</th>
            <th className="border p-2">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {skills.map((skill, index) => (
            <tr key={skill.id} className="hover:bg-gray-50">
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{skill.skillName || "Không rõ"}</td>
              <td className="border p-2 text-center">{skill.level}</td>
              <td className="border p-2 flex space-x-2 justify-center">
                <button
                  className="bg-yellow-500 text-white px-2"
                  onClick={() => startEdit(skill)}
                >
                  Sửa
                </button>
                <button
                  className="bg-red-500 text-white px-2"
                  onClick={() => deleteSkill(skill.id)}
                >
                  Xoá
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
