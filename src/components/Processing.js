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
    if (this.props.inboxCount === 1) {
      this.props.closeProcessInbox();
    }
  }

  hotkeys = e => {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
      e.preventDefault();
      this.saveAsTask();
    } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 68) {
      e.preventDefault();
      this.deleteFromInbox();
    }
  };

  handleClick = e => {
    if (e.target === document.querySelector("#processing-overlay")) {
      this.props.closeProcessInbox();
    }
  };

  deleteFromInbox = () => {
    this.props.deleteFromInbox(this.props.nextInbox.id);
  };

  saveAsTask = async () => {
    const currentInbox = this.props.nextInbox;
    const newDate = Date.now();

    const oTask = {
      ...currentInbox,
      title: this.titleRef.value,
      description: this.descRef.value,
      createdDate: newDate,
      updatedDate: newDate
    };

    this.props.saveInboxAsTask(oTask);
  };

  render() {
    const { nextInbox } = this.props;

    return (
      <div
        id="processing-overlay"
        className="processing-overlay"
        onClick={this.handleClick}
        key={nextInbox.id}
      >
        <div className="processing-modal">
          <input
            className="title-input"
            ref={tr => (this.titleRef = tr)}
            type="text"
            defaultValue={nextInbox.title}
            title="Title"
          />
          <textarea
            className="desc-input"
            ref={dr => (this.descRef = dr)}
            rows="5"
            cols="20"
            title="Description"
          />
          <FontAwesomeIcon
            className="trash-icon"
            icon="trash"
            onClick={this.deleteFromInbox}
            title="Permanently delete"
          />
        </div>
      </div>
    );
  }
}
