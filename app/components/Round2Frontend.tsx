"use client";
import { useState } from "react";

type Question = {
  q: string;
  a: string;
  code: string | null;
  tag: string;
};

type QCardProps = Question & {
  isCompleted: boolean;
  onToggle: () => void;
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
  javascript: {
    label: "JavaScript Deep Dive",
    icon: "JS",
    color: "#F7DF1E",
    colorDim: "#3a3510",
    sections: [
      {
        title: "Execution Context & Scope",
        tag: "CONCEPTS",
        questions: [
          {
            q: "What is the Execution Context and what are its phases?",
            a: `Every time JS runs code, it creates an Execution Context with 2 phases:\n• Creation Phase: Sets up 'this', outer env reference, hoists vars (undefined) & fn declarations (full)\n• Execution Phase: Runs code line by line\n\nTypes: Global EC (one), Function EC (per call), Eval EC.`,
            code: null,
            tag: "core",
          },
          {
            q: "Explain the Scope Chain and Lexical Scope",
            a: `Lexical scope = scope determined by WHERE code is WRITTEN, not where it's called.\nScope chain = current scope → outer scope → ... → global. JS walks up this chain to resolve vars.`,
            code: `function outer() {
  let x = 10;
  function inner() {
    console.log(x); // 10 — found via scope chain
  }
  inner();
}`,
            tag: "core",
          },
          {
            q: "What is Hoisting? How does it differ for var, let, const and functions?",
            a: `Hoisting = declarations moved to top of their scope during Creation Phase.\n• var: hoisted + initialized as undefined → accessible before declaration\n• let/const: hoisted but NOT initialized → TDZ (Temporal Dead Zone) → ReferenceError if accessed early\n• Function declarations: fully hoisted (name + body)\n• Function expressions: only the var name is hoisted`,
            code: `console.log(a); // undefined (var hoisted)
console.log(b); // ReferenceError (TDZ)
var a = 1;
let b = 2;`,
            tag: "tricky",
          },
          {
            q: "What is a Closure? Give a real-world example.",
            a: `A closure is a function that REMEMBERS its lexical scope even when executed outside that scope.\nReal use: data privacy, factory functions, memoization, event handlers with state.`,
            code: `function makeCounter() {
  let count = 0; // private variable
  return {
    increment: () => ++count,
    getCount: () => count
  };
}
const c = makeCounter();
c.increment(); c.increment();
console.log(c.getCount()); // 2`,
            tag: "must-know",
          },
          {
            q: "Classic closure trap: What logs in a loop?",
            a: `var uses function scope — all iterations share the SAME i. By the time setTimeout runs, loop is done.\nFix 1: Use let (block scope, new binding per iteration)\nFix 2: IIFE to capture value\nFix 3: bind() or extra argument`,
            code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 3 3 3 ❌
}
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0); // 0 1 2 ✅
}`,
            tag: "tricky",
          },
        ],
      },
      {
        title: "this, Prototypes & OOP",
        tag: "CONCEPTS",
        questions: [
          {
            q: "How does 'this' work in JavaScript?",
            a: `'this' depends on HOW a function is called, not where it's defined:\n• Global: window (non-strict) / undefined (strict)\n• Method call obj.fn() → this = obj\n• new Fn() → this = new object\n• call/apply/bind → explicitly set\n• Arrow function → inherits 'this' from enclosing lexical scope (NO own 'this')`,
            code: `const obj = {
  name: "Slice",
  greet() { console.log(this.name); },     // "Slice"
  greetArrow: () => console.log(this.name) // undefined
};`,
            tag: "must-know",
          },
          {
            q: "Explain Prototypal Inheritance",
            a: `Every JS object has a [[Prototype]] chain. When you access a property, JS walks up the chain.\nObject.create(proto) creates an object with proto as prototype.\nES6 classes are syntactic sugar over prototypal inheritance.`,
            code: `function Animal(name) { this.name = name; }
Animal.prototype.speak = function() {
  return \`\${this.name} makes a noise\`;
};
const dog = new Animal("Dog");
dog.speak(); // works via prototype chain`,
            tag: "core",
          },
          {
            q: "Difference between call(), apply(), and bind()?",
            a: `All 3 set 'this' explicitly:\n• call(ctx, arg1, arg2) — invokes immediately, args as comma list\n• apply(ctx, [args]) — invokes immediately, args as array\n• bind(ctx, arg1) — returns NEW function with 'this' bound, doesn't invoke`,
            code: `function greet(greeting) {
  return \`\${greeting}, \${this.name}\`;
}
const user = { name: "Raj" };
greet.call(user, "Hi");      // "Hi, Raj"
greet.apply(user, ["Hello"]); // "Hello, Raj"
const bound = greet.bind(user);
bound("Hey");                 // "Hey, Raj"`,
            tag: "must-know",
          },
        ],
      },
      {
        title: "Async JavaScript",
        tag: "ASYNC",
        questions: [
          {
            q: "Explain the Event Loop in detail",
            a: `JS is single-threaded. Event Loop manages async via:\n1. Call Stack — currently executing code\n2. Web APIs — setTimeout, fetch, DOM events (browser handles these)\n3. Macro Task Queue — setTimeout, setInterval, I/O callbacks\n4. Micro Task Queue — Promise.then, queueMicrotask, MutationObserver\n\nOrder: Call stack empties → drain ALL microtasks → pick ONE macrotask → repeat`,
            code: `console.log("1");
setTimeout(() => console.log("2"), 0);
Promise.resolve().then(() => console.log("3"));
console.log("4");
// Output: 1, 4, 3, 2
// Reason: sync → microtask (Promise) → macrotask (setTimeout)`,
            tag: "must-know",
          },
          {
            q: "What is a Promise? States and chaining?",
            a: `Promise = object representing eventual completion/failure of async op.\n3 states: pending → fulfilled | rejected (irreversible)\n\n.then(onFulfill, onReject) — chains\n.catch(fn) — error handling\n.finally(fn) — always runs\n\nPromise.all([]) — all resolve or first rejection\nPromise.allSettled([]) — waits for all, gives all results\nPromise.race([]) — first to settle wins\nPromise.any([]) — first to RESOLVE wins`,
            code: `const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve("done"), 1000);
});
p.then(val => console.log(val))  // "done"
 .catch(err => console.error(err));`,
            tag: "must-know",
          },
          {
            q: "Implement Promise.all from scratch",
            a: `Classic interview question — tests understanding of Promise internals and counting pattern.`,
            code: `function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(val => {
        results[i] = val;
        if (++completed === promises.length) resolve(results);
      }).catch(reject);
    });
  });
}`,
            tag: "coding",
          },
          {
            q: "async/await — what happens under the hood?",
            a: `async/await is syntactic sugar over Promises.\nasync fn always returns a Promise.\nawait pauses execution of THAT function (not the whole thread) until promise settles.\nError handling: try/catch or .catch() on the async call.`,
            code: `async function fetchUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error("Not found");
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}`,
            tag: "must-know",
          },
        ],
      },
      {
        title: "Polyfills (Coding Questions)",
        tag: "CODING",
        questions: [
          {
            q: "Implement debounce from scratch",
            a: "Debounce: delays function execution until N ms AFTER last call. Use case: search input, resize.",
            code: `function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}`,
            tag: "coding",
          },
          {
            q: "Implement throttle from scratch",
            a: "Throttle: ensures function runs at MOST once per N ms. Use case: scroll, mousemove.",
            code: `function throttle(fn, limit) {
  let lastRun = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastRun >= limit) {
      lastRun = now;
      return fn.apply(this, args);
    }
  };
}`,
            tag: "coding",
          },
          {
            q: "Implement Array.prototype.map polyfill",
            a: "Tests understanding of how native array methods work under the hood.",
            code: `Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) result.push(callback(this[i], i, this));
  }
  return result;
};`,
            tag: "coding",
          },
          {
            q: "Deep clone an object (without structuredClone)",
            a: "Recursive solution, handles nested objects and arrays. Mention structuredClone as modern native solution.",
            code: `function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}`,
            tag: "coding",
          },
          {
            q: "Implement curry function",
            a: "Currying transforms fn(a,b,c) into fn(a)(b)(c). Key insight: count args using fn.length.",
            code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function (...more) {
      return curried.apply(this, args.concat(more));
    };
  };
}`,
            tag: "coding",
          },
        ],
      },
      {
        title: "Output Prediction (Tricky Qs)",
        tag: "TRICKY",
        questions: [
          {
            q: "What is the output? (typeof + undefined behavior)",
            a: "typeof null === 'object' is a famous JS bug (legacy). typeof undefined === 'undefined'. typeof undeclaredVar does NOT throw.",
            code: `console.log(typeof null);        // "object" ⚠️ JS bug
console.log(typeof undefined);   // "undefined"
console.log(typeof function(){}); // "function"
console.log(typeof []);          // "object"
console.log(null == undefined);  // true
console.log(null === undefined); // false`,
            tag: "tricky",
          },
          {
            q: "What does this print? (== coercion)",
            a: "== does type coercion. Always prefer ===. NaN is the only value not equal to itself.",
            code: `console.log(0 == false);   // true  (coercion)
console.log(0 === false);  // false (strict)
console.log("" == false);  // true
console.log(NaN == NaN);   // false — NaN !== itself
console.log([] == false);  // true  (array → "" → 0)`,
            tag: "tricky",
          },
        ],
      },
    ],
  },
  react: {
    label: "React In-Depth",
    icon: "⚛",
    color: "#61DAFB",
    colorDim: "#0d2b30",
    sections: [
      {
        title: "Core Concepts & Internals",
        tag: "CORE",
        questions: [
          {
            q: "How does React's Virtual DOM and Reconciliation work?",
            a: `Virtual DOM = lightweight JS object tree mirroring real DOM.\nOn state/prop change:\n1. New vDOM tree created\n2. Diffing algorithm compares old vs new (O(n) heuristics)\n3. React generates minimal set of real DOM changes (patch)\n4. Commit phase applies changes\n\nHeuristics: different type → tear down & rebuild; same type → update attrs; lists → use keys`,
            code: null,
            tag: "core",
          },
          {
            q: "What are React keys and why are they critical for lists?",
            a: `Keys help React identify which items changed, added or removed in lists.\nWithout keys: React re-renders entire list on any change.\nWith keys: React matches old/new by key → only changes relevant nodes.\n\n⚠️ Don't use array index as key if list can reorder/delete — causes subtle bugs`,
            code: `// Bad — index as key
items.map((item, i) => <Item key={i} {...item} />)

// Good — stable unique id
items.map(item => <Item key={item.id} {...item} />)`,
            tag: "must-know",
          },
          {
            q: "Explain React Fiber",
            a: `Fiber = React 16+ reconciliation engine rewrite.\nProblem before Fiber: reconciliation was synchronous — large trees froze the browser.\nFiber solution:\n• Breaks rendering into units of work (fibers)\n• Pauses/resumes work between frames\n• Prioritizes urgent updates (user input) over low priority (data fetch)\n• Enables Concurrent Mode, Suspense, Error Boundaries`,
            code: null,
            tag: "advanced",
          },
          {
            q: "What triggers a re-render in React?",
            a: `A component re-renders when:\n1. Its own state changes (useState setter called)\n2. Its parent re-renders (unless memoized)\n3. Context it consumes changes\n4. Props change\n\n⚠️ Common mistake: object/array created inline as prop always triggers re-render`,
            code: `// This re-renders Child every time Parent renders ❌
<Child style={{ color: "red" }} />

// Fix: memoize the object ✅
const style = useMemo(() => ({ color: "red" }), []);
<Child style={style} />`,
            tag: "must-know",
          },
        ],
      },
      {
        title: "Hooks Deep Dive",
        tag: "HOOKS",
        questions: [
          {
            q: "Explain useEffect — dependency array behavior",
            a: `useEffect(fn, deps):\n• No deps array → runs after EVERY render\n• [] empty array → runs once on mount, cleanup on unmount\n• [a, b] → runs when a or b changes\n\nCleanup: return fn from effect → runs before next effect and on unmount\nCommon uses: subscriptions, timers, fetch, DOM manipulation`,
            code: `useEffect(() => {
  const id = setInterval(() => setCount(c => c + 1), 1000);
  return () => clearInterval(id); // cleanup ← critical
}, []); // only on mount`,
            tag: "must-know",
          },
          {
            q: "useMemo vs useCallback — when to use?",
            a: `useMemo(fn, deps) → memoizes the RETURN VALUE (for expensive computations)\nuseCallback(fn, deps) → memoizes the FUNCTION REFERENCE (to prevent child re-renders)\n\nDon't overuse — memoization has its own cost. Use only when:\n• Computation is provably expensive\n• Passing callback to memoized child component\n• Deps won't change often`,
            code: `// useMemo: don't recompute if data unchanged
const sorted = useMemo(() =>
  data.sort((a,b) => b.score - a.score), [data]);

// useCallback: stable ref for child prop
const handleClick = useCallback((id) => {
  dispatch({ type: "SELECT", id });
}, [dispatch]);`,
            tag: "must-know",
          },
          {
            q: "useRef — what are its two main use cases?",
            a: `1. DOM reference: access DOM element directly (focus, measurements, media control)\n2. Mutable value that persists across renders WITHOUT triggering re-render\n\nKey difference from useState: changing ref.current does NOT cause re-render`,
            code: `// Use case 1: DOM access
const inputRef = useRef(null);
<input ref={inputRef} />
inputRef.current.focus(); // imperative

// Use case 2: store prev value or timer
const timerRef = useRef(null);
timerRef.current = setTimeout(fn, 1000);
// Won't re-render when timerRef changes`,
            tag: "must-know",
          },
          {
            q: "useReducer vs useState — when to prefer useReducer?",
            a: `Prefer useReducer when:\n• State has multiple sub-values that change together\n• Next state depends on previous in complex ways\n• State transitions follow clear action types (like Redux)\n• You want to pass dispatch down instead of many callbacks`,
            code: `function reducer(state, action) {
  switch (action.type) {
    case "INCREMENT": return { ...state, count: state.count + 1 };
    case "RESET":     return { count: 0, loading: false };
    default:          return state;
  }
}
const [state, dispatch] = useReducer(reducer, { count: 0, loading: false });`,
            tag: "core",
          },
          {
            q: "Build a custom hook: useFetch",
            a: "Custom hooks encapsulate reusable stateful logic. Must start with 'use'. Can use other hooks inside.",
            code: `function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; }; // cleanup: prevent stale setState
  }, [url]);

  return { data, loading, error };
}`,
            tag: "coding",
          },
          {
            q: "What are the Rules of Hooks and WHY do they exist?",
            a: `1. Only call hooks at the TOP LEVEL (no if/loops/nested fns)\n2. Only call hooks from React functions (not regular JS)\n\nWHY: React tracks hooks by call ORDER on each render. If you put a hook inside a condition, the order can change between renders, breaking React's internal linked list of hook states.`,
            code: null,
            tag: "core",
          },
          {
            q: "Explain useContext — and its performance pitfall",
            a: `Context provides a way to pass data through component tree without prop drilling.\nPitfall: ANY consumer re-renders when context value changes, even if that consumer only uses a part of the value.\n\nFix: Split contexts by concern. Or use useMemo to stabilize the value object.`,
            code: `const ThemeCtx = createContext(null);
// Provider
<ThemeCtx.Provider value={useMemo(() => ({theme, setTheme}), [theme])}>
  {children}
</ThemeCtx.Provider>
// Consumer
const { theme } = useContext(ThemeCtx);`,
            tag: "must-know",
          },
        ],
      },
      {
        title: "Performance Optimization",
        tag: "PERFORMANCE",
        questions: [
          {
            q: "React.memo — what does it do and when does it NOT help?",
            a: `React.memo = HOC that memoizes a component — skips re-render if props haven't changed (shallow compare).\n\nWhen it DOESN'T help:\n• Props include inline objects/arrays/functions (new reference each render)\n• Component is cheap to render anyway\n• Context changes (memo doesn't stop context-triggered re-renders)`,
            code: `const MemoizedChild = React.memo(({ count, onClick }) => {
  return <button onClick={onClick}>{count}</button>;
});
// Parent must stabilize onClick with useCallback for memo to work!`,
            tag: "must-know",
          },
          {
            q: "Code splitting with React.lazy and Suspense",
            a: `Code splitting = split JS bundle by route/component, load on demand.\nReact.lazy() + Suspense = built-in solution. Dynamic import() does the actual splitting.`,
            code: `const Dashboard = React.lazy(() => import('./Dashboard'));

function App() {
  return (
    <Suspense fallback={<Spinner />}>
      <Dashboard />
    </Suspense>
  );
}`,
            tag: "core",
          },
          {
            q: "What is the Stale Closure problem in React hooks?",
            a: `When a callback/effect captures a value at creation time, but that value later changes — the closure still holds the OLD value.\n\nCommon in: setTimeout inside useEffect, event listeners, async functions.`,
            code: `// Bug: stale closure
const [count, setCount] = useState(0);
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1); // count is always 0! ❌
  }, 1000);
  return () => clearInterval(id);
}, []);

// Fix: functional update
setCount(c => c + 1); // always uses latest value ✅`,
            tag: "tricky",
          },
        ],
      },
      {
        title: "Architecture & Patterns",
        tag: "ARCHITECTURE",
        questions: [
          {
            q: "Compound Components pattern",
            a: `Compound components share implicit state through context. Used in: Tabs, Accordion, Select, Modal.\nAdvantage: caller controls composition without prop-drilling.`,
            code: `// Tabs.Root manages active state via context
<Tabs.Root defaultTab="home">
  <Tabs.List>
    <Tabs.Tab value="home">Home</Tabs.Tab>
    <Tabs.Tab value="about">About</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="home"><HomeContent /></Tabs.Panel>
</Tabs.Root>`,
            tag: "advanced",
          },
          {
            q: "State Management: when Context vs Zustand vs Redux?",
            a: `Context API: low-frequency updates (theme, locale, auth user). NOT good for high-freq updates (form state, animations).\n\nZustand: simple, no boilerplate, great for medium complexity. Selector-based subscriptions avoid over-rendering.\n\nRedux Toolkit: large team, complex state transitions, need time-travel debugging, strict action logging needed.\n\nLocal state first → lift up → context → Zustand → Redux`,
            code: null,
            tag: "architecture",
          },
          {
            q: "Render Props pattern vs HOC vs Custom Hooks",
            a: `All 3 solve: share stateful logic between components.\n\nRender Props: pass a fn as prop, component calls it with state → verbose, 'wrapper hell'\nHOC: wrap component, inject props → hard to trace, naming collisions, needs displayName\nCustom Hooks (modern): cleanest, composable, no wrapping, easy to test\n\nIn 2025: custom hooks preferred for all new code.`,
            code: null,
            tag: "architecture",
          },
        ],
      },
    ],
  },
  browser: {
    label: "Browser & Web APIs",
    icon: "🌐",
    color: "#FF9500",
    colorDim: "#2e1f00",
    sections: [
      {
        title: "How Browsers Work",
        tag: "BROWSER",
        questions: [
          {
            q: "What happens when you type a URL and press Enter?",
            a: `Full flow (impress with depth):\n1. DNS lookup: cache → OS → ISP → root DNS → TLD → authoritative NS\n2. TCP 3-way handshake: SYN → SYN-ACK → ACK\n3. TLS handshake (HTTPS): certificates, key exchange\n4. HTTP request sent\n5. Server responds (200 OK + HTML)\n6. Browser parses HTML → builds DOM\n7. Encounters CSS → builds CSSOM (blocks rendering)\n8. Encounters JS → pauses HTML parsing (unless async/defer)\n9. DOM + CSSOM → Render Tree\n10. Layout (calculate sizes/positions) → Paint → Composite layers`,
            code: null,
            tag: "must-know",
          },
          {
            q: "Critical Rendering Path — what blocks rendering?",
            a: `CSS is render-blocking: browser won't paint until CSSOM is built.\nJS is parser-blocking: <script> stops HTML parsing.\n\nOptimizations:\n• async: download in parallel, execute when ready (non-blocking parse)\n• defer: download in parallel, execute AFTER HTML parsed (in order)\n• Inline critical CSS, load rest async\n• Put scripts at bottom of body`,
            code: `<!-- Blocks parsing ❌ -->
<script src="heavy.js"></script>

<!-- Non-blocking ✅ -->
<script src="analytics.js" async></script>
<script src="app.js" defer></script>`,
            tag: "must-know",
          },
          {
            q: "What is the difference between reflow and repaint?",
            a: `Reflow (Layout): recalculates positions/sizes of elements. Triggered by: adding DOM nodes, changing dimensions, font changes. EXPENSIVE — cascades to children/parents.\n\nRepaint: re-draws pixels without layout change. Triggered by: color, background, visibility changes. CHEAPER than reflow.\n\nBest practice: batch DOM changes, use CSS transforms (doesn't trigger reflow), avoid reading layout props (offsetWidth) in loops.`,
            code: null,
            tag: "core",
          },
          {
            q: "What are Web Workers? When would you use them?",
            a: `Web Workers run scripts in background threads — true parallelism in browser.\nNo DOM access from worker. Communicate via postMessage/onmessage.\n\nUse when: heavy computation (image processing, data parsing, encryption, pathfinding) that would block the main thread and freeze UI.`,
            code: `// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: largeArray });
worker.onmessage = (e) => setResult(e.data.result);

// worker.js
onmessage = (e) => {
  const result = heavyComputation(e.data.data);
  postMessage({ result });
};`,
            tag: "advanced",
          },
          {
            q: "LocalStorage vs SessionStorage vs Cookies vs IndexedDB",
            a: `localStorage: ~5-10MB, persists until cleared, no expiry, same origin only\nSessionStorage: ~5MB, cleared on tab close, per tab\nCookies: ~4KB, sent with every HTTP request (can set HttpOnly, Secure, SameSite), has expiry\nIndexedDB: large structured data (hundreds MB), async, supports transactions\n\nFor auth tokens: HttpOnly cookie (safest — not accessible by JS, immune to XSS)`,
            code: null,
            tag: "must-know",
          },
        ],
      },
      {
        title: "Security",
        tag: "SECURITY",
        questions: [
          {
            q: "What is XSS and how do you prevent it?",
            a: `XSS (Cross-Site Scripting): attacker injects malicious JS into your page, runs in victim's browser.\n\nTypes:\n• Stored XSS: injected into DB, served to all users\n• Reflected XSS: via URL parameter\n• DOM-based XSS: client-side code writes attacker-controlled data to DOM\n\nPrevention:\n• Sanitize/escape all user input before rendering\n• Never use innerHTML with user data (use textContent)\n• Content Security Policy (CSP) headers\n• React escapes by default (dangerouslySetInnerHTML is the only risk)`,
            code: null,
            tag: "must-know",
          },
          {
            q: "What is CORS and how does it work?",
            a: `CORS = browsers block cross-origin requests by default (Same Origin Policy).\nCORS lets server say "I allow requests from origin X".\n\nSimple requests: GET/POST with basic headers — just needs Access-Control-Allow-Origin response header\nPreflight: OPTIONS request first for non-simple requests (e.g. PUT, custom headers) — server must respond with allowed methods/headers\n\nCORS is enforced by BROWSER — doesn't protect server-to-server calls.`,
            code: null,
            tag: "must-know",
          },
          {
            q: "What is CSRF and how do you prevent it?",
            a: `CSRF: attacker tricks authenticated user's browser into making a request to your site.\nWorks because cookies are automatically sent with every request.\n\nPrevention:\n• CSRF tokens (server generates per-session token, must include in forms)\n• SameSite=Strict/Lax cookie attribute\n• Check Origin/Referer headers\n• Double submit cookie pattern`,
            code: null,
            tag: "core",
          },
        ],
      },
      {
        title: "Performance",
        tag: "PERFORMANCE",
        questions: [
          {
            q: "Core Web Vitals — explain each",
            a: `LCP (Largest Contentful Paint): time until largest visible element loads. Target: < 2.5s\nINP (Interaction to Next Paint, replaced FID): responsiveness to user input. Target: < 200ms\nCLS (Cumulative Layout Shift): visual stability, unexpected layout shifts. Target: < 0.1\n\nLCP optimization: preload key images, optimize server response, avoid render-blocking resources\nCLS fix: always specify width/height on images and video\nINP fix: break long tasks, use web workers, avoid heavy main thread work`,
            code: null,
            tag: "must-know",
          },
          {
            q: "What is lazy loading and how do you implement it?",
            a: `Lazy loading = defer loading of non-critical resources until needed.\n\n1. Images: loading="lazy" attribute (native)\n2. Intersection Observer API (programmatic)\n3. React.lazy for component-level code splitting\n4. Dynamic import() for any module`,
            code: `// Native HTML (simplest)
<img src="photo.jpg" loading="lazy" alt="..." />

// Intersection Observer
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.src = e.target.dataset.src;
      observer.unobserve(e.target);
    }
  });
});`,
            tag: "core",
          },
        ],
      },
    ],
  },
  ssr: {
    label: "SSR / Next.js",
    icon: "N",
    color: "#FFFFFF",
    colorDim: "#1a1a1a",
    sections: [
      {
        title: "Rendering Strategies",
        tag: "RENDERING",
        questions: [
          {
            q: "CSR vs SSR vs SSG vs ISR — explain all 4",
            a: `CSR (Client-Side Rendering): HTML shell sent, JS runs in browser, builds DOM. Bad SEO, slow FCP.\n\nSSR (Server-Side Rendering): Full HTML generated per-request on server. Good SEO, slower TTFB for complex pages, high server load.\n\nSSG (Static Site Generation): HTML pre-built at build time. Blazing fast, perfect for blogs/docs. Stale if content changes.\n\nISR (Incremental Static Regeneration): SSG + revalidate interval. Page served from cache, regenerated in background after N seconds. Best of both worlds.`,
            code: `// SSR in Next.js (App Router)
// Any async Server Component fetches on request
export default async function Page() {
  const data = await fetch('/api/data', { cache: 'no-store' }); // SSR
  return <div>{data.title}</div>;
}

// ISR
const data = await fetch('/api/data', {
  next: { revalidate: 60 } // regenerate every 60s
});`,
            tag: "must-know",
          },
          {
            q: "React Server Components (RSC) — what problem do they solve?",
            a: `Problem: Large client bundles, data fetching waterfalls, hydration costs.\n\nRSC run on server only — their code is NEVER sent to client.\nCan access DB, filesystem, secrets directly.\nNo state, no hooks, no browser APIs.\nZero bundle size for server component logic.\n\nClient components still needed for: useState, useEffect, event handlers, browser APIs.\nMix them: Server Components can render Client Components but not vice versa (directly).`,
            code: `// Server Component (default in App Router)
async function ProductList() {
  const products = await db.query('SELECT * FROM products'); // direct DB!
  return <ul>{products.map(p => <ProductCard key={p.id} {...p}/>)}</ul>;
}

// Client Component
"use client"; // directive at top
function AddToCart({ id }) {
  const [added, setAdded] = useState(false);
  return <button onClick={() => setAdded(true)}>Add</button>;
}`,
            tag: "must-know",
          },
          {
            q: "What is hydration? What is hydration mismatch?",
            a: `Hydration: After SSR sends HTML, React runs in browser and "attaches" event listeners to existing DOM (without re-rendering).\n\nHydration mismatch: Server-rendered HTML differs from what React would render on client.\nCauses: Date.now(), Math.random(), browser-only APIs, different timezone on server.\nFix: use suppressHydrationWarning for unavoidable cases, or useEffect for client-only rendering.`,
            code: null,
            tag: "advanced",
          },
          {
            q: "How does Next.js App Router differ from Pages Router?",
            a: `Pages Router (old): _app.js, getServerSideProps/getStaticProps, everything is client component by default\n\nApp Router (new):\n• Nested layouts (layout.js, page.js, loading.js, error.js)\n• Server Components by default (add 'use client' to opt into client)\n• Server Actions for mutations\n• Parallel routes and intercepting routes\n• Streaming with Suspense built-in`,
            code: null,
            tag: "core",
          },
        ],
      },
    ],
  },
  systemdesign: {
    label: "Frontend System Design",
    icon: "🏗",
    color: "#B44FFF",
    colorDim: "#1e0a33",
    sections: [
      {
        title: "Framework for Answering",
        tag: "FRAMEWORK",
        questions: [
          {
            q: "How to structure any frontend system design answer?",
            a: `1. Clarify requirements (functional + non-functional)\n2. API / Data contracts\n3. Component architecture (breakdown)\n4. State management strategy\n5. Data fetching strategy\n6. Performance considerations\n7. Accessibility\n8. Error handling & edge cases\n9. Scalability / trade-offs`,
            code: null,
            tag: "must-know",
          },
        ],
      },
      {
        title: "Common Design Questions",
        tag: "QUESTIONS",
        questions: [
          {
            q: "Design an Autocomplete / Typeahead component",
            a: `Key considerations:\n• Debounce input (300ms) — avoid API call on every keystroke\n• Cancellation: use AbortController to cancel in-flight requests\n• Keyboard navigation: ↑↓ arrows, Enter to select, Esc to close\n• Accessibility: aria-autocomplete, aria-expanded, role="combobox", announce results with aria-live\n• Caching: cache previous query results (object or Map)\n• Highlighting matched text in results\n• Loading/empty/error states`,
            code: null,
            tag: "design",
          },
          {
            q: "Design an Infinite Scroll Feed",
            a: `Options:\n1. Scroll event + check scrollTop + clientHeight vs scrollHeight — fragile\n2. Intersection Observer on a sentinel element at bottom — preferred\n\nConsiderations:\n• Virtualization (windowing) for large lists: react-window / react-virtual\n• Preserve scroll position on back navigation\n• Loading spinner at bottom\n• Handle errors (retry button)\n• Deduplicate items (if real-time)\n• Cursor-based pagination from API (not offset — consistent with real-time data)`,
            code: null,
            tag: "design",
          },
          {
            q: "Design a Payment Form (fintech relevant for Slice!)",
            a: `This is very relevant for Slice (credit/debit card app).\n\nKey aspects:\n• Input masking: card number (4-4-4-4), expiry (MM/YY), CVV\n• Real-time validation: Luhn algorithm for card number\n• Security: never log card details, HTTPS only, CSP, iframe for 3DS\n• Accessibility: proper labels, error announcements\n• Error UX: inline errors, not just on submit\n• Loading/disabled state on submit to prevent double-submit\n• PCI-DSS: ideally use Stripe Elements/Razorpay SDK (sandbox actual card data)`,
            code: null,
            tag: "design",
          },
          {
            q: "Design a Notification System (real-time)",
            a: `Options for real-time delivery:\n• Polling: simple, wasteful bandwidth\n• Server-Sent Events (SSE): one-way server→client stream, auto-reconnect, HTTP-based\n• WebSockets: bi-directional, heavier, for chat/gaming\n\nFor notification bell (like Slice app):\n• SSE or WebSocket for push\n• Unread count badge (local state, synced with server)\n• Mark as read: optimistic update\n• Notification types: toast (ephemeral) vs persistent list\n• Grouping similar notifications`,
            code: null,
            tag: "design",
          },
          {
            q: "Design a Frontend Caching Strategy",
            a: `Layers of caching:\n1. HTTP cache (Cache-Control headers): browser caches responses\n2. Service Worker cache: fine-grained, offline support\n3. React Query / SWR: in-memory cache for API responses with stale-while-revalidate\n4. Memoization (useMemo, React.memo): avoid recomputation\n5. CDN: static assets\n\nStale-while-revalidate: serve cached data immediately, refresh in background → best UX`,
            code: null,
            tag: "design",
          },
        ],
      },
      {
        title: "Architecture Decisions",
        tag: "ARCHITECTURE",
        questions: [
          {
            q: "Micro-Frontend Architecture — what, why, trade-offs",
            a: `Micro-frontends: split large frontend into independently deployable pieces, each owned by different teams.\n\nApproaches:\n• iframes (isolation but poor UX)\n• Web Components (framework-agnostic)\n• Module Federation (Webpack 5) — share code at runtime\n• Route-level code splitting with separate deploys\n\nPros: team autonomy, independent deploy, technology flexibility\nCons: bundle duplication, shared state hard, consistent UX hard, overhead`,
            code: null,
            tag: "advanced",
          },
          {
            q: "How would you handle global error boundaries in React?",
            a: `Error Boundaries catch JS errors in child component tree during render/lifecycle.\nMust be CLASS component (no hook equivalent for render errors).\n\nStrategy:\n• Route-level boundaries: isolate page failures\n• Component-level for critical widgets (don't crash whole app)\n• Log errors to Sentry/monitoring\n• Show fallback UI (retry button)\n• useErrorBoundary from react-error-boundary library`,
            code: `class ErrorBoundary extends React.Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { logToSentry(error, info); }
  render() {
    if (this.state.hasError) return <Fallback />;
    return this.props.children;
  }
}`,
            tag: "core",
          },
          {
            q: "Feature flags in frontend — how to implement?",
            a: `Feature flags decouple deployment from release.\n\nApproaches:\n1. Environment variable (build-time, no dynamic control)\n2. Remote config fetched on app load (LaunchDarkly, custom API)\n3. User-based flags (A/B testing, gradual rollout)\n\nPattern: feature flag context → components check flag before rendering feature`,
            code: `const flags = await fetchFlags(userId);
// Component
if (!flags.NEW_DASHBOARD) return <OldDashboard />;
return <NewDashboard />;`,
            tag: "advanced",
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
        <div style={{ padding: "0 14px 14px 38px" }}>
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

import { useProgress } from "../hooks/useProgress";

export default function Round2Frontend() {
  const tabs = Object.keys(ALL_DATA);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const tab = ALL_DATA[activeTab];

  const { completed, toggleProgress, isLoaded } = useProgress(
    "sde1-round2-progress",
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
              Round 2: Core Frontend
            </span>
            <span
              style={{
                fontSize: 10,
                color: "#3a4a6a",
                fontFamily: "monospace",
              }}
            >
              React · JS · Browser · SSR · System Design
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
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
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
