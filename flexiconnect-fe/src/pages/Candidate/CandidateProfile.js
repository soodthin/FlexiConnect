import { useEffect, useState } from "react";
import { authApis, endpoints } from "../../configs/APIs";
import classNames from "classnames";
import EducationHistory from "./EducationHistory";
import Skill from "./Skill";
import { useNavigate } from "react-router-dom";


export default function CandidateProfilePage() {
  const [profile, setProfile] = useState({});
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();


  useEffect(() => {
    authApis()
      .get(endpoints["profile"])
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    authApis()
      .put(endpoints["update-profile"], {
        title: profile.title,
        bio: profile.bio,
        resumeFile: profile.resumeFile,
      })
      .then(() => alert("Cập nhật thành công"))
      .catch((err) => console.error(err));
  };

  return (

    <div className="max-w-5xl mx-auto p-8">
       <button
        onClick={() => navigate("/")}
        className="mb-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
      >
        ← Quay về trang chủ
      </button>
      <h1 className="text-3xl font-bold mb-6">Hồ Sơ Ứng Viên</h1>

     

      <div className="flex space-x-4 border-b mb-6">
        {[
          { id: "profile", label: "Thông Tin Hồ Sơ" },
          { id: "education", label: "Học Vấn" },
          { id: "experience", label: "Kinh Nghiệm" },
          { id: "skills", label: "Kỹ Năng" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={classNames(
              "px-4 py-2 text-sm font-medium border-b-2 transition",
              activeTab === tab.id
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-black"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-6">
            <img
              src={profile.avatarUrl}
              alt="avatar"
              className="w-24 h-24 rounded-full object-cover border"
            />
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">{profile.fullName}</h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-gray-600">{profile.phoneNumber}</p>
              <p className="text-gray-600">{profile.address}</p>
            </div>
          </div>

          <div>
            <label className="block font-medium">Vị trí mong muốn</label>
            <input
              type="text"
              name="title"
              value={profile.title || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium">Giới thiệu bản thân (Bio)</label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 h-24"
            />
          </div>

          <div>
            <label className="block font-medium">Gợi ý từ AI (Read-only)</label>
            <textarea
              value={profile.bioAiSuggestion || ""}
              readOnly
              className="w-full border rounded px-3 py-2 h-24 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium">Link file CV (Cloudinary)</label>
            <input
              type="text"
              name="resumeFile"
              value={profile.resumeFile || ""}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
            />
            <a
              href={profile.resumeFile}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm"
            >
              Xem CV hiện tại
            </a>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
          >
            Lưu Thay Đổi
          </button>
        </form>
      )}

      {activeTab === "education" && <EducationHistory />}

      {activeTab === "experience" && (
        <div className="text-gray-500 p-6 rounded-lg border bg-gray-50">
          🔨 TODO: WorkExperienceList Component here
        </div>
      )}

      {activeTab === "skills" && <Skill />}
    </div>
  );
}
