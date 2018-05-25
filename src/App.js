import React, {Component} from 'react';
import './App.css';

import Navbar from './navbar/Navbar'
import Main from './main/Main'


class App extends Component {
    constructor(props) {
        super(props);
        this.updateLocale = this.updateLocale.bind(this);
        window.ts_preferred_locale = {
            locale: 'ru'
        };

        this.state = {
            locale:  window.ts_preferred_locale.locale
        }

    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <Navbar updateLocale = {this.updateLocale}  locale = {this.state.locale}/>
                </header>
                <div className="container">
                    <Main locale = {this.state.locale}/>
                </div>
            </div>
        );
    }

    updateLocale(value) {
        this.setState({ locale: value })
    }
}

export default App;


