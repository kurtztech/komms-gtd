import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskCard from "./TaskCard";
import "./Tasks.css";

export default class Tasks extends Component {
  render() {
    const {
      tasks,
      title,
      hideDescriptions,
      updateTask,
      sortTasksBy,
      toggleTaskSort
    } = this.props;
    const currentTime = Date.now();
    const taskKeys = Object.keys(tasks).sort((a, b) => {
      switch (sortTasksBy) {
        case "oldest":
          return tasks[a].createdDate - tasks[b].createdDate;
        case "newest":
          return tasks[b].createdDate - tasks[a].createdDate;
        default:
          return tasks[b].createdDate - tasks[a].createdDate;
      }
    });
    const scheduled = taskKeys.filter(
      key => tasks[key].dueDate > 0 && tasks[key].dueDate <= currentTime
    );
    const unscheduled = taskKeys.filter(
      key => !tasks[key].hasOwnProperty("dueDate") || !tasks[key].dueDate
    );
    const high = unscheduled.filter(key => tasks[key].priority === 1);
    const low = unscheduled.filter(key => tasks[key].priority !== 1);

    return (
      <div className="tasks-list">
        <h1 className="tasks-heading">
          {title}
          <FontAwesomeIcon
            className="task-list-sort"
            icon={
              sortTasksBy === "oldest" ? "sort-numeric-up" : "sort-numeric-down"
            }
            title={sortTasksBy === "oldest" ? "Oldest First" : "Newest First"}
            onClick={toggleTaskSort}
          />
        </h1>
        {scheduled.map(id => (
          <TaskCard
            key={id}
            task={tasks[id]}
            hideDescriptions={hideDescriptions}
            updateTask={updateTask}
          />
        ))}
        {high.map(id => (
          <TaskCard
            key={id}
            task={tasks[id]}
            hideDescriptions={hideDescriptions}
            updateTask={updateTask}
          />
        ))}
        {low.map(id => (
          <TaskCard
            key={id}
            task={tasks[id]}
            hideDescriptions={hideDescriptions}
            updateTask={updateTask}
          />
        ))}
      </div>
    );
  }
}
