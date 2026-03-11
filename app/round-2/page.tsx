import Round2Frontend from "../components/Round2Frontend";
import Link from "next/link";

export default function Round2Page() {
  return (
    <>
      <div style={{ background: "#070b14", padding: "10px 20px" }}>
        <Link
          href="/"
          style={{ color: "#7a8aaa", fontSize: "14px", textDecoration: "none" }}
        >
          ← Back to Home
        </Link>
      </div>
      <Round2Frontend />
    </>
  );
}
