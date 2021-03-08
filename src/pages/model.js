import React, {Component} from 'react';
import {Route, Switch, Link} from 'react-router-dom';
import API from '../api.js';
import URLS from '../urlconf.js';
import {joinPaths, capitalize} from '../utils.js';
import {PageHeader, TableToolbar, Table, Pagination, toast, SkeletonTable} from '../components';
import {Page404} from './errors.js';


export default class ModelPageGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            refresh: false
        }

        this.list_url = joinPaths(this.props.match.url, '/');
        this.add_url = joinPaths(this.props.match.url, '/add/');
        this.edit_url = joinPaths(this.props.match.url, '/:id/edit/');
    }

    componentDidMount() {
        // make api request to fetch mdoel's metadata
    }

    componentDidUpdate(prevProps, prevState) {
        // the component won't remount
        // if the model parameter changed in url
        // so need to refetch the new model's metadata
    }

    refreshPage = () => {
        this.setState({refresh: !this.state.refresh});
    }

    render() {
        let permissions = {can_add: true}

        let app_label = this.props.match.params.app_label;
        let model_param = this.props.match.params.model_name;

        if (!this.props.initData.apps.hasOwnProperty(app_label))
            return <Page404 location={this.props.location} />

        const app = this.props.initData.apps[app_label];

        if (!app.models.hasOwnProperty(model_param))
            return <Page404 location={this.props.location} />;

        const model = app.models[model_param];

        return (
            <div className="main">
                <Route render={(props) => <PageHeader {...props} 
                        title={capitalize(model.verbose_name_plural)}
                        list_url={URLS.model_list}
                        edit_url={URLS.model_edit}
                        add_url={URLS.model_add}
                        onRefresh={this.refreshPage}
                        permissions={permissions}
                        />
                    } 
                />
                <Switch>
                    <Route 
                        path={URLS.model_list}
                        exact
                        render={(props) => <ListPage {...props} 
                            model={model} 
                            key={model.endpoint} 
                            refresh={this.state.refresh}
                            />
                        } 
                    />
                    <Route 
                        path={URLS.model_add} 
                        exact 
                        render={(props) => <AddPage {...props} 
                            model={model} 
                            refresh={this.state.refresh}
                            />
                        } 
                    />
                    <Route 
                        path={URLS.model_edit} 
                        exact 
                        render={(props) => <EditPage {...props} 
                            model={model} 
                            refresh={this.state.refresh}
                            />
                        } 
                    />
                    <Route>
                        <p>404 Page Not Found.</p>
                        <p>This page doesn't exist.</p>
                    </Route>
                </Switch>
            </div>
        );
    }
}

export class ListPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loading: true,
            hasError: false,
            errorType: null,
            list_limit: 20 // :TODO: get this value from backend
        };

        this.api_endpoint = this.props.model.endpoint;
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.queryApi();
        toast.showLoader();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.search !== prevProps.location.search
            || this.props.refresh !== prevProps.refresh) {
            this.setState({loading: true});
            //:TODO: cancel previous api request before sending new one
            this.queryApi();
        }

        if (this.state.loading !== prevState.loading) {
            if (this.state.loading)
                toast.showLoader();
            else
                toast.hideLoader();
        }
    }

    componentWillUnmount() {
        toast.hideLoader();
    }

    
    queryApi = () => {
        //if (!this.props.permissions.can_view) 
        //    return this.setState({loading: false});

        let queryString = new URLSearchParams(this.props.location.search);
        let page = Number(queryString.get('page')) || 1;

        let limit = this.state.list_limit;
        let offset = (page - 1) * limit;

        queryString.delete('page');
        queryString.set('limit', limit);
        queryString.set('offset', offset);

        let api = new API(this.api_endpoint);

        api.getList(queryString.toString())
        .then((response) => {
            this.setState({loading: false, data: response.data});
            window.scrollTo(0, 0);
        })
        .catch((error) => {
            let errorType = 'CONNECTION_ERROR';

            if (error.response)
                errorType = error.response.status;
            else
                error.response = {};

            if (error.response.status === 401) {
                this.props.handleLogout(true);
            } else {
                this.setState({loading: false, hasError: true, errorType: errorType});
                toast.showConnectionError(this.retryApi);
            }

        });
    }

    retryApi = () => {
        this.setState({loading: true, hasError: false});
        this.queryApi();
    }

    getCurrentPage = () => {
        let params = new URLSearchParams(this.props.location.search);
        let page = Number(params.get('page')) || 1;
        return page;
    }

    render() {
        if (this.state.loading) {
            return <div className="content"><SkeletonTable /></div>;
        }

        return (
            <div className="content">
                <div className="table-container">
                    <TableToolbar filters={this.props.model.list_filters} />
                    <div className="table-outer">
                        <Table
                            data={this.state.data.results}
                            tableCols={this.props.model.list_display}
                            tableTh={this.props.model.list_display_labels}
                            tableColCls={[]}
                            tableThWidths={[]}
                            tableRowURI={':id/edit/'}
                            tableRowActions={null}
                            tableCheckable={true}
                            tableCheckCallback={() => null}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-12">
                        <Pagination 
                            total_count={this.state.data.count}
                            per_page={this.state.list_limit}
                            currentPage={this.getCurrentPage()}
                        />
                    </div>
                </div>
            </div>
        )
    }
}


export function AddPage(props) {
    return (
        <h2>:TODO:</h2>
    );
}


export function EditPage(props) {
    return (
        <h2>:TODO:</h2>
    );
}
