import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./TaskCard.css";

export default class TaskCard extends Component {
  updateTask = e => {
    e.preventDefault();
    this.props.updateTask(this.props.task);
  };

  render() {
    const { task } = this.props;

    return (
      <div className="task-card" onClick={this.updateTask}>
        <h3>{task.title}</h3>
        {this.props.hideDescriptions ? "" : <p>{task.description}</p>}
        {task.priority === 1 || task.dueDate ? (
          <FontAwesomeIcon
            className={task.dueDate ? "task-card-due-date" : "high-priority"}
            icon={task.dueDate ? "clock" : "exclamation"}
            title={task.dueDate ? "Scheduled" : "High Priority"}
          />
        ) : (
          ""
        )}
        {task.description !== "" ? (
          <FontAwesomeIcon
            className="task-notes"
            icon="stream"
            title="Contains Notes"
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}
