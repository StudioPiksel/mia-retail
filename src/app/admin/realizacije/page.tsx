"use client";
import { useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Realizacija = {
  id: string; name: string; country: string; images: string;
  categories: string; order: number; published: boolean;
};

const CATS = [
  { key: "supermarketi", label: "Supermarketi" },
  { key: "police", label: "Police" },
  { key: "korpe", label: "Korpe" },
  { key: "horeca", label: "HoReCa" },
];

const emptyForm = { name: "", country: "", images: "[]", categories: "[]", published: true };

function SortableCard({ item, onEdit, onDelete, onToggle }: {
  item: Realizacija;
  onEdit: (r: Realizacija) => void;
  onDelete: (id: string) => void;
  onToggle: (r: Realizacija) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const imgs: string[] = (() => { try { return JSON.parse(item.images); } catch { return []; } })();
  const cats: string[] = (() => { try { return JSON.parse(item.categories); } catch { return []; } })();

  return (
    <div ref={setNodeRef} style={{
      transform: CSS.Transform.toString(transform), transition,
      opacity: isDragging ? 0.5 : item.published ? 1 : 0.6,
      background: "#fff", borderRadius: 12, border: "1px solid #E2E8ED",
      overflow: "hidden", display: "flex", flexDirection: "column",
      boxShadow: isDragging ? "0 8px 24px rgba(11,29,51,0.15)" : "none",
    }}>
      {/* Drag handle + image */}
      <div {...attributes} {...listeners} style={{ cursor: "grab", position: "relative" }}>
        <div style={{ height: 140, background: "#F8FAFB", overflow: "hidden" }}>
          {imgs[0] ? (
            <img src={imgs[0]} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#CBD5DC", fontSize: 32 }}>🖼</div>
          )}
        </div>
        {imgs.length > 1 && (
          <div style={{ position: "absolute", bottom: 8, right: 8, background: "rgba(11,29,51,0.7)", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 20 }}>
            {imgs.length} slike
          </div>
        )}
        <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(11,29,51,0.6)", color: "#fff", fontSize: 11, padding: "2px 8px", borderRadius: 4 }}>
          ⠿ prevuci
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px", flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#0B1D33" }}>{item.name}</div>
        <div style={{ fontSize: 13, color: "#6B7B8A", marginTop: 2 }}>{item.country}</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
          {cats.map(c => (
            <span key={c} style={{ padding: "2px 8px", background: "#C7F1E6", color: "#0A5C56", borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
              {CATS.find(x => x.key === c)?.label ?? c}
            </span>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid #F1F5F7", display: "flex", gap: 6, alignItems: "center" }}>
        <button onClick={() => onToggle(item)} style={{
          padding: "5px 10px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 500,
          background: item.published ? "#DCFCE7" : "#F1F5F7", color: item.published ? "#16A34A" : "#6B7B8A",
        }}>{item.published ? "✓ Aktivan" : "○ Skriven"}</button>
        <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
          <button onClick={() => onEdit(item)} style={{ padding: "5px 12px", background: "#E6EEF2", color: "#0B1D33", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 500 }}>Uredi</button>
          <button onClick={() => onDelete(item.id)} style={{ padding: "5px 10px", background: "#FEF2F2", color: "#DC2626", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>✕</button>
        </div>
      </div>
    </div>
  );
}

function Modal({ item, onSave, onClose }: { item: Realizacija | null; onSave: (data: Partial<Realizacija>) => void; onClose: () => void }) {
  const [form, setForm] = useState(item ?? emptyForm as unknown as Realizacija);
  const [imgInput, setImgInput] = useState("");
  const [imgsList, setImgsList] = useState<string[]>(() => { try { return JSON.parse((item ?? emptyForm).images); } catch { return []; } });
  const [cats, setCats] = useState<string[]>(() => { try { return JSON.parse((item ?? emptyForm).categories); } catch { return []; } });

  function toggleCat(key: string) { setCats(c => c.includes(key) ? c.filter(x => x !== key) : [...c, key]); }
  function addImg() { if (imgInput.trim()) { setImgsList(l => [...l, imgInput.trim()]); setImgInput(""); } }
  function removeImg(i: number) { setImgsList(l => l.filter((_, idx) => idx !== i)); }

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(11,29,51,0.5)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#fff", borderRadius: 16, padding: 28, width: 520, maxWidth: "95vw",
        maxHeight: "90vh", overflowY: "auto", fontFamily: "'Satoshi', sans-serif",
        boxShadow: "0 24px 64px rgba(11,29,51,0.25)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0B1D33", margin: 0 }}>
            {item ? "Uredi realizaciju" : "Nova realizacija"}
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color: "#6B7B8A" }}>×</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={lbl}>Naziv *</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="npr. EDEKA" style={inp} />
            </div>
            <div>
              <label style={lbl}>Zemlja *</label>
              <input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} placeholder="npr. Njemačka" style={inp} />
            </div>
          </div>

          <div>
            <label style={lbl}>Kategorije</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {CATS.map(c => (
                <button key={c.key} type="button" onClick={() => toggleCat(c.key)} style={{
                  padding: "6px 14px", borderRadius: 20, border: "1.5px solid",
                  borderColor: cats.includes(c.key) ? "#0F766E" : "#E2E8ED",
                  background: cats.includes(c.key) ? "#C7F1E6" : "#fff",
                  color: cats.includes(c.key) ? "#0A5C56" : "#6B7B8A",
                  cursor: "pointer", fontSize: 13, fontFamily: "'Satoshi', sans-serif"
                }}>{c.label}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={lbl}>Slike ({imgsList.length})</label>
            <p style={{ fontSize: 12, color: "#6B7B8A", marginBottom: 8 }}>Prva slika = thumbnail kartica. Ostale = lightbox.</p>
            {imgsList.map((img, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, padding: "6px 8px", background: "#F8FAFB", borderRadius: 8 }}>
                <img src={img} alt="" style={{ width: 48, height: 36, objectFit: "cover", borderRadius: 4, flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: "#6B7B8A", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{img.split("/").pop()}</span>
                {i > 0 && <button onClick={() => { const l=[...imgsList]; [l[i-1],l[i]]=[l[i],l[i-1]]; setImgsList(l); }} style={iconBtn}>↑</button>}
                {i < imgsList.length-1 && <button onClick={() => { const l=[...imgsList]; [l[i],l[i+1]]=[l[i+1],l[i]]; setImgsList(l); }} style={iconBtn}>↓</button>}
                <button onClick={() => removeImg(i)} style={{ ...iconBtn, color: "#DC2626" }}>✕</button>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
              <input value={imgInput} onChange={e => setImgInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addImg()}
                placeholder="/assets/images/reference/naziv.jpg" style={{ ...inp, flex: 1, fontSize: 12 }} />
              <button onClick={addImg} style={{ ...btnPrimary, padding: "8px 14px", fontSize: 13 }}>+</button>
            </div>
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
            <span style={{ fontSize: 14, color: "#374151" }}>Vidljivo na sajtu</span>
          </label>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{ ...btnGhost, flex: 1 }}>Odustani</button>
          <button onClick={() => onSave({ ...form, images: JSON.stringify(imgsList), categories: JSON.stringify(cats) })} style={{ ...btnPrimary, flex: 2 }}>
            Sačuvaj
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RealizacijeAdmin() {
  const [items, setItems] = useState<Realizacija[]>([]);
  const [editing, setEditing] = useState<Realizacija | null | "new">(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  async function load() {
    const all = await fetch("/api/realizacije").then(r => r.json());
    setItems(all);
  }
  useEffect(() => { load(); }, []);

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const old = items.findIndex(i => i.id === active.id);
    const next = items.findIndex(i => i.id === over.id);
    const reordered = arrayMove(items, old, next);
    setItems(reordered);
    await fetch("/api/realizacije", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items: reordered.map((i, idx) => ({ id: i.id, order: idx })) }) });
  }

  async function handleSave(data: Partial<Realizacija>) {
    if (editing === "new") {
      await fetch("/api/realizacije", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    } else if (editing) {
      await fetch(`/api/realizacije/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    }
    setEditing(null);
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Obrisati realizaciju?")) return;
    await fetch(`/api/realizacije/${id}`, { method: "DELETE" });
    await load();
  }

  async function handleToggle(item: Realizacija) {
    await fetch(`/api/realizacije/${item.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !item.published }) });
    await load();
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#0B1D33", margin: 0 }}>Realizacije</h1>
          <p style={{ color: "#6B7B8A", fontSize: 14, marginTop: 4 }}>{items.length} realizacija · prevuci za promjenu redoslijeda</p>
        </div>
        <button onClick={() => setEditing("new")} style={btnPrimary}>+ Nova realizacija</button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(i => i.id)} strategy={rectSortingStrategy}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {items.map(item => (
              <SortableCard key={item.id} item={item} onEdit={setEditing} onDelete={handleDelete} onToggle={handleToggle} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {editing !== null && (
        <Modal item={editing === "new" ? null : editing} onSave={handleSave} onClose={() => setEditing(null)} />
      )}
    </div>
  );
}

const lbl: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 6 };
const inp: React.CSSProperties = { width: "100%", padding: "10px 14px", border: "1.5px solid #E2E8ED", borderRadius: 8, fontSize: 14, fontFamily: "'Satoshi', sans-serif", outline: "none", boxSizing: "border-box", color: "#111827", background: "#fff", display: "block" };
const btnPrimary: React.CSSProperties = { padding: "10px 22px", background: "#0F766E", color: "#fff", border: "none", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" };
const btnGhost: React.CSSProperties = { padding: "10px 18px", border: "1.5px solid #E2E8ED", background: "#fff", borderRadius: 8, fontSize: 14, cursor: "pointer", fontFamily: "'Satoshi', sans-serif" };
const iconBtn: React.CSSProperties = { width: 24, height: 24, background: "#E6EEF2", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", padding: 0 };
