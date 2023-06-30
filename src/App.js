import React, { useState, useEffect } from "react";
import "./App.css";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function TodoApp() {
  const [task, setTask] = useState("");
  const [editTask, setEditTask] = useState(null);

  const [tasksList, setTasksList] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasksList));
    document.title = `To-Do List (${tasksList.filter((task) => !task.completed).length
      } tasks remaining)`;
  }, [tasksList]);


  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim() === "") {
      alert("Please enter a task!");
      return;
    }
    const existingTask = tasksList.find(
      (t) => t.task.toLowerCase() === task.toLowerCase()
    );
    if (existingTask) {
      alert("This task already exists!");
      return;
    }
    setTasksList([
      ...tasksList,
      { id: Date.now(), task: task, completed: false },
    ]);
    setTask("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmed) {
      const filteredTasks = tasksList.filter((task) => task.id !== id);
      setTasksList(filteredTasks);
    }
  };

  const handleCheck = (id) => {
    const updatedTasks = tasksList.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasksList(updatedTasks);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (editTask.task.trim() === "") {
      alert("Task cannot be empty!");
      return;
    }
    const updatedTasks = tasksList.map((task) => {
      if (task.id === editTask.id) {
        return { ...task, task: editTask.task };
      }
      return task;
    });
    setTasksList(updatedTasks);
    setEditTask(null);
  };

  return (
    <div className="todo-parent">
      <div className="todo-container">
        <h1 className="todo-header">To-Do List</h1>
        <form onSubmit={handleSubmit} className="todo-form">
          <input
            type="text"
            placeholder="Add task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="todo-input"
          />
          <button type="submit" className="todo-button">
            Add
          </button>
        </form>
        <ul className="todo-list">
          {tasksList.map((task) => (
            <li key={task.id} className="todo-item">
              {editTask && editTask.id === task.id ? (
                <form onSubmit={handleEdit}>
                  <input
                    type="text"
                    value={editTask.task}
                    onChange={(e) =>
                      setEditTask({ ...editTask, task: e.target.value })
                    }
                    className="todo-edit"
                  />
                  <button type="submit" className="todo-save">
                    Save
                  </button>
                </form>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleCheck(task.id)}
                    className="todo-checkbox"
                  />
                  <span
                    className={
                      task.completed ? "todo-task completed" : "todo-task"
                    }
                  >
                    {task.task}
                  </span>
                  <button
                    onClick={() => setEditTask(task)}
                    className="edit-btn"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="todo-delete"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoApp;
