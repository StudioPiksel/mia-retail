import { prisma } from "@/lib/prisma";
import SiteLayout from "@/components/layout/SiteLayout";
import RealizacijeClient from "./RealizacijeClient";

export const metadata = {
  title: "Realizacije | MIA Retail Solutions",
  description: "Naša rješenja u vodećim svjetskim trgovinama. 37+ realizacija u 15+ zemalja.",
};

export default async function RealizacijePage() {
  const items = await prisma.realizacija.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  });

  return (
    <SiteLayout currentPage="/realizacije">
      <RealizacijeClient items={items} />
    </SiteLayout>
  );
}
