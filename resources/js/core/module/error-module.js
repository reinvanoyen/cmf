import React from 'react';
import Title from "../ui/title";

export default function ErrorModule() {
    return (
        <div className="module">
            <div className="module__header">
                <div className="module__title">
                    <Title>Not found</Title>
                </div>
            </div>
            <div className="module__main">
                Are you sure you're trying to access the correct URL? No module or action was found for this request.
            </div>
        </div>
    );
}
