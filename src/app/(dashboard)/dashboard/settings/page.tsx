import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllSettingsForAdmin } from "@/lib/data/settings";
import { SettingsForm } from "@/components/cms/settings-form";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const settings = getAllSettingsForAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pengaturan</h1>
        <p className="mt-1 text-sm text-gray-600">
          Kontak sales, jam operasional, dan link media sosial yang tampil di Footer dan CTA
        </p>
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
