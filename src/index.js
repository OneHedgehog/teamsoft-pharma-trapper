import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom'

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

if(typeof window.Android === 'undefined'){
    window.Android = {
        getCLMAnswer: function (slideId, key) {
            let min = 0, max = 1;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
        getCLMAllAnswers: function (b) {
            return '{}';
        },
        saveCLMAnswer: function (slideId, key, value) {
            console.log(slideId, key, value)
        },
        setIsFinished: function () {
            console.log('finished');
        },
        debugMode: function (b) {
        },
        closeCLM: function () {
            console.log('closed');
        },
        checkPhone: function () {
            return false;
        },
        savePhone: function () {
        },
        checkPhoneCode: function (phoneNumber, code) {
            if (code === 'test') return 1;
            if (code === 'wrong' || code === 'wrongest') return 2;
            if (code === 'wrong3') return 3;
            return 0
        },
        checkSignature: function (name) {
            return 0
        },
        getSignature: function (name, callback) {
            let isDone = parseInt(prompt('Type 1 or 0'));
            if (callback) {
                setTimeout(function () {
                    window[callback](isDone);
                })
            }
        },
        playVideoFullScreen(fileName, showControls){
            console.log('video play')
        }
    };

    window.onSignedDone = function(isDone) {
       return isDone;
    };
}
else {
    // window.Android.debugMode(true);
}

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
    document.getElementById('root'));
registerServiceWorker();
