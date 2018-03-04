import { Link } from 'react-router-dom';
import React, { Component } from 'react';
import './home.css';
import * as mypouch from '../../pouch.js';
import * as logic from './logic.js';
import Modal from 'react-modal';

class Selectedheader extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return(
            <div className="row">
                <div className={"two columns button bb"+ this.props.isselected(1)}
                    onClick={() => this.props.select(1)}>1</div>
                <div className={"two columns button bb"+ this.props.isselected(2)}
                    onClick={() => this.props.select(2)}>2</div>
                <div className={"two columns button bb"+ this.props.isselected(3)}
                    onClick={() => this.props.select(3)}>3</div>
                <div className={"two columns button bb"+ this.props.isselected(4)}
                    onClick={() => this.props.select(4)}>4</div>
                <div className={"two columns button bb"+ this.props.isselected(5)}
                    onClick={() => this.props.select(5)}>5</div>
                <div className={"two columns button bb"+ this.props.isselected(6)}
                    onClick={() => this.props.select(6)}>6</div>
            </div>
        );
    }
}

class Addset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalIsOpen: false,
            setpath: "",
            setname:"",
            selected: 3
        };

        this.render = this.render.bind(this);
        this.getfile= this.getfile.bind(this);
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.select = this.select.bind(this);
        this.isselected = this.isselected.bind(this);
        this.isclickable = this.isclickable.bind(this);
        this.submit = this.submit.bind(this);
    }
    openModal() {
        this.setState({modalIsOpen: true});
    }
    closeModal() {
        this.setState({
            modalIsOpen: false,
            setpath: "",
            setname:""
        });
    }
    submit() {
        if (this.state.clickable !== "") {
            logic.make_new(this.state.setpath, this.state.setname, this.state.selected, this.props.actualize);
            //console.log(this.state.setpath, this.state.setname, this.state.selected, this.props.actualize);
            this.closeModal();
        }
    }
    getfile() {
        var fileNames = logic.get();
        if(fileNames !== undefined){
            this.setState({
                setpath: fileNames[0]
            });
            if (this.state.setname === "") {
                var filename = fileNames[0].replace(/^.*[\\\/]/, '');
                this.setState({
                    setname: filename
                })
            }
        }
        else console.log("No file selected");
    }
    isclickable() {
        return (this.state.setpath === "") ? "unclickable" : "";
    }
    handleChange(event) {
        this.setState({setname: event.target.value});
    }
    isselected(i) {
        return (this.state.selected === i) ? " button-primary" : "";
    }
    select(i) {
        this.setState({selected: i});
    }
    render() {
        return(
            <div>
                <button id="addset" onClick={this.openModal} tabIndex="0">
                    Add set
                </button>
                <Modal
                    isOpen={this.state.modalIsOpen}
                    onRequestClose={this.closeModal}
                    contentLabel="Example Modal"
                    className="Modal"
                    overlayClassName="Overlay"
                    shouldCloseOnOverlayClick={false}
                >
                    <div className="row">
                        <input className="six columns"
                            type="text" placeholder="Setname"
                            value={this.state.setname}
                            onChange={this.handleChange}
                        />
                        <button className="six columns" onClick={this.getfile}>
                            {(this.state.setpath === "") ? "Select file" : "file selected"}
                        </button>
                    </div>
                    <p id="card-header-level">Card-Header Level</p>
                    <Selectedheader select={this.select} isselected={this.isselected}/>
                    <div className="row">
                        <button className="six columns lowerbuttons" onClick={this.closeModal}>Cancel</button>
                        <button className="six columns button-primary lowerbuttons" id={this.isclickable()}
                            onClick={this.submit}>Create Set</button>
                    </div>
                    {/*<input type="text" placeholder="Setname"/>
                    <button onClick={this.closeModal}>Select File</button>*/}
                </Modal>
            </div>
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
          <section id="allsets" className="container">
              <Allsets />
          </section>
      </div>
    );
}

export default App;
