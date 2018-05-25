import React, {Component} from 'react';
import './Navbar.css';

import { HashRouter as Router, Link } from 'react-router-dom'

class Navbar extends Component {
    constructor(props){
        super(props)
        this.handleChangeLanguageClick = this.handleChangeLanguageClick.bind(this);
        this.state = {
            img: 'ru.png'
        }
    }

    render() {
        return (
            <nav className="navbar navbar-default navbar-static-top">
                <div className="container">
                    <div className="navbar-header pull-left">
                        <span className="navbar-brand"><img alt="Brand"
                                                            src="img/logo-teamsoft.png"/>
                        </span>
                    </div>
                    <div className="navbar-header pull-right">
                        <span className="navbar-brand"><img alt="Brand" src="img/logo-mdm.png"/></span>
                    </div>
                    <ul className="nav pull-right">
                        <li>
                            <Router>
                                <Link to='/agreement'><span
                                    className="glyphicon glyphicon-info-sign"
                                    aria-hidden="true"></span></Link>
                            </Router>
                        </li>
                    </ul>
                    <div className="pull-right ts-select-language">
                        <span className="navbar-brand" onClick={this.handleChangeLanguageClick}><img src={`img/${this.state.img}`} alt=""/></span>
                    </div>
                </div>
            </nav>
    )}

    handleChangeLanguageClick(){
        if(this.props.locale === 'ru'){
            this.props.updateLocale('ua');
            this.setState({
                img: 'ua.png'
            })
            return;
        };
        this.props.updateLocale('ru');
        this.setState({
            img: 'ru.png'
        })
    }
}

export default Navbar;