import React, { Component } from 'react';
import {Route, Switch, BrowserRouter, withRouter, Redirect} from 'react-router-dom';
import API from './api.js';
import URLS from './urlconf.js';
import {HomePage, AppPage, ModelPageGroup, LoginPage} from './pages';
import {Nav, ToastContainer, toast, Loader, Splash, ErrorSplash} from './components';
import './App.scss';


class _App extends Component {
    constructor(props) {
        super(props);

        this.defaultInitData = {user: {authenticated: false}};

        this.state = {
            loading: true,
            initData: this.defaultInitData,
            errorMsg: null,
            user: null
        }


        if (!window.hasOwnProperty('candy'))
            window.candy = {
                site_name: 'Candy',
                base_admin_url: '/candy/',
            };

        this.base_admin_url = window.candy.base_admin_url;
        this.login_url = this.base_admin_url + 'login/';
    }

    componentDidMount() {
        if (this.props.location.pathname === '/') {
            this.props.history.replace(this.base_admin_url);
        }

        this.getInitData();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.initData.user.authenticated && this.props.location.pathname === this.login_url) {
            this.redirectToNext();
            return;
        }
    }


    getInitData = () => {
        let api = new API('init');

        api.getList()
        .then((response) => {
            // if user not logged in, redirect to login page
            if (!response.data.user.authenticated) {
                this.redirectToLogin();

                this.setState({
                    loading: false,
                    errorMsg: null
                });

            } else {
                this.setState({
                    loading: false,
                    initData: response.data,
                    errorMsg: null
                });
            }
        })
        .catch((error) => {
            console.log(error);

            let errorType = 'CONNECTION_ERROR';

            if (error.response)
                errorType = error.response.status;

            // if 401 status code; that means the token has expired or user not logged in
            // need to redirect user to login page
            if (errorType === 401) {
                this.redirectToLogin();
            } else if (errorType === 'CONNECTION_ERROR') {
                this.setState({loading: false, errorMsg: "Check your internet connection"})
            } else {
                this.setState({loading: false, errorMsg: "Something went wrong"})

            }
        });
    }

    redirectToNext = () => {
        let next = new URLSearchParams(this.props.location.search).get('next') || '/';

        if (next === '/')
            next = this.base_admin_url;

        this.props.history.push(next);
    }

    redirectToLogin = () => {
        let next = this.props.location.search;

        if (this.props.location.pathname.indexOf('login') === -1)
            next = '?next=' + this.props.location.pathname;

        this.props.history.push(this.login_url + next);
    }

    onLogin = (data) => {
        this.setState({loading: true});
        this.getInitData();
    }

    handleLogout = () => {
        // Logs user out
        // :TODO: Block the page while the request is processing
        let api = new API('logout');

        api.post(api.endpoint)
        .then((response) => {
            this.onLogout(false);
        })
        .catch((error) => {
            if (!error.response)
                error.response = {};

            if (error.response.status === 401) {
                this.onLogout(false);
            } else {
                toast.error("Something went wrong.");
            }
        });
    }

    onLogout = (preserveNext) => {
        // Do stuff after logging out
        this.setState({initData: this.defaultInitData}, () => {
            if (preserveNext) {
                this.redirectToLogin();
            } else {
                this.props.history.push(this.login_url);
            }
        });
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

        if (!this.state.initData.user.authenticated) {
            return (<>
                <LoginPage onLogin={this.onLogin} instance={this.state.instance} />
            </>);
        }

        return (
            <div className="container-fluid">
                <ToastContainer />
                <Nav 
                    sideMenu={this.state.initData.side_menu} 
                    topMenu={this.state.initData.top_menu} 
                    location={this.props.location}
                    match={this.props.match}
                    history={this.props.history}
                    user={this.state.initData.user}
                    handleLogout={this.handleLogout}
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
                            <Route
                                render={() => (
                                    <div className="main" style={{marginTop: '2rem'}}>
                                        <ErrorSplash 
                                            msg="404: Page Not Found" 
                                            retryCallback={this.redirectToNext} 
                                            retryBtnText="Go To Home" 
                                        />
                                    </div>
                                    )
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
