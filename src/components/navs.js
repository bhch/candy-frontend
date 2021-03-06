import React, {Component, Children} from 'react';
import {CSSTransitionGroup} from 'react-transition-group';
import {NavLink} from 'react-router-dom';
import Icon from './icons.js';
import {capitalize, ReverseNavLink, ReverseLink} from '../utils.js';
import URLS from '../urlconf.js';
import {DropdownButton} from './buttons.js';


export class Nav extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false
        };
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.instance !== prevProps.instance && this.state.open) {
            this.setState({open: false});
            document.body.classList.remove('nav-open');
        }
    }

    componentWillUnmount() {
        document.body.classList.remove('nav-open');
    }

    toggleNav = (e) => {
        this.setState({open: !this.state.open});
        document.body.classList.toggle('nav-open');
    }

    handleLinkClick = (e) => {
        if (this.state.open) {
            this.toggleNav();
        }
    }

    render() {
        const base_url = this.props.match.params.base_url;

        return (
            <div>
                <CSSTransitionGroup
                    transitionName="overlay"
                    transitionEnterTimeout={100}
                    transitionLeaveTimeout={150}
                >
                    {(this.state.open && <div className="overlay" key="overlay" onClick={this.handleLinkClick}></div>) || null}
                </CSSTransitionGroup>

                <div className="nav top-nav">
                    <ReverseLink to={URLS.home} args={{base_url: base_url}} className="logo">
                        <img src={process.env.PUBLIC_URL + "/static/django_candy/img/logo-nav.png"}  alt={window.candy.site_name} className="d-none d-sm-block" />
                        <img src={process.env.PUBLIC_URL + "/static/django_candy/img/logo-nav-mobile.png"}  alt={window.candy.site_name} className="d-block d-sm-none" />
                    </ReverseLink> {' '}
                    <button className="toggle-nav d-md-none" onClick={this.toggleNav}>
                        {this.state.open ? <Icon name="x" /> : <Icon name="list" />}
                    </button>

                    <ul className="d-none d-md-block">
                        <li>
                            <DropdownButton 
                                className="default"
                                placement="right"
                                selectedIndex={-1}
                                options={[
                                    {label: "Logout", onSelect: this.props.handleLogout},
                                ]}
                            >
                                <Icon name="person" className="nav-user-icon" /> { this.props.user.name }
                            </DropdownButton>
                        </li>
                    </ul>
                </div>

                <div className={this.state.open ? "nav side-nav open" : "nav side-nav"} id={this.props.id}>
                    <ul>
                        <li key='home'>
                            <ReverseNavLink 
                                exact
                                to={URLS.home}
                                args={{base_url: base_url}}
                                onClick={this.handleLinkClick}
                            >
                                Home
                            </ReverseNavLink>
                        </li>
                        {this.props.sideMenu.map((app) => {
                            let menu_label = <li key={app.app_label}><span className="menu-header">{capitalize(app.verbose_name)}</span></li>;

                            let menu_items = app.models.map((model) => {
                                return (
                                    <li key={model.app_label + '.' + model.name}>
                                        <ReverseNavLink 
                                            to={URLS.model_list}
                                            args={{base_url: base_url, app_label: app.app_label, model_name: model.name.toLowerCase()}}
                                            onClick={this.handleLinkClick}
                                        >
                                            {capitalize(model.menu_label)}
                                        </ReverseNavLink>
                                    </li>
                                );
                            });

                            return [menu_label, menu_items];
                        })}
                    </ul>
                </div>
            </div>
        );
    }
}


export function SubNav(props)  {
    return (
        <div className={'nav sub-nav'}>
            <ul>
                {Children.map(props.children, (child) => child ? <li>{child}</li> : null)}
            </ul>
        </div>
    );
}