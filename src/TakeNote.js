import React from "react";
import { Tooltip } from "antd";
import "antd/dist/antd.css";

const TakeNote = ({ state, ...actions }) => {
  return (
    <div>
      {state.visible === false ? (
        <div className="take-notes1">
          <input
            type="text"
            placeholder="Take a note..."
            onClick={actions.handleClick}
            className="initial"
            value={state.notes.title}
            onChange={() => null}
          />
        </div>
      ) : (
        <div className="take-notes2">
          <Tooltip title="Enter the Title for this todo">
            <input
              type="text"
              value={state.notes.title}
              placeholder="Title"
              className="title"
              onChange={(e) =>
                actions.handleChangeNote(e.target.value, "title")
              }
            />
            <br></br>
          </Tooltip>
          <Tooltip title="Enter the task">
            <input
              type="text"
              value={state.notes.input}
              placeholder="Take a note..."
              onChange={(e) =>
                actions.handleChangeNote(e.target.value, "input")
              }
              className="take-note"
              autoFocus="autofocus "
            />
          </Tooltip>
          <label>
            Pick one:
            <Tooltip title="Select the catogery">
              <select
                value={state.notes.tag}
                onChange={(e) =>
                  actions.handleChangeNote(e.target.value, "tag")
                }
              >
                <option>Select</option>
                <option value="Daily">Daily</option>
                <option value="Coding">Coding</option>
                <option value="TaskList">TaskLists</option>
                <option value="Work">Work</option>
                <option value="Casual">Casual</option>
              </select>
            </Tooltip>
          </label>

          <label>
            <Tooltip title="Set the status">
              Priority:
              <select
                value={state.notes.status}
                onChange={(e) =>
                  actions.handleChangeNote(e.target.value, "status")
                }
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </Tooltip>
          </label>

          <Tooltip title="Select the Deadline">
            <input
              type="date"
              value={state.notes.dueDate}
              onChange={(e) =>
                actions.handleChangeNote(e.target.value, "dueDate")
              }
            />
          </Tooltip>
          <button onClick={actions.addToNotes}>Add</button>
        </div>
      )}
    </div>
  );
};

export default TakeNote;
