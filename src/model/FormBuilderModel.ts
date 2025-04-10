import { FormBuilderProps } from '../types/shared';

/**
 * createFormBuilderModel - Creates a functional Model for the FormBuilder
 * Serves as the "Model" in MVC
 */
export function createFormBuilderModel(
    initialState: Partial<FormBuilderProps> = {},
) {
    // Initialize state with defaults
    const state = {
        oidcUrl: initialState.oidcUrl || '',
        fbmsBaseUrl: initialState.fbmsBaseUrl || '/fbms',
        fbmsFormFname: initialState.fbmsFormFname || '',
        showErrorList: initialState.showErrorList || 'top',
        styles: initialState.styles || '',
    };

    // Subscribers to model changes
    const listeners: Array<() => void> = [];

    // Subscribe to model changes
    const subscribe = (listener: () => void) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    };

    // Notify all subscribers
    const notify = () => {
        listeners.forEach((listener) => listener());
    };

    // Create getters and setters for each property
    const getState = () => ({ ...state });

    const setState = (newState: Partial<FormBuilderProps>) => {
        let changed = false;

        Object.entries(newState).forEach(([key, value]) => {
            if (state[key as keyof FormBuilderProps] !== value) {
                state[key as keyof FormBuilderProps] = value as any;
                changed = true;
            }
        });

        if (changed) {
            notify();
        }
    };

    // Method to get all properties as an object for React props
    const getProps = () => ({ ...state });

    return {
        getState,
        setState,
        getProps,
        subscribe,
    };
}

export type FormBuilderModel = ReturnType<typeof createFormBuilderModel>;
