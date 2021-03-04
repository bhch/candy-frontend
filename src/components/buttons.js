import React from 'react';
import {CSSTransitionGroup} from 'react-transition-group';
import Loader from './loaders.js';
import Icon from './icons.js';


export const Button = React.forwardRef((props, ref) => {
    let loader;
    if (props.loading) {
        loader = <Loader />;
    }

    let className = 'btn ' + props.className;

    return (
        <button className={className} type={props.type || 'button'}
            disabled={props.loading || props.disabled ? true : false}
            onClick={props.onClick}
            ref={ref}
        >
            {props.children}{loader}
        </button>
    );
});


export class DropdownButton extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selected: props.selectedIndex || 0,
            shown: false,
            selectedOnce: false
        }

        this.getBtnClass = this.getBtnClass.bind(this);
        this.toggleMenu = this.toggleMenu.bind(this);

        this.container = React.createRef();
    }

    getBtnClass() {
        let caret = this.state.shown ? ' dropup' : ' dropdown';

        return 'btn ' + this.props.className + caret;
    }

    toggleMenu() {
        this.setState({shown: !this.state.shown});
    }

    onOptionClick(value, index) {
        let autoChange = this.props.autoChange;
        if (autoChange === false) {
            this.setState({shown: false});
        }
        else {
            this.setState({selectedOnce: true, selected: index, shown: false});
        }

        if (this.props.onChange) {
            this.props.onChange(value, index);
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.selectedIndex !== prevProps.selectedIndex) {       
            if (this.state.selected !== this.props.selectedIndex) {
                this.setState({selected: this.props.selectedIndex});
            }
        }
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
      document.removeEventListener("mousedown", this.handleClickOutside);
    }

    handleClickOutside = event => {
        if (this.container.current && !this.container.current.contains(event.target)) {
            if (this.state.shown)
                this.setState({shown: false});
        }
    };

    render() {
        let placement = this.props.placement || '';

        let menu = null;
        if (this.state.shown) {
            menu = (<div key="menu" className={this.state.shown ? "dropdown-menu show " + placement : "dropdown-menu " + placement}>
                        {
                            this.props.options.map((value, index) => 
                                <button 
                                    type="button" 
                                    className={this.state.selected === index ? "dropdown-item active" : "dropdown-item"}
                                    onClick={value.onSelect ? value.onSelect : (e) => this.onOptionClick(value, index)}
                                    key={index}
                                >
                                    {value.label}
                                </button>
                            )
                        }
                    </div>);
        }

        return (
            <div className={this.state.shown ? "dropdown-container show" : "dropdown-container"} ref={this.container}>
                <button className={this.getBtnClass()} type="button" onClick={this.toggleMenu}>
                    {this.props.icon} {this.state.selectedOnce ? this.props.options[this.state.selected].selectLabel : this.props.children}
                </button>
                <CSSTransitionGroup
                    transitionName="dropdown-menu"
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={100}
                >
                    {menu}
                </CSSTransitionGroup>
            </div>
        );
    }
}

export function CloseButton(props) {
    let loader;
    if (props.loading) {
        loader = <Loader />;
    }

    return (
        <button className="btn-close" type="button" 
            disabled={props.loading || props.disabled ? true : false}
            onClick={props.onClick}
        >
            <Icon name="x" />{loader}
        </button>
    );
}
