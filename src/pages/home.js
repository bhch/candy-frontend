import React from 'react';
import {PageHeader} from '../components';

export default function HomePage(props) {
    return (
        <div className="main">
            <PageHeader 
                title="Home" 
                hideSubnav={true}
                location={props.location}
            />
        <div className="content">
        </div>
        </div>
    );
}