import React, { useState, useEffect, useRef, useCallback } from "react";

/**
 * GlobalSearch — top-bar search for MediCore HMS
 * -------------------------------------------------
 * Drop this into your header/topbar in place of the static <input>.
 *
 * WIRE-UP:
 * 1. Point `SEARCH_ENDPOINT` at your real API (see server sketch below the component).
 * 2. Replace `mockFetch` calls with real `fetch()` once the endpoint exists —
 *    just delete the "DEV MOCK" block and uncomment the real fetch block.
 * 3. Wire `onSelect` to your router (react-router / next/navigation / etc).
 *
 * FEATURES:
 * - Debounced search-as-you-type (250ms)
 * - Abortable in-flight requests (no race conditions on fast typing)
 * - Grouped, categorized results (Patients / Doctors / Appointments / Medicines / Billing)
 * - Keyboard nav: ArrowUp/Down to move, Enter to select, Escape to close
 * - Matched-text highlighting
 * - Loading, empty, and error states
 * - Recent searches (persisted per-session via component state; swap in
 *   localStorage/your backend if you want it to survive reloads)
 * - Click-outside-to-close
 * - Accessible: role="combobox"/"listbox", aria-activedescendant
 */

const SEARCH_ENDPOINT = "/api/search"; // your backend route
const DEBOUNCE_MS = 250;
const MIN_QUERY_LENGTH = 1;

const CATEGORY_META = {
  patients: { label: "Patients", icon: "👤" },
  doctors: { label: "Doctors", icon: "🩺" },
  appointments: { label: "Appointments", icon: "📅" },
  medicines: { label: "Medicines", icon: "💊" },
  billing: { label: "Billing", icon: "🧾" },
};

// ---------------------------------------------------------------------------
// DEV MOCK — remove this whole block once SEARCH_ENDPOINT is live.
// It simulates network latency and filters an in-memory dataset so the
// component is fully testable without a backend.
// ---------------------------------------------------------------------------
const MOCK_DB = [
  { id: "P-1001", category: "patients", title: "Ravi Kumar", subtitle: "ICU-3 · Cardiology · Dr. Sen" },
  { id: "P-1002", category: "patients", title: "Meena Shah", subtitle: "General-12 · Observation · Dr. Verma" },
  { id: "P-1003", category: "patients", title: "Arjun Nair", subtitle: "General-4 · Orthopedics · Dr. Rao" },
  { id: "P-1004", category: "patients", title: "Sunita Roy", subtitle: "ICU-1 · Critical · Dr. Sen" },
  { id: "P-1005", category: "patients", title: "Aditya Verma", subtitle: "General-7 · Neurology · Dr. Iyer" },
  { id: "P-1006", category: "patients", title: "Neha Kapoor", subtitle: "OPD · 2:00 PM · Dr. Sen" },
  { id: "D-01", category: "doctors", title: "Dr. Aisha Verma", subtitle: "Administrator" },
  { id: "D-02", category: "doctors", title: "Dr. Sen", subtitle: "Cardiology" },
  { id: "D-03", category: "doctors", title: "Dr. Rao", subtitle: "Orthopedics" },
  { id: "D-04", category: "doctors", title: "Dr. Iyer", subtitle: "Neurology" },
  { id: "A-201", category: "appointments", title: "Neha Kapoor — Dr. Sen", subtitle: "Today · 2:00 PM" },
  { id: "A-202", category: "appointments", title: "Vikram Malhotra — Dr. Verma", subtitle: "Today · 2:30 PM" },
  { id: "M-01", category: "medicines", title: "Paracetamol 500mg", subtitle: "Low stock · 42 units left" },
  { id: "M-02", category: "medicines", title: "Amoxicillin 250mg", subtitle: "Batch B-2291 · Expires 12 Aug" },
  { id: "M-03", category: "medicines", title: "Insulin Glargine", subtitle: "Batch B-1187 · Expires 28 Jul" },
  { id: "B-01", category: "billing", title: "Pending bills", subtitle: "₹1,24,300 total outstanding" },
  { id: "B-02", category: "billing", title: "Meena Shah invoice", subtitle: "General ward · Unpaid" },
];

function mockFetch(query, signal) {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      const q = query.toLowerCase();
      const results = MOCK_DB.filter(
        (r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
      );
      resolve({ ok: true, json: async () => ({ results }) });
    }, 300 + Math.random() * 200);
    signal.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new DOMException("Aborted", "AbortError"));
    });
  });
}
// ---------------------------------------------------------------------------
// END DEV MOCK
// ---------------------------------------------------------------------------

function highlight(text, term) {
  if (!term) return text;
  const idx = text.toLowerCase().indexOf(term.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="gs-highlight">{text.slice(idx, idx + term.length)}</mark>
      {text.slice(idx + term.length)}
    </>
  );
}

function groupResults(results) {
  const groups = {};
  results.forEach((r) => {
    if (!groups[r.category]) groups[r.category] = [];
    groups[r.category].push(r);
  });
  // stable category order
  return Object.keys(CATEGORY_META)
    .filter((cat) => groups[cat]?.length)
    .map((cat) => ({ category: cat, items: groups[cat] }));
}

export default function GlobalSearch({ onSelect, placeholder = "Search records..." }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [recent, setRecent] = useState([]);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const flatResults = groupResults(results).flatMap((g) => g.items);

  const runSearch = useCallback((q) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setStatus("loading");
    mockFetch(q, controller.signal)
      // Swap the line above for the real call once your endpoint exists:
      // fetch(`${SEARCH_ENDPOINT}?q=${encodeURIComponent(q)}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        setResults(data.results || []);
        setStatus("success");
      })
      .catch((err) => {
        if (err.name === "AbortError") return; // superseded by newer keystroke
        setStatus("error");
        setResults([]);
      });
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (query.trim().length < MIN_QUERY_LENGTH) {
      setResults([]);
      setStatus("idle");
      return;
    }
    debounceRef.current = setTimeout(() => runSearch(query.trim()), DEBOUNCE_MS);
    return () => clearTimeout(debounceRef.current);
  }, [query, runSearch]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(item) {
    setRecent((prev) => [item, ...prev.filter((r) => r.id !== item.id)].slice(0, 5));
    setQuery("");
    setIsOpen(false);
    setActiveIndex(-1);
    onSelect?.(item);
  }

  function handleKeyDown(e) {
    if (!isOpen) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatResults.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && flatResults[activeIndex]) handleSelect(flatResults[activeIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  }

  const grouped = groupResults(results);
  const showRecent = !query && recent.length > 0;
  const showEmptyHint = !query && recent.length === 0;
  const showNoResults = query && status === "success" && results.length === 0;

  return (
    <div className="gs-root" ref={containerRef}>
      <div className="gs-inputwrap">
        <span className="gs-icon" aria-hidden="true">
          🔍
        </span>
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="gs-listbox"
          aria-autocomplete="list"
          aria-activedescendant={activeIndex >= 0 ? `gs-opt-${activeIndex}` : undefined}
          className="gs-input"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
        />
        {query && (
          <button
            className="gs-clear"
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setResults([]);
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        )}
      </div>

      {isOpen && (
        <div className="gs-panel" id="gs-listbox" role="listbox">
          {status === "loading" && <div className="gs-status">Searching…</div>}

          {status === "error" && (
            <div className="gs-status gs-error">
              Couldn't complete the search. <button onClick={() => runSearch(query)}>Retry</button>
            </div>
          )}

          {showEmptyHint && (
            <div className="gs-status">Start typing to search patients, doctors, medicines and bills.</div>
          )}

          {showRecent && (
            <>
              <div className="gs-group-label">Recent</div>
              {recent.map((item, i) => (
                <ResultRow
                  key={item.id}
                  item={item}
                  term=""
                  active={i === activeIndex}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setActiveIndex(i)}
                  domId={`gs-opt-${i}`}
                />
              ))}
            </>
          )}

          {showNoResults && (
            <div className="gs-status">
              No results for "<strong>{query}</strong>". Try a patient, doctor, or medicine name.
            </div>
          )}

          {status === "success" &&
            grouped.map((group) => (
              <div key={group.category}>
                <div className="gs-group-label">
                  {CATEGORY_META[group.category]?.icon} {CATEGORY_META[group.category]?.label ?? group.category}
                </div>
                {group.items.map((item) => {
                  const flatIdx = flatResults.findIndex((r) => r.id === item.id);
                  return (
                    <ResultRow
                      key={item.id}
                      item={item}
                      term={query}
                      active={flatIdx === activeIndex}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(flatIdx)}
                      domId={`gs-opt-${flatIdx}`}
                    />
                  );
                })}
              </div>
            ))}
        </div>
      )}

      <style>{`
        .gs-root { position: relative; width: 100%; max-width: 420px; font-family: inherit; }
        .gs-inputwrap {
          display: flex; align-items: center; gap: 8px;
          background: #f4f5f7; border: 1px solid #e3e5e9; border-radius: 8px;
          padding: 0 12px; height: 40px;
        }
        .gs-inputwrap:focus-within { border-color: #0f6e56; background: #fff; }
        .gs-icon { font-size: 15px; opacity: 0.6; }
        .gs-input {
          flex: 1; border: none; background: transparent; outline: none;
          font-size: 14px; height: 100%; color: #1a1a1a;
        }
        .gs-clear {
          border: none; background: transparent; cursor: pointer;
          color: #8a8f98; font-size: 13px; padding: 4px;
        }
        .gs-panel {
          position: absolute; top: 46px; left: 0; right: 0;
          background: #fff; border: 1px solid #e3e5e9; border-radius: 10px;
          max-height: 420px; overflow-y: auto; z-index: 50;
          box-shadow: 0 8px 24px rgba(0,0,0,0.10);
        }
        .gs-group-label {
          padding: 8px 12px 4px; font-size: 11.5px; font-weight: 600;
          color: #8a8f98; text-transform: uppercase; letter-spacing: 0.03em;
        }
        .gs-status { padding: 20px 16px; text-align: center; font-size: 13px; color: #8a8f98; }
        .gs-error button { margin-left: 6px; color: #0f6e56; background: none; border: none; cursor: pointer; text-decoration: underline; }
        .gs-highlight { background: #ffe1a8; color: #1a1a1a; border-radius: 2px; padding: 0 1px; }
      `}</style>
    </div>
  );
}

function ResultRow({ item, term, active, onClick, onMouseEnter, domId }) {
  return (
    <div
      id={domId}
      role="option"
      aria-selected={active}
      className="gs-row"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        margin: "0 4px",
        borderRadius: 6,
        cursor: "pointer",
        background: active ? "#f0f2f4" : "transparent",
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: "#1a1a1a" }}>{highlight(item.title, term)}</div>
        <div style={{ fontSize: 12, color: "#8a8f98" }}>{item.subtitle}</div>
      </div>
    </div>
  );
}
