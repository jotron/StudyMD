import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import './home.css';
import * as mypouch from '../../pouch.js';
import * as logic from './logic.js';

class Addset extends Component {
    constructor(props) {
        super(props);
        this.render = this.render.bind(this);
        this.type = this.type.bind(this);
    }
    type(e) {
        if (e.key === 'Enter') {
            var setname = e.target.value;
            e.target.value = '';
            e.target.blur();
            logic.get(setname, this.props.actualize);
        }
    }
    render() {
        return(
            <input className="button" type="text" placeholder="Add set" onKeyDown={this.type} tabIndex="0"/>
        );
    }
}

function Studyset(props) {
    return (
      <div className="row">
          <div className="twelve columns ">
              <Link to={props.set.id}><div className="Setname">{props.set.title}</div></Link>
              <div className="button button-primary set-edit"
                  onClick={() => props.setdelete(props.set.id)}>
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
        this.setdelete = this.setdelete.bind(this);
        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.getsets = this.getsets.bind(this);
    }
    componentDidMount() {
        this.getsets();
    }
    getsets() {
        mypouch.showsets().then( data => {
            this.setState({
                sets: data
            })
        }).catch(function (err) {
          console.log(err);
        });
    }
    setdelete(id) {
        mypouch.deleteid(id).then( result => {
            console.log(result);
            this.getsets();
        }).catch(function (err) {
            console.log(err);
        });
    }
    render() {
        var rendered_sets = this.state.sets.map(data => <Studyset set={data} setdelete={this.setdelete} key={data.id}/>);
        return (
            <div>
                {rendered_sets}
                <Addset actualize={this.getsets}/>
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
