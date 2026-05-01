import TaskList from "../components/TaskList";

function List({ task, deleteTask, toggleComplete }) {
  return (
    <div className="list-page">
      <h2>Task List</h2>

      <TaskList
        task={task}
        deleteTask={deleteTask}
        toggleComplete={toggleComplete}
      />
    </div>
  );
}

export default List;
