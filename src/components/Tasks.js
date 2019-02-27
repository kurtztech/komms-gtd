import React, { Component } from "react";
import TaskCard from "./TaskCard";

export default class Tasks extends Component {
  render() {
    return (
      <div className="tasks-list">
        <h1>Next Tasks</h1>
        {this.props.tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            hideDescriptions={this.props.hideDescriptions}
            updateTask={this.props.updateTask}
          />
        ))}
      </div>
    );
  }
}
