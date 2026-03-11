"use client";
import { useState } from "react";
import { useProgress } from "../hooks/useProgress";

type Question = {
  q: string;
  a: string;
  code: string | null;
  tag: string;
};

type SectionData = {
  title: string;
  tag: string;
  questions: Question[];
};

type TabData = {
  label: string;
  icon: string;
  color: string;
  colorDim: string;
  sections: SectionData[];
};

const ALL_DATA: Record<string, TabData> = {
  arrays_strings: {
    label: "Arrays & Strings",
    icon: "🧮",
    color: "#FF5733",
    colorDim: "#3a0b08",
    sections: [
      {
        title: "Two Pointers & Arrays",
        tag: "CORE",
        questions: [
          {
            q: "Two Sum",
            a: `Given an array of integers, return indices of the two numbers such that they add up to a specific target.\n\nApproach: Use a hash map. As you iterate, check if (target - current) exists in the map. If yes, return current index and mapped index. O(n) time, O(n) space.`,
            code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
  return [];
}`,
            tag: "must-know",
          },
          {
            q: "Valid Palindrome",
            a: `Check if a string reads the same forward and backward, ignoring non-alphanumeric chars.\n\nApproach: Two pointers -> left at start, right at end. Move pointers towards center, skipping non-alphanumeric chars. If chars mis-match, return false. O(n) time, O(1) space.`,
            code: `function isPalindrome(s) {
  s = s.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  let l = 0, r = s.length - 1;
  while (l < r) {
    if (s[l] !== s[r]) return false;
    l++; r--;
  }
  return true;
}`,
            tag: "must-know",
          },
          {
            q: "Container With Most Water",
            a: `Given an integer array heights representing lines, find two lines that together with the x-axis form a container, such that the container contains the most water.\n\nApproach: Two pointers (left and right). Area = width * min(height[left], height[right]). Move the pointer pointing to the shorter line inward.`,
            code: `function maxArea(height) {
  let left = 0, right = height.length - 1, max = 0;
  while (left < right) {
    const w = right - left;
    const h = Math.min(height[left], height[right]);
    max = Math.max(max, w * h);
    if (height[left] < height[right]) left++;
    else right--;
  }
  return max;
}`,
            tag: "coding",
          },
        ],
      },
      {
        title: "Sliding Window",
        tag: "ADVANCED",
        questions: [
          {
            q: "Longest Substring Without Repeating Characters",
            a: `Find the length of the longest substring without repeating characters.\n\nApproach: Sliding window. Use a Set or Map to track characters in the current window. Expand right. If a duplicate is found, shrink left until duplicate is removed. O(n) time.`,
            code: `function lengthOfLongestSubstring(s) {
  let set = new Set(), max = 0, left = 0;
  for (let right = 0; right < s.length; right++) {
    while (set.has(s[right])) {
      set.delete(s[left]);
      left++;
    }
    set.add(s[right]);
    max = Math.max(max, right - left + 1);
  }
  return max;
}`,
            tag: "must-know",
          },
        ],
      },
    ],
  },
  frontend_dsa: {
    label: "Frontend Specific Data Structures",
    icon: "DOM",
    color: "#61DAFB",
    colorDim: "#0d2b30",
    sections: [
      {
        title: "DOM & Trees",
        tag: "TREES",
        questions: [
          {
            q: "Traverse DOM elements (BFS / DFS)",
            a: `Frontend relies heavily on tree structures (the DOM).\n\nDFS approach: Recursion or Stack. Explores depth first.\nBFS approach: Queue. Explores level by level.`,
            code: `// DFS Recursive
function traverseDFS(node) {
  console.log(node.tagName); // visit
  for (let child of node.children) traverseDFS(child);
}

// BFS with Queue
function traverseBFS(root) {
  const queue = [root];
  while (queue.length) {
    const node = queue.shift();
    console.log(node.tagName); // visit
    queue.push(...node.children);
  }
}`,
            tag: "core",
          },
          {
            q: "Find elements by tag name or class (without DOM API)",
            a: `Implement document.getElementsByClassName.\nApproach: Traverse the DOM tree (DFS/BFS), checking each node's criteria (e.g., node.classList.contains), pushing matches to an array.`,
            code: `function getElementsByClassName(root, className) {
  const result = [];
  function traverse(node) {
    if (node.classList && node.classList.contains(className)) {
      result.push(node);
    }
    for (let child of node.children) traverse(child);
  }
  traverse(root);
  return result;
}`,
            tag: "coding",
          },
        ],
      },
      {
        title: "Object & Array Transformation",
        tag: "JSON",
        questions: [
          {
            q: "Flatten heavily nested array",
            a: `Array.prototype.flat() implementation. Recursively extract items if they are arrays, otherwise push to result.`,
            code: `function flattenArray(arr, depth = 1) {
  let result = [];
  for (let item of arr) {
    if (Array.isArray(item) && depth > 0) {
      result.push(...flattenArray(item, depth - 1));
    } else {
      result.push(item);
    }
  }
  return result;
}`,
            tag: "must-know",
          },
          {
            q: "Flatten nested object",
            a: `Very common UI question. Turn { a: { b: { c: 1 } } } into { "a.b.c": 1 }.\nUse recursion, maintaining the current string path prefix.`,
            code: `function flattenObject(obj, prefix = "") {
  let result = {};
  for (let key in obj) {
    const val = obj[key];
    const newKey = prefix ? prefix + "." + key : key;
    if (typeof val === "object" && val !== null && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val, newKey));
    } else {
      result[newKey] = val;
    }
  }
  return result;
}`,
            tag: "coding",
          },
        ],
      },
    ],
  },
};

const TAG_STYLES: Record<string, { bg: string; color: string; label: string }> =
  {
    "must-know": { bg: "#3a0808", color: "#FF4444", label: "MUST KNOW" },
    tricky: { bg: "#2e2200", color: "#FFB800", label: "TRICKY" },
    coding: { bg: "#0a1a2e", color: "#00B4FF", label: "CODING" },
    core: { bg: "#102010", color: "#44DD88", label: "CORE" },
    advanced: { bg: "#1a0a2e", color: "#B44FFF", label: "ADVANCED" },
    design: { bg: "#1e0a33", color: "#FF9500", label: "DESIGN" },
    architecture: { bg: "#1a1015", color: "#FF6B6B", label: "ARCH" },
  };

function Tag({ type }: { type: string }) {
  const s = TAG_STYLES[type] || TAG_STYLES["core"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 9,
        fontWeight: 700,
        padding: "2px 6px",
        borderRadius: 3,
        letterSpacing: "0.08em",
        fontFamily: "monospace",
        border: `1px solid ${s.color}30`,
      }}
    >
      {s.label}
    </span>
  );
}

type QCardProps = Question & {
  isCompleted: boolean;
  onToggle: () => void;
};

function QCard({ q, a, code, tag, isCompleted, onToggle }: QCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: open ? "#0e1525" : isCompleted ? "#081b10" : "#0b1020",
        border: `1px solid ${open ? "#2a3a5a" : isCompleted ? "#1a3b20" : "#151d30"}`,
        borderRadius: 8,
        marginBottom: 6,
        overflow: "hidden",
        transition: "all 0.15s ease",
        opacity: isCompleted && !open ? 0.7 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          padding: "10px 14px",
          gap: 10,
        }}
        onClick={() => setOpen(!open)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          title={isCompleted ? "Mark as uncompleted" : "Mark as completed"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 24,
            height: 24,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
            color: isCompleted ? "#44DD88" : "#3a4a6a",
          }}
        >
          {isCompleted ? "✅" : "○"}
        </button>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "flex-start",
            gap: 8,
            cursor: "pointer",
          }}
        >
          <span
            style={{
              color: "#444d6a",
              fontSize: 11,
              marginTop: 2,
              minWidth: 14,
              fontFamily: "monospace",
            }}
          >
            {open ? "▼" : "▶"}
          </span>
          <span
            style={{
              flex: 1,
              color: isCompleted ? "#80c095" : "#c8d4f0",
              textDecoration: isCompleted && !open ? "line-through" : "none",
              fontSize: 13,
              fontWeight: 500,
              lineHeight: 1.4,
              textAlign: "left",
            }}
          >
            {q}
          </span>
        </div>
        <Tag type={tag} />
      </div>
      {open && (
        <div style={{ padding: "0 14px 14px 44px" }}>
          <div
            style={{
              color: "#8fa0c0",
              fontSize: 12,
              lineHeight: 1.7,
              whiteSpace: "pre-line",
              marginBottom: code ? 10 : 0,
            }}
          >
            {a}
          </div>
          {code && (
            <pre
              style={{
                background: "#060a14",
                border: "1px solid #1a2540",
                borderRadius: 6,
                padding: "10px 12px",
                fontSize: 11,
                color: "#7dd3fc",
                overflow: "auto",
                fontFamily: "Consolas, monospace",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              {code}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  section,
  completedSet,
  onToggle,
}: {
  section: SectionData;
  completedSet: Set<string>;
  onToggle: (id: string) => void;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          paddingBottom: 6,
          borderBottom: "1px solid #151d30",
        }}
      >
        <span
          style={{ color: "#3a4a6a", fontSize: 10, fontFamily: "monospace" }}
        >
          ##
        </span>
        <span
          style={{
            color: "#7a8aaa",
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {section.title}
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 9,
            color: "#3a4a6a",
            background: "#0d1525",
            border: "1px solid #1a2540",
            padding: "1px 6px",
            borderRadius: 3,
            fontFamily: "monospace",
          }}
        >
          {section.tag}
        </span>
      </div>
      {section.questions.map((q, i) => (
        <QCard
          key={i}
          {...q}
          isCompleted={completedSet.has(q.q)}
          onToggle={() => onToggle(q.q)}
        />
      ))}
    </div>
  );
}

export default function Round1DSA() {
  const tabs = Object.keys(ALL_DATA);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const tab = ALL_DATA[activeTab];

  const { completed, toggleProgress, isLoaded } = useProgress(
    "sde1-round1-progress",
  );

  const totalQ = Object.values(ALL_DATA).reduce(
    (acc, t) =>
      acc + t.sections.reduce((s, sec) => s + sec.questions.length, 0),
    0,
  );

  const completedCount = completed.size;

  if (!isLoaded)
    return <div style={{ background: "#070b14", minHeight: "100vh" }} />;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#070b14",
        color: "#e0e8ff",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
      }}
    >
      {/* Header */}
      <div
        style={{
          borderBottom: "1px solid #111a2e",
          padding: "16px 20px 12px",
          background: "#070b14",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 920, margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 10,
              marginBottom: 3,
            }}
          >
            <span
              style={{
                fontFamily: "Georgia, serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#e0e8ff",
              }}
            >
              Round 1: Problem Solving (DSA)
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#3a4a6a",
                fontFamily: "monospace",
              }}
            >
              Arrays · Strings · Sliding Window · Built for Frontend
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                color: "#3a4a6a",
                fontFamily: "monospace",
              }}
            >
              {completedCount} / {totalQ} completed
            </span>
          </div>
          {/* Tabs */}
          <div
            style={{ display: "flex", gap: 2, flexWrap: "wrap", marginTop: 10 }}
          >
            {tabs.map((key) => {
              const t = ALL_DATA[key];
              const isActive = key === activeTab;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: "5px 12px",
                    background: isActive ? t.colorDim : "transparent",
                    color: isActive ? t.color : "#4a5a7a",
                    border: `1px solid ${isActive ? t.color + "50" : "#151d30"}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: isActive ? 700 : 400,
                    fontFamily: "monospace",
                    transition: "all 0.15s",
                    letterSpacing: "0.03em",
                  }}
                >
                  <span style={{ marginRight: 5 }}>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 920, margin: "0 auto", padding: "20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 16,
            padding: "8px 12px",
            background: tab.colorDim,
            border: `1px solid ${tab.color}40`,
            borderRadius: 6,
          }}
        >
          <span style={{ color: tab.color, fontSize: 16 }}>{tab.icon}</span>
          <span style={{ color: tab.color, fontWeight: 700, fontSize: 14 }}>
            {tab.label}
          </span>
          <span style={{ color: "#4a5a7a", fontSize: 11, marginLeft: 6 }}>
            — {tab.sections.reduce((a, s) => a + s.questions.length, 0)}{" "}
            questions · click to expand
          </span>
        </div>

        {tab.sections.map((sec, i) => (
          <Section
            key={i}
            section={sec}
            completedSet={completed}
            onToggle={toggleProgress}
          />
        ))}
      </div>

      {/* Footer */}
      <div
        style={{
          borderTop: "1px solid #111a2e",
          padding: "10px 20px",
          textAlign: "center",
          color: "#2a3a5a",
          fontSize: 11,
          fontFamily: "monospace",
        }}
      >
        All the best for your SDE 1 Frontend Interviews! 🎯 — Explain your
        thought process aloud, not just the answer
      </div>
    </div>
  );
}
