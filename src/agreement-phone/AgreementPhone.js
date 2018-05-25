import React, {Component} from 'react';
import './AgreementPhone.css'

import locale from './locale/locale.json'

class AgreementPhone extends Component {

    constructor(props) {
        super(props);
        this.handleAgreementPhoneClick = this.handleAgreementPhoneClick.bind(this)
    }

    handleAgreementPhoneClick(){
        this.props.history.push("/questions");
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ts-intro">
                            <div className="ts-text-container">
                                <p>{locale[this.props.locale].costsCompenceText}</p>
                            </div>

                            <div className="ts-text-container">
                                <p>
                                    {locale[this.props.locale].sendMobileNumberText}
                                    <b className="ts-text-container__code-text">{locale[this.props.locale].sendingText}</b>
                                    {locale[this.props.locale].responseText}
                                </p>
                                <p className="ts-help-doctor-text">{locale[this.props.locale].helpDoctorText}</p>
                            </div>
                            <div className="ts-text-container">
                                <p>{locale[this.props.locale].smsSendPricetext}</p>
                                <p>{locale[this.props.locale].personalCodeText}</p>
                                <p>{locale[this.props.locale].giveAgreeText}</p>
                                <p>{locale[this.props.locale].mobileCallAlertText}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="ts-fixed-footer">
                    <div className="col-xs-8 ts-col-centered">
                        <button type="button" className="col-xs-12 btn btn-lg btn-primary" onClick={this.handleAgreementPhoneClick}>{locale[this.props.locale].btnText}</button>
                    </div>

                </footer>
            </div>
        );
    }
}

export default AgreementPhone