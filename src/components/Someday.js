import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TaskCard from "./TaskCard";
import "./Someday.css";

export default class Tasks extends Component {
  render() {
    const {
      tasks,
      showing,
      hovering,
      hoveringOn,
      hoveringOff,
      toggleShowing,
      hideDescriptions,
      updateSomeday
    } = this.props;
    const taskKeys = Object.keys(tasks);

    return (
      <div className="tasks-list">
        <div className="someday-heading">
          <h1>{this.props.title}</h1>
          <div
            className="someday-folder-group"
            onMouseEnter={hoveringOn}
            onMouseLeave={hoveringOff}
            onClick={toggleShowing}
          >
            <FontAwesomeIcon
              className="someday-folder-icon"
              icon={
                (showing && !hovering) || (!showing && hovering)
                  ? "folder-open"
                  : "folder"
              }
            />
            {!showing && !hovering ? (
              <span className="someday-folder-count">
                {Object.keys(tasks).length}
              </span>
            ) : (
              ""
            )}
          </div>
        </div>
        {showing
          ? taskKeys.map(id => (
              <TaskCard
                key={id}
                task={tasks[id]}
                hideDescriptions={hideDescriptions}
                updateTask={updateSomeday}
              />
            ))
          : ""}
      </div>
    );
  }
}
