import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  listNotes,
  createNote,
  updateNote,
  deleteNote,
} from "../services/notes";
import type { Note } from "../types";
import { Plus, Trash2 } from "lucide-react";

export default function Notes() {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  async function load() {
    if (user) setNotes(await listNotes(user.id));
  }
  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [user?.id]);

  function openNote(n: Note) {
    setSelected(n);
    setTitle(n.title);
    setContent(n.content);
  }
  function newNote() {
    setSelected(null);
    setTitle("");
    setContent("");
  }

  async function save() {
    if (!title.trim()) return;
    if (selected) {
      await updateNote(selected.id, { title, content });
    } else {
      await createNote({ title, content });
    }
    await load();
    setSelected(null);
    setTitle("");
    setContent("");
  }

  async function remove(id: string) {
    await deleteNote(id);
    await load();
    if (selected?.id === id) newNote();
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notes</h1>
        <button className="btn-primary" onClick={newNote}>
          <Plus size={16} /> Новая заметка
        </button>
      </div>

      <div className="grid md:grid-cols-[300px_1fr] gap-4">
        <div className="card space-y-2 max-h-[70vh] overflow-y-auto">
          {notes.length === 0 && <p className="text-muted text-sm">Пусто.</p>}
          {notes.map((n) => (
            <button
              key={n.id}
              onClick={() => openNote(n)}
              className={`w-full text-left p-3 rounded-xl border transition ${selected?.id === n.id ? "border-accent bg-accent/10" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
            >
              <div className="font-medium truncate">{n.title}</div>
              <div className="text-xs text-muted truncate">
                {n.content?.slice(0, 60)}
              </div>
            </button>
          ))}
        </div>

        <div className="card space-y-3">
          <input
            className="input text-lg font-semibold"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="input min-h-[40vh]"
            placeholder="Текст заметки…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex gap-2">
            <button className="btn-primary" onClick={save}>
              {selected ? "Сохранить" : "Создать"}
            </button>
            {selected && (
              <button
                className="btn-danger"
                onClick={() => remove(selected.id)}
              >
                <Trash2 size={16} /> Удалить
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
