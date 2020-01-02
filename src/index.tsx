import * as React from 'react'
import { render } from 'react-dom'
import { Main } from './ui/Main';
import './style.scss';

class App extends React.Component {

    render() {
        return (
            <Main />
        )
    }
}

render(<App />, document.getElementById('app'));
