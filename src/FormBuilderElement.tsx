import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import FormBuilder from './FormBuilder';

class FormBuilderElement extends HTMLElement {
    #fbmsBaseUrl = '';

    static get observedAttributes() {
        return ['fbmsBaseUrl'];
    }

    set fbmsBaseUrl(fbmsBaseUrl) {
        this.#fbmsBaseUrl = fbmsBaseUrl;
    }

    get fbmsBaseUrl() {
        return this.#fbmsBaseUrl;
    }

    private root: Root | null = null;
    // private container: HTMLElement | null = null;

    // constructor() {
    //     super();
    //     this.attachShadow({ mode: 'open' });
    // }

    // connectedCallback() {
    //     // Create container div
    //     this.container = document.createElement('div');
    //     this.appendChild(this.container);

    //     // Create and mount React root
    //     this.root = createRoot(this.container);
    //     this.root.render(<FormBuilder />);
    // }

    // disconnectedCallback() {
    //     if (this.root) {
    //         this.root.unmount();
    //         this.root = null;
    //     }
    //     if (this.container) {
    //         this.container.remove();
    //         this.container = null;
    //     }
    // }

    constructor() {
        super();
        // this.#fbmsBaseUrl = this.
        // Attach a shadow DOM to the custom element
        const shadow = this.attachShadow({ mode: 'open' });

        // Inject the compiled CSS for the child component using the <link> tag
        const customFormStylesLink = document.createElement('link');
        customFormStylesLink.rel = 'stylesheet';
        customFormStylesLink.href = '/src/CustomForm/CustomForm.module.scss'; // Vite handles bundling this file
        shadow.appendChild(customFormStylesLink);

        // Inject the compiled CSS for the child component using the <link> tag
        const statefulSubmitButtonStylesLink = document.createElement('link');
        statefulSubmitButtonStylesLink.rel = 'stylesheet';
        statefulSubmitButtonStylesLink.href =
            '/src/StatefulSubmitButton/StatefulSubmitButton.module.scss'; // Vite handles bundling this file
        shadow.appendChild(statefulSubmitButtonStylesLink);

        // Inject the compiled CSS for the grandchild component (if needed)
        const spinnerStylesLink = document.createElement('link');
        spinnerStylesLink.rel = 'stylesheet';
        spinnerStylesLink.href = '/src/Spinner/Spinner.module.scss'; // Vite will bundle it
        shadow.appendChild(spinnerStylesLink);

        const bootstrapStylesLink = document.createElement('link');
        bootstrapStylesLink.rel = 'stylesheet';
        bootstrapStylesLink.href =
            'https://stackpath.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css';

        shadow.appendChild(bootstrapStylesLink);
    }

    connectedCallback() {
        if (this.root === null) {
            // Use ReactDOM to render the React component into the shadow root
            this.root = createRoot(this.shadowRoot!);
            this.root.render(<FormBuilder fbmsBaseUrl={this.#fbmsBaseUrl} />);
        }
    }

    disconnectedCallback() {
        // Clean up when the custom element is removed from the DOM
        if (this.root !== null) {
            this.root.unmount();
            this.root = null;
        }
    }
}

customElements.define('form-builder', FormBuilderElement);
