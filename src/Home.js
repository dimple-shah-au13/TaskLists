import React from "react";
import ReactPaginate from "react-paginate";
import Masonry from "react-masonry-css";
import TakeNote from "./TakeNote";

const PinnedNote = ({ state, removeFromNotes, removePin }) => {
  if (state.pinned_id) {
    return (
      <div className="pinned">
        <h4>Pinned</h4>
        {state.notes_list
          .filter((n) => {
            return n.id === state.pinned_id;
          })
          .map((item, index) => (
            <p key={index} className="list-item" id="li">
              <span className="span1">
                {item.title}{" "}
                <button className="pin-button" onClick={(e) => removePin()}>
                  <img className="pin" src="./push-pin.png" />
                </button>
              </span>
              <span className="span2">{item.input}</span>
              <button
                className="list-button"
                onClick={(e) => removeFromNotes(index, item.id)}
              >
                delete
              </button>
            </p>
          ))}
        <hr></hr>
      </div>
    );
  } else {
    return null;
  }
};
const Home = ({ state, styles, ...actions }) => {
  // const list_string = state.notes_list
  // const notes_list = JSON.parse(list_string);
  const slice = state.notes_list.slice(
    state.offset,
    state.offset + state.perPage
  );
  return (
    <>
      <div>
        <TakeNote state={state} {...actions} />
        <div
          className="popup"
          style={state.showPopUp ? styles.inputStyle : styles.inputStyle1}
        >
          <p className="text">
            <label>
              Set status:
              <select
                value={state.edited_note.status}
                onChange={(e) =>
                  actions.handleChangeNote(
                    e.target.value,
                    "status",
                    "edited_note"
                  )
                }
                className="edit-input"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </label>
            <span className="edit-title">
              <input
                value={state.edited_note.title}
                onChange={(e) =>
                  actions.handleChangeNote(
                    e.target.value,
                    "title",
                    "edited_note"
                  )
                }
              />{" "}
              <button onClick={(e) => actions.pinNote(state.popUp_id)}>
                <img className="pin" src="./push-pin.png" />
              </button>
            </span>
            <input
              value={state.edited_note.input}
              onChange={(e) =>
                actions.handleChangeNote(e.target.value, "input", "edited_note")
              }
              className="edit-input"
            />
            {/* <input value={state.edited_note.status} onChange={(e)=>actions.handleChangeNote(e.target.value,"status", "edited_note")} className="edit-input" /> */}
            <button
              onClick={(e) => actions.updateNote(state.popUp_id)}
              className="close"
            >
              Update
            </button>
            <button
              onClick={(e) => actions.removeFromNotes(state.popUp_id)}
              className="delete"
            >
              Delete
            </button>
          </p>
        </div>
        <PinnedNote state={state} {...actions} />
        <ul>
          <Masonry
            breakpointCols={4}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {(!state.search ? slice : state.search_list)
              .filter((n) => {
                return n.id !== state.pinned_id && n.id !== state.popUp_id;
              })
              .map((item, index) => (
                <li
                  key={index}
                  style={
                    item.status === "Medium" || item.status === "High"
                      ? item.status === "Medium"
                        ? { backgroundColor: "yellow" }
                        : { backgroundColor: "green" }
                      : { backgroundColor: "orange" }
                  }
                  className="list-item"
                >
                  <span className="span1">
                    {item.tag}
                    <button
                      className="pin-button"
                      onClick={(e) => actions.pinNote(item.id)}
                    >
                      <img className="pin" src="./push-pin.png" />
                    </button>
                  </span>
                  <span className="span1">Title: {item.title} </span>
                  <span className="span2">Task: {item.input}</span>

                  <span className="span2">{item.status}</span>
                  <span className="span2">Due Date: {item.dueDate}</span>
                  <div className="action">
                    <button
                      className="list-button"
                      onClick={(e) => actions.showNote(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="list-button"
                      onClick={(e) => actions.removeFromNotes(index, item.id)}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
          </Masonry>
        </ul>
      </div>
      {state.pageCount && (
        <div className="pagination">
          <ReactPaginate
            previousLabel={"prev"}
            nextLabel={"next"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={actions.handlePageClick}
            containerClassName={"pagination"}
            subContainerClassName={"pages pagination"}
            activeClassName={"active"}
          />
        </div>
      )}
    </>
  );
};

export default Home;
