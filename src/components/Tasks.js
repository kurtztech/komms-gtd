import React, { Component } from "react";
import TaskCard from "./TaskCard";
import "./Tasks.css";

export default class Tasks extends Component {
  render() {
    const { tasks } = this.props;
    const taskKeys = Object.keys(tasks);
    const high = taskKeys.filter(key => tasks[key].priority === 1);
    const low = taskKeys.filter(key => tasks[key].priority !== 1);

    return (
      <div className="tasks-list">
        <h1 className="tasks-heading">{this.props.title}</h1>
        {high.map(id => (
          <TaskCard
            key={id}
            task={tasks[id]}
            hideDescriptions={this.props.hideDescriptions}
            updateTask={this.props.updateTask}
          />
        ))}
        {low.map(id => (
          <TaskCard
            key={id}
            task={tasks[id]}
            hideDescriptions={this.props.hideDescriptions}
            updateTask={this.props.updateTask}
          />
        ))}
      </div>
    );
  }
}
