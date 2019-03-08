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

    return (
      <div
        className="inbox-count"
        onMouseEnter={this.showPlayButton}
        onMouseLeave={this.hidePlayButton}
        title="Process Inbox"
      >
        {this.state.showPlayButton ? (
          <p className="process" onClick={this.props.processInbox}>
            <FontAwesomeIcon icon="play" />
          </p>
        ) : (
          <p className="counter">{Object.keys(inbox).length}</p>
        )}
      </div>
    );
  }
}
