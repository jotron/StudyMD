import React, { Component } from 'react';
import './oneset.css';
import { Link } from 'react-router-dom'
import * as mypouch from '../../pouch.js';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            hidden: true
        };
        this.num = this.props.cards.length;
        this.render = this.render.bind(this);
    }
    forward() {
        if (this.state.index !== this.num - 1) {
            this.setState({
                index: this.state.index + 1
            });
            this.hide();
        }
    }
    backward() {
        if (this.state.index !== 0) {
            this.setState({
                index: this.state.index - 1
            });
            this.hide();
        }
    }
    hide() {
        this.setState({
            hidden: !this.state.hidden
        });
    }
    render() {
        return (
            <div>
                <div className="cardside frontside"
                    onClick={() => this.hide()}>
                    <h4>{this.props.cards[this.state.index].f}</h4>
                </div>
                {
                    (!this.state.hidden)? (
                        <div className="cardside backside"
                            dangerouslySetInnerHTML={{__html: this.props.cards[this.state.index].b}}>
                        </div>
                    ) : (null)
                }
                <div>
                    <i className="fa fa-arrow-left fa-lg"
                        aria-hidden="true"
                        onClick={() => this.backward()}></i>
                    &nbsp;&nbsp;&nbsp;
                    <i className="fa fa-arrow-right fa-lg"
                        aria-hidden="true"
                        onClick={() => this.forward()}></i>
                </div>
            </div>
        );
    }
}

class Oneset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false
        };
        mypouch.getset(props.match.params.path_id).then( data => {
            console.log("Successfully got doc!");
            this.doc = data;
            this.setState({
                loaded: true
            });
            this.render();
        }).catch(function(err) {
            console.log(err);
        });
        this.render = this.render.bind(this);
    }
    render() {
        if (this.state.loaded) {
            return (
                <div>
                    <div id="header">
                        <h4>{this.doc.title}</h4>
                        <Link id="back" to="/">
                            <i className="fa fa-caret-left fa-lg" aria-hidden="true"></i>
                            &nbsp;Sets
                        </Link>
                    </div>
                    <div id="main">
                        <Card cards={this.doc.cards}/>
                    </div>
                </div>
            );
        }
        else {
            return null;
        }
    }
}

export default Oneset;
