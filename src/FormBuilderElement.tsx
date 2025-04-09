import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import FormBuilder from './FormBuilder/FormBuilder';

type ShowErrorListOptions = false | 'top' | 'bottom';

class FormBuilderElement extends HTMLElement {
    private root: Root | null = null;

    // Define reactive properties
    private _oidcUrl = '';
    private _fbmsBaseUrl = '/fbms';
    private _fbmsFormFname = '';
    private _showErrorList: ShowErrorListOptions = 'top';
    private _styles = '';

    // Define property getters and setters that reflect to attributes
    get oidcUrl() {
        return this._oidcUrl;
    }
    set oidcUrl(val) {
        this._oidcUrl = val;
        this.setAttribute('oidc-url', val);
    }

    get fbmsBaseUrl() {
        return this._fbmsBaseUrl;
    }
    set fbmsBaseUrl(val) {
        this._fbmsBaseUrl = val;
        this.setAttribute('fbms-base-url', val);
    }

    get fbmsFormFname() {
        return this._fbmsFormFname;
    }
    set fbmsFormFname(val) {
        this._fbmsFormFname = val;
        this.setAttribute('fbms-form-fname', val);
    }

    get showErrorList() {
        return this._showErrorList;
    }
    set showErrorList(val) {
        this._showErrorList = val;
        if (val === false) {
            this.setAttribute('show-error-list', 'false');
        } else {
            this.setAttribute('show-error-list', val);
        }
    }

    get styles() {
        return this._styles;
    }
    set styles(val) {
        this._styles = val;
        this.setAttribute('styles', val);
    }

    static get observedAttributes() {
        return [
            'oidc-url',
            'fbms-base-url',
            'fbms-form-fname',
            'show-error-list',
            'styles',
        ];
    }

    constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });

        // Add necessary stylesheets
        const stylesheets = [
            '/src/CustomForm/CustomForm.module.scss',
            '/src/StatefulSubmitButton/StatefulSubmitButton.module.scss',
            '/src/Spinner/Spinner.module.scss',
            'https://stackpath.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css',
        ];

        stylesheets.forEach((href) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            shadowRoot.appendChild(link);
        });
    }

    // Handle attribute changes and update properties without infinite loops
    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null,
    ) {
        if (oldValue === newValue) return;
        // console.log(`name: ${name} newValue: ${newValue}`);

        switch (name) {
            case 'oidc-url':
                this._oidcUrl = newValue || '';
                break;
            case 'fbms-base-url':
                this._fbmsBaseUrl = newValue || '/fbms';
                break;
            case 'fbms-form-fname':
                this._fbmsFormFname = newValue || '';
                break;
            case 'show-error-list':
                if (newValue === 'false') {
                    this._showErrorList = false;
                } else if (newValue === 'top' || newValue === 'bottom') {
                    this._showErrorList = newValue;
                } else {
                    this._showErrorList = 'top';
                }
                break;
            case 'styles':
                this._styles = newValue || '';
                break;
        }

        // console.log('name: showErrorList newValue: ', this.showErrorList);

        // Only update on connection and when attributes change
        if (this.isConnected) {
            this.renderComponent();
        }
    }

    // Render React component
    private renderComponent() {
        if (!this.shadowRoot) return;

        if (this.root === null) {
            this.root = createRoot(this.shadowRoot);
        }

        if (this._styles) {
            const styleTag = document.createElement('style');
            styleTag.textContent = this._styles;
            this.shadowRoot.appendChild(styleTag);
        }

        this.root.render(
            <FormBuilder
                oidcUrl={this._oidcUrl}
                fbmsBaseUrl={this._fbmsBaseUrl}
                fbmsFormFname={this._fbmsFormFname}
                showErrorList={this._showErrorList}
                styles={this._styles}
            />,
        );
    }

    connectedCallback() {
        // Initialize properties from attributes
        if (this.hasAttribute('oidc-url')) {
            this._oidcUrl = this.getAttribute('oidc-url') || '';
        }

        if (this.hasAttribute('fbms-base-url')) {
            this._fbmsBaseUrl = this.getAttribute('fbms-base-url') || '/fbms';
        }

        if (this.hasAttribute('fbms-form-fname')) {
            this._fbmsFormFname = this.getAttribute('fbms-form-fname') || '';
        }

        if (this.hasAttribute('show-error-list')) {
            const showErrorListAttr = this.getAttribute('show-error-list');
            if (showErrorListAttr === 'false') {
                this._showErrorList = false;
            } else if (
                showErrorListAttr === 'top' ||
                showErrorListAttr === 'bottom'
            ) {
                this._showErrorList = showErrorListAttr;
            }
        }

        if (this.hasAttribute('styles')) {
            this._styles = this.getAttribute('styles') || '';
        }

        // Render component
        this.renderComponent();
    }

    disconnectedCallback() {
        if (this.root !== null) {
            this.root.unmount();
            this.root = null;
        }
    }
}

// Register the custom element
if (!customElements.get('form-builder')) {
    customElements.define('form-builder', FormBuilderElement);
}
