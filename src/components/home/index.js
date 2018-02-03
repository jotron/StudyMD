import { Link } from 'react-router-dom'

import React, { Component } from 'react';
import './home.css';

// pouchdb part
import * as mypouch from '../../pouch.js';
/*import PouchDB from 'pouchdb';
var db = new PouchDB('./pouch');*/
// end part

function Studyset(props) {
    return (
      <div className="row">
          <div className="twelve columns ">
              <Link to="/oneset"><div className="Setname">{props.set.doc.title}</div></Link>
              <div className="button button-primary set-edit"
                  onClick={() => props.setdelete(props.set)}>
                  <i className="fa fa-trash fa-lg"></i>
              </div>
          </div>
      </div>
    );
};

class Allsets extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sets: []
        };
        this.addset = this.addset.bind(this);
        this.setdelete = this.setdelete.bind(this);
        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        this.getsets();
    }
    getsets() {
        mypouch.showsets().then( data => {
            this.setState({
                sets: data.rows
            })
        }).catch(function (err) {
          console.log(err);
        });
    }
    addset(e) {
        if (e.key === 'Enter') {
            var setname = e.target.value;
            e.target.value = '';
            e.target.blur();
            mypouch.addset(setname);
            this.getsets();
        }
    }
    setdelete(set) {
        mypouch.deleteButtonPressed(set);
        this.getsets();
    }
    render() {
        var rendered_sets = this.state.sets.map(data => <Studyset set={data} setdelete={this.setdelete}/>);
        return (
            <div>
                {rendered_sets}
                <input className="button" type="text" placeholder="Add set" onKeyDown={this.addset} tabIndex="0"/>
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
