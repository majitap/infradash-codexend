import type { Metadata } from "next";
import { RunnersView } from "@/components/runners-view";
export const metadata: Metadata = { title: "Runners" };
export default function RunnersPage() {
  return <RunnersView />;
}
