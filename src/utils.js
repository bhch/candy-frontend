import React from 'react';
import {Link, NavLink} from 'react-router-dom';
import {compile} from 'path-to-regexp';



export function capitalize(string) {
    if (!string)
        return '';
    
    return string.charAt(0).toUpperCase() + string.substr(1).toLowerCase();
}


export function joinPaths(...paths) {
    let _paths = [];
    for (let i = 0; i < paths.length; i++) {
        let path = paths[i];

        if (path.length > 1) {
            if(path.endsWith('/'))
                path = path.substr(0, path.length - 1);
        }

        if (i > 0) {
            if (path.startsWith('/'))
                path = path.substr(1, path.length);
        }

        if (path == '/')
            path = '';

        _paths.push(path)
    }

    let path = _paths.join('/');

    // append trailing slash
    if (!path.endsWith('/'))
        path += '/';

    return path;
}


var CACHED_REGEXP = {};

export function reverse(to, args) {
    let toPath = CACHED_REGEXP[to];
    let qs = ''; // querystring

    if (typeof toPath === 'undefined') {
        // split querystring
        if (to.indexOf('?') > -1)
            [to, qs] = to.split('?')

        toPath = compile(to);
        CACHED_REGEXP[to] = toPath;
    }

    let path = toPath(args);

    return qs ? path + '?' + qs : path; 
}


export function ReverseLink({args, ...props}) {
    props.to = reverse(props.to, args);

    return <Link {...props}>{props.children}</Link>;
}


export function ReverseNavLink({args, ...props}) {
    props.to = reverse(props.to, args);

    return <NavLink {...props}>{props.children}</NavLink>;
}


export function requestErrorMsg(error) {
    let errorType = 'CONNECTION_ERROR';

    if (error.response)
        errorType = error.response.status;

    switch (errorType) {
        case 400:
            return {errorType: errorType, errorMsg: "Something wen't wrong. Reload the page and try again"};
        case 401:
            return {errorType: errorType, errorMsg: "You need to log in to perform this action"};
        case 403: 
            return {errorType: errorType, errorMsg: "You don't have permission to add or modify this object"};
        case 404: 
            return {errorType: errorType, errorMsg: "This page or object doesn't exist or has been deleted"};
        case 405:
            return {errorType: errorType, errorMsg: "This operation is not permitted"};
        case 500:
            return {errorType: errorType, errorMsg: "500 Server Error. Contact administrator"};
        case 'CONNECTION_ERROR':
            return {errorType: errorType, errorMsg: "Check your Internet connection"};
        default:
            return {errorType: errorType, errorMsg: "Something wen't wrong. Try again"};
    }
}