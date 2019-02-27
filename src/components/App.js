import React, { Component } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlay, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./App.css";
import InboxCount from "./InboxCount";
import InboxAdd from "./InboxAdd";
import Tasks from "./Tasks";
import Processing from "./Processing";
import Updating from "./Updating";

library.add(faPlay);
library.add(faTrash);

const testTime = Date.now();

class App extends Component {
  state = {
    processingInbox: false,
    hideTaskDescriptions: false,
    taskUpdating: null,
    inbox: [],
    tasks: []
  };

  componentDidMount() {
    document.addEventListener("keydown", this.hotkeys);
    this.loadFromLocalStorage();
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.hotkeys);
  }

  componentDidUpdate() {
    this.saveToLocalStorage();
  }

  loadFromLocalStorage = () => {
    if (localStorage.getItem("inbox") != null) {
      const inbox = JSON.parse(localStorage.getItem("inbox"));
      const tasks = JSON.parse(localStorage.getItem("tasks"));

      this.setState({ inbox, tasks });
    }
  };

  saveToLocalStorage = () => {
    const { inbox, tasks } = { ...this.state };

    localStorage.setItem("inbox", JSON.stringify(inbox));
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };

  hotkeys = e => {
    const { target, code } = e;

    if (target === document.querySelector("body")) {
      switch (code) {
        case "KeyA":
          e.preventDefault();
          this.inboxAddRef.descRef.focus();
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

  inboxAdd = description => {
    const inbox = [...this.state.inbox];
    const newInbox = {
      description,
      createdDate: Date.now()
    };
    inbox.push(newInbox);
    this.setState({ inbox });
    this.blur();
  };

  processInbox = () => {
    this.setState({ processingInbox: this.state.inbox.length > 0 });
  };

  closeProcessInbox = () => {
    this.setState({ processingInbox: false });
  };

  saveInboxAsTask = oTask => {
    const { tasks, inbox } = { ...this.state };

    oTask.updatedDate = Date.now();
    oTask.id =
      oTask.createdDate +
      String(Math.round(Math.random() * 10000)).slice(0, 16);
    tasks.push(oTask);
    this.deleteNextInbox();

    this.setState({ tasks, inbox });

    return this.state.inbox.length > 0;
  };

  deleteNextInbox = () => {
    const { inbox } = { ...this.state };
    inbox.shift();
    this.setState({ inbox });
    return this.state.inbox.length > 0;
  };

  updateTask = oTask => {
    this.setState({ taskUpdating: oTask });
  };

  saveTask = oTask => {
    const { tasks } = { ...this.state };

    const index = tasks.reduce(
      (acc, cur, ind) => (acc = cur.id === oTask.id ? ind : acc),
      null
    );

    if (index != null) {
      tasks[index] = oTask;
      this.setState({ tasks });
      this.closeUpdateTask();
    }
  };

  deleteTask = taskId => {
    const { tasks } = { ...this.state };

    const index = tasks.reduce(
      (acc, cur, ind) => (acc = cur.id === taskId ? ind : acc),
      null
    );

    if (index != null) {
      tasks.splice(index, 1);
      this.setState({ tasks });
      this.closeUpdateTask();
    }
  };

  closeUpdateTask = () => {
    this.setState({ taskUpdating: null });
  };

  render() {
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
        {this.state.processingInbox && this.state.inbox.length > 0 ? (
          <Processing
            nextInbox={this.state.inbox[0]}
            closeProcessInbox={this.closeProcessInbox}
            saveInboxAsTask={this.saveInboxAsTask}
            deleteNextInbox={this.deleteNextInbox}
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
