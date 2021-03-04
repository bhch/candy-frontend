import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {capitalize, ReverseLink} from '../utils.js';
import {PageHeader} from '../components';
import ModelPageGroup from './model.js';
import {Page404} from './errors.js';
import URLS from '../urlconf.js';


export default class AppPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let app_label = this.props.match.params.app_label;

        if (!this.props.initData.apps.hasOwnProperty(app_label)) {
            return <Page404 location={this.props.location} />;
        }

        let app = this.props.initData.apps[app_label];

        return (
            <div className="main">
                <PageHeader hideSubnav={true} title={app.verbose_name} location={this.props.location} />

                <div className="content">
                    {Object.keys(app.models).map((key) => {
                        let model = app.models[key];

                        return (
                            <div key={app_label + '.' + model.name}>
                                <ReverseLink 
                                    to={URLS.model_list} 
                                    args={{
                                        base_url: this.props.match.params.base_url, 
                                        app_label: app_label, 
                                        'model_name': model.name
                                    }}
                                >
                                    {capitalize(model.verbose_name_plural)}
                                </ReverseLink>
                            </div>
                        );
                    })}
                </div>
            </div>
        )
    }
}
