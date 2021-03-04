import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import Icon from './icons.js';
import {DropdownButton} from './buttons.js';


export default class TableToolbar extends Component {
    constructor(props) {
        super(props);
    }

    render() {    
        return (
            <div className="toolbar">
                <div className="row">
                    <div className="col-12 col-md-4">
                        <ListSearch />
                    </div>
                    <div className="col-12 col-md-8 text-right toolbar-buttons">
                        <ListFilter />
                    </div>
                </div>
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

        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.updateSearch = this.updateSearch.bind(this);

        this.input = React.createRef();
    }

    handleSearchChange(e) {
        this.setState({searchVal: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        //this.updateSearch();
    }

    updateSearch() {
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

    clearSearch(e) {
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
        return (
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
        );
    }
}

const ListSearch = withRouter(_ListSearch);


function ListFilter() {
    return (
            <button className='btn default dropdown'>
                <Icon name='sliders' /> Filters
            </button>
        );

}