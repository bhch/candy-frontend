import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {CSSTransitionGroup} from 'react-transition-group';
import {withRouter} from 'react-router-dom';
import Icon from './icons.js';
import {DropdownButton, Button} from './buttons.js';
import {RadioCheckInput} from './forms.js';


export default class TableToolbar extends Component {
    constructor(props) {
        super(props);

        this.toolbarToolsRef = React.createRef();
    }

    render() {    
        return (
            <div className="toolbar">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <ListSearch />
                    </div>
                    <div className="col-12 col-md-8 text-right toolbar-buttons">
                        <ListFilter toolsRef={this.toolbarToolsRef}  filters={this.props.filters} />
                    </div>
                </div>
                <div ref={this.toolbarToolsRef}></div>
            </div>
        );
    }
}


class _ListSearch extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            searchVal: '',
            activeQuery: '',
            focussed: false
        };

        this.input = React.createRef();
    }

    handleSearchChange = (e) => {
        this.setState({searchVal: e.target.value});
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.updateSearch();
    }

    updateSearch = () => {
        /*
        When a user searches something, the `page` number should be removed 
        from the queryString so the user is taken to first page of search results.

        :TODO: reload page if searching for same thing twice.
        */

        let q = this.state.searchVal;
        let queryString = new URLSearchParams(this.props.location.search);

        if (q === '') {
            queryString.delete('q');
        } else {
            queryString.set('q', q);
        }

        queryString.delete('page');
        
        this.setState({activeQuery: q});

        this.props.history.push(this.props.location.pathname + '?' + queryString.toString());  
    }

    clearSearch = (e) => {
        this.setState(
            {searchVal: '', activeQuery: ''}, 
            () => this.updateSearch()
        );
    }

    componentDidMount() {
        let queryString = new URLSearchParams(this.props.location.search);
        let q = queryString.get('q') || '';
        if (q !== '') {
            this.setState({searchVal: q, activeQuery: q});
        }
    }

    handleFocus = (e) => {
        this.setState({
            focussed: true
        });

        this.input.current.focus();
    }

    handleBlur = (e) => {
        this.setState({
            focussed: false
        });

        this.input.current.blur();
    } 

    render() {
        let activeQuery = null;
        if (this.state.activeQuery !== '' || this.state.activeQuery === null) {
            activeQuery = (
                <p>
                    <br />
                    Search results for: <strong>"{this.state.activeQuery}"</strong>
                    {' '}
                    <button className="btn link" onClick={this.clearSearch}><Icon name="x-circle" /> Clear</button>
                </p>
            );
        }

        return (
            <>
            <form onSubmit={this.handleSubmit}>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span 
                            className={this.state.focussed ? "input-group-text focussed" : "input-group-text"}
                            onClick={this.handleFocus}
                        >
                            <Icon name='search' />
                        </span>
                    </div>
                    <input 
                        type="text" name="q" className="form-control icon-prepend" placeholder="Search..."
                        autoFocus={this.state.focussed}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                        ref={this.input}
                        value={this.state.searchVal} onChange={this.handleSearchChange} />
                </div>
            </form>
            {activeQuery}
            </>
        );
    }
}

const ListSearch = withRouter(_ListSearch);


class ListFilterButtons extends Component {
    constructor(props) {
        super(props);
    }

    getFilterBtnClass = () => {
        let style = this.props.filterApplied ? 'primary' : 'default';
        let caret = this.props.toolsShown ? 'dropup' : 'dropdown';

        return 'btn ' + style + ' ' + caret;
    }

    render() {
        let clearBtn;

        if (this.props.filterApplied) {
            clearBtn = <button className="btn default" onClick={this.props.clearFilters}><Icon name="x-circle" /> Clear</button>
            
        }

        return (
            <>
                <button className={this.getFilterBtnClass()} onClick={this.props.toggleFilterTools}>
                    <Icon name="sliders" /> Filters {this.props.filterApplied ? 'Applied' : null}
                </button>
                {clearBtn}
            </>
        );
    }
}


class ListFilterTools extends Component {
    render() {
        if (!this.props.toolsRef.current || !this.props.isShown) {
            return null;
        }

        return ReactDOM.createPortal(
            this.props.children,
            this.props.toolsRef.current
        );
    }
}


class _ListFilter extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showTools: false
        };
    }

    getFilterState = () => {
        let searchParams = new URLSearchParams(this.props.location.search);

        let filters = {}

        for (let i = 0; i < this.props.filters.length; i++) {
            let filter = this.props.filters[i];

            if (filter.type === 'radio') {
                filters[filter.name] = searchParams.get(filter.name);
            } else if (filter.type === 'checkbox') {
                filters[filter.name] = searchParams.getAll(filter.name);
            }
        }

        return filters;
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let queryString = new URLSearchParams(this.props.location.search);
        this.props.filters.map((filter) => {
            queryString.delete(filter.name);
            return null;
        });

        let formData = new FormData(e.target);
        for (let item of formData) {
            queryString.append(item[0], item[1]);
        }

        // go to page 1 of results
        queryString.delete('page');

        queryString = '?' + queryString.toString();


        if (queryString !== this.props.location.search) {
            this.props.history.push(this.props.location.pathname + queryString);
        }

        this.setState({showTools: false});
    }

    toggleFilterTools = () => {
        this.setState({showTools: !this.state.showTools});
    }

    clearFilters = () => {
        let oldQueryString = new URLSearchParams(this.props.location.search);

        this.props.filters.map((filter) => {
            if (oldQueryString.has(filter.name)) {
                oldQueryString.delete(filter.name);
            }
            return null;
        });

        this.props.history.push(this.props.location.pathname + '?' + oldQueryString.toString());
        this.setState({showTools: false});
    }

    render() {
        let filterState = this.getFilterState();
        let filterApplied = false;

        let filters = null;

        if (this.state.showTools) {
            filters = this.props.filters.map((filter) => {

                let options = filter.options.map((option) => {
                    let isChecked = false;

                    if (filter.type === 'radio') {
                        if (String(filterState[filter.name]) === option.value)
                            isChecked = true;
                    } else if (filter.type === 'checkbox') {
                        if (String(filterState[filter.name]).includes(option.value))
                            isChecked = true;
                    }

                    if (isChecked && !filterApplied)
                        filterApplied = true;

                    return (
                        <RadioCheckInput 
                            key={filter.name + '_option_' + option.value}
                            label={option.label}
                            type={filter.type} 
                            name={filter.name} 
                            value={option.value} 
                            defaultChecked={filterApplied ? isChecked : option.default}
                        />
                    );
                });

                return (
                    <div className="col-12 col-md-4 col-sm-6" key={'filter_' + filter.name}>
                        <h4>{filter.label}</h4>
                        {options}
                    </div>
                );
            });
        } else {
            filterApplied = this.props.filters.some((filter) => {
                return filter.options.some((option) => {
                    if (filter.type === 'radio') {
                        if (filterState[filter.name] === option.value)
                            return true;
                    } else if (filter.type === 'checkbox') {
                        if (filterState[filter.name].includes(option.value))
                            return true;
                    }
                        
                    return false;
                    
                });
            });
        }

        return (
            <>
            <ListFilterButtons 
                filterApplied={filterApplied} 
                toggleFilterTools={this.toggleFilterTools}
                clearFilters={this.clearFilters}
                toolsShown={this.state.showTools}
            />
            <CSSTransitionGroup
                transitionName="toolbar-tools"
                transitionEnterTimeout={100}
                transitionLeaveTimeout={100}
            >
                {filters ? <ListFilterTools key="filterTools" toolsRef={this.props.toolsRef} isShown={this.state.showTools}>
                    <div className="toolbar-tools">
                        <form onSubmit={this.handleSubmit}>
                            <div className="row filters-row">
                                {filters}
                            </div>
                            <div className="row filter-btns">
                                <div className="col-12">
                                    <Button className="primary" type="submit">Apply</Button>{' '}
                                    <Button className="default" type="button" onClick={this.toggleFilterTools}>Cancel</Button>
                                </div>
                            </div>
                        </form>
                    </div>
                </ListFilterTools> : null}
            </CSSTransitionGroup>
            </>
        );
    }
}


const ListFilter = withRouter(_ListFilter);