import React, {Component} from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom'

//route Components
import Home from '../home/Home'
import Agreement from '../agreement/Agreement'
import AgreementPhone from '../agreement-phone/AgreementPhone'
import Questions from '../questions/Questions';
import PhoneCheck from '../phone-check/PhoneCheck'
import PhoneAdd from '../phone-add/PhoneAdd'
import FinalPage from '../final-page/FInalPage'

class Main extends  Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <main>
                <Router>
                    <Switch>
                        <Route exact path='/' render={props => (
                            <Home {...props} locale={this.props.locale}/>
                        )}/>
                        <Route exact path='/agreement' render={props => (
                            <Agreement {...props} locale={this.props.locale}/>
                        )}/>
                        <Route exact path='/agreement_phone' render={props => (
                            <AgreementPhone {...props} locale={this.props.locale}/>
                        )}/>
                        <Route exact path='/questions' render={props => (
                            <Questions {...props} locale={this.props.locale}/>
                        )}/>
                        <Route exact path='/phone_check' render={props => (
                            <PhoneCheck {...props} locale={this.props.locale}/>
                        )}/>
                        <Route exact path='/phone_add' render={props => (
                            <PhoneAdd {...props} locale={this.props.locale}/>
                        )}/>
                        <Route exact path='/final_page' render={props => (
                            <FinalPage {...props} locale={this.props.locale}/>
                        )}/>
                    </Switch>
                </Router>
            </main>
        )

    }
}

export default Main