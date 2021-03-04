import React from 'react';


export function SkeletonInput() {
    return (
        <div className="placeholder ph-input"></div>
    );
}

export function SkeletonButton() {
    return (
        <div className="placeholder ph-button"></div>
    );
}

export function SkeletonButtonRight() {
    return (
        <div className="placeholder ph-button ph-right"></div>
    );
}

export function SkeletonTable() {
    return (
        <div className="skeleton-table table-container">
            <div className="row header">
                <div className="col-md-4 col-12">
                    <SkeletonInput />
                </div>
                <div className="col-md-8 col-12 text-right d-none d-md-block">
                    <SkeletonButton />
                </div>
                <div className="col-md-8 col-12 d-md-none">
                    <SkeletonButton />
                </div>
            </div>

            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <div className="row" key={i}>
                <div className="col-md-1 col-12 d-none d-md-block"><div className="placeholder ph-checkbox"></div></div>
                <div className="col-md-6 col-12 d-none d-md-block"><div className="placeholder ph-line"></div></div>
                <div className="col-md-2 col-12"><div className="placeholder ph-line"></div></div>
                <div className="col-md-3 col-12"><div className="placeholder ph-line"></div></div>
            </div>
            ))
            }
        </div>
    );
}


export function SkeletonForm(props) {
    let fields = [];

    for (let i = 0; i < props.fields; i++) {
        fields.push(
            <div className="placeholder-field" key={i}>
                <div className="placeholder-label placeholder"></div>
                <SkeletonInput />
            </div>
        );
    }

    return (
        <div className="skeleton-form">
            <div className="row">
                <div className="col-md-5">{fields}</div>
                <div className="col-12">
                    <div className="placeholder-buttons">
                        <SkeletonButton />
                        <SkeletonButton />
                        <SkeletonButtonRight />
                    </div>
                </div>
            </div>
        </div>
    );
}