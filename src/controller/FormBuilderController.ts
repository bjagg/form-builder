import { FormBuilderModel } from '../model/FormBuilderModel';
import { FormBuilderView } from '../view/FormBuilderView';
import { FormBuilderProps, ShowErrorListOptions } from '../types/shared';

// Rest of the file remains the same

/**
 * createFormBuilderController - Creates a functional Controller for the FormBuilder
 * Serves as the "Controller" in MVC
 */
export function createFormBuilderController(
    model: FormBuilderModel,
    view: FormBuilderView,
    element: HTMLElement,
) {
    // Initialize controller
    const initialize = () => {
        syncModelFromAttributes();
        updateView();
    };

    // Update view with current model state
    const updateView = () => {
        view.render(model.getProps());
    };

    // Sync model properties from element attributes
    const syncModelFromAttributes = () => {
        const newState: Partial<FormBuilderProps> = {};

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
            } else if (value === 'top' || value === 'bottom') {
                newState.showErrorList = value;
            }
        }

        if (element.hasAttribute('styles')) {
            newState.styles = element.getAttribute('styles') || '';
        }

        model.setState(newState);
    };

    // Sync element attributes from model properties
    const syncAttributesToModel = () => {
        const state = model.getState();

        // Only set attribute if it differs from current value to avoid infinite loops
        const setAttributeSafely = (name: string, value: string) => {
            if (element.getAttribute(name) !== value) {
                element.setAttribute(name, value);
            }
        };

        setAttributeSafely('oidc-url', state.oidcUrl);
        setAttributeSafely('fbms-base-url', state.fbmsBaseUrl);
        setAttributeSafely('fbms-form-fname', state.fbmsFormFname);

        if ((state.showErrorList as ShowErrorListOptions) === false) {
            setAttributeSafely('show-error-list', 'false');
        } else {
            setAttributeSafely('show-error-list', state.showErrorList);
        }

        setAttributeSafely('styles', state.styles);
    };

    // Handle attribute changes
    const handleAttributeChange = (
        name: string,
        oldValue: string | null,
        newValue: string | null,
    ) => {
        if (oldValue === newValue) return;

        const update: Partial<FormBuilderProps> = {};

        switch (name) {
            case 'oidc-url':
                update.oidcUrl = newValue || '';
                break;
            case 'fbms-base-url':
                update.fbmsBaseUrl = newValue || '/fbms';
                break;
            case 'fbms-form-fname':
                update.fbmsFormFname = newValue || '';
                break;
            case 'show-error-list':
                if (newValue === 'false') {
                    update.showErrorList = false;
                } else if (newValue === 'top' || newValue === 'bottom') {
                    update.showErrorList = newValue;
                } else {
                    update.showErrorList = 'top';
                }
                break;
            case 'styles':
                update.styles = newValue || '';
                break;
        }

        model.setState(update);
    };

    // Subscribe to model changes
    const unsubscribe = model.subscribe(() => {
        updateView();
        syncAttributesToModel();
    });

    // Clean up resources
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
