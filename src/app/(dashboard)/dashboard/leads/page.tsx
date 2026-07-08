import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getAllLeads } from "@/lib/data/leads";
import { LeadsTable } from "@/components/cms/leads-table";

export default async function LeadsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const leads = getAllLeads();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leads</h1>
        <p className="mt-1 text-sm text-gray-600">
          Kontak yang ditangkap oleh CHIVA saat menawarkan bantuan ke tim sales
        </p>
      </div>

      <LeadsTable leads={leads} />
    </div>
  );
}
