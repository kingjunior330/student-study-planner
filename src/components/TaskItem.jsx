import {useState} from "react";
import {Link} from "react-router-dom";

function TaskItem({ task, deleteTask, toggleComplete }) {
    return (
        <div className="task-item-wrapper">  {/* Add wrapper div */}
            <div className={`task-item ${task.completed ? "completed" : ""}`}>
                <h3>{task.title}</h3>
                <p>Day: {task.day}</p>
                <p>Due Date: {task.dueDate}</p>
                <p>Status: {task.completed ? "Completed" : "Not Completed"}</p>
            </div>
            
            <div className="task-buttons">
                <button onClick={() => toggleComplete(task.id)}>
                    {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                </button>
                <button onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
        </div>
    );
}
export default TaskItem;