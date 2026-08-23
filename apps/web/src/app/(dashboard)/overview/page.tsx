import { OverviewPage } from "@/features/overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard Overview",
};

export default function Page() {
  return <OverviewPage />;
}
