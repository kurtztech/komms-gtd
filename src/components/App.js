import React, { Component } from "react";
import firebase from "firebase";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPlay,
  faTrash,
  faExclamation,
  faSave,
  faFolder,
  faFolderOpen,
  faCloud,
  faTasks
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import base, { firebaseApp } from "../base";
import InboxCount from "./InboxCount";
import InboxAdd from "./InboxAdd";
import Tasks from "./Tasks";
import Someday from "./Someday";
import Processing from "./Processing";

library.add(faPlay);
library.add(faTrash);
library.add(faExclamation);
library.add(faSave);
library.add(faFolder);
library.add(faFolderOpen);
library.add(faCloud);
library.add(faTasks);

class App extends Component {
  state = {
    inbox: {},
    tasks: {},
    someday: {},
    uid: null,
    processingInbox: false,
    hideTaskDescriptions: false,
    taskUpdating: null,
    somedayUpdating: null,
    loading: true,
    showingSomeday: true,
    hoveringSomeday: false,
    inboxStale: false
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

    this.calcStaleInbox();
    this.staleRef = setInterval(() => {
      this.calcStaleInbox();
    }, 60000);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.hotkeys);

    clearInterval(this.staleRef);
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
    this.ref = base.syncState(`/${this.state.uid}/someday`, {
      context: this,
      state: "someday"
    });
    this.ref = base.syncState(`/${this.state.uid}/hideTaskDescriptions`, {
      context: this,
      state: "hideTaskDescriptions"
    });
    this.ref = base.syncState(`/${this.state.uid}/showingSomeday`, {
      context: this,
      state: "showingSomeday"
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

  saveInboxAsSomeday = oTask => {
    const { inbox, someday } = { ...this.state };
    someday[oTask.id] = oTask;
    inbox[oTask.id] = null;
    this.setState({ inbox, someday });
  };

  saveTaskAsSomeday = oTask => {
    const { tasks, someday } = { ...this.state };
    someday[oTask.id] = oTask;
    tasks[oTask.id] = null;
    this.setState({ tasks, someday });
    this.closeUpdateTask();
  };

  saveSomedayAsTask = oTask => {
    const { tasks, someday } = { ...this.state };
    tasks[oTask.id] = oTask;
    someday[oTask.id] = null;
    this.setState({ tasks, someday });
    this.closeUpdateSomeday();
  };

  saveSomeday = oTask => {
    const { someday } = { ...this.state };
    someday[oTask.id] = oTask;
    this.setState({ someday });
    this.closeUpdateSomeday();
  };

  updateSomeday = oTask => {
    this.setState({ somedayUpdating: oTask });
  };

  closeUpdateSomeday = () => {
    this.setState({ somedayUpdating: null });
  };

  deleteSomeday = taskId => {
    const { someday } = { ...this.state };
    someday[taskId] = null;
    this.setState({ someday });
    this.closeUpdateSomeday();
  };

  hoveringOnSomeday = () => {
    this.setState({ hoveringSomeday: true });
  };

  hoveringOffSomeday = () => {
    this.setState({ hoveringSomeday: false });
  };

  toggleShowingSomeday = () => {
    this.setState({ showingSomeday: !this.state.showingSomeday });
  };

  calcStaleInbox = () => {
    const now = Date.now();

    const { inbox } = this.state;
    const inboxKeys = Object.keys(inbox);

    const inboxStale =
      inboxKeys.reduce(
        (acc, cur) =>
          inbox[cur].createdDate < now && inbox[cur].createdDate < acc
            ? inbox[cur].createdDate
            : acc,
        now
      ) <
      now - 3600000;

    this.setState({ inboxStale });
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
              className="login-button"
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
            stale={this.state.inboxStale}
          />
          <InboxAdd
            ref={iar => (this.inboxAddRef = iar)}
            inboxAdd={this.inboxAdd}
          />
        </div>
        <div className="lists-section">
          <Tasks
            title="Next Tasks"
            tasks={this.state.tasks}
            hideDescriptions={this.state.hideTaskDescriptions}
            updateTask={this.updateTask}
          />
          <Someday
            title="Someday"
            tasks={this.state.someday}
            hideDescriptions={this.state.hideTaskDescriptions}
            updateSomeday={this.updateSomeday}
            showing={this.state.showingSomeday}
            hovering={this.state.hoveringSomeday}
            toggleShowing={this.toggleShowingSomeday}
            hoveringOn={this.hoveringOnSomeday}
            hoveringOff={this.hoveringOffSomeday}
          />
          {/* <Folders someday={this.state.someday} /> */}
        </div>
        {this.state.processingInbox && this.getNextInbox() ? (
          <Processing
            task={this.getNextInbox()}
            save={this.saveInboxAsTask}
            saveAsSomeday={this.saveInboxAsSomeday}
            close={this.closeProcessInbox}
            delete={this.deleteFromInbox}
            count={Object.keys(this.state.inbox).length}
            type="inbox"
          />
        ) : (
          ""
        )}
        {this.state.taskUpdating ? (
          <Processing
            task={this.state.taskUpdating}
            save={this.saveTask}
            saveAsSomeday={this.saveTaskAsSomeday}
            close={this.closeUpdateTask}
            delete={this.deleteTask}
            type="task"
          />
        ) : (
          ""
        )}
        {this.state.somedayUpdating ? (
          <Processing
            task={this.state.somedayUpdating}
            save={this.saveSomeday}
            saveAsTask={this.saveSomedayAsTask}
            close={this.closeUpdateSomeday}
            delete={this.deleteSomeday}
            type="someday"
          />
        ) : (
          ""
        )}
        <button className="logout-button" onClick={this.logout}>
          Logout
        </button>
      </div>
    );
  }
}

export default App;
