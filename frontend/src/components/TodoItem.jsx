import { useState, useRef, useEffect } from 'react';
import { Trash2, Edit2, Check, X } from 'lucide-react';

export default function TodoItem({ todo, toggleTodo, deleteTodo, editTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEditSubmit = () => {
    if (editText.trim() && editText !== todo.text) {
      editTodo(todo.id, editText.trim());
    } else {
      setEditText(todo.text); // reset if empty or unchanged
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleEditSubmit();
    if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li className={`todo-item ${todo.completed ? 'completed' : ''}`}>
      <label className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
        />
        <div className="checkbox-custom"></div>
      </label>

      <div className="todo-content">
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            className="edit-input"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span className="todo-text">{todo.text}</span>
        )}
      </div>

      <div className="todo-actions">
        {isEditing ? (
          <>
            <button className="action-btn" onClick={handleEditSubmit}>
              <Check size={18} />
            </button>
            <button
              className="action-btn"
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(false);
              }}
            >
              <X size={18} />
            </button>
          </>
        ) : (
          <>
            <button
              className="action-btn"
              onClick={() => setIsEditing(true)}
              aria-label="Edit"
            >
              <Edit2 size={18} />
            </button>
            <button
              className="action-btn delete"
              onClick={() => deleteTodo(todo.id)}
              aria-label="Delete"
            >
              <Trash2 size={18} />
            </button>
          </>
        )}
      </div>
    </li>
  );
}
