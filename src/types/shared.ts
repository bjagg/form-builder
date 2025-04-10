export type ShowErrorListOptions = false | 'top' | 'bottom';

export type FormBuilderProps = {
    oidcUrl: string;
    fbmsBaseUrl: string;
    fbmsFormFname: string;
    showErrorList: ShowErrorListOptions;
    styles: string;
};
