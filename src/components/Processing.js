import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Processing.css";

export default class Processing extends Component {
  componentDidMount() {
    this.descRef.focus();
    document.addEventListener("keydown", this.hotkeys);
  }

  componentWillUnmount() {
    const { count, close } = this.props;

    document.removeEventListener("keydown", this.hotkeys);
    if (count === 1) {
      close();
    }
  }

  hotkeys = e => {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.keyCode === 13) {
      e.preventDefault();
      this.checkRef.checked = true;
      this.save();
    } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
      e.preventDefault();
      this.checkRef.checked = false;
      this.save();
    } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 83) {
      e.preventDefault();
      this.save();
    } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 68) {
      e.preventDefault();
      this.delete();
    }
  };

  handleClick = e => {
    const { close } = this.props;
    if (e.target === document.querySelector("#processing-overlay")) {
      close();
    }
  };

  delete = () => {
    const { delete: deleteTask, task } = this.props;
    deleteTask(task.id);
  };

  save = () => {
    const { type } = this.props;
    if (type === "someday") {
      this.saveSomeday();
    } else {
      this.saveTask();
    }
  };

  saveAlt = () => {
    const { type } = this.props;
    if (type !== "someday") {
      this.saveSomeday();
    } else {
      this.saveTask();
    }
  };

  saveTask = async () => {
    const { task, type, save, saveAsTask } = this.props;
    const newDate = Date.now();

    const oTask = {
      ...task,
      title: this.titleRef.value,
      description: this.descRef.value,
      updatedDate: newDate,
      priority: this.checkRef.checked ? 1 : 0,
      dueDate: false,
      delegate: this.delRef.value
    };

    switch (type) {
      case "someday":
        saveAsTask(oTask);
        break;
      default:
        save(oTask);
        break;
    }
  };

  saveSomeday = async () => {
    const { task, type, save, saveAsSomeday } = this.props;
    const newDate = Date.now();

    const oTask = {
      ...task,
      title: this.titleRef.value,
      description: this.descRef.value,
      updatedDate: newDate,
      priority: 0,
      dueDate: false
    };

    switch (type) {
      case "someday":
        save(oTask);
        break;
      default:
        saveAsSomeday(oTask);
        break;
    }
  };

  render() {
    const { task, type } = this.props;

    return (
      <div
        id="processing-overlay"
        className="processing-overlay"
        onClick={this.handleClick}
        key={task.id}
      >
        <div className="processing-modal">
          <input
            className="title-input"
            ref={tr => (this.titleRef = tr)}
            type="text"
            defaultValue={task.title}
            title="Title"
          />
          <textarea
            className="desc-input"
            ref={dr => (this.descRef = dr)}
            rows="5"
            cols="20"
            defaultValue={task.description}
            title="Description"
          />
          <FontAwesomeIcon
            className="trash-icon"
            icon="trash"
            onClick={this.delete}
            title="Permanently Delete&#10;Ctrl+D"
          />
          <div className="priority-group">
            <label htmlFor="priority">Priority</label>
            <input
              id="priority"
              className="priority-checkbox"
              type="checkbox"
              defaultChecked={task.priority === 1}
              ref={cr => (this.checkRef = cr)}
            />
          </div>
          <div className="delegated-group">
            <FontAwesomeIcon className="delegated-icon" icon="user" />
            <input
              id="delegated"
              className="delegated-input"
              type="text"
              defaultValue={task.delegate}
              ref={dr => (this.delRef = dr)}
            />
          </div>
          <FontAwesomeIcon
            className="someday-icon"
            icon={type !== "someday" ? "cloud" : "tasks"}
            onClick={this.saveAlt}
            title={type === "someday" ? "Task" : "Someday"}
          />
          <FontAwesomeIcon
            className="save-icon"
            icon="save"
            onClick={this.save}
            title="Save Task&#10;Ctrl+S"
          />
        </div>
      </div>
    );
  }
}
