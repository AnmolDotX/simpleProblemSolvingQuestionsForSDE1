import Round1DSA from "../components/Round1DSA";
import Link from "next/link";

export default function Round1Page() {
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
      <Round1DSA />
    </>
  );
}
