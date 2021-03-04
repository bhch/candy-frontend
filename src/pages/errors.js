import {PageHeader} from '../components';

export function Page404(props) {
    return (
        <div className="main">
            <PageHeader hideSubnav={true} title="404 Page not found" location={props.location} />
            <div className="content">
                <p className="lead">
                    The requested page doesn't exist. 
                </p>
            </div>
        </div>
    );
}