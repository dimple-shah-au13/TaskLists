import React from 'react';
import Home from './Home';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Trash from './Trash';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      edited_note: {
        title: '',
        input: '',
        status: '',
        listusers: [],
      },
      notes: {
        title: '',
        input: '',
        tag: '',
        status: '',
        dueDate: '2021-10-04',
      },
      deleted_note: {
        title: '',
        input: '',
      },
      search_list: [],
      notes_list: [],
      visible: false,
      pinned_id: null,
      showPopUp: false,
      popUp_id: null,
      trash_list: [],
      offset: 0,
      data: [],
      perPage: 4,
      currentPage: 0,
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChangeNote = this.handleChangeNote.bind(this);
    this.addToNotes = this.addToNotes.bind(this);
    this.removeFromNotes = this.removeFromNotes.bind(this);
    this.removePin = this.removePin.bind(this);
    this.pinNote = this.pinNote.bind(this);
    this.showNote = this.showNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.removeFromTrash = this.removeFromTrash.bind(this);
    this.actions = {
      handleClick: this.handleClick,
      handleChangeNote: this.handleChangeNote,
      addToNotes: this.addToNotes,
      removeFromNotes: this.removeFromNotes,
      removePin: this.removePin,
      pinNote: this.pinNote,
      showNote: this.showNote,
      updateNote: this.updateNote,
      removeFromTrash: this.removeFromTrash,
      handlePageClick: this.handlePageClick,
    };
    console.log(process.env.REACT_APP_API_KEY);
    
    
  }

  componentDidMount() {
    let Url = `https://devza.com/tests/tasks/listusers?key=${process.env.REACT_APP_API_KEY}`;
    fetch(Url, {
      method : "POST",
      body:JSON.stringify(this.state.listusers),
      headers : {
        "REACT_APP_API_KEY": "UrM4YHgb1FcqEf1tuKwmAMMX5MxFZ12a",
        "content-type" : "application/json",
      }
    }).then((result) => {
      result.json().then((resp) =>{
        this.setState({listusers:resp});
        console.warn("result",result);
        localStorage.setItem("listusers",JSON.stringify({
          token:result.token
        }))
      })
    })
      

    const trash_string = localStorage.getItem('trash');
    const trash_list = JSON.parse(trash_string);
    const list_string = localStorage.getItem('list');
    const notes_list = JSON.parse(list_string);
    this.setState({
      ...this.state,
      notes_list: notes_list ? notes_list : [],
      trash_list: trash_list ? trash_list : [],
    });
    if (notes_list) {
      this.setState({
        pageCount: Math.ceil(notes_list.length / this.state.perPage),
      });
    } else {
      this.setState({ pageCount: 0 });
    }
  }

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    const offset = selectedPage * this.state.perPage;

    this.setState({
      currentPage: selectedPage,
      offset: offset,
    });
  };

  handleClick() {
    this.setState({
      ...this.state,
      visible: true,
    });
  }
  handleSearch(value) {
    if (value.length > 0) {
      this.setState({
        ...this.state,
        search: value,
        search_list: this.state.notes_list.filter((note) => {
          return note.title.includes(value) || note.input.includes(value);
        }),
      });
    } else {
      this.setState({
        ...this.state,
        search: '',
        search_list: [],
      });
    }
  }
  handleChangeNote(value, key, obj = 'notes') {
    this.setState({
      ...this.state,
      [obj]: {
        ...this.state[obj],
        [key]: value,
      },
    });
  }
  addToNotes() {
    const notes_list = this.state.notes_list;
    if (
      this.state.notes.input.length > 10 &&
      this.state.notes.title.length > 2
    ) {
      notes_list.unshift({
        id: Date.now(),
        ...this.state.notes,
      });
      this.setState({
        ...this.state,
        notes_list: notes_list,
        notes: {
          ...this.state.notes,
          title: '',
          input: '',
        },
        visible: false,
      });
      localStorage.setItem('list', JSON.stringify(notes_list));
    } else {
      return alert('Invalid title and note length');
      // this.setState({
      //   ...this.state,
      //   visible: false,
      // });
    }
  }
  removeFromNotes(i, id) {
    let deleted_note = this.state.notes_list.filter((item) => {
      return item.id === id;
    })[0];
    const trash_list = this.state.trash_list;
    trash_list.unshift(deleted_note);
    this.setState({
      trash_list: trash_list,
    });
    const notes_list = this.state.notes_list.filter((note, index) => {
      return index !== i;
    });
    if (this.state.pinned_id) {
      this.setState({
        notes_list: notes_list,
        pinned_id: null,
      });
    } else {
      this.setState({
        showPopUp: false,
        notes_list: notes_list,
      });
    }
    localStorage.setItem('list', JSON.stringify(notes_list));
    localStorage.setItem('trash', JSON.stringify(trash_list));
  }
  pinNote(id) {
    this.setState({
      ...this.state,
      pinned_id: id,
    });
  }
  removePin() {
    this.setState({
      ...this.state,
      pinned_id: null,
    });
  }
  showNote(id) {
    let edited_note = this.state.notes_list.filter((item) => {
      return item.id === id;
    })[0];
    this.setState({
      ...this.state,
      edited_note,
      showPopUp: true,
      popUp_id: id,
    });
  }
  updateNote(id) {
    let note = this.state.edited_note;
    let containsOnlyOneElement = this.state.notes_list.length === 1;
    this.setState({
      ...this.state,
      notes_list: containsOnlyOneElement
        ? [{ id, ...note }]
        : [
            { id, ...note },
            ...this.state.notes_list.filter((item) => item.id !== id),
          ],
      edited_note: {
        title: '',
        input: '',
        status: '',
      },
      showPopUp: false,
      popUp_id: null,
    });
  }
  removeFromTrash(id) {
    const trash_list = this.state.trash_list.filter((item) => {
      return item.id !== id;
    });
    this.setState({
      ...this.state,
      trash_list: trash_list,
    });
  }

  render() {
    let styles = {
      inputStyle: {
        display: 'flex',
      },
      inputStyle1: {
        display: 'none',
      },
    };
    const list_string = localStorage.getItem('list');
    const notes_list = JSON.parse(list_string);

    var Coding_total = 0;
    var Work_total = 0;
    var Casual_total = 0;
    var Tasks_total = 0;
    var Daily_total = 0;

    if (notes_list) {
      notes_list.forEach((e) => {
        if (e.tag === 'Coding') {
          Coding_total += 1;
        } else if (e.tag === 'Work') {
          Work_total += 1;
        } else if (e.tag === 'Casual') {
          Casual_total += 1;
        } else if (e.tag === 'Tasks') {
          Tasks_total += 1;
        } else if (e.tag === 'Daily') {
          Daily_total += 1;
        }
      });
      
    }

    return (
      <div>

        <div className='header'>
          <img alt='' src='./logo.png' />
          <a href='/'>
            <h3>TodoList</h3>
          </a>

          <input
            className='search'
            type='text'
            placeholder='Search'
            value={this.state.search}
            onChange={(e) => this.handleSearch(e.target.value)}
          />

         {/* {this.state.listusers.map(listusers =><div>{listusers}.{listusers.name}</div>)} */}
        </div>

        <div className='content'>
          <Router>
            <div className='navigation'>
              <Link to='/' className='nav-home'>
                <img alt='home' className='home' src='./note.png' /> Dashboard
              </Link>
              <Link to='/trash' className='nav-trash'>
                <img alt='trash' className='trash' src='./del.png' />
                Trash
              </Link>
              <div className='top'>
                <p>
                  Total Coding tasks {Coding_total}
                  <br></br>
                  Work tasks pending : {Work_total}
                  <br></br>
                  Casual tasks pending : {Casual_total}
                  <br></br>
                  Daily tasks pending : {Daily_total}
                  <br></br>
                  TaskLists pending : {Tasks_total}
                  <br></br>
                </p>
              </div>
            </div>
            <Switch>
              <Route
                exact
                path='/'
                render={() => (
                  <Home state={this.state} styles={styles} {...this.actions} />
                )}
              />
              <Route
                path='/trash'
                render={() => (
                  <Trash state={this.state} styles={styles} {...this.actions} />
                )}
              />
                 <Route
                exact
                path='/https://devza.com/tests/tasks/listusers'
                render={() => (
                  <Home state={this.state.listusers} styles={styles} {...this.actions} />
                )}
              />

            </Switch>
          </Router>
        </div>
      </div>
    );
  }
}

export default App;
