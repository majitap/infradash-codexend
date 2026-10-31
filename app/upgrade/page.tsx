import type { Metadata } from "next";
import { UpgradeView } from "@/components/upgrade-view";
export const metadata: Metadata = { title: "업그레이드" };
export default function UpgradePage() {
  return <UpgradeView />;
}
