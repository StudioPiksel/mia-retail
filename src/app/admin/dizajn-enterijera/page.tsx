"use client";
import { useEffect, useState, useCallback } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, useSortable, rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Project = { id: string; caption: string; overlayLabel: string; image: string; order: number; published: boolean; };
type Studio = { id: string; badge: string; name: string; tag: string; order: number; projects: Project[]; };

function SortableProject({ p, onDelete, onToggle }: { p: Project; onDelete: (id: string) => void; onToggle: (p: Project) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: p.id });
  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition,
      opacity: isDragging ? 0.5 : p.published ? 1 : 0.55,
      background: "#fff", borderRadius: 10, border: "1px solid #E2E8ED",
      overflow: "hidden", display: "flex", flexDirection: "column",
      boxShadow: isDragging ? "0 8px 20px rgba(11,29,51,0.15)" : "none",
    }}>
      <div {...attributes} {...listeners} style={{ cursor: "grab", height: 110, overflow: "hidden", position: "relative" }}>
        {p.image ? (
          <img src={p.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <div style={{ height: "100%", background: "#F8FAFB", display: "flex", alignItems: "center", justifyContent: "center", color: "#CBD5DC", fontSize: 28 }}>🖼</div>
        )}
        <div style={{ position: "absolute", top: 6, left: 6, background: "rgba(11,29,51,0.6)", color: "#fff", fontSize: 10, padding: "2px 7px", borderRadius: 4 }}>⠿</div>
      </div>
      <div style={{ padding: "8px 10px", flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "#0B1D33", lineHeight: 1.3 }}>{p.overlayLabel}</div>
        <div style={{ fontSize: 11, color: "#6B7B8A", marginTop: 2 }}>{p.caption.slice(0, 50)}{p.caption.length > 50 ? "..." : ""}</div>
      </div>
      <div style={{ padding: "7px 10px", borderTop: "1px solid #F1F5F7", display: "flex", gap: 5 }}>
        <button onClick={() => onToggle(p)} style={{ flex: 1, padding: "4px 6px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 10, fontWeight: 500, background: p.published ? "#DCFCE7" : "#F1F5F7", color: p.published ? "#16A34A" : "#6B7B8A" }}>
          {p.published ? "✓" : "○"}
        </button>
        <button onClick={() => onDelete(p.id)} style={{ padding: "4px 8px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>✕</button>
      </div>
    </div>
  );
}

function AddProjectForm({ studioId, onAdded }: { studioId: string; onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ caption: "", overlayLabel: "", image: "" });
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!form.image.trim() || !form.overlayLabel.trim()) return;
    setSaving(true);
    await fetch(`/api/design-studios/${studioId}/projects`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form),
    });
    setForm({ caption: "", overlayLabel: "", image: "" });
    setOpen(false);
    setSaving(false);
    onAdded();
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ width: "100%", padding: "16px", border: "2px dashed #E2E8ED", borderRadius: 10, background: "transparent", cursor: "pointer", color: "#6B7B8A", fontSize: 14, fontFamily: "'Satoshi', sans-serif" }}>
      + Dodaj projekat
    </button>
  );

  return (
    <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #E2E8ED", padding: 16 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input value={form.overlayLabel} onChange={e => setForm({ ...form, overlayLabel: e.target.value })}
          placeholder="Naziv (overlay)" style={inp} />
        <input value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })}
          placeholder="Caption (opis za lightbox)" style={inp} />
        <ImageUpload value={form.image} onChange={v => setForm({ ...form, image: v })} maxWidthPx={900} qualityWebp={0.85} />
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setOpen(false)} style={btnGhost}>Odustani</button>
          <button onClick={handleAdd} disabled={saving} style={btnPrimary}>
            {saving ? "Čuvanje..." : "Dodaj"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DizajnEnterijeraAdmin() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  // New studio state
  const [showNewStudio, setShowNewStudio] = useState(false);
  const [newStudio, setNewStudio] = useState({ badge: "", name: "", tag: "" });
  const [savingStudio, setSavingStudio] = useState(false);

  // Edit studio state
  const [editingStudio, setEditingStudio] = useState<Studio | null>(null);
  const [editForm, setEditForm] = useState({ badge: "", name: "", tag: "" });

  const load = useCallback(async () => {
    const res = await fetch("/api/design-studios-admin");
    if (res.ok) setStudios(await res.json());
    else {
      const r2 = await fetch("/api/design-studios");
      setStudios(await r2.json());
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  async function createStudio() {
    if (!newStudio.name.trim() || !newStudio.badge.trim()) return;
    setSavingStudio(true);
    await fetch("/api/design-studios", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStudio),
    });
    setNewStudio({ badge: "", name: "", tag: "" });
    setShowNewStudio(false);
    setSavingStudio(false);
    await load();
  }

  async function updateStudio() {
    if (!editingStudio) return;
    setSavingStudio(true);
    await fetch("/api/design-studios", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: editingStudio.id, ...editForm }),
    });
    setEditingStudio(null);
    setSavingStudio(false);
    await load();
  }

  async function deleteStudio(studio: Studio) {
    if (studio.projects.length > 0) {
      alert(`Studio "${studio.name}" ima ${studio.projects.length} projekata. Obrišite ih prvo.`);
      return;
    }
    if (!confirm(`Obrisati studio "${studio.name}"?`)) return;
    const res = await fetch("/api/design-studios", {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: studio.id }),
    });
    if (!res.ok) { const e = await res.json(); alert(e.error); return; }
    await load();
  }

  async function handleDragEnd(studioId: string, e: DragEndEvent, projects: Project[]) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const old = projects.findIndex(p => p.id === active.id);
    const next = projects.findIndex(p => p.id === over.id);
    const reordered = arrayMove(projects, old, next);
    setStudios(s => s.map(st => st.id === studioId ? { ...st, projects: reordered } : st));
    await fetch(`/api/design-studios/${studioId}/projects`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: reordered.map((p, i) => ({ id: p.id, order: i })) }),
    });
  }

  async function handleDelete(studioId: string, pid: string) {
    if (!confirm("Obrisati projekat?")) return;
    await fetch(`/api/design-studios/${studioId}/projects/${pid}`, { method: "DELETE" });
    await load();
  }

  async function handleToggle(studioId: string, p: Project) {
    await fetch(`/api/design-studios/${studioId}/projects/${p.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !p.published }),
    });
    await load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Dizajn enterijera</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>Upravljanje design studijima i projektima · prevuci za promjenu redoslijeda</p>
        </div>
        <button onClick={() => setShowNewStudio(s => !s)} style={{ padding: "11px 22px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" }}>
          + Novi partner / studio
        </button>
      </div>

      {/* New studio form */}
      {showNewStudio && (
        <div style={{ background: "#F0FDF4", borderRadius: 12, border: "1.5px solid #BBF7D0", padding: 24, marginBottom: 24 }}>
          <strong style={{ fontSize: 15, color: "#0B1D33", display: "block", marginBottom: 16 }}>Novi design partner</strong>
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 2fr", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={lbl}>Badge (2-3 sl.)</label>
              <input value={newStudio.badge} onChange={e => setNewStudio({ ...newStudio, badge: e.target.value.toUpperCase().slice(0, 3) })}
                placeholder="DZ" style={inp} maxLength={3} />
            </div>
            <div>
              <label style={lbl}>Naziv studija *</label>
              <input value={newStudio.name} onChange={e => setNewStudio({ ...newStudio, name: e.target.value })}
                placeholder="STUDIO NAME" style={inp} />
            </div>
            <div>
              <label style={lbl}>Kratki opis / tag</label>
              <input value={newStudio.tag} onChange={e => setNewStudio({ ...newStudio, tag: e.target.value })}
                placeholder="Internacionalni retail design studio · ..." style={inp} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => { setShowNewStudio(false); setNewStudio({ badge: "", name: "", tag: "" }); }} style={btnGhost}>Odustani</button>
            <button onClick={createStudio} disabled={savingStudio || !newStudio.name || !newStudio.badge} style={btnPrimary}>
              {savingStudio ? "Kreiranje..." : "Kreiraj studio"}
            </button>
          </div>
        </div>
      )}

      {/* Edit studio modal */}
      {editingStudio && (
        <>
          <div onClick={() => setEditingStudio(null)} style={{ position: "fixed", inset: 0, background: "rgba(11,29,51,0.4)", zIndex: 9998 }} />
          <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", background: "#fff", borderRadius: 16, padding: 28, width: 520, zIndex: 9999, fontFamily: "'Satoshi', sans-serif", boxShadow: "0 24px 64px rgba(11,29,51,0.2)" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0B1D33", margin: "0 0 20px" }}>Uredi studio</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: 12 }}>
                <div>
                  <label style={lbl}>Badge</label>
                  <input value={editForm.badge} onChange={e => setEditForm({ ...editForm, badge: e.target.value.toUpperCase().slice(0, 3) })} maxLength={3} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Naziv</label>
                  <input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} style={inp} />
                </div>
              </div>
              <div>
                <label style={lbl}>Opis / tag linija</label>
                <input value={editForm.tag} onChange={e => setEditForm({ ...editForm, tag: e.target.value })} style={inp} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setEditingStudio(null)} style={{ ...btnGhost, flex: 1 }}>Odustani</button>
              <button onClick={updateStudio} disabled={savingStudio} style={{ ...btnPrimary, flex: 2 }}>
                {savingStudio ? "Čuvanje..." : "Sačuvaj"}
              </button>
            </div>
          </div>
        </>
      )}

      {studios.map(studio => (
        <div key={studio.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED", marginBottom: 28, overflow: "hidden" }}>
          {/* Studio header */}
          <div style={{ padding: "18px 24px", borderBottom: "1px solid #E2E8ED", display: "flex", alignItems: "center", gap: 14, background: "#F8FAFB" }}>
            <div style={{ width: 44, height: 44, background: "#0B1D33", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#C7F1E6", fontWeight: 800, fontSize: 15, flexShrink: 0 }}>
              {studio.badge}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#0B1D33" }}>{studio.name}</div>
              <div style={{ fontSize: 12, color: "#6B7B8A", marginTop: 2 }}>{studio.tag}</div>
            </div>
            <span style={{ background: "#C7F1E6", color: "#0A5C56", padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
              {studio.projects.filter(p => p.published).length} / {studio.projects.length} projekata
            </span>
            {/* Studio actions */}
            <button onClick={() => { setEditingStudio(studio); setEditForm({ badge: studio.badge, name: studio.name, tag: studio.tag }); }}
              style={{ padding: "6px 14px", background: "#E6EEF2", color: "#0B1D33", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif" }}>
              ✏️ Uredi
            </button>
            <button onClick={() => deleteStudio(studio)}
              style={{ padding: "6px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 7, cursor: "pointer", fontSize: 13 }}
              title="Obriši studio (samo ako nema projekata)">
              🗑
            </button>
          </div>

          {/* Project grid */}
          <div style={{ padding: 20 }}>
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={e => handleDragEnd(studio.id, e, studio.projects)}
            >
              <SortableContext items={studio.projects.map(p => p.id)} strategy={rectSortingStrategy}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 12 }}>
                  {studio.projects.map(p => (
                    <SortableProject
                      key={p.id} p={p}
                      onDelete={pid => handleDelete(studio.id, pid)}
                      onToggle={p => handleToggle(studio.id, p)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
            <AddProjectForm studioId={studio.id} onAdded={load} />
          </div>
        </div>
      ))}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 500, color: "#374151", marginBottom: 5 };
const inp: React.CSSProperties = { width: "100%", padding: "9px 12px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 13, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" };
const btnPrimary: React.CSSProperties = { flex: 1, padding: "9px 18px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" };
const btnGhost: React.CSSProperties = { padding: "9px 16px", border: "1.5px solid #E2E8ED", background: "#fff", borderRadius: 8, fontSize: 13, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" };
