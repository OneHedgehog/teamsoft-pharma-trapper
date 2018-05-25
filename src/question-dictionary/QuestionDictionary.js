import React, {Component} from 'react';
import ReactModal from 'react-modal';

import './QuestionDictionary.css';

import locale from './locale/locale.json';

class QuestionDictionary extends Component {

    current_id = "";
    constructor (props) {
        super(props);
        this.state = {
            showModal: false
        };
        this.style = {
            maxHeight: this.props.dictionaryDictionaryDataSet.max_height + 'px',
            maxWidth: this.props.dictionaryDictionaryDataSet.max_height + 'px'
        }
        this.state.selected = null;
        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
        this.renderSelectedTest = this.renderSelectedTest.bind(this);

    }


    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal (e, item) {

        let updateStateObj = {
            showModal: false,
            selected: item,
            value: item.item_id
        }


        if(item.item_value){
            updateStateObj.value = item.item_value[this.props.locale];
        }
        this.setState(updateStateObj);
        if(this.props.onDictionaryChange){
            this.props.onDictionaryChange(updateStateObj.value, this.props.dictionatyChangeParams);
        }


    }

    render () {
        if( this.current_id  !== this.props.dictionaryQuestionDataSet.id){
            console.log('sdfsdf');
            this.setState({
                selected: null,
                value: ""
            })
        }

        this.current_id = this.props.dictionaryQuestionDataSet.id;

        let name = `$result_per_${this.props.dictionaryQuestionDataSet.id}`;
        if(this.props.tableName){
            name = this.props.tableName;
        }
        return (
            <div>
                <div className="ts-dictionary-question" onClick={this.handleOpenModal}>{this.renderSelectedTest(this.state.selected)}</div>
                <input type="hidden" name={`${name}`} value={this.state.value}/>
                <ReactModal
                    isOpen={this.state.showModal}
                    contentLabel="Minimal Modal Example"
                >
                    <div className='ts-dictionary-items-container'>
                        {this.renderDictionaryContext(this.props.dictionaryDictionaryDataSet)}
                    </div>
                </ReactModal>
            </div>
        );
    }

    renderDictionaryContext(dictionary){
        switch(dictionary.dictionary_type){
            case('simple'):
                return this.renderSimpleDictionaryItems(dictionary);
            case('image'):
                return this.renderImageDictionaryItems(dictionary);
            case('video'):
                return this.renderVideoDictionaryItems(dictionary);
        }
    }

    renderSimpleDictionaryItems(dictionary){
        let liDomElements = dictionary.items.map((item)=>{

            return (
                <li className='ts-simple-li-container' key={item.item_id} onClick={((e) => this.handleCloseModal(e, item))}>
                   <span>{item.item_value[this.props.locale]}</span>
                </li>
            )
        });

        return(
            <ul>
                {liDomElements}
            </ul>
        )
    }

    renderImageDictionaryItems(dictionary){

        let liDomElements = dictionary.items.map((item)=>{

            return (
                <li className="ts-dictionary-question-image-container" key={item.item_id} onClick={((e) => this.handleCloseModal(e, item))}>
                    <img src={item.item_src} alt="" style={this.style}/>
                </li>
            )
        });

         return(
             <ul>
                 {liDomElements}
             </ul>
             )

    }

    renderVideoDictionaryItems(dictionary){
        let liDomElements = dictionary.items.map((item)=>{

            let play_video =  function () {
                window.Android.playVideoFullScreen(item.item_src, true);
            }
            return (
                <li key={item.item_id} className="ts-dictionary-container">
                    <div className="ts-dictionary-question-video" onClick={((e) => this.handleCloseModal(e, item))}>
                        <img src={item.item_preview} alt=""/>
                    </div>
                    <button onClick={play_video}>{locale[this.props.locale].playVideo}</button>
                </li>
            )
        });

        return(
            <ul>
                {liDomElements}
            </ul>
        )
    }

    renderSelectedTest(selected){
        if(selected === null){
            return locale[this.props.locale].defaultText;
        }

        if(selected.item_value){
            return selected.item_value[this.props.locale]
        }

        if(selected.item_preview){
            return  (
                <div className="ts-dictionary-question-video">
                    <div className="ts-dictionary-question-video">
                        <img src={selected.item_preview} alt="" style={this.style}/>
                    </div>
                </div>
            )
        }

        return (
            <img src={selected.item_src} className='ts-dictionary-selected-image' style={this.style}/>
        )
    }


}

export default QuestionDictionary