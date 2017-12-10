import React from 'react';
import { Route, Switch } from 'react-router-dom'
import Home from '../home'
import oneset from '../oneset'

import './skeleton.css';

// Routing
const App = () => (
  <div>
    <main>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/oneset" component={oneset} />
      </Switch>
      <section id="footer">
        <p className="vertical-centered"> Made with
          <i className="fa fa-heart" aria-hidden="true"> </i>
        by Joel André 2017</p>
      </section>
    </main>
  </div>
)

export default App
