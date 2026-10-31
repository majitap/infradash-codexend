import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
export default function NotFound() {
  return (
    <div className="not-found">
      <Compass size={40} />
      <span className="eyebrow">A SMALL DETOUR</span>
      <h1>Let’s get you back on track.</h1>
      <p>This page isn’t in your workspace.</p>
      <Link href="/" className="back-link">
        Back to overview
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
