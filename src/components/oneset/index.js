import React from 'react'
import './oneset.css';
import { Link } from 'react-router-dom'



export default () => (
    <div>
        <div id="header">
            <h4>setName</h4>
            <Link id="back" to="/">
                <i class="fa fa-caret-left fa-lg" aria-hidden="true"></i>
                &nbsp;Sets
            </Link>
        </div>
        <div id="main">
            <div class="cardside frontside">
                <h4>Differenzialgesetze</h4>
            </div>
            <div class="cardside backside">
                <ul>
                    <li>Potenzregel</li>
                    <li>Produktregel</li>
                    <li>Summenregel</li>
                    <li>Kettenregel</li>
                </ul>
            </div>
            <div>
                <i class="fa fa-arrow-left fa-lg" aria-hidden="true"></i>
                &nbsp;&nbsp;&nbsp;
                <i class="fa fa-arrow-right fa-lg" aria-hidden="true"></i>
            </div>
        </div>
    </div>
)
