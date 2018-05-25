import React, { Component } from 'react';

import locale from './locale/locale'

class FinalPage extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return(
            <form className="container">
                <div className="row">
                    <div className="col-xs-12">
                        <div className="ts-intro">
                            {locale[this.props.locale].thank}
                        </div>
                    </div>
                </div>
                <footer className="ts-fixed-footer">
                    <button type="button" className="btn btn-lg btn-primary agreement-btn" onClick={this.AndroidWrapSetIsFinished}>{locale[this.props.locale].end}</button>
                </footer>
            </form>
        );
    }

    AndroidWrapSetIsFinished(e){
        e.target.onclick = window.Android.setIsFinished();
    }

}

export default FinalPage