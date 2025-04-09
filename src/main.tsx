import React from 'react';
import ReactDOM from 'react-dom/client';
import './FormBuilderElement'; // Just import the element definition
import './index.css';

const root = ReactDOM.createRoot(
    document.getElementById('root')! as HTMLElement,
);

// Use the web component directly
root.render(
    <React.StrictMode>
        <form-builder
            oidc-url="//someURL"
            fbms-base-url="/demoBaseUrl"
            fbms-form-fname="Some Name"
            show-error-list="bottom"
            styles="form { max-width: 700px; }"
        />
    </React.StrictMode>,
);
