import React, {Component} from 'react';
import {FormInput, Button} from '../components';
import API from '../api.js';



export default class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            errorUsername: '',
            errorPassword: '',
            errorGeneral: '',
            isSubmitting: false
        };

        this.year = new Date().getFullYear();
    }

    handleUsernameChange = (e) => {
        this.setState({
            username: e.target.value,
            errorUsername: ''
        });
    }

    handlePasswordChange = (e) => {
        this.setState({
            password: e.target.value,
            errorPassword: ''
        });
    }

    handleSubmit = (e) => {
        e.preventDefault();

        let username = this.state.username;
        let password = this.state.password;

        if (!username || !password) {
            if (!username)
                this.setState({errorUsername: 'Username is required'});

            if (!password)
                this.setState({errorPassword: 'Password is required'});

            return;
        }

        this.setState({isSubmitting: true, errorGeneral: ''});

        let api = new API('login');

        api.post(api.endpoint, {username: username, password: password})
        .then((response) => {
            this.props.onLogin(response.data);
        })
        .catch((error) => {
            let errorMsg = 'Something went wrong. Please check your internet connection';

            if (error.response) {

                if (error.response.status === 401) {
                    errorMsg = 'Unauthorized';
                } else { 
                    errorMsg = 'Wrong Username or Password';
                }
            }

            this.setState({isSubmitting: false, errorGeneral: errorMsg});
        });
    }

    componentDidMount() {
        document.documentElement.classList.add('full-height');
    }

    componentWillUnmount() {
        document.documentElement.classList.remove('full-height');
    }


    render() {
        return (
            <>
            <img src={process.env.PUBLIC_URL + "/static/django_candy/img/logo-splash.png"} alt={window.candy.site_name} className="form-signin-logo" />
            <div className="form-signin">
                <h2 className="text-center">Login</h2>
                {this.state.errorGeneral ? <div className="alert error">{this.state.errorGeneral}</div> : null}
                <form onSubmit={this.handleSubmit}>
                    <FormInput 
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={this.handleUsernameChange}
                        label="Username"
                        error={this.state.errorUsername}
                        autoCapitalize="off"
                    />
                    <FormInput 
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={this.state.password}
                        onChange={this.handlePasswordChange}
                        label="Password"
                        error={this.state.errorPassword}
                    />
                    
                    <Button type="submit" className="primary"
                        loading={this.state.isSubmitting}
                    >
                        {this.state.isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>

                </form>
            </div>

            <p className="form-signin-bottom">&copy; {this.year} Candy</p>
            </>
        );
    }
}