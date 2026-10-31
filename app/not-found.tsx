import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";
export default function NotFound() {
  return (
    <div className="not-found">
      <Compass size={40} />
      <span className="eyebrow">페이지를 찾을 수 없어요</span>
      <h1>개요 화면으로 돌아가 볼까요?</h1>
      <p>요청한 페이지가 워크스페이스에 없습니다.</p>
      <Link href="/" className="back-link">
        개요로 돌아가기
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
