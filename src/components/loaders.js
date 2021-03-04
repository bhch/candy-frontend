import React from 'react';


export default function Loader ({className, ...props}) {
    if (!className)
        className = '';

    return <div className={"loader circle " + className} {...props}></div>;
}
