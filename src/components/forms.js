import React, {Component} from 'react';
import Loader from './loaders.js';


export function FormInput({label, helpText, error, required, inputRef, ...props}) {
    let helpSpan = '';
    if (helpText)
        helpSpan = <span className="help-text">{helpText}</span>;

    let errorSpan = '';
    if (error)
        errorSpan = <span className="help-text">{error}</span>;

    if (!props.className)
        props.className = 'form-control';

    if (inputRef)
        props.ref = inputRef;

    return (
        <div className={error ? "form-group error" : "form-group"}>
            {label ? <label>{label} {required && <span className="required-label">*</span>}</label> : null}
            <input {...props} />
            {errorSpan}
            {helpSpan}
        </div>
    );
}


export function FormInputGroup({label, helpText, error, required, append, prepend, ...props}) {
    let helpSpan = '';
    if (helpText)
        helpSpan = <span className="help-text">{helpText}</span>;

    let errorSpan = '';
    if (error)
        errorSpan = <span className="help-text">{error}</span>;

    if (!props.className)
        props.className = 'form-control';

    return (
         <div className={error ? "form-group error" : "form-group"}>
            {label ? <label>{label} {required && <span className="required-label">*</span>}</label> : null}
            <div className="input-group">
                {prepend && 
                    <div className="input-group-prepend">{prepend}</div>
                }
                <input {...props} />
                {append && 
                    <div className="input-group-append">{append}</div>
                }
            </div>
            {errorSpan}
            {helpSpan}
        </div>
    );
}


export class FormTextArea extends Component {
    constructor(props) {
        super(props);

        if (!props.inputRef)
            this.inputRef = React.createRef();
    }

    handleChange = (e) => {
        this.updateHeight(e.target);

        if (this.props.onChange)
            this.props.onChange(e);
    }

    updateHeight = (el) => {
        let offset = el.offsetHeight - el.clientHeight;
        el.style.height = 'auto';
        el.style.height = (el.scrollHeight + offset) + 'px';
    }

    componentDidMount() {
        if (this.props.autoHeight) {
            if (this.props.inputRef)
                this.updateHeight(this.props.inputRef.current);
            else 
                this.updateHeight(this.inputRef.current);
        }
    }

    render() {
        let {error, label, required, helpText, autoHeight, inputRef, ...props} = this.props;

        let helpSpan = '';
        if (helpText)
            helpSpan = <span className="help-text">{helpText}</span>;

        let errorSpan = '';
        if (error)
            errorSpan = <span className="help-text">{error}</span>;

        if (!this.props.className)
            props.className = 'form-control';

        if (autoHeight) 
            props.onChange = this.handleChange;


        return (
            <div className={error ? "form-group error" : "form-group"}>
                {label ? <label>{label} {required && <span className="required-label">*</span>}</label> : null}
                <textarea {...props} ref={inputRef || this.inputRef} />
                {errorSpan}
                {helpSpan}
            </div>
        );
    }
}


export function RadioCheckInput({label, ...props}) {
    return (
        <div className={"custom-control custom-" + props.type}>
            <label className="custom-control-label">
                {label}
                <input 
                    className="custom-control-input" 
                    {...props}
                />
                <div className="custom-control-indicator"></div>
            </label>
        </div>
    );
}


export class FormRadioInput extends Component {
    handleChange = (e) => {
        if (this.props.onChangeCallback) {
            this.props.onChangeCallback(e);
        }
    }

    render() {
        /* props.variant = inline || stacked */

        let helpSpan = '';
        if (this.props.helpText)
            helpSpan = <span className="help-text">{this.props.helpText}</span>;

        let errorSpan = '';
        if (this.props.error)
            errorSpan = <span className="help-text">{this.props.error}</span>;

        let inputClass = this.props.variant === "inline" ? "form-check form-check-inline" : "form-check";

        let options = this.props.options.map(
            (option) => <div className={inputClass} key={option.value}>
                            <RadioCheckInput 
                                type="radio"
                                name={this.props.name}
                                label={option.label}
                                value={option.value}
                                defaultChecked={option.value === this.props.defaultValue}
                                onChange={this.handleChange}
                            />
                        </div>
        );

        return (
            <div className={this.props.error ? "form-group error" : "form-group"}>
                <label>{this.props.label} {this.props.required && <span className="required-label">*</span>}</label>
                {options}
                {helpSpan}
                {errorSpan}
            </div>
        );
    }
}


export function _FormRadioInput(props) {
    /* props.variant = inline || stacked */

    let helpSpan = '';
    if (props.helpText)
        helpSpan = <span className="help-text">{props.helpText}</span>;

    let errorSpan = '';
    if (props.error)
        errorSpan = <span className="help-text">{props.error}</span>;

    let inputClass = props.variant === "inline" ? "form-check form-check-inline" : "form-check";

    let options = props.options.map(
        (option) => <div className={inputClass} key={option.value}>
                        <RadioCheckInput 
                            type="radio"
                            name={props.name}
                            label={option.label}
                            value={option.value}
                            defaultChecked={option.value === props.defaultValue}
                        />
                    </div>
    );

    return (
        <div className={props.error ? "form-group error" : "form-group"}>
            <label>{props.label} {props.required && <span className="required-label">*</span>}</label>
            {options}
            {helpSpan}
            {errorSpan}
        </div>
    );
}

export function CheckBoxInput({label, ...props}) {
    return (
        <div className="custom-control custom-checkbox">
            <label className="custom-control-label">
                {label}
                <input 
                    className="custom-control-input" 
                    type="checkbox" 
                    {...props}
                />
                <div className="custom-control-indicator"></div>
            </label>
        </div>
    );
}

export function FormCheckInput({label, helpText, error, variant, options, ...props}) {
    /* props.variant = inline || stacked */

    let helpSpan = '';
    if (helpText)
        helpSpan = <span className="help-text">{helpText}</span>;

    let errorSpan = '';
    if (error)
        errorSpan = <span className="help-text">{error}</span>;

    let inputClass = variant === "inline" ? "form-check form-check-inline" : "form-check";

    let defaultValue = props.defaultValue;
    if (defaultValue && !(defaultValue instanceof Array))
        defaultValue = [props.defaultValue];

    let value = props.value;
    if (value && !(value instanceof Array))
        value = [props.value];

    if (options) {
        let checkInputs = options.map(
            (option) => {
                let valueProps = {};

                if (defaultValue)
                    valueProps.defaultChecked = defaultValue.includes(option.value);

                if (value)
                    valueProps.checked = value.includes(option.value);

                return (
                    <div className={inputClass} key={option.value}>
                        <RadioCheckInput 
                            type="checkbox"
                            name={props.name}
                            label={option.label}
                            value={option.value}
                            {...valueProps}
                            onChange={props.onChange}
                        />
                    </div>
                );
            }
        );

        return (
            <div className={error ? "form-group error" : "form-group"}>
                <label>{label} {props.required && <span className="required-label">*</span>}</label>
                {checkInputs}
                {helpSpan}
                {errorSpan}
            </div>
        );

    }

    return (
        <div className={error ? "form-group form-check form-check-inline error" : "form-group form-check form-check-inline"}>
            <CheckBoxInput
                label={label}
                {...props}
            />
            {helpSpan}
            {errorSpan}
        </div>
    );
}



export class Typeahead extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: this.props.value || this.props.defaultValue || '',
            isShown: false,
            focusOptionIndex: -1,
            options: []
        };

        this.inputRef = React.createRef();
    }

    handleChange = (e) => {
        this.setState({value: e.target.value});
        this.props.loadOptions(e.target.value, this.updateOptions);
    }

    updateOptions = (options) => {
        this.setState({options: options.concat()});
    }

    handleFocus = (e) => {
        this.setState({isShown: true});
    }

    handleBlur = (e) => {
        e.persist()
        this.setState({isShown: false, focusOptionIndex: -1});
    }

    handleMouseDown = (e) => {
        e.preventDefault();
    }

    handleOptionSelect = (index) => {
        let option = this.state.options[index];

        this.inputRef.current.blur();
        this.setState({value: option.label});

        this.props.onOptionSelect(option);
    }

    handleKeyDown = (e) => {
        const key = e.keyCode;
        const focusOptionIndex = this.state.focusOptionIndex;
        const maxIndex = this.state.options.length - 1;
        if (key === 38) {
            // up arrow
            if (focusOptionIndex > -1) {
                this.setState({
                    focusOptionIndex: focusOptionIndex - 1
                });
            }
        } else if (key === 40) {
            // down arrow
            if (focusOptionIndex < maxIndex) {
                this.setState({
                    focusOptionIndex: focusOptionIndex + 1
                });
            }
        } else if (key === 13) {
            // enter
            e.preventDefault();

            if (focusOptionIndex > -1 && focusOptionIndex <= maxIndex && this.state.isShown) {
                this.setState({
                    focusOptionIndex: -1,
                    isShown: false
                });
                this.handleOptionSelect(focusOptionIndex);
            } 
        } else {
            if (key !== 13 && this.state.focusOptionIndex !== -1) {
                //this.state.focusOptionIndex = -1;
                
                this.setState({
                    focusOptionIndex: -1
                });
            }
        }
        return;
    }

    render() {
        let options = null;

        if (this.state.isShown && this.state.options.length) {
            options = this.state.options.map((option, index) => {
                return (
                    <div 
                        className={this.state.focusOptionIndex === index ? "typeahead__option typeahead__option--is-focused" : "typeahead__option"} 
                        key={option.value}
                        tabIndex={-1}
                        onClick={(e) => this.handleOptionSelect(index)}
                        onMouseDown={this.handleMouseDown}
                    >
                        <span className="typeahead__option__title">{option.label}</span>
                        <span className="typeahead__option__extra-data">{option.extraData}</span>
                    </div>
                );
            });
        }

        return (
            <div className="typeahead">
                <FormInput 
                    label={this.props.label}
                    placeholder={this.props.placeholder}
                    type={this.props.type || 'text'}
                    value={this.state.value}
                    error={this.props.error}
                    name={this.props.name}
                    helpText={this.props.helpText}
                    onFocus={this.handleFocus}
                    onBlur={this.handleBlur}
                    onKeyDown={this.handleKeyDown}
                    inputRef={this.inputRef}

                    onChange={this.handleChange}
                    required={this.props.required}
                    readOnly={this.props.readOnly}
                />
                <div className={options ? "typeahead__options typeahead__options--shown" : "typeahead__options"}>
                    {options}
                </div>
            </div>
        );
    }
}