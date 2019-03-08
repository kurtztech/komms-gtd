import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Updating.css";

export default class Updating extends Component {
  componentDidMount() {
    document.addEventListener("keydown", this.hotkeys);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.hotkeys);
  }

  hotkeys = e => {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
      e.preventDefault();
      this.saveTask();
    } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 68) {
      e.preventDefault();
      this.deleteTask();
    }
  };

  handleClick = e => {
    if (e.target === document.querySelector("#updating-overlay")) {
      this.props.closeUpdateTask();
    }
  };

  saveTask = () => {
    const {
      description: ogDescription,
      title: ogTitle,
      updatedDate: ogUpdatedDate
    } = this.props.task;

    const title = this.titleRef.value;
    const description = this.descRef.value;
    const updatedDate =
      description === ogDescription && title === ogTitle
        ? ogUpdatedDate
        : Date.now();

    const oTask = {
      ...this.props.task,
      title,
      description,
      updatedDate
    };

    this.props.saveTask(oTask);
  };

  deleteTask = () => {
    this.props.deleteTask(this.props.task.id);
  };

  render() {
    return (
      <div
        id="updating-overlay"
        className="updating-overlay"
        onClick={this.handleClick}
        key={this.props.task.id}
      >
        <div className="updating-modal">
          <input
            className="title-input"
            ref={tr => (this.titleRef = tr)}
            type="text"
            defaultValue={this.props.task.title}
            title="Title"
          />
          <textarea
            className="desc-input"
            ref={dr => (this.descRef = dr)}
            rows="5"
            cols="20"
            title="Description"
            defaultValue={this.props.task.description}
          />
          <FontAwesomeIcon
            className="trash-icon"
            icon="trash"
            onClick={this.deleteTask}
            title="Permanently delete"
          />
        </div>
      </div>
    );
  }
}
