import React, { Component } from "react";
import firebase from "firebase";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import base, { firebaseApp } from "../base";
import InboxCount from "./InboxCount";
import InboxAdd from "./InboxAdd";
import Tasks from "./Tasks";
import Processing from "./Processing";
import Updating from "./Updating";

library.add(faPlay);
library.add(faTrash);

class App extends Component {
  state = {
    inbox: {},
    tasks: {},
    uid: null,
    processingInbox: false,
    hideTaskDescriptions: false,
    taskUpdating: null,
    loading: true
  };

  componentDidMount() {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        await this.authHandler({ user });
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    });

    document.addEventListener("keydown", this.hotkeys);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.hotkeys);
  }

  authenticate = provider => {
    const authProvider = new firebase.auth[`${provider}AuthProvider`]();
    firebaseApp
      .auth()
      .signInWithPopup(authProvider)
      .then(this.authHandler);
  };

  authHandler = async authData => {
    await this.setState({
      uid: authData.user.uid
    });

    this.ref = base.syncState(`/${this.state.uid}/inbox`, {
      context: this,
      state: "inbox"
    });
    this.ref = base.syncState(`/${this.state.uid}/tasks`, {
      context: this,
      state: "tasks"
    });
    this.ref = base.syncState(`/${this.state.uid}/hideTaskDescriptions`, {
      context: this,
      state: "hideTaskDescriptions"
    });
  };

  logout = async () => {
    await firebase.auth().signOut();
    this.setState({
      inbox: {},
      tasks: {},
      uid: null
    });
    base.removeBinding(this.ref);
  };

  hotkeys = e => {
    const { target, code } = e;

    if (target === document.querySelector("body")) {
      switch (code) {
        case "KeyA":
          e.preventDefault();
          this.inboxAddRef.titleRef.focus();
          break;
        case "KeyH":
          e.preventDefault();
          let { hideTaskDescriptions } = { ...this.state };
          hideTaskDescriptions = !hideTaskDescriptions;
          this.setState({ hideTaskDescriptions });
          break;
        case "KeyP":
          e.preventDefault();
          this.processInbox();
          break;
        default:
          break;
      }
    }

    if (code === "Escape") {
      this.closeProcessInbox();
      this.closeUpdateTask();
      this.blur();
    }
  };

  blur = () => {
    document.activeElement.blur();
  };

  inboxAdd = oNewInbox => {
    const { inbox } = { ...this.state };
    inbox[oNewInbox.id] = oNewInbox;
    this.setState({ inbox });
    this.blur();
  };

  getNextInbox = () => {
    const { inbox } = { ...this.state };
    const keys = Object.keys(inbox).sort(
      (a, b) => inbox[a].updatedDate - inbox[b].updatedDate
    );
    return inbox[keys[0]];
  };

  processInbox = () => {
    this.setState({ processingInbox: this.getNextInbox() });
  };

  closeProcessInbox = () => {
    this.setState({ processingInbox: false });
  };

  saveInboxAsTask = oTask => {
    const { tasks, inbox } = { ...this.state };
    tasks[oTask.id] = oTask;
    inbox[oTask.id] = null;
    this.setState({ tasks, inbox });
  };

  deleteFromInbox = id => {
    const { inbox } = { ...this.state };
    inbox[id] = null;
    this.setState({ inbox });
  };

  updateTask = oTask => {
    this.setState({ taskUpdating: oTask });
  };

  saveTask = oTask => {
    const { tasks } = { ...this.state };
    tasks[oTask.id] = oTask;
    this.setState({ tasks });
    this.closeUpdateTask();
  };

  deleteTask = taskId => {
    const { tasks } = { ...this.state };
    tasks[taskId] = null;
    this.setState({ tasks });
    this.closeUpdateTask();
  };

  closeUpdateTask = () => {
    this.setState({ taskUpdating: null });
  };

  render() {
    if (this.state.uid === null) {
      return (
        <div className="App">
          {this.state.loading ? (
            <h3>Loading...</h3>
          ) : (
            <button
              onClick={() => {
                this.authenticate("Google");
              }}
            >
              Login with Google
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="App">
        <div className="inbox-bar">
          <InboxCount
            inbox={this.state.inbox}
            processInbox={this.processInbox}
          />
          <InboxAdd
            ref={iar => (this.inboxAddRef = iar)}
            inboxAdd={this.inboxAdd}
          />
        </div>
        <div className="lists-section">
          <Tasks
            tasks={this.state.tasks}
            hideDescriptions={this.state.hideTaskDescriptions}
            updateTask={this.updateTask}
          />
        </div>
        {this.state.processingInbox && this.getNextInbox() ? (
          <Processing
            nextInbox={this.getNextInbox()}
            closeProcessInbox={this.closeProcessInbox}
            saveInboxAsTask={this.saveInboxAsTask}
            deleteFromInbox={this.deleteFromInbox}
            inboxCount={Object.keys(this.state.inbox).length}
          />
        ) : (
          ""
        )}
        {this.state.taskUpdating ? (
          <Updating
            task={this.state.taskUpdating}
            saveTask={this.saveTask}
            closeUpdateTask={this.closeUpdateTask}
            deleteTask={this.deleteTask}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default App;
