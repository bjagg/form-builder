// Export the Web Component
export { FormBuilderElement } from './FormBuilderElement';

// Re-export types for external use
export type { FormBuilderProps, ShowErrorListOptions } from './types/shared';

import { FormBuilderElement } from './FormBuilderElement';

document.addEventListener('DOMContentLoaded', () => {
    console.log('Testing FormBuilderElement instantiation');
    try {
        // Test direct class instantiation
        const testElement = new FormBuilderElement();
        console.log(
            'FormBuilderElement instantiated successfully:',
            testElement,
        );

        // Test if the element can be created via document.createElement
        const customElement = document.createElement('form-builder');
        customElement.setAttribute('oidc-url', '//some-url');
        customElement.setAttribute('fbms-form-fname', 'Some Name');
        customElement.setAttribute('styles', 'form { max-width: 500px;}');
        document.body.appendChild(customElement);
        console.log('Created form-builder element:', customElement);

        // Check if it's registered
        console.log(
            'Is form-builder registered?',
            !!customElements.get('form-builder'),
        );
    } catch (error) {
        console.error('Error instantiating FormBuilderElement:', error);
    }
});
