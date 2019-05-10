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
    const high = taskKeys.filter(key => tasks[key].priority === 1);
    const low = taskKeys.filter(key => tasks[key].priority !== 1);

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
        {high.map(id => (
          <TaskCard
            key={id}
            task={tasks[id]}
            hideDescriptions={hideDescriptions}
            updateTask={updateTask}
          />
        ))}
        <br />
        <br />
        <br />
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
