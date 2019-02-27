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
  }

  hotkeys = e => {
    if ((e.ctrlKey || e.metaKey) && e.keyCode === 13) {
      e.preventDefault();
      this.saveAsTask();
    } else if ((e.ctrlKey || e.metaKey) && e.keyCode === 68) {
      e.preventDefault();
      this.deleteNextInbox();
    }
  };

  handleClick = e => {
    if (e.target === document.querySelector("#processing-overlay")) {
      this.props.closeProcessInbox();
    }
  };

  saveAsTask = () => {
    const currentInbox = this.props.nextInbox;

    const oTask = {
      title: this.titleRef.value,
      description: this.descRef.value,
      createdDate: currentInbox.createdDate
    };

    const loadNext = this.props.saveInboxAsTask(oTask);

    if (loadNext) {
      this.loadNextInfo();
    }
  };

  deleteNextInbox = () => {
    const loadNext = this.props.deleteNextInbox();

    if (loadNext) {
      this.loadNextInfo();
    }
  };

  loadNextInfo = () => {
    this.titleRef.value = this.props.nextInbox.description;
    this.descRef.value = "";
  };

  render() {
    return (
      <div
        id="processing-overlay"
        className="processing-overlay"
        onClick={this.handleClick}
      >
        <div className="processing-modal">
          <input
            className="title-input"
            ref={tr => (this.titleRef = tr)}
            type="text"
            defaultValue={this.props.nextInbox.description}
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
            onClick={this.deleteNextInbox}
            title="Permanently delete"
          />
        </div>
      </div>
    );
  }
}
