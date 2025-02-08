declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'form-builder': React.DetailedHTMLProps<
                React.HTMLAttributes<HTMLElement>,
                HTMLElement
            > & { fbmsBaseUrl: string };
            'greeting-element': {};
        }
    }
}

export {};
