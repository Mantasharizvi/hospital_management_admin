import React, { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, Bed, X, User, Calendar, Stethoscope, Sparkles, AlertTriangle, ArrowLeft } from "lucide-react";

// ---- Mock data ---------------------------------------------------------

const WARDS = [
  {
    id: "icu",
    name: "ICU",
    tag: "Critical Care",
    total: 12,
    beds: [
      { id: "ICU-01", status: "occupied", patient: "Ramesh Gupta", pid: "P-10231", admitted: "10 Jul", doctor: "Dr. Aisha Verma", dischargeToday: false },
      { id: "ICU-02", status: "occupied", patient: "Sunita Rao", pid: "P-10238", admitted: "11 Jul", doctor: "Dr. Karan Mehta", dischargeToday: true },
      { id: "ICU-03", status: "vacant" },
      { id: "ICU-04", status: "occupied", patient: "Arjun Nair", pid: "P-10240", admitted: "09 Jul", doctor: "Dr. Aisha Verma", dischargeToday: false },
      { id: "ICU-05", status: "cleaning" },
      { id: "ICU-06", status: "occupied", patient: "Fatima Sheikh", pid: "P-10245", admitted: "12 Jul", doctor: "Dr. Priya Singh", dischargeToday: false },
      { id: "ICU-07", status: "reserved", patient: "Incoming: Deepak Joshi", pid: "P-10250" },
      { id: "ICU-08", status: "occupied", patient: "Meera Iyer", pid: "P-10233", admitted: "08 Jul", doctor: "Dr. Karan Mehta", dischargeToday: false },
      { id: "ICU-09", status: "vacant" },
      { id: "ICU-10", status: "occupied", patient: "Vikram Chawla", pid: "P-10236", admitted: "10 Jul", doctor: "Dr. Aisha Verma", dischargeToday: false },
      { id: "ICU-11", status: "occupied", patient: "Ayesha Khan", pid: "P-10248", admitted: "12 Jul", doctor: "Dr. Priya Singh", dischargeToday: false },
      { id: "ICU-12", status: "occupied", patient: "Naveen Rathi", pid: "P-10242", admitted: "09 Jul", doctor: "Dr. Karan Mehta", dischargeToday: false },
    ],
  },
  {
    id: "ward-a",
    name: "Ward A",
    tag: "General Care",
    total: 24,
    beds: Array.from({ length: 24 }, (_, i) => {
      const n = i + 1;
      if ([3, 9, 14, 18, 21, 22, 23].includes(n)) return { id: `A-${String(n).padStart(2, "0")}`, status: "vacant" };
      if ([7, 19].includes(n)) return { id: `A-${String(n).padStart(2, "0")}`, status: "cleaning" };
      if ([12].includes(n)) return { id: `A-${String(n).padStart(2, "0")}`, status: "reserved", patient: "Incoming: Rohan Das", pid: "P-10261" };
      return {
        id: `A-${String(n).padStart(2, "0")}`,
        status: "occupied",
        patient: ["Anil Kumar", "Pooja Sharma", "Sanjay Verma", "Kavita Joshi", "Rahul Mehta", "Divya Reddy", "Manoj Tiwari", "Neha Kapoor"][n % 8],
        pid: `P-10${300 + n}`,
        admitted: `${(n % 5) + 8} Jul`,
        doctor: ["Dr. Aisha Verma", "Dr. Karan Mehta", "Dr. Priya Singh"][n % 3],
        dischargeToday: n === 5 || n === 16,
      };
    }),
  },
  {
    id: "ward-b",
    name: "Ward B",
    tag: "Maternity",
    total: 18,
    beds: Array.from({ length: 18 }, (_, i) => {
      const n = i + 1;
      if ([2, 8, 15, 17].includes(n)) return { id: `B-${String(n).padStart(2, "0")}`, status: "vacant" };
      if ([11].includes(n)) return { id: `B-${String(n).padStart(2, "0")}`, status: "cleaning" };
      return {
        id: `B-${String(n).padStart(2, "0")}`,
        status: "occupied",
        patient: ["Shreya Pillai", "Anjali Bose", "Ritu Malhotra", "Simran Kaur", "Priyanka Nair"][n % 5],
        pid: `P-10${400 + n}`,
        admitted: `${(n % 4) + 9} Jul`,
        doctor: ["Dr. Priya Singh", "Dr. Aisha Verma"][n % 2],
        dischargeToday: n === 6,
      };
    }),
  },
];

// ---- Style tokens (matched to existing MediCore HMS shell) ------------

const STATUS_META = {
  occupied: { label: "Occupied", dot: "#0d9488", bg: "#ecfdf5", text: "#0f766e", border: "#99f6e4" },
  vacant: { label: "Vacant", dot: "#22c55e", bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0" },
  reserved: { label: "Reserved", dot: "#eab308", bg: "#fefce8", text: "#a16207", border: "#fde68a" },
  cleaning: { label: "Cleaning", dot: "#94a3b8", bg: "#f8fafc", text: "#475569", border: "#e2e8f0" },
};

function Dot({ color }) {
  return <span style={{ width: 8, height: 8, borderRadius: 999, background: color, display: "inline-block", flexShrink: 0 }} />;
}

function StatCard({ label, value, sub, accent }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e9ee", borderRadius: 10, padding: "14px 16px", flex: 1, minWidth: 140 }}>
      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 700, color: accent || "#0f172a", marginTop: 4 }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: "#94a3b8", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

function ProgressBar({ pct }) {
  const color = pct >= 90 ? "#dc2626" : pct >= 75 ? "#d97706" : "#0d9488";
  return (
    <div style={{ height: 8, background: "#e5e9ee", borderRadius: 999, overflow: "hidden", marginTop: 10 }}>
      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width 0.4s ease" }} />
    </div>
  );
}

function WardCard({ ward, onOpen }) {
  const occupied = ward.beds.filter((b) => b.status === "occupied").length;
  const pct = Math.round((occupied / ward.total) * 100);
  const alerts = ward.beds.filter((b) => b.dischargeToday).length;

  return (
    <button
      onClick={() => onOpen(ward.id)}
      style={{
        background: "#fff",
        border: "1px solid #e5e9ee",
        borderRadius: 12,
        padding: "18px 20px",
        textAlign: "left",
        cursor: "pointer",
        flex: "1 1 280px",
        minWidth: 260,
        transition: "box-shadow 0.15s ease, transform 0.15s ease",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(15,23,42,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>{ward.name}</span>
          {pct >= 90 && (
            <span title="Near capacity" style={{ display: "inline-flex", alignItems: "center", color: "#dc2626" }}>
              <AlertTriangle size={14} />
            </span>
          )}
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "#0d9488" }}>{ward.tag}</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{ fontSize: 13.5, color: "#475569" }}>Beds: {occupied}/{ward.total} occupied</span>
        {alerts > 0 && (
          <span style={{ fontSize: 11.5, color: "#a16207", background: "#fefce8", border: "1px solid #fde68a", borderRadius: 999, padding: "2px 8px", fontWeight: 600 }}>
            {alerts} discharge{alerts > 1 ? "s" : ""} today
          </span>
        )}
      </div>
      <ProgressBar pct={pct} />

      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 12, fontSize: 12.5, color: "#0d9488", fontWeight: 600 }}>
        View bed grid <ChevronRight size={14} />
      </div>
    </button>
  );
}

function BedTile({ bed, onSelect }) {
  const meta = STATUS_META[bed.status];
  return (
    <button
      onClick={() => onSelect(bed)}
      style={{
        background: meta.bg,
        border: `1px solid ${meta.border}`,
        borderRadius: 10,
        padding: "10px 10px 9px",
        cursor: "pointer",
        textAlign: "left",
        fontFamily: "inherit",
        position: "relative",
        transition: "transform 0.1s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {bed.dischargeToday && (
        <span style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: 999, background: "#dc2626" }} title="Discharge today" />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#0f172a" }}>
        <Bed size={13} color={meta.text} />
        {bed.id}
      </div>
      <div style={{ fontSize: 11, color: meta.text, fontWeight: 600, marginTop: 4 }}>{meta.label}</div>
      {bed.status === "occupied" && (
        <div style={{ fontSize: 11, color: "#475569", marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {bed.patient}
        </div>
      )}
      {bed.status === "reserved" && (
        <div style={{ fontSize: 10.5, color: "#a16207", marginTop: 3 }}>Reserved</div>
      )}
    </button>
  );
}

function BedDetailPanel({ bed, wardName, onClose }) {
  if (!bed) return null;
  const meta = STATUS_META[bed.status];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.35)",
        display: "flex",
        justifyContent: "flex-end",
        zIndex: 50,
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 340,
          maxWidth: "90vw",
          background: "#fff",
          height: "100%",
          padding: "22px 22px",
          boxShadow: "-8px 0 24px rgba(15,23,42,0.12)",
          overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>{wardName}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginTop: 2 }}>{bed.id}</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "#f1f5f9", borderRadius: 8, padding: 6, cursor: "pointer" }}>
            <X size={16} color="#475569" />
          </button>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14, padding: "4px 10px", borderRadius: 999, background: meta.bg, border: `1px solid ${meta.border}` }}>
          <Dot color={meta.dot} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: meta.text }}>{meta.label}</span>
        </div>

        {bed.status === "occupied" && (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <InfoRow icon={<User size={15} />} label="Patient" value={`${bed.patient} · ${bed.pid}`} />
            <InfoRow icon={<Calendar size={15} />} label="Admitted" value={bed.admitted} />
            <InfoRow icon={<Stethoscope size={15} />} label="Attending" value={bed.doctor} />
            {bed.dischargeToday && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#b91c1c", fontSize: 12.5, borderRadius: 8, padding: "8px 10px", fontWeight: 600 }}>
                Scheduled for discharge today
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
              <ActionButton label="Transfer patient" />
              <ActionButton label="Discharge patient" />
              <ActionButton label="View treatment records" variant="ghost" />
            </div>
          </div>
        )}

        {bed.status === "reserved" && (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
            <InfoRow icon={<User size={15} />} label="Reserved for" value={`${bed.patient.replace("Incoming: ", "")} · ${bed.pid}`} />
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 6 }}>
              <ActionButton label="Confirm admission" />
              <ActionButton label="Cancel reservation" variant="ghost" />
            </div>
          </div>
        )}

        {bed.status === "vacant" && (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>This bed is currently vacant and ready for a new admission.</p>
            <ActionButton label="Assign patient" />
            <ActionButton label="Mark for cleaning" variant="ghost" />
          </div>
        )}

        {bed.status === "cleaning" && (
          <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13 }}>
              <Sparkles size={15} /> Housekeeping in progress
            </div>
            <ActionButton label="Mark as vacant" />
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
      <span style={{ color: "#94a3b8", marginTop: 1 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13.5, color: "#0f172a", fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  );
}

function ActionButton({ label, variant }) {
  const isGhost = variant === "ghost";
  return (
    <button
      style={{
        border: isGhost ? "1px solid #e2e8f0" : "none",
        background: isGhost ? "#fff" : "#0d9488",
        color: isGhost ? "#334155" : "#fff",
        fontWeight: 600,
        fontSize: 13,
        padding: "9px 12px",
        borderRadius: 8,
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      {label}
    </button>
  );
}

// ---- Main page ----------------------------------------------------------

export default function WardManagement() {
  const [openWardId, setOpenWardId] = useState(null);
  const [selectedBed, setSelectedBed] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");

  const openWard = WARDS.find((w) => w.id === openWardId);

  const totals = useMemo(() => {
    const all = WARDS.flatMap((w) => w.beds);
    const total = all.length;
    const occupied = all.filter((b) => b.status === "occupied").length;
    const vacant = all.filter((b) => b.status === "vacant").length;
    const discharges = all.filter((b) => b.dischargeToday).length;
    return { total, occupied, vacant, discharges, pct: Math.round((occupied / total) * 100) };
  }, []);

  const filteredBeds = useMemo(() => {
    if (!openWard) return [];
    return openWard.beds.filter((b) => {
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const matchesQuery =
        !query ||
        b.id.toLowerCase().includes(query.toLowerCase()) ||
        (b.patient && b.patient.toLowerCase().includes(query.toLowerCase()));
      return matchesStatus && matchesQuery;
    });
  }, [openWard, statusFilter, query]);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif", background: "#f4f6f8", minHeight: "100%", padding: "24px 28px" }}>
      {/* Header */}
      {!openWard ? (
        <>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>Ward Management</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>Live bed occupancy across all wards.</p>
        </>
      ) : (
        <>
          <button
            onClick={() => { setOpenWardId(null); setStatusFilter("all"); setQuery(""); }}
            style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: "#0d9488", fontWeight: 600, fontSize: 13.5, cursor: "pointer", padding: 0, marginBottom: 10, fontFamily: "inherit" }}
          >
            <ArrowLeft size={15} /> All wards
          </button>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", margin: 0 }}>{openWard.name}</h1>
          <p style={{ fontSize: 14, color: "#64748b", marginTop: 4 }}>{openWard.tag} · {openWard.beds.filter(b=>b.status==='occupied').length}/{openWard.total} beds occupied</p>
        </>
      )}

      <div style={{ height: 1, background: "#e5e9ee", margin: "18px 0 22px" }} />

      {!openWard && (
        <>
          {/* Stats row */}
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
            <StatCard label="Total beds" value={totals.total} />
            <StatCard label="Occupied" value={totals.occupied} sub={`${totals.pct}% occupancy`} accent="#0d9488" />
            <StatCard label="Vacant" value={totals.vacant} accent="#15803d" />
            <StatCard label="Discharges today" value={totals.discharges} accent={totals.discharges > 0 ? "#b91c1c" : "#0f172a"} />
          </div>

          {/* Ward cards */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            {WARDS.map((w) => (
              <WardCard key={w.id} ward={w} onOpen={setOpenWardId} />
            ))}
          </div>
        </>
      )}

      {openWard && (
        <>
          {/* Toolbar: search + filter + legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 8, padding: "7px 12px", minWidth: 200 }}>
                <Search size={15} color="#94a3b8" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search bed or patient..."
                  style={{ border: "none", outline: "none", fontSize: 13, fontFamily: "inherit", width: "100%", background: "transparent" }}
                />
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["all", "occupied", "vacant", "reserved", "cleaning"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    style={{
                      border: "1px solid " + (statusFilter === s ? "#0d9488" : "#e2e8f0"),
                      background: statusFilter === s ? "#0d9488" : "#fff",
                      color: statusFilter === s ? "#fff" : "#475569",
                      fontSize: 12.5,
                      fontWeight: 600,
                      padding: "6px 12px",
                      borderRadius: 999,
                      cursor: "pointer",
                      textTransform: "capitalize",
                      fontFamily: "inherit",
                    }}
                  >
                    {s === "all" ? "All beds" : STATUS_META[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              {Object.entries(STATUS_META).map(([key, m]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12, color: "#64748b" }}>
                  <Dot color={m.dot} /> {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* Bed grid */}
          {filteredBeds.length === 0 ? (
            <div style={{ padding: "40px 0", textAlign: "center", color: "#94a3b8", fontSize: 13.5 }}>
              No beds match your filters.
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 10 }}>
              {filteredBeds.map((bed) => (
                <BedTile key={bed.id} bed={bed} onSelect={setSelectedBed} />
              ))}
            </div>
          )}
        </>
      )}

      <BedDetailPanel bed={selectedBed} wardName={openWard?.name} onClose={() => setSelectedBed(null)} />
    </div>
  );
}
