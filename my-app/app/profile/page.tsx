"use client";

import { ProfileUpdateForm, type UserProfile } from "@/components/ProfileUpdateForm";

export default function ProfilePage() {
  const handleSubmit = async (profile: UserProfile) => {
    // API entegrasyonu: await fetch("/api/profile", { method: "PUT", body: JSON.stringify(profile) })
    console.log("Profil güncellendi:", profile);
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
      <ProfileUpdateForm
        initialProfile={{
          fullName: "Ayşe Yılmaz",
          email: "ayse@email.com",
          username: "ayse_yilmaz",
          bio: "Frontend geliştirici. React ve Tailwind ile arayüz tasarlıyorum.",
          location: "İstanbul, Türkiye",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
