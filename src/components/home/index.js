import { Link } from 'react-router-dom'

import React, { Component } from 'react';
import './home.css';

function Studyset(props) {
    return (
      <div className="row">
          <div className="twelve columns ">
              <Link to="/oneset"><div className="Setname">{props.studysetname}</div></Link>
              <div className="button button-primary set-edit"
                  onClick={() => props.setdelete(props.setdelete)}>
                  <i className="fa fa-trash fa-lg"></i>
              </div>
        </div>
      </div>
    );
};

class Allsets extends Component {
    constructor(props) {
      super(props);
      this.state = {sets: []};
    }
    addset(props) {
      var setname = window.prompt();
      var newsets = this.state.sets.slice();
      newsets.push(<Studyset studysetname={setname} setdelete={() => this.setdelete(3)} key={setname}/>);
      this.setState({
        sets: newsets
      });
    }
    setdelete(itemid) {
      var newsets = this.state.sets;
      const index = newsets.findIndex(a => a.id === itemid);
      if (index === -1) return;
      newsets.splice(index, 1);
      this.setState({sets: newsets});
    }
    render() {
      this.addset = this.addset.bind(this);
      this.setdelete = this.setdelete.bind(this);
      return (
        <div>
          {this.state.sets}
          <button onClick={this.addset}>New Set</button>
        </div>
      );
    }
}

function App() {
    return (
      <div>
          <header id="header">
              <h2>Sets</h2>
          </header>
          <section id="main" className="container">
              <Allsets />
          </section>
      </div>
    );
}

export default App;
