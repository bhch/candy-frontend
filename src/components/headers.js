import React from 'react';
import {matchPath} from 'react-router-dom';
import Icon from './icons.js';
import {SubNav} from './navs.js';
import {ReverseLink} from '../utils.js';


export default function PageHeader(props) {
    /* 
        Page header component.

        Props:
            title:      Base title of the page.
            edit_url:   URL pattern for edit page.
            add_url:    URL pattern for add page.

    */
    let title = props.title;
    let path = props.location.pathname;
    let backBtn = null;

    let list_filters = new URLSearchParams(props.location.search).get('_list_filters') || '';

    if (matchPath(path, props.edit_url))
        title = title + ' / Edit';
    else if (matchPath(path, props.add_url))
        title = title + ' / Add New';

    if (matchPath(path, props.edit_url) || matchPath(path, props.add_url)) {
        backBtn = <ReverseLink 
                    to={props.list_url + list_filters}
                    args={{base_url: props.match.params.base_url, 
                        app_label: props.match.params.app_label, 
                        model_name: props.match.params.model_name
                    }}
                  >
                    <Icon name="arrow-left" /> View All
                  </ReverseLink>;
    }

    document.title = props.title + ' | '+ window.candy.site_name;


    return (
        <div className="header">
            <div className="row">
                <div className="col-12 col-md-5">
                    <h3>{title}</h3>
                </div>
                <div className="col-12 col-md-7">
                    {!props.hideSubnav && 
                        <SubNav>
                            {backBtn}
                            {props.permissions.can_add ? 
                                <ReverseLink 
                                    className="active" 
                                    to={props.add_url}
                                    args={{base_url: props.match.params.base_url, 
                                        app_label: props.match.params.app_label, 
                                        model_name: props.match.params.model_name
                                    }}
                                >
                                    <Icon name="plus" /> Add New
                                </ReverseLink>
                                : null
                            }
                            <button className="btn" onClick={props.onRefresh}><Icon name="arrow-clockwise" /> Refresh</button>
                        </SubNav>
                    }
                </div>
            </div>
        </div>
    );
}