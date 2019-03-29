import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Processing.css";

export default class Processing extends Component {
  componentDidMount() {
    this.descRef.focus();
    document.addEventListener("keydown", this.hotkeys);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.hotkeys);
    if (this.props.count === 1) {
      this.props.close();
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
    if (e.target === document.querySelector("#processing-overlay")) {
      this.props.close();
    }
  };

  delete = () => {
    this.props.delete(this.props.task.id);
  };

  save = () => {
    if (this.props.type === "someday") {
      this.saveSomeday();
    } else {
      this.saveTask();
    }
  };

  saveAlt = () => {
    if (this.props.type !== "someday") {
      this.saveSomeday();
    } else {
      this.saveTask();
    }
  };

  saveTask = async () => {
    const { task } = this.props;
    const newDate = Date.now();

    const oTask = {
      ...task,
      title: this.titleRef.value,
      description: this.descRef.value,
      updatedDate: newDate,
      priority: this.checkRef.checked ? 1 : 0,
      dueDate: false
    };

    switch (this.props.type) {
      case "someday":
        this.props.saveAsTask(oTask);
        break;
      default:
        this.props.save(oTask);
        break;
    }
  };

  saveSomeday = async () => {
    const { task } = this.props;
    const newDate = Date.now();

    const oTask = {
      ...task,
      title: this.titleRef.value,
      description: this.descRef.value,
      updatedDate: newDate,
      priority: 0,
      dueDate: false
    };

    switch (this.props.type) {
      case "someday":
        this.props.save(oTask);
        break;
      default:
        this.props.saveAsSomeday(oTask);
        break;
    }
  };

  render() {
    const { task } = this.props;

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
            title="Permanently delete"
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
          <FontAwesomeIcon
            className="someday-icon"
            icon={this.props.type !== "someday" ? "cloud" : "tasks"}
            onClick={this.saveAlt}
            title={this.props.type === "someday" ? "Task" : "Someday"}
          />
          <FontAwesomeIcon
            className="save-icon"
            icon="save"
            onClick={this.save}
            title="Save Task"
          />
        </div>
      </div>
    );
  }
}
