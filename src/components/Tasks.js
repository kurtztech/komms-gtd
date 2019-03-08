import React, { Component } from "react";
import TaskCard from "./TaskCard";

export default class Tasks extends Component {
  render() {
    const { tasks } = this.props;

    return (
      <div className="tasks-list">
        <h1>Next Tasks</h1>
        {Object.keys(tasks).map(id => (
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
