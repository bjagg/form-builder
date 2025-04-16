import { FormBuilderConfig } from '../types/shared';

export function createFormBuilderModel(
    initialState: Partial<FormBuilderConfig> = {},
) {
    const state = {
        oidcUrl: initialState.oidcUrl || '',
        fbmsBaseUrl: initialState.fbmsBaseUrl || '/fbms',
        fbmsFormFname: initialState.fbmsFormFname || '',
        showErrorList:
            initialState.showErrorList !== undefined
                ? initialState.showErrorList
                : 'top',
        styles: initialState.styles || '',
    };

    const listeners: Array<() => void> = [];

    /**
     * Subscribes an entity to model changes
     * @param listener An entity requesting to subscribe to model changes
     */
    const subscribe = (listener: () => void) => {
        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    };

    /**
     * Notifies all subscribers of model changes
     */
    const notify = () => {
        listeners.forEach((listener) => listener());
    };

    const getState = () => ({ ...state });

    const setState = (newState: Partial<FormBuilderConfig>) => {
        let changed = false;

        Object.entries(newState).forEach(([key, value]) => {
            if (state[key as keyof FormBuilderConfig] !== value) {
                state[key as keyof FormBuilderConfig] = value as any;
                changed = true;
            }
        });

        if (changed) {
            notify();
        }
    };

    /**
     * Gets all properties as an object for React props
     * @returns properties to serve as props for React
     */
    const getProps = () => ({ ...state });

    return {
        getState,
        setState,
        getProps,
        subscribe,
    };
}

export type FormBuilderModel = ReturnType<typeof createFormBuilderModel>;
