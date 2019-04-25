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
        {task.priority === 1 ? (
          <FontAwesomeIcon
            className="high-priority"
            icon="exclamation"
            title="High Priority"
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
