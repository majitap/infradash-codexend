import type { Metadata } from "next";
import { UpgradeView } from "@/components/upgrade-view";
export const metadata: Metadata = { title: "Upgrade" };
export default function UpgradePage() {
  return <UpgradeView />;
}
