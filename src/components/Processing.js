import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./Processing.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class Processing extends Component {
  state = {
    dueDate: this.props.task.dueDate
  };

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
      this.complete();
    }
  };

  handleClick = e => {
    const { close } = this.props;
    if (e.target === document.querySelector("#processing-overlay")) {
      close();
    }
  };

  complete = () => {
    const { complete: completeTask, task } = this.props;
    completeTask(task.id);
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
    const { dueDate } = this.state;
    const newDate = Date.now();

    const oTask = {
      ...task,
      title: this.titleRef.value,
      description: this.descRef.value,
      updatedDate: newDate,
      priority: this.checkRef.checked ? 1 : 0,
      dueDate: !dueDate ? false : dueDate,
      delegate: !this.delRef.value ? "" : this.delRef.value
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
    const { dueDate } = this.state;
    const newDate = Date.now();

    const oTask = {
      ...task,
      title: this.titleRef.value,
      description: this.descRef.value,
      updatedDate: newDate,
      priority: this.checkRef.checked ? 1 : 0,
      dueDate: !dueDate ? false : dueDate,
      delegate: !this.delRef.value ? "" : this.delRef.value
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

  updateDueDate = dueDate => {
    this.setState({ dueDate: new Date(dueDate).getTime() });
  };

  render() {
    const { task, type } = this.props;

    const createdDate = new Date(task.createdDate);
    const updatedDate = new Date(task.updatedDate);

    return (
      <div
        id="processing-overlay"
        className="processing-overlay"
        onMouseDown={this.handleClick}
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
          <div className="processing-dates">
            <table>
              <tbody>
                <tr className="processing-date">
                  <td className="processing-date-title">Created:</td>
                  <td>{createdDate.toLocaleString()}</td>
                </tr>
                <tr className="processing-date">
                  <td className="processing-date-title">Updated:</td>
                  <td>{updatedDate.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <FontAwesomeIcon
            className="trash-icon"
            icon="trash"
            onClick={this.complete}
            title="Complete&#10;Ctrl+D"
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
          <div className="processing-bottom-right-actions">
            <div className="date-picker-group">
              <FontAwesomeIcon className="date-picker-icon" icon="clock" />
              <DatePicker
                selected={this.state.dueDate}
                onChange={this.updateDueDate}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                timeCaption="time"
                className="date-picker-input"
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
      </div>
    );
  }
}
