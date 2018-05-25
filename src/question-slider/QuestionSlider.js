import React, {Component} from 'react';
import Slider from 'rc-slider';
// We can just import Slider or Range to reduce bundle size
// import Slider from 'rc-slider/lib/Slider';
// import Range from 'rc-slider/lib/Range';
import 'rc-slider/assets/index.css';
import Tooltip from 'rc-tooltip';

class QuestionSlider extends Component{

    updated = false;
    constructor(props){
        super(props);
        this.default_value = Math.floor(this.props.sliderQuestionDataSet.max_value/2);
        this.state = {
            sliderVal: this.default_value
        }
        this.setValue = this.setValue.bind(this);
    }

    render() {
        const Handle = Slider.Handle;
        const handle = (props) => {
            const { value, dragging, index, ...restProps } = props;
            this.updated = false;

            return (
                <Tooltip
                    prefixCls="rc-slider-tooltip"
                    overlay={value}
                    visible={dragging}
                    placement="top"
                    key={index}
                >
                    <Handle value={value} {...restProps} />
                </Tooltip>
            );
        };

        let min_value = this.props.sliderQuestionDataSet.min_value;
        let max_value = this.props.sliderQuestionDataSet.max_value;

        if(this.props.tableField !== undefined){
            min_value = this.props.tableField.min_value;
            max_value = this.props.tableField.max_value
        };

        let default_name = `$result_per_${this.props.sliderQuestionDataSet.id}`;
        if(this.props.tableName){
            default_name = this.props.tableName;
        };
        return(
            <div className="col-sm-8 col-sm-offset-2">
                <div>
                    <Slider min={min_value} max={max_value} defaultValue={this.default_value} handle={handle} onAfterChange={this.setValue}/>
                    <input type="hidden" value={this.state.sliderVal} name={default_name}/>
                </div>
            </div>
        )
    }


    setValue(sliderValue){
        if(this.props.onSliderChange){
            this.props.onSliderChange(sliderValue, this.props.sliderChangeParams);
        }

        if(this.updated === false){
            this.setState({
                sliderVal: sliderValue
            })
        }
        this.updated = true;
    }


}

export default QuestionSlider;