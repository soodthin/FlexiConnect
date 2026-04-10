import { useEffect, useState, useRef } from "react";
import { cn } from "@/utils/cn";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import EducationHistory from "@candidateProfile/EducationHistory";
import Skill from "@candidateProfile/Skill";
import WorkExperience from "@candidateProfile/WorkExperience";
import { toast } from "sonner";
import {
  Wand2,
  Crown,
  Zap,
  ArrowLeft,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  User,
  Calendar,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Skeleton } from "@/components/ui/Skeleton";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogBody,
} from "@/components/ui/Dialog";
import {
  ProfileCard,
  ProfileCardHeader,
  ProfileCardContent,
} from "@/components/profile";
import {
  ProfileSection,
  ProfileSectionHeader,
  ProfileSectionTitle,
  ProfileSectionContent,
  ProfileNavItem,
} from "@/components/profile";

// Section navigation config
const SECTIONS = [
  { id: "profile", label: "Thông tin cá nhân", icon: User },
  { id: "education", label: "Học vấn", icon: GraduationCap },
  { id: "experience", label: "Kinh nghiệm", icon: Briefcase },
  { id: "skills", label: "Kỹ năng & Việc đã lưu", icon: Award },
];

// Format date helper
const formatDate = (dateStr) => {
  if (!dateStr) return "Hiện tại";
  const date = new Date(dateStr);
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
};

// Upgrade Dialog Component
const UpgradeDialog = ({ open, onOpenChange, onUpgrade }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <DialogTitle className="text-center text-2xl">
          Nâng cấp tài khoản AI
        </DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p className="text-center text-muted-foreground mb-6">
          Bạn cần nâng cấp tài khoản để sử dụng tính năng AI
        </p>

        <div className="space-y-4">
          {/* Basic Package */}
          <div className="rounded-xl p-4 border-2 border-info-200 dark:border-info-700 bg-info-50/50 dark:bg-info-900/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-info-700 dark:text-info-300">
                Basic
              </h4>
              <span className="text-lg font-bold text-info-600 dark:text-info-400">
                55.000₫
              </span>
            </div>
            <ul className="text-sm text-info-600 dark:text-info-300 space-y-1">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Đánh giá CV tự động bằng AI
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Gợi ý chỉnh sửa CV
              </li>
            </ul>
          </div>

          {/* Premium Package */}
          <div className="rounded-xl p-4 border-2 border-purple-500 bg-purple-50/50 dark:bg-purple-900/20 relative">
            <Badge
              variant="default"
              className="absolute -top-2 right-4 bg-purple-600"
            >
              Phổ biến
            </Badge>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-purple-700 dark:text-purple-300">
                Premium
              </h4>
              <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                115.000₫
              </span>
            </div>
            <ul className="text-sm text-purple-600 dark:text-purple-300 space-y-1">
              <li className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Tất cả tính năng Basic
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Mock interview với AI
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> Tạo Cover Letter bằng AI
              </li>
            </ul>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex-col sm:flex-row gap-2">
        <Button
          variant="secondary"
          className="w-full sm:w-auto"
          onClick={() => onOpenChange(false)}
        >
          Để sau
        </Button>
        <Button variant="ai" className="w-full sm:w-auto" onClick={onUpgrade}>
          <Zap className="w-4 h-4" />
          Nâng cấp ngay
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Edit Profile Dialog
const EditProfileDialog = ({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  onGetSuggestion,
  bioSuggestion,
  setBioSuggestion,
  isSuggesting,
  checkAIAccess,
  onAIFeatureClick,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>Cập nhật thông tin</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <DialogBody className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và tên</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm({ ...form, phoneNumber: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Chức danh</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Giới tính</Label>
              <Select
                id="gender"
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                placeholder="Chọn giới tính"
              >
                <option value="MALE">Nam</option>
                <option value="FEMALE">Nữ</option>
                <option value="OTHER">Khác</option>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Giới thiệu bản thân</Label>
            <Textarea
              id="bio"
              rows={4}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="Nhập vài ý chính..."
            />
            <Button
              type="button"
              variant={checkAIAccess() ? "ai" : "secondary"}
              className="w-full"
              onClick={() => onAIFeatureClick(onGetSuggestion)}
              disabled={isSuggesting}
            >
              {isSuggesting ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : checkAIAccess() ? (
                <Wand2 className="w-4 h-4" />
              ) : (
                <Crown className="w-4 h-4" />
              )}
              {isSuggesting
                ? "Đang xử lý..."
                : checkAIAccess()
                ? "Gợi ý từ AI"
                : "Nâng cấp để dùng AI"}
            </Button>

            {bioSuggestion && (
              <div className="mt-3 rounded-xl p-4 border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                <p className="text-sm font-medium mb-2 flex items-center gap-2 text-blue-700 dark:text-blue-300">
                  <Wand2 className="w-4 h-4" /> Gợi ý từ AI
                </p>
                <p className="text-sm italic whitespace-pre-wrap text-blue-600 dark:text-blue-400">
                  {bioSuggestion}
                </p>
                <div className="mt-3 flex gap-2">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      setForm({ ...form, bio: bioSuggestion });
                      setBioSuggestion("");
                    }}
                  >
                    Dùng gợi ý
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setBioSuggestion("")}
                  >
                    Bỏ qua
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Huỷ
          </Button>
          <Button type="submit">Lưu thay đổi</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
);

// Main Component
export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [currentSection, setCurrentSection] = useState("profile");
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    title: "",
    bio: "",
    gender: "",
  });

  const [bioSuggestion, setBioSuggestion] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  const sectionRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", localStorage.getItem("theme") === "dark");
  }, []);

  const loadProfile = async () => {
    try {
      const res = await authApis().get(endpoints["candidate-profile"]);
      setProfile(res.data);
      const pkg = res.data.userPackage;
      setIsVerified(pkg?.isActive === true);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Scroll tracking
  useEffect(() => {
    const onScroll = () => {
      const offs = SECTIONS.map(({ id }) => {
        const el = sectionRefs.current[id];
        return {
          id,
          top: el ? Math.abs(el.getBoundingClientRect().top - 120) : Infinity,
        };
      });
      offs.sort((a, b) => a.top - b.top);
      setCurrentSection(offs[0].id);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const checkAIAccess = () => isVerified;

  const handleAIFeatureClick = (callback) => {
    if (checkAIAccess()) {
      callback();
    } else {
      setIsUpgradeDialogOpen(true);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fd = new FormData();
      fd.append("avatar", file);
      await authApis().post(endpoints["candidate-avatar"], fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAvatarTimestamp(Date.now());
      toast.success("Ảnh đại diện đã được cập nhật!");
    } catch {
      toast.error("Lỗi khi cập nhật ảnh đại diện.");
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await authApis().put(endpoints["candidate-profile"], {
        ...form,
        bio: bioSuggestion || form.bio,
        avatar: profile.avatar,
      });
      toast.success("Đã cập nhật thành công!");
      loadProfile();
      setIsDialogOpen(false);
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  const handleOpenEdit = () => {
    if (!profile) return;
    setForm({
      fullName: profile.fullName || "",
      phoneNumber: profile.phoneNumber || "",
      address: profile.address || "",
      title: profile.title || "",
      bio: profile.bio || "",
      gender: profile.gender || "",
    });
    setBioSuggestion("");
    setIsDialogOpen(true);
  };

  const handleGetSuggestion = async () => {
    if (!form.bio) {
      toast.info("Vui lòng nhập vài ý chính để AI gợi ý.");
      return;
    }
    setIsSuggesting(true);
    try {
      const res = await authApis().post(endpoints["cv-suggestion"], {
        originalInput: form.bio,
      });
      if (res.data?.aiSuggestion) {
        setBioSuggestion(res.data.aiSuggestion);
        toast.success("AI đã tạo gợi ý!");
      }
    } catch {
      toast.error("AI gợi ý thất bại.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleUpgradeRedirect = () => {
    setIsUpgradeDialogOpen(false);
    navigate("/candidate-upgrade");
  };

  const genderLabel = {
    MALE: "Nam",
    FEMALE: "Nữ",
    OTHER: "Khác",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-card">
          <div className="p-4 border-b border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2"
              onClick={() => navigate("/candidate-dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về Dashboard
            </Button>
          </div>

          <ScrollArea className="flex-1 p-4">
            <nav className="space-y-2">
              {SECTIONS.map((sec) => (
                <ProfileNavItem
                  key={sec.id}
                  icon={sec.icon}
                  label={sec.label}
                  isActive={currentSection === sec.id}
                  onClick={() => scrollToSection(sec.id)}
                />
              ))}
            </nav>

            {/* Package info */}
            {profile?.userPackage && (
              <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-2">Gói hiện tại</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={profile.userPackage.isActive ? "success" : "error"}
                  >
                    {profile.userPackage.name}
                  </Badge>
                </div>
                {profile.userPackage.isActive && profile.userPackage.endDate && (
                  <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Hết hạn {formatDate(profile.userPackage.endDate)}
                  </p>
                )}
                {!profile.userPackage.isActive && (
                  <Button
                    variant="ai"
                    size="sm"
                    className="w-full mt-3"
                    onClick={() => setIsUpgradeDialogOpen(true)}
                  >
                    <Zap className="w-3 h-3" />
                    Nâng cấp
                  </Button>
                )}
              </div>
            )}
          </ScrollArea>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Mobile back button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/candidate-dashboard")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay về
              </Button>
            </div>

            {profile ? (
              <>
                {/* Profile Header Card */}
                <div ref={(el) => (sectionRefs.current["profile"] = el)}>
                  <ProfileCard>
                    <ProfileCardHeader
                      avatar={profile.avatar}
                      name={profile.fullName}
                      title={profile.title}
                      email={profile.email}
                      phone={profile.phoneNumber}
                      address={profile.address}
                      isPremium={checkAIAccess()}
                      onAvatarChange={handleAvatarChange}
                      onEdit={handleOpenEdit}
                      avatarTimestamp={avatarTimestamp}
                    />
                    <ProfileCardContent>
                      <Separator className="mb-4" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">
                            Giới tính:
                          </span>{" "}
                          <span className="font-medium">
                            {genderLabel[profile.gender] || "-"}
                          </span>
                        </div>
                        {profile.bio && (
                          <div className="sm:col-span-2">
                            <span className="text-muted-foreground">
                              Giới thiệu:
                            </span>{" "}
                            <span>{profile.bio}</span>
                          </div>
                        )}
                      </div>
                      {profile.resumeFile && (
                        <a
                          href={profile.resumeFile}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-muted text-sm font-medium hover:bg-accent transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          Xem CV hiện tại
                        </a>
                      )}
                    </ProfileCardContent>
                  </ProfileCard>
                </div>

                {/* Education Section */}
                <ProfileSection
                  id="education"
                  innerRef={(el) => (sectionRefs.current["education"] = el)}
                >
                  <ProfileSectionHeader>
                    <ProfileSectionTitle icon={GraduationCap}>
                      Học vấn
                    </ProfileSectionTitle>
                  </ProfileSectionHeader>
                  <ProfileSectionContent>
                    <EducationHistory />
                  </ProfileSectionContent>
                </ProfileSection>

                {/* Experience Section */}
                <ProfileSection
                  id="experience"
                  innerRef={(el) => (sectionRefs.current["experience"] = el)}
                >
                  <ProfileSectionHeader>
                    <ProfileSectionTitle icon={Briefcase}>
                      Kinh nghiệm làm việc
                    </ProfileSectionTitle>
                  </ProfileSectionHeader>
                  <ProfileSectionContent>
                    <WorkExperience
                      userPackage={profile.userPackage}
                      onUpgradeClick={() => setIsUpgradeDialogOpen(true)}
                    />
                  </ProfileSectionContent>
                </ProfileSection>

                {/* Skills Section */}
                <ProfileSection
                  id="skills"
                  innerRef={(el) => (sectionRefs.current["skills"] = el)}
                >
                  <ProfileSectionHeader>
                    <ProfileSectionTitle icon={Award}>
                      Kỹ năng & Việc đã lưu
                    </ProfileSectionTitle>
                  </ProfileSectionHeader>
                  <ProfileSectionContent>
                    <Skill
                      onUpgradeClick={() => setIsUpgradeDialogOpen(true)}
                    />
                  </ProfileSectionContent>
                </ProfileSection>
              </>
            ) : (
              // Loading skeleton
              <div className="space-y-6">
                <div className="rounded-2xl bg-card border border-border p-6">
                  <div className="flex items-start gap-6">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <div className="flex-1 space-y-3">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-32" />
                      <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  </div>
                </div>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-xl bg-card border border-border p-6"
                  >
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="space-y-3">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <EditProfileDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        form={form}
        setForm={setForm}
        onSubmit={handleUpdateProfile}
        onGetSuggestion={handleGetSuggestion}
        bioSuggestion={bioSuggestion}
        setBioSuggestion={setBioSuggestion}
        isSuggesting={isSuggesting}
        checkAIAccess={checkAIAccess}
        onAIFeatureClick={handleAIFeatureClick}
      />

      <UpgradeDialog
        open={isUpgradeDialogOpen}
        onOpenChange={setIsUpgradeDialogOpen}
        onUpgrade={handleUpgradeRedirect}
      />
    </div>
  );
}
