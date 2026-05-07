import FlipkartPrep from "../components/FlipkartPrep";
import Link from "next/link";

export const metadata = {
  title: "Flipkart SDE 1 Frontend Interview Prep | Latest Questions 2026",
  description:
    "Comprehensive Flipkart SDE 1 frontend interview prep: JavaScript core, React hooks, Redux, system design, machine coding, and behavioral questions from the latest interview transcripts.",
};

export default function FlipkartPage() {
  return (
    <>
      <div style={{ background: "#0c0c0c", padding: "10px 20px", borderBottom: "1px solid #1e1e1e" }}>
        <Link
          href="/"
          style={{ color: "#666", fontSize: "13px", textDecoration: "none", fontFamily: "monospace" }}
        >
          ← back
        </Link>
      </div>
      <FlipkartPrep />
    </>
  );
}
