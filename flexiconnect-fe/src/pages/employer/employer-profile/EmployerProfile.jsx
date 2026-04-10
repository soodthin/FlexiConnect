import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "@configs/APIs";
import CompanyInfo from "@employerProfile/CompanyInfo";
import CompanyIntro from "@employerProfile/CompanyIntro";
import { toast } from "sonner";
import {
  ArrowLeft,
  User,
  Building2,
  FileText,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  ProfileCard,
  ProfileCardHeader,
  ProfileCardContent,
  ProfileStat,
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
  { id: "company", label: "Thông tin công ty", icon: Building2 },
  { id: "intro", label: "Giới thiệu công ty", icon: FileText },
];

export default function EmployerProfilePage() {
  const [profile, setProfile] = useState(null);
  const [currentSection, setCurrentSection] = useState("profile");
  const [avatarTimestamp, setAvatarTimestamp] = useState(Date.now());
  const navigate = useNavigate();
  const sectionRefs = useRef({});

  const loadProfile = async () => {
    try {
      const res = await authApis().get(endpoints["employer-profile"]);
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await authApis().post(endpoints["employer-avatar"], formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      await loadProfile();
      setAvatarTimestamp(Date.now());
      toast.success("Ảnh đại diện đã được cập nhật!");
    } catch {
      toast.error("Lỗi khi cập nhật ảnh đại diện.");
    }
  };

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const offsets = SECTIONS.map(({ id }) => {
        const el = sectionRefs.current[id];
        if (!el) return { id, top: Infinity };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top - 120) };
      });
      offsets.sort((a, b) => a.top - b.top);
      setCurrentSection(offsets[0].id);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    sectionRefs.current[id]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-4 h-4" />
              Quay về trang chủ
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
                onClick={() => navigate("/")}
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
                      title={profile.companyName}
                      email={profile.email}
                      phone={profile.phoneNumber}
                      address={profile.address}
                      isVerified={profile.isVerified}
                      onAvatarChange={handleAvatarChange}
                      avatarTimestamp={avatarTimestamp}
                    />
                    <ProfileCardContent>
                      {/* Stats Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <ProfileStat
                          icon={Users}
                          label="Followers"
                          value={profile.follower || 0}
                        />
                        <ProfileStat
                          icon={Building2}
                          label="Trạng thái"
                          value={
                            <Badge variant={profile.isVerified ? "success" : "warning"}>
                              {profile.isVerified ? "Đã xác minh" : "Chờ xác minh"}
                            </Badge>
                          }
                        />
                      </div>

                      {/* Rejection reason if not verified */}
                      {!profile.isVerified && profile.reasonReject && (
                        <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700">
                          <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-1">
                            Lý do từ chối:
                          </p>
                          <p className="text-sm text-red-600 dark:text-red-400">
                            {profile.reasonReject}
                          </p>
                        </div>
                      )}
                    </ProfileCardContent>
                  </ProfileCard>
                </div>

                {/* Company Info Section */}
                <ProfileSection
                  id="company"
                  innerRef={(el) => (sectionRefs.current["company"] = el)}
                >
                  <ProfileSectionHeader>
                    <ProfileSectionTitle icon={Building2}>
                      Thông tin công ty
                    </ProfileSectionTitle>
                  </ProfileSectionHeader>
                  <ProfileSectionContent>
                    <CompanyInfo
                      profile={profile}
                      onUpdated={(newProfile) => setProfile(newProfile)}
                    />
                  </ProfileSectionContent>
                </ProfileSection>

                {/* Company Intro Section */}
                <ProfileSection
                  id="intro"
                  innerRef={(el) => (sectionRefs.current["intro"] = el)}
                >
                  <ProfileSectionHeader>
                    <ProfileSectionTitle icon={FileText}>
                      Giới thiệu công ty
                    </ProfileSectionTitle>
                  </ProfileSectionHeader>
                  <ProfileSectionContent>
                    <CompanyIntro profile={profile} />
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
                {[1, 2].map((i) => (
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
    </div>
  );
}
