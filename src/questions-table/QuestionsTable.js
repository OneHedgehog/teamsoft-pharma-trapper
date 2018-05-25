import React, {Component} from 'react';
import './QuestionsTable.css';

import QuestionSlider from '../question-slider/QuestionSlider';
import QuestionDictionary from '../question-dictionary/QuestionDictionary'

class QuestionsTable extends Component{

    rows = null;
    columnsNumber = 0;
    fieldsValidate = [];

    constructor(props){
        super(props);
        this.columnsNumber = this.props.tableDataSet.fields.length;
        this.initFirstColumn();
        this.onSliderChange = this.onSliderChange.bind(this);
        this.onDictionaryChange = this.onDictionaryChange.bind(this);
    }

    render(){
        return (
            <table className='ts-table'>
                <thead>
                    {this.renderHeaderColumns()}
                </thead>
                <tbody>
                    {this.renderTableRows()}
                </tbody>
            </table>
        )
    }

    initFirstColumn(){
        this.props.tableDataSet.fields.forEach( (item, key) => {
            if(item.is_first_column){
                this.props.tableDataSet.fields.splice(key, 1);
                this.props.tableDataSet.fields.unshift(item);
            };
        })
    }

    renderHeaderColumns(){
        let th = this.props.tableDataSet.fields.map( item => {
            if(item.is_first_column){
                this.rows = item.dictioanary.items;
            }
            return (
                <th key={item.id}>
                    <span>{item.caption[this.props.locale]}</span>
                </th>
            )
        });

        return (
            <tr>
                {th}
            </tr>
        );
    }

    renderTableRows(){
        this.rows = this.sortItems(this.rows, this.props.tableDataSet.order, 'item_id');
        return this.rows.map( (item, key) => {
            return(
                <tr>
                    {this.renderColumnForRow(key)}
                </tr>
            )
        })

    }

    sortItems(sort_items, sort_type, sort_field){
        switch (sort_type) {
            case 'asc':
                sort_items.sort((a,b)=>{
                    return parseInt(a[sort_field]) - parseInt(b[sort_field]);
                });
                break;
            case 'desc':
                sort_items.sort((a, b) =>{
                    return  parseInt(b[sort_field]) -  parseInt(a[sort_field]);
                });
                break;
            case 'random':
                sort_items.sort(() =>{
                    return 0.5 - Math.random();
                });
                break;
        }
        return sort_items;
    }

    renderColumnForRow(trNumber){
        let tdDomArr = [];
        for( let i = 0; i <= this.columnsNumber-1; i++ ){

            tdDomArr.push(
                //td dom element
                this.renderColumnItemForRow(this.props.tableDataSet.fields[i], trNumber, i)
            )

        }

        return tdDomArr;
    }

    renderColumnItemForRow(field, trNumber, fieldNumber){
        if(field.is_first_column){
            return this.renderFirstColumn(fieldNumber, field, trNumber);
        }
        switch(field.type){
            case 'int':
                return this.renderTableInt(fieldNumber, field, trNumber);
            case 'dictionary':
                return this.renderTabeDictionary(fieldNumber, field, trNumber);
            case 'checkbox':
                return this.renderTableCheckbox(fieldNumber, field, trNumber);
            case 'slider':
                return this.renderTableSlider(fieldNumber, field, trNumber);
            case 'radiogroup':
                return this.renderTableRadioGroup(fieldNumber, field, trNumber);
            case 'date':
                return this.renderTableDateInput(fieldNumber, field, trNumber);
            case 'float':
                return this.renderTableFloatInput(fieldNumber, field, trNumber);
            case 'string':
                return this.renderTableStringInput(fieldNumber, field, trNumber);

        }
    }

    renderFirstColumn(fieldNumber, field, trNumber){

        return (
            <td key={`dictioanary_trNumber=${trNumber}_fieldNumber=${fieldNumber}`}>
               <span>{field.dictioanary.items[trNumber].item_value[this.props.locale]}</span>
            </td>
        )
    }

    renderTableInt(fieldNumber, field, trNumber){
        return (
            <td key={`int_trNumber=${trNumber}_fieldNumber=${fieldNumber}`}>
                <input className="form-control" onChange={(e) => this.onChange(e, field, trNumber)} type="Number" name={`$result_per_${field.id}:${this.rows[trNumber].item_id}`} max={this.props.tableDataSet.max_value} min={this.props.tableDataSet.min_value}/>
            </td>
        )
    }

    renderTabeDictionary(fieldNumber, field, trNumber){
        return (
            <td>
                <QuestionDictionary locale={this.props.locale}  onDictionaryChange={this.onDictionaryChange} dictionatyChangeParams={{field:field, trNumber: trNumber, filedNumber: fieldNumber}} dictUniqueClass={this.dictValidClass} dictionaryDictionaryDataSet={field.dictioanary} dictionaryQuestionDataSet={this.props.tableDataSet} tableName={`$result_per_${field.id}:${this.rows[trNumber].item_id}`}/>
            </td>
        )
    }

    renderTableCheckbox(fieldNumber, field, trNumber){
        return (
            <td key={`int_trNumber=${trNumber}_fieldNumber=${fieldNumber}`}>
                <input type="checkbox" name={`$result_per_${field.id}:${this.rows[trNumber].item_id}`} />
            </td>
        )
    }

    renderTableSlider(fieldNumber, field, trNumber){
        return (
            <td>
                <QuestionSlider onSliderChange={this.onSliderChange} sliderChangeParams={{field:field, trNumber: trNumber, filedNumber: fieldNumber}} sliderQuestionDataSet={this.props.tableDataSet}  tableField = {field}  tableName={`$result_per_${field.id}:${this.rows[trNumber].item_id}`}/>
            </td>

        )
    }

    renderTableRadioGroup(fieldNumber, field, trNumber){
        return (
            <td>
                <input  type="radio" name={`$result_per_${field.id}:${this.rows[trNumber].item_id}`}/>
            </td>
        )
    }

    renderTableDateInput(fieldNumber, field, trNumber){
        return (
            <td>
                <input onChange={(e) => this.onChange(e, field, trNumber)} required type="date"  className="form-control " name={`$result_per_${field.id}:${this.rows[trNumber].item_id}`}/>
            </td>
        )
    }

    renderTableFloatInput(fieldNumber, field, trNumber){
        return (
            <td>
                <input onChange={(e) => this.onChange(e, field, trNumber)} required type="number" step="any" className="form-control" name={`$result_per_${field.id}:${this.rows[trNumber].item_id}`} max={this.props.tableDataSet.max_value} min={this.props.tableDataSet.min_value}/>
            </td>
        )
    }

    renderTableStringInput(fieldNumber, field, trNumber){
        return (
            <td>
                <input  onChange={(e) => this.onChange(e, field, trNumber)} required type="text"  className="form-control" name={`$result_per_${field.id}:${this.rows[trNumber].item_id}`}/>
            </td>
        )
    }

    onChange(e, field, trNumber){

        if(field.is_unique != 1){
            return;
        };
        if(!this.fieldsValidate[field.id]){
            this.fieldsValidate[field.id] = [];
        }

        this.fieldsValidate[field.id][trNumber] = e.target.value;
        let valid =this.controlUnique(this.fieldsValidate[field.id], e.target.value);
        if(!valid){
            e.target.classList.add("ts-input-invalid");
        }else{
            e.target.classList.remove("ts-input-invalid");
        };
    }

    onSliderChange(val, params){

        if(!this.fieldsValidate[params.field.id]){
            this.fieldsValidate[params.field.id] = [];
        }

        this.fieldsValidate[params.field.id][params.trNumber] = val;
        let valid =this.controlUnique(this.fieldsValidate[params.field.id], val);

        let input = document.querySelector(`input[name="$result_per_${params.field.id}:${this.rows[params.trNumber].item_id}"]`);
        let invalid_slider = input.parentElement.children[0].children[3];

        if(!valid){
            input.classList.add("ts-input-invalid");
            invalid_slider.classList.add("ts-input-invalid");
        }else{
            input.classList.remove("ts-input-invalid");
            invalid_slider.classList.remove("ts-input-invalid");
        };
    }

    onDictionaryChange(val, params){
        if(!this.fieldsValidate[params.field.id]){
            this.fieldsValidate[params.field.id] = [];
        }

        this.fieldsValidate[params.field.id][params.trNumber] = val;
        let valid =this.controlUnique(this.fieldsValidate[params.field.id], val);

        let input = document.querySelector(`input[name="$result_per_${params.field.id}:${this.rows[params.trNumber].item_id}"]`);
        let input_container =input.parentElement.children[0];

        if(!valid){
            input.classList.add("ts-input-invalid");
            input_container.classList.add("ts-input-invalid");
        }else{
            input.classList.remove("ts-input-invalid");
            input_container.classList.remove("ts-input-invalid");
        };
    }


    controlUnique(inputs_data_set, val){
        let counter = 0;
        inputs_data_set.forEach((item)=> {
            if(item === val){
                counter++;
            }
        })

        if(counter < 2) return true;

        return false;
    }
}

export default QuestionsTable;