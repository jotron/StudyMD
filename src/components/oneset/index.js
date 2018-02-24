import React, { Component } from 'react';
import update from 'immutability-helper';
import * as Mousetrap from 'mousetrap'
import './oneset.css';
import './markdown.css';
import { Link, Redirect } from 'react-router-dom'
import * as mypouch from '../../pouch.js';
import * as logic from '../home/logic.js';

class Card extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cards: this.props.cards,
            index: 0,
            hidden: true
        };
        this.num = this.props.cards.length;
        this.render = this.render.bind(this);
        this.hide = this.hide.bind(this);
        this.forward = this.forward.bind(this);
        this.backward = this.backward.bind(this);
    }
    componentWillReceiveProps(nextProps){
        if (nextProps.cards !== this.props.cards) {
            this.setState({ cards: nextProps.cards })
        }
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
        //console.log("State ", this.state.cards);
        //console.log("Props ", this.props.cards);
        console.log("render: ", this.state.cards)
        return (
            <div>
                <div className="container cardside" id="frontside"
                    onClick={() => this.hide()}>
                    <h4 dangerouslySetInnerHTML={{__html: this.state.cards[this.state.index].f}}>
                    </h4>
                </div>
                {
                    (!this.state.hidden)? (
                        <div className="cardside container" id="backside">
                            <div className="innercard markdown-body" dangerouslySetInnerHTML={{__html: this.state.cards[this.state.index].b}}></div>
                        </div>
                    ) : (null)
                }
                <div id="arrow-container">
                    <a className="fa fa-arrow-left fa-lg click"
                        aria-hidden="true"
                        onClick={() => this.backward()}></a>
                    &nbsp;&nbsp;&nbsp;
                    <a className="fa fa-arrow-right fa-lg click"
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
            doc: {},
            redirect: false
        };
        this.render = this.render.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
        this.setRedirect = this.setRedirect.bind(this);
        this.renderRedirect = this.renderRedirect.bind(this);
        this.getdoc = this.getdoc.bind(this);
        this.refresh = this.refresh.bind(this);

        this.getdoc()
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
    randomize() {
        this.setState(update(this.state, {
            doc: {
                cards: {$set: this.state.doc.cards.sort(function(a, b){
                    return 0.5 - Math.random();
                })}
            }
        }));
    }
    getdoc() {
        console.log("getdoc");
        mypouch.getset(this.props.match.params.path_id).then( data => {
            console.log("Successfully got doc!");
            this.setState({
                loaded: true,
                doc: data
            });
            this.render();
        }).catch(function(err) {
            console.log(err);
        });
    }
    refresh() {
        logic.refresh(this.props.match.params.path_id, this.getdoc);
    }
    render() {
        if (this.state.loaded) {
            return (
                <div>
                    <div id="header">
                        <h4>{this.state.doc.title}</h4>
                        <Link id="back" to="/">
                            <i className="fa fa-caret-left fa-lg" aria-hidden="true"></i>
                            &nbsp;Sets
                        </Link>
                        <div id="actions">
                            <a className="fa fa-random click" title="randomize" aria-hidden="true"
                                onClick={() => this.randomize()}></a>
                            &nbsp;&nbsp;
                            <a className="fa fa-refresh click" title="refresh" aria-hidden="true"
                                onClick={() => this.refresh()}></a>
                        </div>
                    </div>
                    <div id="main">
                        <Card cards={this.state.doc.cards}/>
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
