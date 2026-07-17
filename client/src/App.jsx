import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Trash2, Plus } from 'lucide-react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/todos`);
      setTodos(res.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/todos`, { title });
      setTodos([...todos, res.data]);
      setTitle('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const res = await axios.put(`${API_URL}/todos/${id}`);
      setTodos(todos.map(t => t.id === id ? res.data : t));
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>📝 Todo List</h1>
        
        <div className="input-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new todo..."
            className="input-field"
          />
          <button onClick={addTodo} className="btn-add">
            <Plus size={20} />
            Add
          </button>
        </div>

        {loading ? (
          <div className="loading">Loading...</div>
        ) : (
          <div className="todo-list">
            {todos.length === 0 ? (
              <p className="empty">No todos yet. Add one above!</p>
            ) : (
              todos.map((todo) => (
                <motion.div
                  key={todo.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="todo-item"
                >
                  <div className="todo-content">
                    <button 
                      onClick={() => toggleTodo(todo.id)}
                      className="btn-toggle"
                    >
                      {todo.completed ? (
                        <CheckCircle className="icon-completed" size={24} />
                      ) : (
                        <Circle className="icon-pending" size={24} />
                      )}
                    </button>
                    <span className={todo.completed ? 'todo-text completed' : 'todo-text'}>
                      {todo.title}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="btn-delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
