import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import FormBuilder from '../FormBuilder/FormBuilder';
import { FormBuilderProps } from '../types/shared';

/**
 * createFormBuilderView - Creates a functional View for the FormBuilder
 * Serves as the "View" in MVC
 */
export function createFormBuilderView(shadowRoot: ShadowRoot) {
    let root: Root | null = null;

    // Set up stylesheets
    const setupStylesheets = () => {
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
    };

    // Initialize stylesheets
    setupStylesheets();

    // Render the component
    const render = (props: FormBuilderProps) => {
        if (root === null) {
            root = createRoot(shadowRoot);
        }

        if (props.styles) {
            // Remove any existing style element first
            const existingStyle = shadowRoot.querySelector(
                'style[data-custom-styles]',
            );
            if (existingStyle) {
                shadowRoot.removeChild(existingStyle);
            }

            // Create and append new style element
            const styleElement = document.createElement('style');
            styleElement.setAttribute('data-custom-styles', '');
            styleElement.textContent = props.styles;
            shadowRoot.appendChild(styleElement);
        }

        root.render(
            <FormBuilder
                oidcUrl={props.oidcUrl}
                fbmsBaseUrl={props.fbmsBaseUrl}
                fbmsFormFname={props.fbmsFormFname}
                showErrorList={props.showErrorList}
                styles={props.styles}
            />,
        );
    };

    // Clean up resources
    const cleanup = () => {
        if (root !== null) {
            root.unmount();
            root = null;
        }
    };

    return {
        render,
        cleanup,
    };
}

export type FormBuilderView = ReturnType<typeof createFormBuilderView>;
