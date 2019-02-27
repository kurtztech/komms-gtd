import React, { Component } from "react";
import "./TaskCard.css";

export default class TaskCard extends Component {
  updateTask = e => {
    e.preventDefault();
    this.props.updateTask(this.props.task);
  };

  render() {
    return (
      <div className="task-card" onClick={this.updateTask}>
        <h3>{this.props.task.title}</h3>
        {this.props.hideDescriptions ? (
          ""
        ) : (
          <p>{this.props.task.description}</p>
        )}
      </div>
    );
  }
}
