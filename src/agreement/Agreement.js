import React, { Component } from 'react';
import './Agreement.css';


import locale from './locale/locale.json';

class Agreement extends Component{

    signature = 'signature.png';

    constructor(props) {
        super(props);
        this.state = {
            signed: window.ts_signed_done ? window.ts_signed_done : window.Android.checkSignature(this.signature)
        };
        this.handleAgreementClick = this.handleAgreementClick.bind(this)

    }

    handleAgreementClick() {
        if(this.state.signed){
            this.props.history.push('/agreement_phone');
            return;
        }
        let self = this;
        window.onSignedDone = function(isDone) {
            self.setState({
                signed: isDone
            });
            window.ts_signed_done = isDone;
        };

        window.Android.getSignature(this.signature, 'onSignedDone');
    }

    render(){
        return (
            <div className="container">
                <h1 className="text-center"><small>{locale[this.props.locale].userAgreement}</small></h1>
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ts-intro">
                            <p>{locale[this.props.locale].agreementText}</p>
                        </div>
                    </div>
                </div>
                <footer className="ts-fixed-footer">
                    {this.state.signed ?
                        <div className="col-xs-8 col-xs-offset-2 text-success">Соглашение подписано</div> :
                        null
                    }
                    <button type="button" className="btn btn-lg btn-primary agreement-btn" onClick={this.handleAgreementClick}>{locale[this.props.locale].subscrieButtonText}</button>
                </footer>

            </div>
        )
    }



}

export default Agreement