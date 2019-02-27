import React, { Component } from "react";
import "./InboxAdd.css";

export default class InboxAdd extends Component {
  inboxAdd = e => {
    e.preventDefault();
    const description = this.descRef.value;
    this.props.inboxAdd(description);
    this.descRef.value = "";
  };

  render() {
    return (
      <div className="inbox-add">
        <form onSubmit={this.inboxAdd}>
          <input
            type="text"
            name="description"
            ref={dr => (this.descRef = dr)}
          />
          <button type="submit">+</button>
        </form>
      </div>
    );
  }
}
