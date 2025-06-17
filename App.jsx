import { useState, useEffect } from 'react';
import './App.css'

function App() {

  const [todolist,setTodolist]=useState([]);

  const [filter, setFilter] = useState('all');

  useEffect(()=>{
    const stored = localStorage.getItem('todos');
    if (stored) {
      setTodolist(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todolist));
  }, [todolist]);

  const saveTodoList=(event)=>{

    event.preventDefault();
    const toname=event.target.toname.value.trim();
    if (toname && !todolist.some(todo => todo.name === toname)) {
      const newTodo = { name: toname, completed: false };
      setTodolist([...todolist, newTodo]);
      event.target.reset();
    } else {
      alert("Invalid or duplicate todo.");
    }
  };

  const updateTodoStatus = (index) => {
    const updatedList = [...todolist];
    updatedList[index].completed = !updatedList[index].completed;
    setTodolist(updatedList);
  };

   const deleteTodo = (index) => {
    const updatedList = todolist.filter((_, i) => i !== index);
    setTodolist(updatedList);
  };

  const updateTodoName = (index, newName) => {
    const updatedList = [...todolist];
    updatedList[index].name = newName;
    setTodolist(updatedList);
  };

  const handleDrag = (e, index) => {
    e.dataTransfer.setData("todoIndex", index);
  };

  const handleDrop = (e, targetIndex) => {
    const draggedIndex = e.dataTransfer.getData("todoIndex");
    const reorderedList = [...todolist];
    const [draggedItem] = reorderedList.splice(draggedIndex, 1);
    reorderedList.splice(targetIndex, 0, draggedItem);
    setTodolist(reorderedList);
  };

  const filteredList = todolist.filter(todo => {
    if (filter === 'completed') return todo.completed;
    if (filter === 'incomplete') return !todo.completed;
    return true;
  });

  return (
    <div className="App">
      <h1>Todo List</h1>
      <form onSubmit={saveTodoList}>
        <input type='text' name='toname' placeholder="Task Name" /> 
        <button>Add</button>
      </form>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>

      <ul className="todo-list">
        {filteredList.map((todo, index) => (
          <TodoListItems
            key={index}
            index={index}
            todo={todo}
            updateStatus={() => updateTodoStatus(index)}
            deleteTodo={() => deleteTodo(index)}
            updateTodoName={updateTodoName}
            onDragStart={(e) => handleDrag(e, index)}
            onDrop={(e) => handleDrop(e, index)}
          />
        ))}
      </ul>
    </div>
  );
}

function TodoListItems({ todo, index, updateStatus, deleteTodo, updateTodoName, onDragStart, onDrop }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(todo.name);

  const saveEdit = () => {
    updateTodoName(index, tempName);
    setIsEditing(false);
  };

  return (
    <li
      className={todo.completed ? 'completetodo' : ''}
      draggable
      onDragStart={onDragStart}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
    >
      {isEditing ? (
        <>
          <input value={tempName} onChange={(e) => setTempName(e.target.value)} />
          <button onClick={saveEdit}>Save</button>
        </>
      ) : (
        <>
          <span onClick={updateStatus}>{todo.name}</span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={deleteTodo}>Delete</button>
        </>
      )}
    </li>
  );
}

export default App;