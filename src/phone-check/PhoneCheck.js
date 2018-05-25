import React, { Component } from 'react';
import InputMask from 'react-input-mask';
import './PhoneCheck.css'


import locale from './locale/locale.json'

class PhoneCheck extends Component{

    constructor(props) {
        super(props);
        this.handlePhoneCheckClick = this.handlePhoneCheckClick.bind(this)
    }

    handlePhoneCheckClick(e){
        e.preventDefault();
        let form = document.forms[0];
        let phone = form.elements[0].value;
        let code = form.elements[1].value;

        let checker = window.Android.checkPhoneCode(phone, code);

        if(checker === 0){
            let form = document.forms[0].elements;
            window.Android.saveCLMAnswer(0,'phone_number',form[0].value);
            window.Android.saveCLMAnswer(0,'phone_code',form[1].value)
           this.props.history.push("/phone_add");
            return;
        }

        alert(locale[this.props.locale].codeError);

    }

    render(){
        return(
            <form className="container ts-for-fixed-footer-padding" onSubmit={ (e)=> this.handlePhoneCheckClick(e)}>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ts-intro">
                            {locale[this.props.locale].smsPhoneNumber}
                        </div>
                        <div className="ts-intro ts-desc-text">
                            {locale[this.props.locale].typePhoneNumber}
                        </div>
                    </div>
                    <div className="ts-phone-check-container col-sm-8 col-sm-offset-2">
                        <label className="input-group">
                            <InputMask {...this.props} mask={locale[this.props.locale].phoneMask} maskChar=" "  className="form-control" placeholder={locale[this.props.locale].phoneMask} type="tel" required/>
                        </label>
                    </div>
                </div>
                <div className="row ts-row-footer-space">
                    <div className="col-xs-12">
                        <div className="ts-intro">
                            {locale[this.props.locale].smsPersonalCode}
                        </div>
                        <div className="ts-intro ts-desc-text">
                            {locale[this.props.locale].typePersonalCode}
                        </div>
                    </div>
                    <div className="ts-phone-check-container col-sm-8 col-sm-offset-2">
                        <label className="input-group">
                            <input required type="text" placeholder="Код" className="form-control "/>
                        </label>
                    </div>
                </div>
                <footer className="ts-fixed-footer">
                    <button type="submit" className="btn btn-lg btn-primary agreement-btn" >{locale[this.props.locale].nextButton}</button>
                </footer>
            </form>
        )
    }
};

export default PhoneCheck;