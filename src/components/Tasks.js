import React, { Component } from "react";
import TaskCard from "./TaskCard";
import "./Tasks.css";

export default class Tasks extends Component {
  render() {
    const { tasks, title, hideDescriptions, updateTask } = this.props;
    const taskKeys = Object.keys(tasks).sort(
      (a, b) => tasks[a].createdDate - tasks[b].createdDate
    );
    const high = taskKeys.filter(key => tasks[key].priority === 1);
    const low = taskKeys.filter(key => tasks[key].priority !== 1);

    return (
      <div className="tasks-list">
        <h1 className="tasks-heading">{title}</h1>
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
