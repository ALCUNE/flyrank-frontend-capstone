"use client";

import { ProfileUpdateForm, type UserProfile } from "@/components/ProfileUpdateForm";

export default function ProfilePage() {
  const handleSubmit = async (profile: UserProfile) => {
    // API integration: await fetch("/api/profile", { method: "PUT", body: formData })
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Profile updated:", {
      fullName: profile.fullName,
      email: profile.email,
      hasPassword: Boolean(profile.password),
      avatar: profile.avatar?.name ?? null,
    });
  };

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 px-4 py-10 font-sans dark:bg-black">
      <ProfileUpdateForm
        initialProfile={{
          fullName: "Jane Doe",
          email: "jane@example.com",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
