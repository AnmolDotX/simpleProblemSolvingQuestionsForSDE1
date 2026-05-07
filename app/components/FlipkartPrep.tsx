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
  sections: SectionData[];
};

const ALL_DATA: Record<string, TabData> = {
  js_core: {
    label: "JavaScript Core",
    icon: "JS",
    sections: [
      {
        title: "Closures",
        tag: "HOT",
        questions: [
          {
            q: "What is a closure and why does it work?",
            a: `A closure is a function that remembers variables from its outer scope even after the outer function has finished executing.\n\nBank vault analogy: The vault (outer fn) closes at end of day, but you (inner fn) still carry the key (reference to the variable).\n\nReal uses: data privacy, memoization, event handlers, factory functions, currying.`,
            code: `function parent() {
  let count = 0;
  return function child() {
    return (count += 1);
  };
}
const increment = parent();
increment(); // 1
increment(); // 2`,
            tag: "must-know",
          },
          {
            q: "Tricky: Closure inside a loop with var — what logs, and how do you fix it?",
            a: `setTimeout runs AFTER the loop finishes. By then i = 4. All callbacks close over the SAME single i (var is function-scoped, not block-scoped).\n\nFix 1: Use let (block-scoped — fresh binding per iteration)\nFix 2: IIFE that captures current i in its own scope`,
            code: `for (var i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), i * 1000);
}
// Output: 4, 4, 4  ← same i, loop already done

// Fix 1: let (block scope)
for (let i = 1; i <= 3; i++) {
  setTimeout(() => console.log(i), i * 1000); // 1, 2, 3 ✅
}

// Fix 2: IIFE
for (var i = 1; i <= 3; i++) {
  (function(idx) {
    setTimeout(() => console.log(idx), i * 1000);
  })(i);
}`,
            tag: "tricky",
          },
        ],
      },
      {
        title: "Shallow Copy vs Deep Copy",
        tag: "HOT",
        questions: [
          {
            q: "What is the difference between shallow copy and deep copy?",
            a: `Shallow copy: copies top-level only. Nested objects are still shared references.\nDeep copy: copies all levels independently.\n\nMethods:\n• Shallow: {...obj}, Object.assign()\n• Deep: structuredClone() [modern], JSON.parse(JSON.stringify()) [has caveats], Lodash _.cloneDeep()`,
            code: `const original = { name: 'Ravi', address: { city: 'Bangalore' } };

const shallow = { ...original };
shallow.address.city = 'Mumbai';
console.log(original.address.city); // 'Mumbai' ← MUTATED ⚠️

const deep = structuredClone(original);
deep.address.city = 'Delhi';
console.log(original.address.city); // 'Mumbai' (unchanged) ✅`,
            tag: "must-know",
          },
          {
            q: "Why not always use JSON.parse(JSON.stringify())?",
            a: `JSON.parse(JSON.stringify()) loses:\n• Functions (undefined)\n• undefined values\n• Date objects → become strings\n• Map, Set → become empty {}\n• Circular references → throws TypeError\n\nModern answer: use structuredClone() — handles circular refs, but still doesn't clone functions/class methods.`,
            code: null,
            tag: "tricky",
          },
        ],
      },
      {
        title: "Event Loop & Async",
        tag: "HOT",
        questions: [
          {
            q: "Explain the Event Loop: microtasks vs macrotasks",
            a: `JS is single-threaded. The event loop order:\n\n1. Run all synchronous code (call stack drains)\n2. Drain ALL microtasks (Promise.then, await continuations, queueMicrotask, MutationObserver)\n3. Run ONE macrotask (setTimeout, setInterval, I/O, DOM events)\n4. Repeat\n\nMicrotasks ALWAYS run before the next macrotask, no matter how many are queued.`,
            code: `console.log('1');
setTimeout(() => console.log('2'), 0);
Promise.resolve().then(() => console.log('3'));
async function transition() {
  console.log('4');
  await Promise.resolve();
  console.log('5');
}
transition();
console.log('6');
// Output: 1, 4, 6, 3, 5, 2`,
            tag: "must-know",
          },
          {
            q: "Output walkthrough: why does 1,4,6,3,5,2 happen?",
            a: `Step by step:\n• '1' → sync log\n• setTimeout → goes to macrotask queue\n• Promise.then → goes to microtask queue\n• '4' → sync inside transition()\n• await → pauses transition, schedules continuation as microtask\n• '6' → sync log\n• '3' → first microtask drained\n• '5' → second microtask (transition resumes)\n• '2' → macrotask runs last`,
            code: null,
            tag: "tricky",
          },
          {
            q: "Promise states and async/await internals",
            a: `3 states: Pending → Fulfilled | Rejected. Once settled, cannot change.\n\nasync functions ALWAYS return a Promise.\nawait only pauses the current async function — JS thread stays non-blocking.\nError handling: try/catch inside async function.`,
            code: `async function fetchUser() {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) throw new Error('Not found');
    const data = await res.json();
    return data;
  } catch (err) {
    console.error(err);
  }
}`,
            tag: "core",
          },
        ],
      },
      {
        title: "let / const / var & Hoisting",
        tag: "HOT",
        questions: [
          {
            q: "Key differences between var, let, const",
            a: `var: function/global scope, hoisted (initialized as undefined), can redeclare\nlet: block scope, in TDZ until declaration, cannot redeclare\nconst: block scope, in TDZ, must initialize, cannot reassign (but object properties ARE mutable)\n\nTDZ (Temporal Dead Zone): let/const are hoisted but NOT initialized → ReferenceError if accessed before declaration`,
            code: `function demo() {
  console.log(a); // undefined  (var hoisted with undefined)
  console.log(b); // ReferenceError (TDZ)
  var a = 1;
  let b = 2;
}

const obj = { name: 'A' };
obj.name = 'B'; // ✅ Allowed (mutating property)
obj = {};       // ❌ TypeError (reassigning const)`,
            tag: "must-know",
          },
          {
            q: "Tricky hoisting output — what does this log?",
            a: `var a = 1 in outer scope. Inside func, var a is hoisted to top of function scope (initialized as undefined). Then a = 2 sets the LOCAL a. The outer a is untouched.`,
            code: `var a = 1;
function func() {
  a = 2;
  console.log(a); // 2  ← local a (hoisted inside func)
  var a;          // ← hoisted to top of func
}
func();
console.log(a);   // 1  ← outer a untouched

// Function declarations are fully hoisted ✅
display(); // works!
function display() { console.log('hi'); }

// Function expressions: only var hoisted ❌
func3(); // TypeError: func3 is not a function
var func3 = function() {};`,
            tag: "tricky",
          },
        ],
      },
      {
        title: "this / call / apply / bind",
        tag: "HOT",
        questions: [
          {
            q: "How does 'this' work? All the rules.",
            a: `'this' is determined by HOW a function is called, not WHERE it's defined:\n\n• obj.method() → this = obj\n• Standalone func() → undefined (strict) / window (non-strict)\n• Arrow function → inherits from enclosing scope (lexical — no own 'this')\n• func.call(ctx) / apply / bind → whatever you pass\n• new Foo() → the new instance\n• Event handler el.onclick = fn → the element`,
            code: `const obj = {
  name: 'Flipkart',
  greet: function() {
    setTimeout(() => console.log(this.name), 100);    // 'Flipkart' (arrow inherits)
    setTimeout(function() { console.log(this.name); }, 100); // undefined (new this)
  }
};`,
            tag: "must-know",
          },
          {
            q: "call vs apply vs bind — differences and when to use each",
            a: `All three explicitly set 'this':\n\n• call(ctx, arg1, arg2): invoke immediately, args as comma list\n• apply(ctx, [args]): invoke immediately, args as array\n• bind(ctx, arg1): returns NEW function, doesn't invoke immediately`,
            code: `function greet(greeting, punct) {
  return \`\${greeting}, \${this.name}\${punct}\`;
}
const user = { name: 'Ravi' };

greet.call(user, 'Hi', '!');     // 'Hi, Ravi!'
greet.apply(user, ['Hi', '!']);  // 'Hi, Ravi!'
const bound = greet.bind(user, 'Hi');
bound('!');                       // 'Hi, Ravi!'`,
            tag: "must-know",
          },
          {
            q: "Implement a polyfill for bind()",
            a: `Tests: closures (captures context & args), apply, rest/spread, prototype.\n\nKey insight: bind returns a function that calls the original with the bound context and pre-filled args merged with call-time args.`,
            code: `Function.prototype.myBind = function (context, ...args) {
  const fn = this;
  if (typeof fn !== 'function') {
    throw new TypeError('myBind — not callable');
  }
  return function (...args2) {
    return fn.apply(context, [...args, ...args2]);
  };
};

// Test
function show(city, country) {
  return \`\${this.name} from \${city}, \${country}\`;
}
const user2 = { name: 'Anu' };
const bound2 = show.myBind(user2, 'Mumbai');
console.log(bound2('India')); // 'Anu from Mumbai, India'`,
            tag: "coding",
          },
          {
            q: "Normal function vs arrow function — key differences",
            a: `• this: Normal → dynamic (caller decides). Arrow → lexical (parent scope, no own this)\n• arguments object: Normal → has it. Arrow → use ...args instead\n• new constructor: Normal → ✅. Arrow → ❌ (throws)\n• prototype: Normal → ✅. Arrow → ❌\n• Hoisted: Normal declarations → ✅. Arrow (assigned to let/const) → ❌\n\nIn React: arrow functions in class methods auto-bind this to the instance.`,
            code: null,
            tag: "core",
          },
        ],
      },
      {
        title: "Polyfills & Coding",
        tag: "CODING",
        questions: [
          {
            q: "Implement debounce",
            a: "Debounce: wait until user STOPS for N ms, then fire. Use case: search boxes, form validation.",
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
            q: "Implement throttle",
            a: "Throttle: fire at most once every N ms regardless of how often called. Use case: scroll handlers, resize, button spam.",
            code: `function throttle(fn, delay) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}`,
            tag: "coding",
          },
          {
            q: "Implement memoize",
            a: "Cache function results by args. Return cached result if same args called again. Uses JSON.stringify for cache key.",
            code: `function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) return cache.get(key);
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}`,
            tag: "coding",
          },
          {
            q: "Implement currying — add(1)(2)(3) → 6",
            a: "Currying transforms f(a,b,c) into f(a)(b)(c). Key: count args using fn.length. If enough args collected, call the original fn.",
            code: `function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn.apply(this, args);
    return (...more) => curried.apply(this, [...args, ...more]);
  };
}

// Simple version (fixed arity)
const add = a => b => c => a + b + c;
add(1)(2)(3); // 6`,
            tag: "coding",
          },
          {
            q: "Implement Array.map, Array.filter, Array.reduce polyfills",
            a: "Classic polyfill questions. All iterate with for loop, call callback with (element, index, array).",
            code: `Array.prototype.myMap = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    result.push(callback.call(this, this[i], i, this));
  }
  return result;
};

Array.prototype.myFilter = function(callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (callback.call(this, this[i], i, this)) result.push(this[i]);
  }
  return result;
};

Array.prototype.myReduce = function(callback, initial) {
  let acc = initial;
  let startIdx = 0;
  if (acc === undefined) { acc = this[0]; startIdx = 1; }
  for (let i = startIdx; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};`,
            tag: "coding",
          },
          {
            q: "Implement Promise.all from scratch",
            a: "Resolves when ALL promises resolve (maintaining order). Rejects on first failure. Key: counter pattern, not Array.push order.",
            code: `Promise.myAll = function(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (!promises.length) return resolve([]);
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        val => {
          results[i] = val; // preserve order
          if (++completed === promises.length) resolve(results);
        },
        err => reject(err)
      );
    });
  });
};`,
            tag: "coding",
          },
          {
            q: "Longest subarray with K distinct characters (Sliding Window)",
            a: "Sliding window with a Map tracking character counts. Expand right, shrink left when distinct chars exceed K.",
            code: `function longestSubArr(arr, k) {
  let left = 0, maxLen = 0;
  const charCount = new Map();
  for (let right = 0; right < arr.length; right++) {
    charCount.set(arr[right], (charCount.get(arr[right]) || 0) + 1);
    while (charCount.size > k) {
      const c = arr[left];
      charCount.set(c, charCount.get(c) - 1);
      if (charCount.get(c) === 0) charCount.delete(c);
      left++;
    }
    maxLen = Math.max(maxLen, right - left + 1);
  }
  return maxLen;
}
// longestSubArr(['a','b','a','c','c','b','a','d'], 3) → 7
// Time: O(n) | Space: O(k)`,
            tag: "coding",
          },
        ],
      },
    ],
  },

  react_core: {
    label: "React Core",
    icon: "⚛",
    sections: [
      {
        title: "Class vs Functional Components",
        tag: "HOT",
        questions: [
          {
            q: "Class components vs Functional components — key differences",
            a: `Class components: use this.state + setState, have lifecycle methods, this keyword required (tricky), logic reuse via HOC/render props\n\nFunctional components (modern, recommended): plain functions, useState/useReducer for state, useEffect for lifecycle, no this, logic reuse via custom hooks\n\nWhy functional won: no this confusion, hooks composable, smaller bundles, easier to test.`,
            code: null,
            tag: "core",
          },
        ],
      },
      {
        title: "Lifecycle ↔ Hooks Mapping",
        tag: "HOT",
        questions: [
          {
            q: "Map lifecycle methods to hooks equivalents",
            a: `componentDidMount → useEffect(() => {}, [])\ncomponentDidUpdate (specific dep) → useEffect(() => {}, [dep])\ncomponentWillUnmount → return cleanup fn from useEffect\nshouldComponentUpdate → React.memo / useMemo\nRun on every render → useEffect(() => {}) — no deps array`,
            code: `// componentDidMount
useEffect(() => { console.log('mounted'); }, []);

// componentDidUpdate
useEffect(() => { console.log('userId changed'); }, [userId]);

// componentWillUnmount
useEffect(() => {
  return () => console.log('unmounting');
}, []);`,
            tag: "must-know",
          },
          {
            q: "useEffect vs useLayoutEffect — differences and when to use each",
            a: `useEffect: fires async AFTER browser paint. Non-blocking. Use for: API calls, subscriptions, logging.\nuseLayoutEffect: fires sync BEFORE paint (right after DOM mutation). Blocks paint. Use for: DOM measurements, preventing flicker.\n\nDefault to useEffect. Only reach for useLayoutEffect when fixing visual flicker.\nWarning: useLayoutEffect causes SSR warning (runs before paint doesn't make sense on server).`,
            code: null,
            tag: "must-know",
          },
          {
            q: "Output question: render → useLayoutEffect → useEffect order",
            a: `Render phase runs top-down synchronously. After commit, useLayoutEffect fires sync. Then useEffect fires async after paint.\n\nOutput: 1 (Render Start) → 4 (Render Body) → 3 (useLayoutEffect) → 2 (useEffect)`,
            code: `const ComponentA = () => {
  const [count, setCount] = useState(0);
  console.log('1: Render Start');
  useEffect(() => { console.log('2: useEffect'); }, []);
  useLayoutEffect(() => { console.log('3: useLayoutEffect'); }, []);
  return (
    <div>
      {console.log('4: Render Body')}
      Check Console
    </div>
  );
};
// Output: 1, 4, 3, 2`,
            tag: "tricky",
          },
          {
            q: "Parent/child useEffect firing order — what logs first?",
            a: `React commits children before parents. useEffect fires bottom-up (deepest first).\n\nIf Parent → Child1 → Grandchild:\nOutput: grandchild, child1, parent\n\nWhy: the child must finish mounting before the parent's "post-mount" effect fires. React's commit phase is depth-first.`,
            code: null,
            tag: "tricky",
          },
        ],
      },
      {
        title: "Performance Hooks",
        tag: "HOT",
        questions: [
          {
            q: "useMemo vs useCallback vs React.memo — when to use each",
            a: `useMemo(fn, deps): memoizes computed VALUE. Use for expensive computations (sort/filter large arrays).\nuseCallback(fn, deps): memoizes FUNCTION REFERENCE. Use when passing callbacks to memoized children.\nReact.memo(Component): HOC that memoizes a whole component — skips re-render if props unchanged (shallow compare).\n\n⚠️ None are free. They add overhead. Only use after measuring a real performance problem.\n⚠️ React.memo won't help if you pass inline objects/functions — combine with useMemo/useCallback.`,
            code: `// Expensive computation
const sortedList = useMemo(() => hugeArray.sort(), [hugeArray]);

// Stable callback for memoized child
const handleClick = useCallback(() => doSomething(id), [id]);

// Memoize component
const Row = React.memo(({ item }) => <div>{item.name}</div>);`,
            tag: "must-know",
          },
          {
            q: "Build a custom hook: useDebounce",
            a: "Debounce hook: updates debouncedValue only after value hasn't changed for 'delay' ms. Cleanup clears the timer on each new value.",
            code: `function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup on each change
  }, [value, delay]);
  return debouncedValue;
}

// Usage
function SearchApp() {
  const [searchTerm, setSearchTerm] = useState('');
  const debounced = useDebounce(searchTerm, 300);
  useEffect(() => {
    if (debounced) console.log('API Call:', debounced);
  }, [debounced]);
  return <input onChange={e => setSearchTerm(e.target.value)} />;
}`,
            tag: "coding",
          },
        ],
      },
      {
        title: "HOC & Patterns",
        tag: "PATTERNS",
        questions: [
          {
            q: "What is a Higher-Order Component (HOC)?",
            a: `A function that takes a component and returns an enhanced component.\nUse cases: auth guards, logging, error boundaries, theme injection.\n\nHOC vs Custom Hook:\n• HOC wraps a component — good for cross-cutting concerns\n• Custom Hook shares stateful logic without wrapper — preferred in modern React`,
            code: `function withAuth(WrappedComponent) {
  return function AuthGuard(props) {
    const { isLoggedIn, user } = useAuth();
    if (!isLoggedIn) return <Navigate to="/login" />;
    return <WrappedComponent {...props} user={user} />;
  };
}

const ProtectedDashboard = withAuth(Dashboard);`,
            tag: "core",
          },
          {
            q: "Code review trap: what's wrong with key={index}?",
            a: `Issues:\n1. key={index} is an anti-pattern. Use stable IDs (post.id). Index keys cause bugs when items are reordered/inserted — React misidentifies which item moved.\n2. No PropTypes / TypeScript types\n3. No empty/error state handling for posts === undefined\n4. No memoization — re-renders on every parent render\n5. No accessibility — sidebar list missing <nav aria-label="...">`,
            code: `// ❌ Anti-pattern
{props.posts.map((post, index) =>
  <li key={index}>{post.title}</li>
)}

// ✅ Correct
{props.posts.map((post) =>
  <li key={post.id}>{post.title}</li>
)}`,
            tag: "tricky",
          },
        ],
      },
    ],
  },

  rendering: {
    label: "Rendering & Arch",
    icon: "🏗",
    sections: [
      {
        title: "Rendering Strategies",
        tag: "HOT",
        questions: [
          {
            q: "CSR vs SSR — tradeoffs table",
            a: `CSR (Client-Side Rendering):\n• Initial HTML: empty shell\n• First paint: slow (waits for JS)\n• SEO: poor\n• Server load: low\n• Use: dashboards, apps behind login\n• Examples: Vite+React, CRA\n\nSSR (Server-Side Rendering):\n• Initial HTML: pre-rendered\n• First paint: fast\n• SEO: excellent\n• Server load: high\n• Use: e-commerce, marketing, blogs\n• Examples: Next.js, Remix\n\nBonus — ISR (Next.js): pre-render at build time + revalidate on schedule. Best of both.`,
            code: null,
            tag: "must-know",
          },
          {
            q: "What is hydration? What causes hydration mismatch?",
            a: `After SSR sends HTML, React "attaches" event listeners to existing server-rendered DOM to make it interactive — without re-rendering.\n\nAnalogy: Server sends a paper car (looks right, won't move). Hydration installs the engine.\n\nHydration mismatch: server HTML ≠ client HTML → React throws an error.\nCauses: Date.now(), Math.random(), window usage during render, different timezone on server.\nFix: suppressHydrationWarning for unavoidable cases, or useEffect for client-only code.`,
            code: null,
            tag: "must-know",
          },
        ],
      },
      {
        title: "Virtual DOM & Reconciliation",
        tag: "INTERNALS",
        questions: [
          {
            q: "How does the Virtual DOM and reconciliation work?",
            a: `Virtual DOM: a JS object representation of the real DOM. All diffing happens in JS-land, not on the slow real DOM.\n\nReconciliation flow:\n1. State changes → React re-renders component tree (virtually)\n2. Diffing algorithm compares new VDOM vs old VDOM (O(n) heuristics)\n3. Computes minimal patches\n4. Applies them to real DOM in a batch\n\nDiffing rules:\n• Different element types → unmount entire subtree, mount new\n• Same type → only update changed attributes\n• Lists → use key to identify which item moved/added/removed`,
            code: null,
            tag: "core",
          },
        ],
      },
      {
        title: "Full Browser Pipeline",
        tag: "MUST KNOW",
        questions: [
          {
            q: "What happens when you type flipkart.com and hit enter?",
            a: `1. DNS lookup: cache → OS → router → ISP → root → TLD → authoritative NS → returns IP\n2. TCP 3-way handshake: SYN → SYN-ACK → ACK\n3. TLS handshake: certificate exchange, session keys\n4. HTTP GET / with headers\n5. Server: load balancer → app server → DB → response\n6. HTML received → browser starts parsing\n7. Critical render path:\n   • HTML → DOM tree\n   • CSS → CSSOM\n   • DOM + CSSOM → Render Tree\n   • Layout (geometry) → Paint (pixels) → Composite (layers)\n8. JS execution: blocks parser unless async/defer\n9. Subsequent requests: images, fonts, API calls`,
            code: null,
            tag: "must-know",
          },
          {
            q: "Frontend performance optimization techniques",
            a: `Architecture:\n• SSR/ISR for SEO-heavy pages (Next.js)\n• Code splitting: React.lazy + Suspense\n• CDN for static assets\n\nCode:\n• Minimize re-renders: React.memo, useMemo, useCallback\n• Tree shaking: import specific lodash fns, not the whole lib\n• Image optimization: WebP, srcSet, loading="lazy"\n• Debounce/throttle expensive handlers\n• Virtualize long lists (react-window)\n• Web Workers for CPU-heavy work off main thread\n\nNetwork:\n• HTTP/2 multiplexing, gzip/brotli compression\n• Cache headers, Service Workers (PWA)\n• Prefetch/preload critical resources\n\nMeasurement: Lighthouse, Web Vitals (LCP, FID, CLS, INP)`,
            code: null,
            tag: "core",
          },
        ],
      },
    ],
  },

  redux: {
    label: "Redux / State",
    icon: "⚙",
    sections: [
      {
        title: "Why Redux",
        tag: "HOT",
        questions: [
          {
            q: "Why use Redux? When is it overkill?",
            a: `Redux solves: prop drilling + single source of truth for global state with predictable transitions.\n\nUse Redux when:\n• Many unrelated components share state\n• Complex state transitions need traceability (Redux DevTools)\n• Multi-team frontend with clear ownership\n\nDon't use Redux when:\n• Local form state (useState is fine)\n• Server state (use React Query / SWR)\n• Small app with few shared states`,
            code: null,
            tag: "core",
          },
        ],
      },
      {
        title: "Core Concepts",
        tag: "HOT",
        questions: [
          {
            q: "Explain the Redux data flow: Action → Reducer → Store → Component",
            a: `Store: single JS object holding the entire app state.\nAction: { type: 'cart/addItem', payload: {...} } — plain object describing what happened.\nReducer: pure function (state, action) => newState. Never mutates directly.\nDispatch: sends action to the store, triggering reducer.\nuseSelector: subscribe to slices of store state.\nuseDispatch: get dispatch function in components.`,
            code: `function cartReducer(state = [], action) {
  switch (action.type) {
    case 'cart/addItem':
      return [...state, action.payload];
    case 'cart/removeItem':
      return state.filter(i => i.id !== action.payload.id);
    default:
      return state;
  }
}`,
            tag: "must-know",
          },
          {
            q: "Why must Redux updates be immutable?",
            a: `Redux uses === shallow equality to detect state changes. If you mutate state in place, the reference stays the same → React/Redux thinks nothing changed → no re-render.\n\nAlways return a NEW reference for changed state.`,
            code: `// ❌ Mutation — won't trigger re-render
state.items.push(newItem);
return state;

// ✅ New reference — re-render triggers
return { ...state, items: [...state.items, newItem] };`,
            tag: "tricky",
          },
          {
            q: "Redux Toolkit (RTK) — how does it improve DX?",
            a: `RTK eliminates boilerplate:\n• createSlice: auto-generates action creators + handles Immer (allows "mutations" safely)\n• createAsyncThunk: standardized async action with pending/fulfilled/rejected cases\n• configureStore: sets up DevTools + middleware automatically`,
            code: `import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk('user/fetch', async (id) => {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
});

const userSlice = createSlice({
  name: 'user',
  initialState: { data: null, loading: false, error: null },
  reducers: {
    logout: (state) => { state.data = null; }, // Immer: "mutate" safely
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending,   (s)    => { s.loading = true; })
      .addCase(fetchUser.fulfilled, (s, a) => { s.loading = false; s.data = a.payload; })
      .addCase(fetchUser.rejected,  (s, a) => { s.loading = false; s.error = a.error.message; });
  },
});`,
            tag: "core",
          },
        ],
      },
    ],
  },

  system_design: {
    label: "System Design",
    icon: "🌐",
    sections: [
      {
        title: "Infrastructure Concepts",
        tag: "HOT",
        questions: [
          {
            q: "Redis — what is it and what are its use cases?",
            a: `Redis is an in-memory key-value store. Lightning fast (RAM-based) with optional disk persistence.\n\nUse cases:\n• Caching: SET user:123 "{...}" EX 300\n• Sessions: centralized so multiple servers can read same session\n• Rate limiting: INCR requests:ip:1.2.3.4 EX 60\n• Pub/Sub: real-time messaging between microservices\n• Leaderboards: Sorted Sets ZADD\n• Job queues: BullMQ uses Redis\n• Distributed locks`,
            code: null,
            tag: "core",
          },
          {
            q: "SQL vs MongoDB — when to use each?",
            a: `SQL (Postgres, MySQL):\n• Strict schema, ACID full transactions\n• Native joins, relational data\n• Vertical scaling (scale up)\n• Best for: financial data, user accounts, anything with relationships\n\nMongoDB:\n• Flexible schema (document-based)\n• No native joins ($lookup is slow — prefer embedding)\n• Horizontal scaling\n• Best for: product catalogs, user profiles, evolving schemas, high write throughput`,
            code: null,
            tag: "core",
          },
          {
            q: "WebSockets — what are they and when to use them?",
            a: `WebSockets: persistent, bidirectional TCP connection. Both sides can push at any time.\n\nUse cases: chat, live scores, collaborative editing, stock tickers, multiplayer games.\n\nvs HTTP polling: WS has lower overhead and lower latency for real-time updates.\nvs SSE (Server-Sent Events): SSE is one-way server→client, simpler, auto-reconnect. Use SSE for live feeds; use WS for true bidirectional.`,
            code: null,
            tag: "core",
          },
          {
            q: "Load balancer — algorithms, sticky sessions, and the Redis solution",
            a: `Load balancer distributes traffic across multiple servers.\n\nAlgorithms: Round Robin, Least Connections, IP Hash (sticky).\n\nStateless servers (JWT): easy to scale — any server can handle any request.\nStateful services (WebSockets, in-memory sessions): need sticky sessions OR shared store.\n\nSticky sessions problem: if Server 1 dies, all its users lose state.\nBetter solution: store session in Redis → any server can read any session → truly stateless.`,
            code: null,
            tag: "must-know",
          },
        ],
      },
    ],
  },

  html_css: {
    label: "HTML & CSS",
    icon: "#",
    sections: [
      {
        title: "Box Model & Layout",
        tag: "FUNDAMENTALS",
        questions: [
          {
            q: "Explain the CSS Box Model",
            a: `Every element = content + padding + border + margin.\n\nbox-sizing: content-box (default): width only applies to content. Total = width + padding + border + margin.\nbox-sizing: border-box (preferred): width includes padding + border. Much easier to reason about.\n\nAlways set: * { box-sizing: border-box; }`,
            code: `/* Without border-box: */
/* div width=100, padding=10, border=5 → rendered width = 130 */

/* With border-box: */
* { box-sizing: border-box; }
/* div width=100, padding=10, border=5 → rendered width = 100 */`,
            tag: "core",
          },
          {
            q: "Block vs Inline vs Inline-Block differences",
            a: `Block: forces new line, respects width/height/vertical margin. Examples: div, p, h1\nInline: stays in text flow, ignores width/height, top/bottom margin ignored. Examples: span, a, em\nInline-Block: stays in text flow BUT respects width/height/all margins. Examples: img, button, input\n\nPractical: want elements side-by-side with width/height? → inline-block or (better) Flexbox/Grid`,
            code: null,
            tag: "core",
          },
          {
            q: "CSS position values — when does each apply?",
            a: `static (default): normal flow, top/left/etc ignored\nrelative: offset from its own normal position, still takes space\nabsolute: removed from flow, positioned relative to nearest positioned ancestor\nfixed: removed from flow, positioned relative to viewport (stays on scroll)\nsticky: relative until scroll threshold, then fixed within scrolling ancestor`,
            code: `/* Center with absolute */
.parent { position: relative; }
.child {
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

/* Center with flexbox (cleaner) */
.parent { display: flex; justify-content: center; align-items: center; }`,
            tag: "must-know",
          },
          {
            q: "Flexbox — key properties cheat sheet",
            a: `Container:\n• flex-direction: row | column\n• justify-content: flex-start | center | space-between | space-around\n• align-items: stretch | center | flex-start | flex-end\n• flex-wrap: nowrap | wrap\n• gap: 16px\n\nItem:\n• flex: 1 (shorthand for grow shrink basis)\n• flex-grow / flex-shrink / flex-basis\n• align-self: override container's align-items`,
            code: `/* N children in a row */
.parent { display: flex; flex-wrap: wrap; gap: 8px; }
.child { flex: 0 0 33.33%; } /* 3 per row */`,
            tag: "core",
          },
        ],
      },
      {
        title: "Selectors & Specificity",
        tag: "FUNDAMENTALS",
        questions: [
          {
            q: "CSS Specificity — how is it calculated?",
            a: `From highest to lowest:\n1. !important (override all — avoid in prod)\n2. Inline styles → score 1000\n3. ID selectors #id → score 100\n4. Class, attribute, pseudo-class .class, [attr], :hover → score 10\n5. Element, pseudo-element div, ::before → score 1\n\nRule: higher specificity wins. If equal, last declared wins.`,
            code: `#nav .item.active a:hover
/* = 100 + 10 + 10 + 1 + 10 = 131 */`,
            tag: "core",
          },
          {
            q: "display:none vs visibility:hidden vs opacity:0",
            a: `display: none → removed from layout, no space, not in a11y tree, can't animate\nvisibility: hidden → takes space, not visible, not clickable, IS in a11y tree\nopacity: 0 → takes space, not visible, still CLICKABLE (⚠️), can animate\n\nFor animations: opacity is GPU-accelerated. display:none can't be animated (no intermediate state).`,
            code: null,
            tag: "tricky",
          },
          {
            q: "Pseudo-class vs Pseudo-element",
            a: `Pseudo-class (single colon :): a STATE of the element\nExamples: :hover, :focus, :nth-child(2), :not(), :checked\n\nPseudo-element (double colon ::): a virtual PART of the element\nExamples: ::before, ::after, ::first-letter, ::placeholder\n\nRule of thumb: if it's a state/condition → pseudo-class. If it's a virtual element → pseudo-element.`,
            code: `a:hover { color: red; }              /* pseudo-class */
p::first-line { font-weight: bold; } /* pseudo-element */`,
            tag: "core",
          },
        ],
      },
    ],
  },

  machine_coding: {
    label: "Machine Coding",
    icon: "⌨",
    sections: [
      {
        title: "Modal Component",
        tag: "COMMON",
        questions: [
          {
            q: "Build a reusable Modal with overlay, close on Esc, scroll lock",
            a: `Key considerations:\n• e.stopPropagation() on inner div prevents overlay click from firing\n• max-h + overflow-y-auto makes content scrollable\n• ESC key support via useEffect document.addEventListener\n• For real apps: use createPortal to escape parent stacking contexts\n• Accessibility: focus trap, aria-modal, aria-labelledby`,
            code: `function Modal({ isOpen, onClose, title, footer, children }) {
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg w-[90%] max-w-2xl max-h-[80vh] flex flex-col"
        onClick={e => e.stopPropagation()} // prevent bubble
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="overflow-y-auto p-4 flex-1">{children}</div>
        {footer && <div className="p-4 border-t">{footer}</div>}
      </div>
    </div>
  );
}`,
            tag: "coding",
          },
        ],
      },
      {
        title: "Autocomplete / Typeahead",
        tag: "COMMON",
        questions: [
          {
            q: "Build an Autocomplete with debouncing and click-outside close",
            a: `Key features:\n• Debounce input (300ms) — avoid API call on every keystroke\n• Click outside to close — via useRef + document.addEventListener('mousedown')\n• Keyboard navigation (↑↓ Enter Esc) — bonus points\n• AbortController to cancel in-flight requests\n• Cache previous query results`,
            code: `function Autocomplete() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounced = useDebounce(query, 300);
  const ref = useRef();

  useEffect(() => {
    if (!debounced) return setResults([]);
    fetch(\`/api/search?q=\${debounced}\`)
      .then(r => r.json())
      .then(data => { setResults(data); setShowDropdown(true); });
  }, [debounced]);

  // Click outside to close
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target))
        setShowDropdown(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      {showDropdown && results.length > 0 && (
        <ul style={{ position: 'absolute', background: 'white', width: '100%' }}>
          {results.map(r => <li key={r.id}>{r.name}</li>)}
        </ul>
      )}
    </div>
  );
}`,
            tag: "coding",
          },
        ],
      },
      {
        title: "Multi-Step Form",
        tag: "COMMON",
        questions: [
          {
            q: "Build a multi-step form with validation and error recovery",
            a: `Follow-up questions often asked:\n• State: local useState for small forms, useReducer for complex, React Hook Form for large\n• Persist on refresh: useEffect syncing to sessionStorage\n• API failure: don't lose user data — show toast, allow retry\n• Re-render optimization: split into per-field memoized children\n• Config-driven: define steps as JSON schema, render generically`,
            code: `const STEPS = [
  { id: 1, title: 'Personal', fields: ['name', 'email'] },
  { id: 2, title: 'Address',  fields: ['city', 'pincode'] },
  { id: 3, title: 'Review',   fields: [] },
];

function MultiStepForm() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  const validate = (s) => {
    const e = {};
    if (s === 0) {
      if (!data.name) e.name = 'Required';
      if (!/\S+@\S+\.\S+/.test(data.email || '')) e.email = 'Invalid';
    }
    if (s === 1) {
      if (!/^\d{6}$/.test(data.pincode || '')) e.pincode = '6 digits';
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) return setErrors(e);
    setErrors({});
    setStep(s => s + 1);
  };

  return (
    <div>
      <ProgressBar current={step} total={STEPS.length} />
      {/* render current step fields */}
      <button disabled={step === 0} onClick={() => setStep(s => s - 1)}>Back</button>
      <button onClick={step === STEPS.length - 1 ? submit : next}>
        {step === STEPS.length - 1 ? 'Submit' : 'Continue'}
      </button>
    </div>
  );
}`,
            tag: "coding",
          },
        ],
      },
      {
        title: "Infinite Scroll, Carousel, Progress Bar",
        tag: "COMMON",
        questions: [
          {
            q: "Build Infinite Scroll with Intersection Observer",
            a: `Preferred approach: Intersection Observer on sentinel element at bottom of list — more reliable than scroll event.\n\nKey considerations:\n• Reset items + page on search change\n• cursor-based pagination (not offset — consistent with real-time data)\n• Virtualization for very long lists (react-window)\n• Preserve scroll on back navigation`,
            code: `function InfiniteList() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const lastItemRef = useCallback(node => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) setPage(p => p + 1);
    });
    if (node) observer.current.observe(node);
  }, [hasMore]);

  return (
    <div>
      {items.map((item, i) => (
        <div key={item.id} ref={i === items.length - 1 ? lastItemRef : null}>
          {item.name}
        </div>
      ))}
      {!hasMore && <p>No more items</p>}
    </div>
  );
}`,
            tag: "coding",
          },
          {
            q: "Build a resumable Progress Bar",
            a: "Use setInterval inside useEffect. Toggle running state to pause/resume. Functional updater prevents stale closure on progress value.",
            code: `function ProgressBar() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(id); return 100; }
        return p + 1;
      });
    }, 50);
    return () => clearInterval(id); // cleanup on pause/unmount
  }, [running]);

  return (
    <div>
      <div style={{ width: '100%', background: '#eee', height: 8, borderRadius: 4 }}>
        <div style={{ width: \`\${progress}%\`, background: '#555', height: '100%', borderRadius: 4 }} />
      </div>
      <button onClick={() => setRunning(r => !r)}>{running ? 'Pause' : 'Resume'}</button>
      <button onClick={() => { setProgress(0); setRunning(false); }}>Reset</button>
    </div>
  );
}`,
            tag: "coding",
          },
          {
            q: "Build a Carousel with auto-play and dot navigation",
            a: "setInterval for auto-play. Modulo (%) for circular navigation. Cleanup interval on unmount.",
            code: `function Carousel({ images }) {
  const [idx, setIdx] = useState(0);
  const next = () => setIdx(i => (i + 1) % images.length);
  const prev = () => setIdx(i => (i - 1 + images.length) % images.length);

  useEffect(() => {
    const id = setInterval(next, 3000);
    return () => clearInterval(id); // cleanup
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <img src={images[idx]} alt="" style={{ width: '100%' }} />
      <button onClick={prev} style={{ position: 'absolute', left: 8, top: '50%' }}>‹</button>
      <button onClick={next} style={{ position: 'absolute', right: 8, top: '50%' }}>›</button>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 8 }}>
        {images.map((_, i) => (
          <span
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: i === idx ? '#333' : '#bbb',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  );
}`,
            tag: "coding",
          },
        ],
      },
    ],
  },

  behavioral: {
    label: "Behavioral & HR",
    icon: "🎯",
    sections: [
      {
        title: "Self-Introduction & Storytelling",
        tag: "HR",
        questions: [
          {
            q: "Tell me about yourself — 90-second structure",
            a: `Structure: Past → Present → Future (keep it under 90 seconds)\n\n"I'm a frontend engineer with X years building React-based products. Currently at [Company], I work on [most impressive project], where I [specific accomplishment with metric]. Before this, I [past role with growth]. I'm looking for [why Flipkart] because [specific to them — scale, impact, product]."\n\nKey: end with a bridge to why THIS company.`,
            code: null,
            tag: "behavioral",
          },
          {
            q: "Most challenging project — STAR format",
            a: `Situation: scope, team size, why it mattered\nTask: your specific role and ownership\nAction: concrete steps YOU took (not "we")\nResult: quantified outcome — latency reduced X%, conversion up Y%, shipped on time\n\nTip: prepare 2 STAR stories — one technical challenge, one team/process challenge.`,
            code: null,
            tag: "behavioral",
          },
        ],
      },
      {
        title: "Collaboration & Process",
        tag: "HR",
        questions: [
          {
            q: "How do you handle conflicts with design or product teams?",
            a: `Frame the disagreement around the user, not personal preferences.\n• Bring data: A/B tests, accessibility audits, performance budgets\n• Suggest a small experiment rather than a long debate\n• Always summarize alignment in writing (email/Slack) so both sides have shared truth\n• Escalate to manager only after exhausting direct resolution`,
            code: null,
            tag: "behavioral",
          },
          {
            q: "How do you ensure collaborative work in a team?",
            a: `• Daily standups, weekly demos\n• Shared design system / component library to reduce friction\n• PRs with templates: what + why + screenshots + test plan\n• Pair-programming on complex features\n• Document decisions (ADRs — Architecture Decision Records)\n• Async-first communication with summary docs`,
            code: null,
            tag: "behavioral",
          },
          {
            q: "How did you take a feature from 0 to production?",
            a: `Walk through the full lifecycle:\n1. Requirements gathering — clarifying edge cases with PM\n2. Design review — aligning with designer + engineering lead\n3. Tech doc — component breakdown, API contracts, state strategy\n4. Implementation — small atomic PRs with meaningful descriptions\n5. Testing — unit (Jest), integration (RTL), E2E (Playwright/Cypress)\n6. Feature flags — 1% → 10% → 100% rollout\n7. Monitoring — Sentry errors, Datadog latency dashboards\n8. Post-launch — metric analysis, retro`,
            code: null,
            tag: "behavioral",
          },
        ],
      },
      {
        title: "Questions to Ask the Interviewer",
        tag: "MUST ASK",
        questions: [
          {
            q: "What questions should YOU ask the interviewer?",
            a: `Always have 3 prepared. Great questions:\n\n• "What does success look like for this role in 6 months / 1 year?"\n• "How does the team handle technical debt vs feature work balance?"\n• "What's the deployment cadence — how often does the team ship?"\n• "How are product priorities balanced against engineering improvements?"\n• "What's the growth path here — tech-lead vs deeper IC?"\n• "What's your favorite thing about working on this team?"\n\nTip: tailor one question to something specific you learned in the interview — shows you were listening.`,
            code: null,
            tag: "behavioral",
          },
        ],
      },
    ],
  },
};

// ─── Minimal design tokens ────────────────────────────────────────────────────
const T = {
  bg: "#0c0c0c",
  surface: "#161616",
  surfaceOpen: "#191919",
  surfaceDone: "#131813",
  border: "#252525",
  borderOpen: "#2e2e2e",
  borderDone: "#1e2a1e",
  text: "#dedede",
  textDim: "#777",
  textMuted: "#3e3e3e",
  textDone: "#7aad8a",
  codeBg: "#0e0e0e",
  codeBorder: "#222",
  codeText: "#9ec8e8",
};

const TAG_STYLES: Record<string, { bg: string; color: string; label: string }> =
  {
    "must-know": { bg: "#1e1210", color: "#d4926e", label: "MUST KNOW" },
    tricky: { bg: "#1a1910", color: "#c4a555", label: "TRICKY" },
    coding: { bg: "#0f1520", color: "#6a9ec4", label: "CODING" },
    core: { bg: "#101812", color: "#72a888", label: "CORE" },
    advanced: { bg: "#14101e", color: "#9c7ec8", label: "ADVANCED" },
    design: { bg: "#1a1410", color: "#c49060", label: "DESIGN" },
    behavioral: { bg: "#151318", color: "#a08898", label: "HR" },
    architecture: { bg: "#181213", color: "#b07878", label: "ARCH" },
  };

const TAB_ACCENTS: Record<string, string> = {
  js_core: "#c8a838",
  react_core: "#61a8c4",
  rendering: "#8a9ec4",
  redux: "#9c7ec8",
  system_design: "#72a888",
  html_css: "#c49060",
  machine_coding: "#d4926e",
  behavioral: "#a08898",
};

function Tag({ type }: { type: string }) {
  const s = TAG_STYLES[type] || TAG_STYLES["core"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        fontSize: 9,
        fontWeight: 600,
        padding: "2px 7px",
        borderRadius: 3,
        letterSpacing: "0.07em",
        fontFamily: "monospace",
        border: `1px solid ${s.color}22`,
        whiteSpace: "nowrap",
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
        background: open ? T.surfaceOpen : isCompleted ? T.surfaceDone : T.surface,
        border: `1px solid ${open ? T.borderOpen : isCompleted ? T.borderDone : T.border}`,
        borderRadius: 7,
        marginBottom: 5,
        overflow: "hidden",
        transition: "all 0.12s ease",
        opacity: isCompleted && !open ? 0.65 : 1,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px 14px",
          gap: 10,
          cursor: "pointer",
        }}
        onClick={() => setOpen(!open)}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          title={isCompleted ? "Mark incomplete" : "Mark complete"}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            width: 20,
            height: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            flexShrink: 0,
            color: isCompleted ? T.textDone : T.textMuted,
            padding: 0,
          }}
        >
          {isCompleted ? "✓" : "○"}
        </button>
        <span
          style={{
            color: T.textMuted,
            fontSize: 10,
            marginTop: 1,
            minWidth: 10,
            fontFamily: "monospace",
          }}
        >
          {open ? "▾" : "▸"}
        </span>
        <span
          style={{
            flex: 1,
            color: isCompleted ? T.textDone : T.text,
            textDecoration: isCompleted && !open ? "line-through" : "none",
            fontSize: 13,
            fontWeight: 450,
            lineHeight: 1.45,
          }}
        >
          {q}
        </span>
        <Tag type={tag} />
      </div>
      {open && (
        <div style={{ padding: "2px 14px 14px 44px" }}>
          <div
            style={{
              color: "#909090",
              fontSize: 12.5,
              lineHeight: 1.75,
              whiteSpace: "pre-line",
              marginBottom: code ? 10 : 0,
            }}
          >
            {a}
          </div>
          {code && (
            <pre
              style={{
                background: T.codeBg,
                border: `1px solid ${T.codeBorder}`,
                borderRadius: 6,
                padding: "10px 14px",
                fontSize: 11.5,
                color: T.codeText,
                overflow: "auto",
                fontFamily: "'Geist Mono', 'Cascadia Code', Consolas, monospace",
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
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 8,
          paddingBottom: 7,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <span style={{ color: T.textMuted, fontSize: 10, fontFamily: "monospace" }}>§</span>
        <span
          style={{
            color: "#888",
            fontSize: 11,
            fontWeight: 600,
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
            color: T.textMuted,
            background: T.bg,
            border: `1px solid ${T.border}`,
            padding: "1px 7px",
            borderRadius: 3,
            fontFamily: "monospace",
            letterSpacing: "0.06em",
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

export default function FlipkartPrep() {
  const tabs = Object.keys(ALL_DATA);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const tab = ALL_DATA[activeTab];
  const accent = TAB_ACCENTS[activeTab] || "#888";

  const { completed, toggleProgress, isLoaded } = useProgress("sde1-flipkart-progress");

  const totalQ = Object.values(ALL_DATA).reduce(
    (acc, t) => acc + t.sections.reduce((s, sec) => s + sec.questions.length, 0),
    0
  );
  const completedCount = completed.size;
  const pct = Math.round((completedCount / totalQ) * 100);

  if (!isLoaded) return <div style={{ background: T.bg, minHeight: "100vh" }} />;

  return (
    <div style={{ minHeight: "100vh", background: T.bg, color: T.text, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Header */}
      <div
        style={{
          borderBottom: `1px solid ${T.border}`,
          padding: "14px 20px 12px",
          background: T.bg,
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div style={{ maxWidth: 940, margin: "0 auto" }}>
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: T.text, letterSpacing: "-0.01em" }}>
              Flipkart — SDE 1 Frontend Prep
            </span>
            <span style={{ fontSize: 10, color: T.textDim, fontFamily: "monospace" }}>
              Latest interview questions · ThinkifyLabs
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 80,
                  height: 3,
                  background: T.border,
                  borderRadius: 2,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: "#5a8a6a",
                    borderRadius: 2,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <span style={{ fontSize: 10, color: T.textDim, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                {completedCount}/{totalQ}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            {tabs.map((key) => {
              const t = ALL_DATA[key];
              const isActive = key === activeTab;
              const tabAccent = TAB_ACCENTS[key] || "#888";
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: "4px 11px",
                    background: isActive ? `${tabAccent}12` : "transparent",
                    color: isActive ? tabAccent : T.textDim,
                    border: `1px solid ${isActive ? `${tabAccent}30` : T.border}`,
                    borderRadius: 4,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: "monospace",
                    transition: "all 0.12s",
                    letterSpacing: "0.02em",
                  }}
                >
                  <span style={{ marginRight: 5, fontSize: 10 }}>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 940, margin: "0 auto", padding: "20px 20px 40px" }}>
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 18,
            padding: "8px 12px",
            background: `${accent}0a`,
            border: `1px solid ${accent}20`,
            borderRadius: 6,
          }}
        >
          <span style={{ color: accent, fontSize: 13 }}>{tab.icon}</span>
          <span style={{ color: accent, fontWeight: 600, fontSize: 13, letterSpacing: "-0.01em" }}>
            {tab.label}
          </span>
          <span style={{ color: T.textDim, fontSize: 11, marginLeft: 4 }}>
            — {tab.sections.reduce((a, s) => a + s.questions.length, 0)} questions
          </span>
          <span style={{ color: T.textMuted, fontSize: 10, marginLeft: "auto", fontFamily: "monospace" }}>
            click any card to expand
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
          borderTop: `1px solid ${T.border}`,
          padding: "10px 20px",
          textAlign: "center",
          color: T.textMuted,
          fontSize: 11,
          fontFamily: "monospace",
        }}
      >
        flipkart prep · sde 1 frontend · explain your reasoning aloud, not just the answer
      </div>
    </div>
  );
}
