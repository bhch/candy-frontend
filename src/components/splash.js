import Loader from './loaders.js';


export function Splash(props) {
    return (
        <div className="splash">
            <img src={process.env.PUBLIC_URL + "/static/django_candy/img/logo-splash.png"} alt={window.candy.site_name} />
            
            <Loader />
        </div>
    );
}


export function ErrorSplash(props) {
    return (
        <div className="splash text-center">
            <img src={process.env.PUBLIC_URL + "/static/django_candy/img/error-splash.png"} alt="Error" />
            <h2>{props.msg || 'Something went wrong. Try again'}</h2>
            {
                props.retryCallback ? 
                <p>
                    <button className="btn link" onClick={props.retryCallback}>
                        {props.retryBtnText || 'Try Again'}
                    </button>
                </p> 
                : 
                null
            }
        </div>
    );
}