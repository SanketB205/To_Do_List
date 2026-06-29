import { useState } from 'react';
import { Plus } from 'lucide-react';

export default function TodoInput({ addTodo }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText('');
    }
  };

  return (
    <form className="input-wrapper" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoFocus
      />
      <button type="submit" className="add-btn" disabled={!text.trim()}>
        <Plus size={20} />
      </button>
    </form>
  );
}
