import { useState, useEffect, useRef } from 'react';
import './App.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';
import FilterBar from './components/FilterBar';
import AuthModal from './components/AuthModal';
import { LogOut } from 'lucide-react';

const API_URL = 'https://to-do-list-pehn.onrender.com/api/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('All');
  const [isLoading, setIsLoading] = useState(false);

  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });

  // When a guest tries to add a task we hold the text here,
  // then save it automatically after they log in.
  const [showAuthModal, setShowAuthModal] = useState(false);
  const pendingTaskRef = useRef(null);

  // Authenticated fetch helper
  const authFetch = (url, options = {}) =>
    fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

  useEffect(() => {
    if (token) {
      setIsLoading(true);
      fetchTodos();
    }
  }, [token]);

  const handleAuth = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setTodos([]);
  };

  const fetchTodos = async () => {
    try {
      const response = await authFetch(API_URL);
      if (response.status === 401) { handleLogout(); return; }
      const data = await response.json();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Called by TodoInput — if guest, open modal and remember the text
  const addTodo = async (text) => {
    if (!token) {
      pendingTaskRef.current = text;
      setShowAuthModal(true);
      return;
    }
    await saveTodo(text);
  };

  const saveTodo = async (text) => {
    const tempId = crypto.randomUUID();
    setTodos(curr => [{ id: tempId, text, completed: false }, ...curr]);

    try {
      const response = await authFetch(API_URL, {
        method: 'POST',
        body: JSON.stringify({ text, completed: false }),
      });
      const savedTodo = await response.json();
      setTodos(curr => curr.map(t => t.id === tempId ? { ...t, id: savedTodo.id } : t));
    } catch (err) {
      console.error('Error adding todo:', err);
      fetchTodos();
    }
  };

  // After login/register, flush any pending task
  useEffect(() => {
    if (token && pendingTaskRef.current) {
      const text = pendingTaskRef.current;
      pendingTaskRef.current = null;
      saveTodo(text);
    }
  }, [token]);

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const updated = { ...todo, completed: !todo.completed };
    setTodos(todos.map(t => t.id === id ? updated : t));
    try {
      await authFetch(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
    } catch { fetchTodos(); }
  };

  const deleteTodo = async (id) => {
    setTodos(todos.filter(t => t.id !== id));
    try {
      await authFetch(`${API_URL}/${id}`, { method: 'DELETE' });
    } catch { fetchTodos(); }
  };

  const editTodo = async (id, newText) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    const updated = { ...todo, text: newText };
    setTodos(todos.map(t => t.id === id ? updated : t));
    try {
      await authFetch(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(updated) });
    } catch { fetchTodos(); }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Completed') return todo.completed;
    return true;
  });

  return (
    <>
      <div className="app-container">
        <header className="header">
          <h1>Tasks</h1>
          <p>What needs to be done today?</p>

          {token ? (
            <div className="user-bar">
              <span className="user-name">👋 {user?.username}</span>
              <button className="logout-btn" onClick={handleLogout} aria-label="Log out">
                <LogOut size={16} />
                Log out
              </button>
            </div>
          ) : (
            <div className="user-bar">
              <button className="guest-login-btn" onClick={() => setShowAuthModal(true)}>
                Sign in / Sign up
              </button>
            </div>
          )}
        </header>

        <TodoInput addTodo={addTodo} />
        <FilterBar filter={filter} setFilter={setFilter} />

        {isLoading ? (
          <div className="todo-empty"><p>Loading tasks…</p></div>
        ) : (
          <TodoList
            todos={filteredTodos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        )}
      </div>

      {showAuthModal && (
        <AuthModal
          onAuth={handleAuth}
          onClose={() => {
            setShowAuthModal(false);
            pendingTaskRef.current = null;
          }}
        />
      )}
    </>
  );
}

export default App;
