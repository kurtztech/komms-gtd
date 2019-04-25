import React, { Component } from "react";
import uuidv4 from "uuid/v4";
import "./InboxAdd.css";

export default class InboxAdd extends Component {
  inboxAdd = e => {
    e.preventDefault();
    const time = Date.now();
    const newInbox = {
      id: uuidv4(),
      title: this.titleRef.value,
      createdDate: time,
      updatedDate: time
    };
    this.props.inboxAdd(newInbox);
    this.titleRef.value = "";
  };

  render() {
    return (
      <div className="inbox-add">
        <form onSubmit={this.inboxAdd}>
          <input
            type="text"
            name="description"
            placeholder="hotkey: a"
            ref={tr => (this.titleRef = tr)}
          />
          <button type="submit">+</button>
        </form>
      </div>
    );
  }
}
