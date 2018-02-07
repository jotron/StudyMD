import React, { Component } from 'react';
import * as Mousetrap from 'mousetrap'
import './oneset.css';
import { Link, Redirect } from 'react-router-dom'
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
        this.hide = this.hide.bind(this);
        this.forward = this.forward.bind(this);
        this.backward = this.backward.bind(this);
    }
    componentDidMount() {
        Mousetrap.bind('space', this.hide);
        Mousetrap.bind('left', this.backward);
        Mousetrap.bind('right', this.forward);
    }
    componentWillUnmount() {
        Mousetrap.unbind('space', this.hide);
        Mousetrap.unbind('left', this.backward);
        Mousetrap.unbind('right', this.forward);
    }
    forward() {
        if (this.state.index !== this.num - 1) {
            this.setState({
                index: this.state.index + 1,
                hidden: true
            });
        }
    }
    backward() {
        if (this.state.index !== 0) {
            this.setState({
                index: this.state.index - 1,
                hidden: true
            });
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
                    <h4 dangerouslySetInnerHTML={{__html: this.props.cards[this.state.index].f}}>
                    </h4>
                </div>
                {
                    (!this.state.hidden)? (
                        <div className="cardside backside">
                            <div id="backcardcontainer" dangerouslySetInnerHTML={{__html: this.props.cards[this.state.index].b}}></div>
                        </div>
                    ) : (null)
                }
                <div>
                    <a className="fa fa-arrow-left fa-lg arrows"
                        aria-hidden="true"
                        onClick={() => this.backward()}></a>
                    &nbsp;&nbsp;&nbsp;
                    <a className="fa fa-arrow-right fa-lg arrows"
                        aria-hidden="true"
                        onClick={() => this.forward()}></a>
                </div>
            </div>
        );
    }
}

class Oneset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            redirect: false
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
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.setRedirect = this.setRedirect.bind(this);
        this.renderRedirect = this.renderRedirect.bind(this);
    }
    componentDidMount() {
        Mousetrap.bind('esc', this.setRedirect);
    }
    componentWillUnmount() {
        Mousetrap.unbind('esc', this.setRedirect);
    }
    setRedirect() {
        this.setState({
            redirect: true
        })
    }
    renderRedirect() {
        if (this.state.redirect) {
            return <Redirect to='/'/>;
        }
    }
    render() {
        if (this.state.loaded) {
            return (
                <div>

                    {this.renderRedirect()}
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
