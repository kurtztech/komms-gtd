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
  faTasks,
  faStream,
  faUser,
  faSortNumericDown,
  faSortNumericUp,
  faClock
} from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import base, { firebaseApp } from "../base";
import InboxCount from "./InboxCount";
import InboxAdd from "./InboxAdd";
import Tasks from "./Tasks";
import Folder from "./Folder";
import Processing from "./Processing";

library.add(faPlay);
library.add(faTrash);
library.add(faExclamation);
library.add(faSave);
library.add(faFolder);
library.add(faFolderOpen);
library.add(faCloud);
library.add(faTasks);
library.add(faStream);
library.add(faUser);
library.add(faSortNumericDown);
library.add(faSortNumericUp);
library.add(faClock);

class App extends Component {
  state = {
    inbox: {},
    tasks: {},
    someday: {},
    completed: {},
    uid: null,
    processingInbox: false,
    hideTaskDescriptions: false,
    taskUpdating: null,
    somedayUpdating: null,
    loading: true,
    showingSomeday: true,
    hoveringSomeday: false,
    showingDelegated: true,
    hoveringDelegated: false,
    showingScheduled: true,
    hoveringScheduled: false,
    renderCount: true,
    sortTasksBy: "oldest"
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
    window.onfocus = this.triggerRender;
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.hotkeys);
    window.onfocus = null;
  }

  triggerRender = () => {
    const { renderCount } = this.state;
    this.setState({ renderCount: !renderCount });
  };

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

    const { uid } = this.state;

    this.ref = base.syncState(`/${uid}/inbox`, {
      context: this,
      state: "inbox"
    });
    this.ref = base.syncState(`/${uid}/tasks`, {
      context: this,
      state: "tasks"
    });
    this.ref = base.syncState(`/${uid}/someday`, {
      context: this,
      state: "someday"
    });
    this.ref = base.syncState(`/${uid}/completed`, {
      context: this,
      state: "completed"
    });
    this.ref = base.syncState(`/${uid}/hideTaskDescriptions`, {
      context: this,
      state: "hideTaskDescriptions"
    });
    this.ref = base.syncState(`/${uid}/showingSomeday`, {
      context: this,
      state: "showingSomeday"
    });
    this.ref = base.syncState(`/${uid}/showingDelegated`, {
      context: this,
      state: "showingDelegated"
    });
    this.ref = base.syncState(`/${uid}/showingScheduled`, {
      context: this,
      state: "showingScheduled"
    });
    this.ref = base.syncState(`/${uid}/sortTasksBy`, {
      context: this,
      state: "sortTasksBy"
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
    let { hideTaskDescriptions } = { ...this.state };

    if (target === document.querySelector("body")) {
      switch (code) {
        case "KeyA":
          e.preventDefault();
          this.inboxAddRef.titleRef.focus();
          break;
        case "KeyH":
          e.preventDefault();
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

  completeFromInbox = id => {
    const { inbox, completed } = { ...this.state };
    completed[id] = inbox[id];
    completed[id].completedDate = Date.now();
    inbox[id] = null;
    this.setState({ completed, inbox });
  };

  getTasks = () => {
    const { tasks } = { ...this.state };
    const keys = Object.keys(tasks);
    const tasksOut = {};
    keys.forEach(key => {
      if (tasks[key].delegate === "") {
        tasksOut[key] = tasks[key];
      }
    });
    return tasksOut;
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

  completeTask = id => {
    const { tasks, completed } = { ...this.state };
    completed[id] = tasks[id];
    completed[id].completedDate = Date.now();
    tasks[id] = null;
    this.setState({ completed, tasks });
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

  completeSomeday = id => {
    const { someday, completed } = { ...this.state };
    completed[id] = someday[id];
    completed[id].completedDate = Date.now();
    someday[id] = null;
    this.setState({ completed, someday });
    this.closeUpdateSomeday();
  };

  getDelegated = () => {
    const { tasks } = { ...this.state };
    const keys = Object.keys(tasks);
    const tasksOut = {};
    keys.forEach(key => {
      if (tasks[key].delegate !== "") {
        tasksOut[key] = tasks[key];
      }
    });
    return tasksOut;
  };

  hoveringOnSomeday = () => {
    this.setState({ hoveringSomeday: true });
  };

  hoveringOffSomeday = () => {
    this.setState({ hoveringSomeday: false });
  };

  toggleShowingSomeday = () => {
    const { showingSomeday } = this.state;
    this.setState({ showingSomeday: !showingSomeday });
  };

  hoveringOnDelegated = () => {
    this.setState({ hoveringDelegated: true });
  };

  hoveringOffDelegated = () => {
    this.setState({ hoveringDelegated: false });
  };

  toggleShowingDelegated = () => {
    const { showingDelegated } = this.state;
    this.setState({ showingDelegated: !showingDelegated });
  };

  getScheduled = () => {
    const { tasks } = { ...this.state };
    const keys = Object.keys(tasks);
    const tasksOut = {};
    keys.forEach(key => {
      if (tasks[key].dueDate) {
        tasksOut[key] = tasks[key];
      }
    });
    return tasksOut;
  };
  hoveringOnScheduled = () => {
    this.setState({ hoveringScheduled: true });
  };

  hoveringOffScheduled = () => {
    this.setState({ hoveringScheduled: false });
  };

  toggleShowingScheduled = () => {
    const { showingScheduled } = this.state;
    this.setState({ showingScheduled: !showingScheduled });
  };

  isInboxStale = () => {
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

    return inboxStale;
  };

  toggleTaskSort = () => {
    const { sortTasksBy } = this.state;
    const newSort = sortTasksBy === "oldest" ? "newest" : "oldest";
    this.setState({ sortTasksBy: newSort });
  };

  render() {
    const {
      uid,
      loading,
      inbox,
      hideTaskDescriptions,
      showingDelegated,
      hoveringDelegated,
      someday,
      showingSomeday,
      hoveringSomeday,
      processingInbox,
      taskUpdating,
      somedayUpdating,
      renderCount,
      sortTasksBy,
      showingScheduled,
      hoveringScheduled
    } = this.state;

    if (uid === null) {
      return (
        <div className="App">
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <button
              onClick={() => {
                this.authenticate("Google");
              }}
              className="login-button"
              type="button"
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
            inbox={inbox}
            processInbox={this.processInbox}
            stale={this.isInboxStale()}
            renderCount={renderCount}
          />
          <InboxAdd
            ref={iar => (this.inboxAddRef = iar)}
            inboxAdd={this.inboxAdd}
          />
        </div>
        <div className="lists-section">
          <Tasks
            title="Next Tasks"
            tasks={this.getTasks()}
            hideDescriptions={hideTaskDescriptions}
            updateTask={this.updateTask}
            sortTasksBy={sortTasksBy}
            toggleTaskSort={this.toggleTaskSort}
          />
          <Folder
            title="Scheduled"
            tasks={this.getScheduled()}
            hideDescriptions={hideTaskDescriptions}
            updateTasks={this.updateTask}
            showing={showingScheduled}
            hovering={hoveringScheduled}
            toggleShowing={this.toggleShowingScheduled}
            hoveringOn={this.hoveringOnScheduled}
            hoveringOff={this.hoveringOffScheduled}
            sortTasksBy={sortTasksBy}
          />
          <Folder
            title="Delegated"
            tasks={this.getDelegated()}
            hideDescriptions={hideTaskDescriptions}
            updateTasks={this.updateTask}
            showing={showingDelegated}
            hovering={hoveringDelegated}
            toggleShowing={this.toggleShowingDelegated}
            hoveringOn={this.hoveringOnDelegated}
            hoveringOff={this.hoveringOffDelegated}
            sortTasksBy={sortTasksBy}
          />
          <Folder
            title="Someday"
            tasks={someday}
            hideDescriptions={hideTaskDescriptions}
            updateTasks={this.updateSomeday}
            showing={showingSomeday}
            hovering={hoveringSomeday}
            toggleShowing={this.toggleShowingSomeday}
            hoveringOn={this.hoveringOnSomeday}
            hoveringOff={this.hoveringOffSomeday}
            sortTasksBy={sortTasksBy}
          />
        </div>
        {processingInbox && this.getNextInbox() ? (
          <Processing
            task={this.getNextInbox()}
            save={this.saveInboxAsTask}
            saveAsSomeday={this.saveInboxAsSomeday}
            close={this.closeProcessInbox}
            complete={this.completeFromInbox}
            count={Object.keys(inbox).length}
            type="inbox"
          />
        ) : (
          ""
        )}
        {taskUpdating ? (
          <Processing
            task={taskUpdating}
            save={this.saveTask}
            saveAsSomeday={this.saveTaskAsSomeday}
            close={this.closeUpdateTask}
            complete={this.completeTask}
            type="task"
          />
        ) : (
          ""
        )}
        {somedayUpdating ? (
          <Processing
            task={somedayUpdating}
            save={this.saveSomeday}
            saveAsTask={this.saveSomedayAsTask}
            close={this.closeUpdateSomeday}
            complete={this.completeSomeday}
            type="someday"
          />
        ) : (
          ""
        )}
        <button className="logout-button" onClick={this.logout} type="button">
          Logout
        </button>
      </div>
    );
  }
}

export default App;
