import { prisma } from "@/lib/prisma";
import PageShell from "@/components/layout/PageShell";
import FirmForm from "@/components/settings/FirmForm";
import DocManager from "@/components/settings/DocManager";

export default async function SettingsPage() {
  const settings = await prisma.firmSettings.upsert({
    where: { id: 1 },
    update: {},
    create: { id: 1, name: "My Fund", thesis: "", stageFocus: [], sectorFocus: [] },
  });

  return (
    <PageShell
      title="Settings"
      subtitle="Configure your fund context. This personalizes every intelligence brief."
    >
      <div className="max-w-2xl space-y-10">
        {/* Fund details */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Fund Details</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <FirmForm
              initial={{
                id: settings.id,
                name: settings.name,
                thesis: settings.thesis,
                stageFocus: settings.stageFocus,
                sectorFocus: settings.sectorFocus,
                createdAt: settings.createdAt.toISOString(),
                updatedAt: settings.updatedAt.toISOString(),
              }}
            />
          </div>
        </section>

        {/* Internal documents */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-1">Internal Documents</h2>
          <p className="text-sm text-gray-500 mb-4">
            Upload investment memos, thesis documents, or portfolio notes. Periscope uses these to personalize the Fund Fit section of each brief.
          </p>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <DocManager />
          </div>
        </section>
      </div>
    </PageShell>
  );
}
