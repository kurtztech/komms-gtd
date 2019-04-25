import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./InboxCount.css";

export default class InboxCount extends Component {
  state = {
    showPlayButton: false
  };

  showPlayButton = () => {
    let { showPlayButton } = { ...this.state };
    showPlayButton = true;
    this.setState({ showPlayButton });
  };

  hidePlayButton = () => {
    let { showPlayButton } = { ...this.state };
    showPlayButton = false;
    this.setState({ showPlayButton });
  };

  render() {
    const { inbox } = this.props;
    const inboxKeys = Object.keys(inbox);
    const inboxCount = inboxKeys.length;

    return (
      <div
        className={`inbox-count ${this.props.stale ? "stale" : ""}`}
        onClick={this.props.processInbox}
        onMouseEnter={this.showPlayButton}
        onMouseLeave={this.hidePlayButton}
        title="Process Inbox&#10;hotkey: p"
      >
        {this.state.showPlayButton ? (
          <p className="process">
            <FontAwesomeIcon icon="play" />
          </p>
        ) : (
          <p className="counter">{inboxCount}</p>
        )}
      </div>
    );
  }
}
