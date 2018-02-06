import React from 'react'
import ReactDOM from 'react-dom';
import { MemoryRouter} from 'react-router-dom'
import App from './components/app'
import registerServiceWorker from './registerServiceWorker';
import './index.css'; // Sample global css file


const target = document.getElementById('root'); // Target in /public/index.html
ReactDOM.render(
            <MemoryRouter>
                <App />
            </MemoryRouter>,
        target)
registerServiceWorker();
