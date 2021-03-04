import React, { Component } from 'react';
import {Route, Switch, BrowserRouter, withRouter, Redirect} from 'react-router-dom';
import API from './api.js';
import URLS from './urlconf.js';
import {HomePage, AppPage, ModelPageGroup} from './pages';
import {Nav, ToastContainer, Loader, Splash, ErrorSplash} from './components';
import './App.scss';


class _App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            initData: null,
            errorMsg: null
        }


        if (!window.hasOwnProperty('candy'))
            window.candy = {
                site_name: 'Candy',
                base_admin_url: '/candy/',
            };

        this.base_admin_url = window.candy.base_admin_url;
    }

    componentDidMount() {
        if (this.props.location.pathname === '/') {
            this.props.history.replace(this.base_admin_url);
        }


        if (!this.props.location.pathname.startsWith(this.base_admin_url) && 
            this.props.location.pathname !== '/') {
            this.setState({loading: false});
            return;
        }

        this.getInitData();
    }

    getInitData = () => {
        let api = new API('init');

        api.getList()
        .then((response) => {
            this.setState({
                loading: false,
                initData: response.data,
                errorMsg: null
            });
        })
        .catch((err) => {
            console.log(err)
            this.setState({
                loading: false,
                errorMsg: 'Something went wrong'
            })
        })
    }

    retryApi = () => {
        this.setState({loading: true});
        this.getInitData();
    }

    render() {
        if (this.state.loading)
            return (<Splash />);

        if (this.state.errorMsg)
            return <ErrorSplash msg={this.state.errorMsg} retryCallback={this.retryApi} />;

        if (!this.props.location.pathname.startsWith(this.base_admin_url))
            return <ErrorSplash msg="404 Page not found" />;

        return (
            <div className="container-fluid">
                <ToastContainer />
                <Nav 
                    sideMenu={this.state.initData.side_menu} 
                    topMenu={this.state.initData.top_menu} 
                    location={this.props.location}
                    match={this.props.match}
                    history={this.props.history}
                />
                <div className="row">
                    <div className="col-12 px-0">
                        <Switch>
                            <Route path={URLS.home} exact 
                                render={
                                    (props) => <HomePage {...props} />
                                } 
                            /> 
                            <Route path={URLS.app_index} exact
                                render={
                                    (props) => <AppPage {...props} initData={this.state.initData} />
                                }
                            />
                            <Route path={URLS.model_list}
                                render={
                                    (props) => <ModelPageGroup {...props} initData={this.state.initData} />
                                }
                            />
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}


const App = withRouter(_App);


export default function AppExport({props}) {
    return (
        <BrowserRouter>
            <Route path="/:base_url?"
                render={() => <App {...props} />}
            />

            <div className="footer">
                version {process.env.REACT_APP_VERSION}
            </div>
        </BrowserRouter>
    );
};
