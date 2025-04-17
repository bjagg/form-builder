import { FormBuilderModel } from '../model/FormBuilderModel';
import { FormBuilderView } from '../view/FormBuilderView';
import { FormBuilderConfig, ShowErrorListOptions } from '../types/shared';

export function createFormBuilderController(
    model: FormBuilderModel,
    view: FormBuilderView,
    element: HTMLElement,
) {
    let skipInitialSync = true;

    /**
     * Initialize controller
     */
    const initialize = () => {
        syncModelFromAttributes();
        updateView();
        skipInitialSync = false;
    };

    /**
     * Update view with current model state
     */
    const updateView = () => {
        view.render(model.getProps());
    };

    /**
     * Sync model properties from element attributes
     */
    const syncModelFromAttributes = () => {
        const newState: Partial<FormBuilderConfig> = {};

        if (element.hasAttribute('oidc-url')) {
            newState.oidcUrl = element.getAttribute('oidc-url') || '';
        }
        if (element.hasAttribute('fbms-base-url')) {
            newState.fbmsBaseUrl =
                element.getAttribute('fbms-base-url') || '/fbms';
        }
        if (element.hasAttribute('fbms-form-fname')) {
            newState.fbmsFormFname =
                element.getAttribute('fbms-form-fname') || '';
        }
        if (element.hasAttribute('show-error-list')) {
            const value = element.getAttribute('show-error-list');
            if (value === 'false') {
                newState.showErrorList = false;
            } else if (value === 'bottom') {
                newState.showErrorList = 'bottom';
            } else {
                newState.showErrorList = 'top';
            }
        }
        if (element.hasAttribute('styles')) {
            newState.styles = element.getAttribute('styles') || '';
        }

        model.setState(newState);
    };

    /**
     * Sets attribute only if it differs from current value to avoid infinite loops
     * @param name The name of the attribute
     * @param value The value of the attribute
     */
    const setAttributeSafely = (name: string, value: string) => {
        if (element.getAttribute(name) !== value) {
            element.setAttribute(name, value ?? '');
        }
    };

    let isSyncing = false;

    /**
     * Sync element attributes from the model properties
     */
    function syncAttributesToModel() {
        isSyncing = true;
        const state = model.getState();
        if (!state.oidcUrl || !state.fbmsBaseUrl || !state.fbmsFormFname) {
            isSyncing = false;
            return;
        }

        setAttributeSafely('oidc-url', state.oidcUrl);
        setAttributeSafely('fbms-base-url', state.fbmsBaseUrl);
        setAttributeSafely('fbms-form-fname', state.fbmsFormFname);

        if (state.showErrorList === false) {
            setAttributeSafely('show-error-list', 'false');
        } else if (state.showErrorList === 'bottom') {
            setAttributeSafely('show-error-list', 'bottom');
        } else {
            setAttributeSafely('show-error-list', 'top');
        }

        if (typeof state.styles === 'string' && state.styles.trim() !== '') {
            setAttributeSafely('styles', state.styles);
        }

        isSyncing = false;
    }

    /**
     * Handle attribute changes
     * @param name The name of the attribute
     * @param _oldValue The existing value of the attribute
     * @param newValue The new value of the attribute
     */
    function handleAttributeChange(
        name: string,
        _oldValue: string | null,
        newValue: string | null,
    ) {
        if (isSyncing) return;

        const value = newValue ?? '';
        const currentState = model.getState();

        switch (name) {
            case 'oidc-url':
                if (currentState.oidcUrl !== value) {
                    model.setState({ oidcUrl: value });
                }
                break;
            case 'fbms-base-url':
                if (currentState.fbmsBaseUrl !== value) {
                    model.setState({ fbmsBaseUrl: value });
                }
                break;
            case 'fbms-form-fname':
                if (currentState.fbmsFormFname !== value) {
                    model.setState({ fbmsFormFname: value });
                }
                break;
            case 'show-error-list': {
                let newErrorListValue: ShowErrorListOptions;

                if (value === 'bottom') {
                    newErrorListValue = 'bottom';
                } else if (value === 'false') {
                    newErrorListValue = false;
                } else {
                    newErrorListValue = 'top';
                }

                // Only update if value changed
                if (currentState.showErrorList !== newErrorListValue) {
                    model.setState({ showErrorList: newErrorListValue });
                }
                break;
            }
            case 'styles':
                if (currentState.styles !== value) {
                    model.setState({ styles: value });
                }
                break;
        }
    }

    /**
     * Subscribe to model changes
     */
    const unsubscribe = model.subscribe(() => {
        updateView();
        if (!skipInitialSync) {
            syncAttributesToModel();
        }
    });

    /**
     * Clean up resources
     */
    const cleanup = () => {
        unsubscribe();
        view.cleanup();
    };

    return {
        initialize,
        handleAttributeChange,
        cleanup,
    };
}

export type FormBuilderController = ReturnType<
    typeof createFormBuilderController
>;
