import { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');
  
  // State for handling edits
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // CREATE
  const addTodo = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    setTodos([{ id: Date.now(), text: inputValue, completed: false }, ...todos]);
    setInputValue('');
  };

  // UPDATE - Toggle Status
  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // UPDATE - Enter Edit Mode
  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  };

  // UPDATE - Save Changes
  const saveEdit = (id) => {
    if (!editValue.trim()) return;
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editValue } : todo
    ));
    setEditingId(null);
  };

  // CANCEL Edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  // DELETE
  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="app-container">
      <div className="todo-box">
        
        <header className="header">
          <h1 className="title">Tasks</h1>
          <span className="task-count">
            {todos.filter(t => !t.completed).length} pending
          </span>
        </header>

        <form onSubmit={addTodo} className="input-group">
          <input
            type="text"
            className="todo-input primary-input"
            placeholder="What needs to be done?"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Create</button>
        </form>

        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
              
              {/* Check if current item is being edited */}
              {editingId === todo.id ? (
                <div className="edit-mode">
                  <input
                    type="text"
                    className="todo-input edit-input"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    autoFocus
                  />
                  <div className="edit-actions">
                    <button className="btn btn-sm btn-success" onClick={() => saveEdit(todo.id)}>Save</button>
                    <button className="btn btn-sm btn-ghost" onClick={cancelEdit}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="view-mode">
                  <label className="checkbox-container">
                    <input 
                      type="checkbox" 
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                  </label>
                  
                  <span className="todo-text">{todo.text}</span>
                  
                  <div className="item-actions">
                    <button 
                      className="action-btn edit-btn" 
                      onClick={() => startEditing(todo)}
                      title="Edit task"
                    >
                      ✎
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      onClick={() => deleteTodo(todo.id)}
                      title="Delete task"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}

          {todos.length === 0 && (
            <div className="empty-state">
              <p>You have no tasks lined up.</p>
            </div>
          )}
        </ul>

      </div>
    </div>
  );
}

export default App;
