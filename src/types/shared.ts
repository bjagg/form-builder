export type ShowErrorListOptions = false | 'top' | 'bottom';

export interface FormBuilderConfig {
    oidcUrl: string;
    fbmsBaseUrl: string;
    fbmsFormFname: string;
    showErrorList: ShowErrorListOptions;
    styles: string;
}

export enum NotificationTypes {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}
