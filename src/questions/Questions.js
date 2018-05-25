import React, {Component} from 'react';
import './Questions.css'

import questions from './mock/questions.json'
import dictionaries from './mock/dictonaries.json'

import QuestionsTable from '../questions-table/QuestionsTable';
import QuestionSlider from '../question-slider/QuestionSlider';
import QuestionDictionary from "../question-dictionary/QuestionDictionary";

import locale from './locale/locale.json';

class Questions extends Component {
    answers = {};
    counter = 0;
    dictionaries = {};

    constructor(props) {
        super(props);
        questions.questions = this.sortItems(questions.questions, questions.questions_order, 'id');
        this.handleAnswerClick = this.handleAnswerClick.bind(this);
        this.state = {
            number: this.counter
        };

        this.state.current_question = questions.questions[this.state.number];
        this.dictionaries = this.initializeDictionaryDataSets();
        let answers = sessionStorage.getItem('answers');

        if (answers !== null) {
            this.answers = JSON.parse(answers);
        }

        if (this.state.current_question.dictionary_identifier) {
            this.state.currentDictionary = this.dictionaries[this.state.current_question.dictionary_identifier];
        }

    }

    //template for question
    render() {
        if (this.state.current_question.dictionary_identifier && this.state.current_question.order) {
            this.state.currentDictionary.items = this.sortItems(this.state.currentDictionary.items, this.state.current_question.order, 'item_id');
        }
        let question_text = this.initQuestionTextValue(this.state.current_question.value[this.props.locale]);
        return (
            <form className="container" onSubmit={this.handleAnswerClick}>
                <div className="row ts-for-fixed-footer-padding">
                    <div className="col-xs-12 ts-question-container">
                        <p className="ts-question-container__question-value">{question_text}</p>
                        {this.initQuestionDescription(this.state.current_question)}
                        {this.renderMediaSlide()}
                        {this.checkAnswerType(this.state.current_question)}
                    </div>
                </div>
                <footer className="ts-fixed-footer">
                    <div className="col-xs-8 ts-col-centered">
                        <button type="submit"
                                className="col-xs-12 btn btn-lg btn-primary">{locale[this.props.locale].agreeButton}</button>
                    </div>
                </footer>
            </form>

        )
    }

    //react hook, first render
    componentDidMount() {
        this.filterQuestions();
    }

    //react hook, every render, except first
    componentDidUpdate() {
        this.filterQuestions();
    }

    //react hook, when we change component
    componentWillUnmount() {
        sessionStorage.setItem('answers', JSON.stringify(this.answers));
    }


    initQuestionTextValue(value) {
        let needle = value.match(/#(.*)#/);
        if (needle === null) {
            return value;
        }

        let replacer = this.answers[`$result_per_${needle[1]}`];
        if (replacer == undefined) replacer = ''
        let replaced_val = value.replace(needle[0], replacer);

        return replaced_val;

    }

    initQuestionDescription(question) {
        if (!question.description) {
            return null;
        }
        ;
        return (
            <p className="ts-question-descr">
                {question.description}
            </p>
        );
    }

    //switch default keys in dictionaries.json to their ids
    initializeDictionaryDataSets() {

        let localDictionaries = {};
        dictionaries.forEach((item, i) => {
            localDictionaries[item.dictionary_id] = item;
        });


        return localDictionaries;
    }

    sortItems(sort_items, sort_type, sort_field) {
        switch (sort_type) {
            case 'asc':
                sort_items.sort((a, b) => {
                    if (a[sort_field] < b[sort_field]) return -1;
                    if (a[sort_field] > b[sort_field]) return 1;
                    return 0;
                });
                break;
            case 'desc':
                sort_items.sort((a, b) => {
                    if (a[sort_field] > b[sort_field]) return -1;
                    if (a[sort_field] < b[sort_field]) return 1;
                    return 0;
                });
                break;
            case 'random':
                sort_items.sort(() => {
                    return 0.5 - Math.random();
                });
                break;
        }
        return sort_items;
    }

    renderMediaSlide() {
        if (this.state.current_question.value_src) {
            let imgStyle = {
                maxWidth: this.state.current_question.max_height + 'px',
                maxHeight: this.state.current_question.max_height + 'px'
            };

            let src_url = this.state.current_question.value_src;
            switch (this.state.current_question.value_src_type) {
                case 'image':
                    return this.renderImage(imgStyle, src_url);
                case 'video':
                    return this.renderVideo(imgStyle, src_url);
            }
        }
        return null;
    }

    renderImage(imgStyle, src_url) {
        return (
            <p>
                <img src={src_url} style={imgStyle} className="ts-question-media-slide"/>
            </p>
        )
    }

    renderVideo(imgStyle, src_url) {
        imgStyle.prev_src = this.state.current_question.value_preview;
        let play_video = function () {
            window.Android.playVideoFullScreen(`${src_url}`, true);
        }

        return (
            <p className="video-container">
                <span className='ts-play-icon'><img src="img/play-icon.png" alt="" onClick={play_video}/></span>
                <img src={imgStyle.prev_src} style={imgStyle} className="ts-question-media-slide"/>
            </p>
        )
    }

    //main render function, check types and return rendering func
    checkAnswerType(current_question) {
        // no need to break, we have returnR
        switch (current_question.type) {
            case 'radiogroup':
                return this.renderRadiogroupAnswer();
            case 'int':
                return this.renderIntAnswer();
            case 'checkbox':
                return this.renderCheckboxAnswer();
            case 'table':
                return this.renderTableAnswer();
            case 'date':
                return this.renderDateAnswer();
            case 'float':
                return this.renderFloatAnswer();
            case 'string':
                return this.renderStringAnswer();
            case 'slider':
                return this.renderSliderAnswer();
            case 'dictionary':
                return this.renderDictionaryAnswer();
        }
    }

    renderRadiogroupAnswer() {
        let listItemsDom = null;
        let imgStyle = {
            maxWidth: this.state.currentDictionary.max_height + 'px',
            maxHeight: this.state.currentDictionary.max_height + 'px'
        };
        switch (this.state.currentDictionary.dictionary_type) {
            case 'simple':
                listItemsDom = this.state.currentDictionary.items.map((item, i) => {
                    return (
                        <label key={`radio_${item.item_id}`}
                               className="btn btn-default text-left ts-radiogroup-container__item">
                            <input required="" type="radio" name={`$result_per_${this.state.current_question.id}`}
                                   value={item.item_value[this.props.locale]}/>
                            <span>{item.item_value[this.props.locale]}</span>
                        </label>
                    )
                });
                break;
            case 'image':
                listItemsDom = this.state.currentDictionary.items.map((item, i) => {
                    return (
                        <label key={`radio_${item.item_id}`}
                               className="btn btn-default text-left ts-checkbox-container__media">
                            <input name={`$result_per_${this.state.current_question.id}`} value={item.item_id}
                                   type="radio"/>
                            <img src={item.item_src} style={imgStyle} className="ts-image-fixed"></img>
                        </label>
                    )
                });
                break;
            case "video":

                listItemsDom = this.state.currentDictionary.items.map((item, i) => {
                    let play_video = function () {
                        window.Android.playVideoFullScreen(item.item_src, true);
                    }
                    return (
                        <label key={`radio_${item.item_id}`}
                               className="btn btn-default text-left ts-checkbox-container__media">
                            <input name={`$result_per_${this.state.current_question.id}`} value={item.item_id}
                                   type="radio"/>
                            <p className="video-container">
                                <span className='ts-play-icon'><img src="img/play-icon.png" alt=""
                                                                    onClick={play_video}/></span>
                                <img src={item.item_preview} style={imgStyle} className="ts-question-media-slide"/>
                            </p>
                        </label>
                    )
                });
                break;
        }


        return (
            <div className="ts-radiobutton-container">
                {listItemsDom}
            </div>

        )
    };

    renderIntAnswer() {
        return (
            <div className="ts-int-container col-sm-8 col-sm-offset-2">
                <label className="input-group">
                    <input required type="number" name={`$result_per_${this.state.current_question.id}`}
                           min={this.state.current_question.min_value} max={this.state.current_question.max_value}
                           className="form-control "/>
                </label>
            </div>
        )
    }

    renderCheckboxAnswer() {
        let listItemsDom = null;
        let imgStyle = {
            maxWidth: this.state.currentDictionary.max_height + 'px',
            maxHeight: this.state.currentDictionary.max_height + 'px'
        };
        switch (this.state.currentDictionary.dictionary_type) {
            case 'simple':
                listItemsDom = this.state.currentDictionary.items.map((item, i) => {
                    return (
                        <label key={`checkbox_${item.item_id}`}
                               className="btn btn-default text-left ts-checkbox-container__item">
                            <input name={`$result_per_${this.state.current_question.id}`}
                                   value={item.item_value[this.props.locale]} type="checkbox"/>
                            <span>{item.item_value[this.props.locale]}</span>
                        </label>
                    )
                });
                break;
            case 'image':
                listItemsDom = this.state.currentDictionary.items.map((item, i) => {
                    return (
                        <label key={`checkbox_${item.item_id}`}
                               className="btn btn-default text-left ts-checkbox-container__media">
                            <input name={`$result_per_${this.state.current_question.id}`} value={item.item_id}
                                   type="checkbox"/>
                            <img src={item.item_src} style={imgStyle} className="ts-image-fixed"></img>
                        </label>
                    )
                });
                break;
            case "video":

                listItemsDom = this.state.currentDictionary.items.map((item, i) => {
                    let play_video = function () {
                        window.Android.playVideoFullScreen(item.item_src, true);
                    }
                    return (
                        <label key={`checkbox_${item.item_id}`}
                               className="btn btn-default text-left ts-checkbox-container__media">
                            <input name={`$result_per_${this.state.current_question.id}`} value={item.item_id}
                                   type="checkbox"/>
                            <p className="video-container">
                                <span className='ts-play-icon'><img src="img/play-icon.png" alt=""
                                                                    onClick={play_video}/></span>
                                <img src={item.item_preview} style={imgStyle} className="ts-question-media-slide"/>
                            </p>
                        </label>
                    )
                });
                break;
        }

        return (
            <div className="ts-checkbox-container">
                {listItemsDom}
            </div>
        )

    }

    renderTableAnswer() {

        let local_question = this.state.current_question;

        //add dictionary field to relevent 'fields' field in current_question data set
        local_question.fields.forEach((item) => {
            if (item.dictionary_identifier) {
                item.dictioanary = this.dictionaries[item.dictionary_identifier];
            }
        });

        //render new component ( a lot of logic for table )
        return (
            <QuestionsTable tableDataSet={local_question} locale={this.props.locale}/>
        );

    }

    renderDateAnswer() {
        let input = <input required type="date" name={`$result_per_${this.state.current_question.id}`}
                           min={this.state.current_question.min_value} max={this.state.current_question.max_value}
                           className="form-control"/>;
        return (
            <div className="ts-date-container col-sm-8 col-sm-offset-2">
                <label className="input-group">
                    {input}
                </label>
            </div>
        )
    }

    renderFloatAnswer() {
        return (
            <div className="ts-int-container col-sm-8 col-sm-offset-2">
                <label className="input-group">
                    <input required type="number" step="any" name={`$result_per_${this.state.current_question.id}`}
                           min={this.state.current_question.min_value} max={this.state.current_question.max_value}
                           className="form-control "/>
                </label>
            </div>
        )
    }

    renderStringAnswer() {
        return (
            <div className="ts-string-container col-sm-8 col-sm-offset-2">
                <label className="input-group">
                    <input required type="text" name={`$result_per_${this.state.current_question.id}`}
                           min={this.state.current_question.min_value} max={this.state.current_question.max_value}
                           className="form-control "/>
                </label>
            </div>
        )
    }

    renderSliderAnswer() {
        return (
            <QuestionSlider sliderQuestionDataSet={this.state.current_question}
                            sliderDictionaryDataSet={this.state.currentDictionary}/>
        )
    }

    renderDictionaryAnswer() {

        return (
            <QuestionDictionary locale={this.props.locale} dictionaryQuestionDataSet={this.state.current_question}
                                dictionaryDictionaryDataSet={this.state.currentDictionary}/>
        )
    }

    handleAnswerClick(e) {
        let serialize_object = {};
        e.preventDefault();


        //array to collect checkbox values
        let checkboxArrVal = [];

        let valid = true;

        //collect form data for ONE question.
        Array.from(document.forms[0].elements).forEach((item) => {

            let class_arr = item.classList.value.split(' ');
            if (class_arr[class_arr.length - 1] === 'ts-input-invalid') {
                valid = false;
            }
            ;

            if (
                item.type === 'date'
                && (this.state.current_question.min_value || this.state.current_question.max_value)
            ) {
                valid = true;
                if (new Date(this.state.current_question.min_value) > new Date(item.value)) {
                    alert(locale[this.props.locale].date.min);
                    valid = false;
                }

                if (new Date(this.state.current_question.max_value) < new Date(item.value)) {
                    alert(locale[this.props.locale].date.max);
                    valid = false;
                }

            }

            if (
                (item.type === 'radio' && item.checked !== false && item.value)
                || (item.type === 'number' && item.value)
                || (item.type === 'date' && item.value)
                || (item.type === 'text' && item.value)
                || (item.type === 'hidden' && item.value)
            ) {
                serialize_object[item.name] = item.value;
            }

            if (item.type === 'checkbox' && item.checked !== false && this.state.current_question.type !== 'table') {
                checkboxArrVal.push(item.value);
                serialize_object[item.name] = checkboxArrVal;
            }

            if (item.type === 'checkbox' && item.checked !== false && this.state.current_question.type === 'table') {
                serialize_object[item.name] = item.value;
            }

        });

        if (this.state.current_question.type === 'table' && Object.keys(serialize_object).length !== 0) {
            serialize_object[`$result_per_${this.state.current_question.id}`] = true;
        }


        //init answers
        if (this.answers.length === 0) {
            this.answers = serialize_object;
        }


        //collect answers obj
        this.answers = Object.assign(this.answers, serialize_object);

        //check if next question exist
        if (valid) {
            Array.from(document.forms[0].elements).forEach((item) => {
                if (
                    (item.type === 'radio' )
                    || (item.type === 'number' )
                    || (item.type === 'date' )
                    || (item.type === 'text' )
                    || (item.type === 'hidden' )
                    || item.type === 'checkbox'
                ){
                    item.value = "";
                    if (item.checked) item.checked = false;
                }
            });
            for (let key in serialize_object) {
                window.Android.saveCLMAnswer(0, key, serialize_object[key])
            }
            ;

            this.updateClickState();
        }

        if (!questions.questions[this.counter + 1]) {
            //questions end
            this.processAnswersData(this.answers);
        }

    }

    updateClickState() {
        this.toNextQuestion();
    }

    processAnswersData(answers) {
        this.props.history.push('/phone_check');
    }

    toNextQuestion() {
        if (!questions.questions[this.counter + 1]) {
            this.processAnswersData(this.answers);
            return;
        }
        this.setState({
            number: ++this.counter,
            current_question: questions.questions[this.counter],
        });

        //here our state isn't already changed. We changed in callbacks. But now we should use local vars for updating
        if (questions.questions[this.counter].dictionary_identifier) {
            this.setState({
                currentDictionary: this.dictionaries[questions.questions[this.counter].dictionary_identifier]
            });
        }
    }

    filterQuestions() {
        if (!questions.questions[this.counter].filters) {
            return;
        }

        let reversed_filters = questions.questions[this.counter].filters.reverse();
        reversed_filters.forEach((item) => {
            let check_quest_answer = this.answers[`$result_per_${item.check_question_id}`] ? this.answers[`$result_per_${item.check_question_id}`] : null;
            switch (item.condition) {
                case '>':
                    if (item.value > check_quest_answer) {
                        if (item.type === 'show_question') {
                            return;
                        }
                        this.toNextQuestion();
                    }
                    break;
                case '<':
                    if (item.value < check_quest_answer) {
                        if (item.type === 'show_question') {
                            return;
                        }
                        this.toNextQuestion();
                    }
                    break;
                case '<=':
                    if (item.value <= check_quest_answer) {
                        if (item.type === 'show_question') {
                            return;
                        }
                        this.toNextQuestion();
                    }
                    break;
                case '>=':
                    if (item.value >= check_quest_answer) {
                        if (item.type === 'show_question') {
                            return;
                        }
                        this.toNextQuestion();
                    }
                    break;
                case '=':
                    if (item.value == check_quest_answer) {
                        if (item.type === 'show_question') {
                            return;
                        }
                        this.toNextQuestion();
                    }
                    break;
                case 'equals':
                    item.value.forEach((val) => {
                        if (val == check_quest_answer) {
                            if (item.type === 'show_question') return;
                            this.toNextQuestion();
                        }
                    });
                    break;
                case 'not equals':
                    item.value.forEach((val) => {
                        if (val != check_quest_answer) {
                            if (item.type === 'show_question') return;
                            this.toNextQuestion();
                        }
                    });
                    break;
                case 'is empty':
                    if (check_quest_answer === null) {
                        if (item.type === 'show_question') {
                            return;
                        }
                        this.toNextQuestion();
                    }
                    break;
                case 'not empty':
                    if (check_quest_answer !== null) {
                        if (item.type === 'show_question') {
                            return;
                        }
                        this.toNextQuestion();
                    }
                    break;

            }
        })
    }


}

export default Questions;