import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TaskCard from './TaskCard';
import './Folder.css';

export default class Folder extends Component {
  render() {
    const {
      tasks,
      showing,
      hovering,
      hoveringOn,
      hoveringOff,
      toggleShowing,
      hideDescriptions,
      updateTasks,
      title,
    } = this.props;
    const taskKeys = Object.keys(tasks);

    return (
      <div className="tasks-list">
        <div className="folder-heading">
          <h1>{title}</h1>
          <div
            className="folder-group"
            onMouseEnter={hoveringOn}
            onMouseLeave={hoveringOff}
            onClick={toggleShowing}
            role="button"
          >
            <FontAwesomeIcon
              className="folder-icon"
              icon={
                (showing && !hovering) || (!showing && hovering)
                  ? 'folder-open'
                  : 'folder'
              }
            />
            {!showing && !hovering ? (
              <span className="folder-count">{Object.keys(tasks).length}</span>
            ) : (
              ''
            )}
          </div>
        </div>
        {showing
          ? taskKeys.map(id => (
              <TaskCard
                key={id}
                task={tasks[id]}
                hideDescriptions={hideDescriptions}
                updateTask={updateTasks}
              />
            ))
          : ''}
      </div>
    );
  }
}
