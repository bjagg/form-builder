import { createFormBuilderModel } from './model/FormBuilderModel';
import { createFormBuilderView } from './view/FormBuilderView';
import { createFormBuilderController } from './controller/FormBuilderController';

/**
 * FormBuilderElement - Web Component that uses functional MVC pattern
 */
export class FormBuilderElement extends HTMLElement {
    private model = createFormBuilderModel();
    private view;
    private controller;

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

        // Create shadow DOM
        const shadow = this.attachShadow({ mode: 'open' });

        // Set up MVC components using functional approach
        this.view = createFormBuilderView(shadow);
        this.controller = createFormBuilderController(
            this.model,
            this.view,
            this,
        );
    }

    // Define property getters and setters that modify the model
    get oidcUrl() {
        return this.model.getState().oidcUrl;
    }
    set oidcUrl(val) {
        this.model.setState({ oidcUrl: val });
    }

    get fbmsBaseUrl() {
        return this.model.getState().fbmsBaseUrl;
    }
    set fbmsBaseUrl(val) {
        this.model.setState({ fbmsBaseUrl: val });
    }

    get fbmsFormFname() {
        return this.model.getState().fbmsFormFname;
    }
    set fbmsFormFname(val) {
        this.model.setState({ fbmsFormFname: val });
    }

    get showErrorList() {
        return this.model.getState().showErrorList;
    }
    set showErrorList(val) {
        this.model.setState({ showErrorList: val });
    }

    get styles() {
        return this.model.getState().styles;
    }
    set styles(val) {
        this.model.setState({ styles: val });
    }

    // Web component lifecycle methods
    connectedCallback() {
        this.controller.initialize();
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null,
    ) {
        this.controller.handleAttributeChange(name, oldValue, newValue);
    }

    disconnectedCallback() {
        this.controller.cleanup();
    }
}

// Register the custom element if not already defined
if (!customElements.get('form-builder')) {
    customElements.define('form-builder', FormBuilderElement);
}
