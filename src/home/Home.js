import React, {Component} from 'react';
import './Home.css'

import locale from './locale/locale.json'

import { Link } from 'react-router-dom'

class Home extends  Component{
    constructor(props){
        super(props);

        //JSON STRING there. Take care, cause it is not an obj
        let prev_answers = window.Android.getCLMAllAnswers(0);

        if(prev_answers !== '{}'){
            sessionStorage.setItem('answers', prev_answers);
            this.props.history.push("/questions");
        }
    }

    render(){
        return (
                <div className="row ts-main-wrapper">
                    <div className="col-xs-12 ts-content">
                        <div className="ts-intro">
                            {locale[this.props.locale].homeInfo}
                        </div>
                    </div>
                    <footer className="ts-fixed-footer">
                        <div className="col-xs-8 ts-col-centered">
                            <Link to='/agreement' className="col-xs-5 btn btn-lg btn-primary">{locale[this.props.locale].agreeButton}</Link>
                            <button type="button" className="col-xs-5 btn btn-lg btn-primary home-btn">{locale[this.props.locale].disagreeButton}</button>
                        </div>
                    </footer>
                </div>
            )
    }
}

export default Home