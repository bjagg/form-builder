import { ShowErrorListOptions } from './shared';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'form-builder': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & {
                'oidc-url': string;
                'fbms-base-url': string;
                'fbms-form-fname': string;
                showErrorList?: ShowErrorListOptions;
                styles: string;
            };
        }
    }
}

export {};
