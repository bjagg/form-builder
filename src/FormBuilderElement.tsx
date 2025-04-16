import { createFormBuilderModel } from './model/FormBuilderModel';
import { createFormBuilderView } from './view/FormBuilderView';
import { createFormBuilderController } from './controller/FormBuilderController';
import { FormBuilderConfig, ShowErrorListOptions } from './types/shared';
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
        // Set up MVC components
        this.view = createFormBuilderView(shadow);
        this.controller = createFormBuilderController(
            this.model,
            this.view,
            this,
        );
    }

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

    connectedCallback() {
        const initialState: Partial<FormBuilderConfig> = {};

        for (const attr of Array.from(this.attributes)) {
            const name = attr.name;
            const value = attr.value;
            switch (name) {
                case 'oidc-url':
                    initialState.oidcUrl = value;
                    break;
                case 'fbms-base-url':
                    initialState.fbmsBaseUrl = value;
                    break;
                case 'fbms-form-fname':
                    initialState.fbmsFormFname = value;
                    break;
                case 'show-error-list': {
                    let errorListValue: ShowErrorListOptions;

                    if (value === 'false') {
                        errorListValue = false;
                    } else if (value === 'bottom') {
                        errorListValue = 'bottom';
                    } else {
                        errorListValue = 'top';
                    }

                    initialState.showErrorList = errorListValue;
                    break;
                }
                case 'styles':
                    initialState.styles = value;
                    break;
            }
        }

        this.model.setState(initialState);
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

if (!customElements.get('form-builder')) {
    customElements.define('form-builder', FormBuilderElement);
}
