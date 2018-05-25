import React, { Component } from 'react';
import InputMask from 'react-input-mask';

import locale from './locale/locale.json'

class PhoneAdd extends Component{
    constructor(props) {
        super(props);
        this.handlePhoneAddClick =  this.handlePhoneAddClick.bind(this);
        this.handleRadioClick = this.handleRadioClick.bind(this);
        this.state = {
            showSpecifyNumberInfo: 0
        }
    }

    render(){
        return (
            <form className="container ts-for-fixed-footer-padding" onSubmit={e => this.handlePhoneAddClick(e)}>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ts-intro">
                            {locale[this.props.locale].refillYouPhone}
                        </div>
                        <div className="ts-radiobutton-container">
                            <label  className="btn btn-default text-left ts-radiogroup-container__item">
                                <input required type="radio" name='PhoneAdd' onClick={this.handleRadioClick} value="0"/>
                                <span>{locale[this.props.locale].Yes}</span>
                            </label>
                            <label  className="btn btn-default text-left ts-radiogroup-container__item">
                                <input required type="radio" name='PhoneAdd' onClick={this.handleRadioClick} value="1"/>
                                <span>{locale[this.props.locale].No}</span>
                            </label>
                        </div>
                        {this.renderSpecifyNumber()}
                    </div>
                </div>
                <footer className="ts-fixed-footer">
                    <button type="sumbit" className="btn btn-lg btn-primary agreement-btn">{locale[this.props.locale].nextButton}</button>
                </footer>
            </form>
        )
    };

    handlePhoneAddClick(e){
        e.preventDefault();
        let number = document.forms[0].elements[2].value;
        if(number){
            window.Android.saveCLMAnswer(0, 'new_number', number);
        };

        this.props.history.push("/final_page");
    }

    handleRadioClick(e){
        this.setState({
            showSpecifyNumberInfo: e.target.value
        })
    }

    renderSpecifyNumber(){
        if(this.state.showSpecifyNumberInfo == 0){
            return null;
        }
        return (
            <div className="ts-specify-number-container">
                <div className="ts-intro ts-desc-text">
                    {locale[this.props.locale].specifyPhoneNumber}
                </div>
                <div className="ts-intro ts-desc-text">
                    {locale[this.props.locale].anotherProvider}
                </div>
                <div className="ts-phone-check-container col-sm-8 col-sm-offset-2">
                    <label className="input-group">
                        <InputMask {...this.props} mask={locale[this.props.locale].phoneMask} maskChar=" "  className="form-control" placeholder={locale[this.props.locale].phoneMask} required type="tel" name="phone"/>
                    </label>
                </div>
            </div>
        )
    }
}

export default PhoneAdd