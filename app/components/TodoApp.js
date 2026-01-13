"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, Check, X } from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
  const [slug, setSlug] = useState("");
  const [editId, setEditId] = useState(null);

  // Fetch todos
  useEffect(() => {
    fetch("/api/todos")
      .then(res => res.json())
      .then(data => setTodos(data));
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);
    setSlug(value.toLowerCase().trim().replace(/\s+/g, "-"));
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;

    if (editId) {
      await fetch("/api/todos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editId, text, slug }),
      });

      setTodos(todos.map(t =>
        t._id === editId ? { ...t, text, slug } : t
      ));
      setEditId(null);
    } else {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, slug }),
      });

      const newTodo = await res.json();
      setTodos([...todos, newTodo]);
    }

    setText("");
    setSlug("");
  };

  const handleDelete = async (id) => {
    await fetch("/api/todos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setTodos(todos.filter(t => t._id !== id));
  };

  const handleEdit = (todo) => {
    setText(todo.text);
    setSlug(todo.slug);
    setEditId(todo._id);
  };

  const cancelEdit = () => {
    setText("");
    setSlug("");
    setEditId(null);
  };

  return (
    <div className="ui-wrapper">
      <div className="ui-card">
        <h2>🚀 Todo App</h2>    

        {/* Input */}
        <div className="ui-input-row">
          <input
            placeholder="Type your task..."
            value={text}
            onChange={handleChange}
          />

          <button className="btn-primary" onClick={handleSubmit}>
            {editId ? <Check size={18} /> : <Plus size={18} />}
          </button>

          {editId && (
            <button className="btn-cancel" onClick={cancelEdit}>
              <X size={18} />
            </button>
          )}
        </div>

        {/* Slug preview */}
        {slug && (
          <div className="slug-box">
            🔗 <span>/todo/{slug}</span>
          </div>
        )}

        {/* Table */}
        <table className="ui-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Slug</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {todos.map(todo => (
              <tr key={todo._id}>
                <td>
                  <Link href={`/todo/${todo.slug}`} className="task-link">
                    {todo.text}
                  </Link>
                </td>
                <td className="slug-text">{todo.slug}</td>
                <td className="action-btns">
                  <button onClick={() => handleEdit(todo)}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(todo._id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {todos.length === 0 && (
          <p className="empty-state">✨ No tasks yet. Add one!</p>
        )}
      </div>
    </div>
  );
}
