import React, {Component} from 'react';
import Loader from './loaders.js';
import Icon from './icons.js';
import {CSSTransitionGroup} from 'react-transition-group';


class ToastService {
    constructor() {
        this.toasts = new Set();
    }

    register(toast) {
        this.toasts.add(toast);
        return () => this.unregister(toast);
    }

    unregister(toast) {
        this.toasts.forEach((tst) => {
            if (tst === toast) {
                this.toasts.delete(toast);
            }
        });
    }

    success(message) {
        this.toasts.forEach(toast => {
            toast.showToast(message, 'success');
        });
    }

    error(message) {
        this.toasts.forEach(toast => {
            toast.showToast(message, 'error');
        });
    }

    showLoader() {
        this.toasts.forEach(toast => {
            toast.showLoaderToast();
        });
    }

    hideLoader() {
        this.toasts.forEach(toast => {
            toast.hideLoaderToast();
        });
    }

    showConnectionError(retryCallback) {
        this.toasts.forEach(toast => {
            toast.showConnectionError(retryCallback);
        })
    }

    hideConnectionError() {
        
    }

    hideAll() {
        this.toasts.forEach(toast => {
            toast.hideAll();
        });
    }

    hideError() {
        this.toasts.forEach(toast => {
            toast.hideError();
        });
    }
}


export const toastService = new ToastService();


export class ToastContainer extends Component {
    constructor(props) {
        super(props);

        this.timer = null;
        this.toastService = toastService;
        //this.mounted = false;

        this.state = {
            message: null,
            type: null,
            loader: false,
            connectionError: false,
            retryCallback: null
        }

        this.showToast = this.showToast.bind(this);
        this.showLoaderToast = this.showLoaderToast.bind(this);
        this.hideLoaderToast = this.hideLoaderToast.bind(this);
        this.hasToast = this.hasToast.bind(this);
        this.unregister = this.toastService.register(this);
        this.closeToast = this.closeToast.bind(this);
        this.closeConnectionErrorToast = this.closeConnectionErrorToast.bind(this);
    }

    componentDidMount() {
        //this.mounted = true;
    }

    componentWillUnmount() {
        this.unregister();
    }

    showToast(message, type) {
        clearTimeout(this.timer);

        this.setState({
            message: message,
            type: type,
            loader: false,
            connectionError: false,
            retryCallback: null
        });

        if (type === 'success')
            this.timer = setTimeout(this.closeToast, 5000);
    }

    showLoaderToast() {
        this.setState({
            //message: null,
            //type: null,
            loader: true,
            connectionError: false,
            retryCallback: null
        });
    }

    hideLoaderToast() {
        this.setState({
            //message: null,
            //type: null,
            loader: false
        });
    }

    showConnectionError(retryCallback) {
        this.setState({
            loader: false,
            message: null,
            type: null,
            connectionError: true,
            retryCallback: retryCallback
        });
    }

    hideError() {
        if (this.hasToast() && this.state.type === 'error') {
            this.setState({
                message: null,
                type: null,
                loader: false
            });
        }
    }

    hideAll() {
        if (this.hasToast()) {
            this.setState({
                message: null,
                type: null,
                loader: false
            });
        }
    }

    hasToast() {
        if (this.state.loader || this.state.message || this.connectionError)
            return true;
        return false;
    }

    _componentDidUpdate() {
        if (this.hasToast) {
            clearTimeout(this.timer);
            this.timer = setTimeout(this.props.hideToast, 5000);
        }
    }

    closeToast(e) {
        this.setState({
            message: null,
            type: null
        });
    }

    closeConnectionErrorToast(e) {
        this.setState({
            message: null,
            type: null,
            connectionError: false
        });
    }


    render() {
        let toast = null;
        if (this.state.loader) {
            toast = <LoaderToast key={'loader'} />;
        } else if (this.state.connectionError) {
            toast = (
                <ConnectionErrorToast 
                    key={'connerror'} 
                    onRetry={this.state.retryCallback} 
                    onClose={this.closeConnectionErrorToast} 
                />
            );
        }

        let toast2 = null;
        if (this.state.message && !this.state.connectionError) {
            toast2 = <Toast 
                        key={'toast'}
                        message={this.state.message} 
                        type={this.state.type}
                        onClose={this.closeToast}
                    />;
        }

        return (
            <div className="toast-container">
                <CSSTransitionGroup
                    transitionName="toast-animate"
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={100}
                    component="div" className="toast-container"
                >
                    {toast}
                    {toast2}
                </CSSTransitionGroup>
            </div>
        );
    }

}

export function Toast(props) {

    let type = '';
    if (props.type)
        type = props.type;

    let icon = null;
    if (type === 'success') {
        icon = <Icon name="check" />;
    } else if (type === 'error') {
        icon = <Icon name="exclamation-octagon" />;
    }

    return (
        <div className={"toast " + type}>
            <div className="icon">{icon}</div>
            <div className="message">{props.message}</div>
            <div className="close">
                <button onClick={props.onClose}>&times;</button>
            </div>
        </div>
    );
}

export function LoaderToast() {
    return (
        <div className="toast loader-toast">
            <div className="message">
                <Loader /> Loading
            </div>
        </div>
    );
}

export function ConnectionErrorToast(props) {
    return (
        <div className="toast error">
            <div className="icon with-btn"><Icon name="exclamation-octagon" /></div>
            <div className="message">
                Check your internet connection.{' '}
                <button className="btn link" onClick={props.onRetry}>Try again</button>
            </div>
            <div className="close">
                <button onClick={props.onClose}>&times;</button>
            </div>
        </div>
    );
}
