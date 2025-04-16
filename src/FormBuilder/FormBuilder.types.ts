import { ShowErrorListOptions, NotificationTypes } from '../types/shared';

export interface FormBuilderProps {
    fbmsBaseUrl: string;
    fbmsFormFname: string;
    oidcUrl: string;
    showErrorList?: ShowErrorListOptions;
}

export enum FormActionTypes {
    SET_LOADING = 'SET_LOADING',
    SET_ERROR = 'SET_ERROR',
    SET_SUCCESS = 'SET_SUCCESS',
}

export interface FormNotification {
    header: string;
    messages?: string[];
}

export interface FormConfig {
    formVersion?: string;
    formFname: string;
    schema?: {};
    uiSchema: {
        'ui:submitButtonOptions'?: {
            submitText?: string;
            norender?: boolean;
            props?: {
                isProcessing?: boolean;
                disabled?: boolean;
            };
        };
        [key: string]: any;
    };
}

export interface FormState {
    isLoading: boolean;
    errors: FormNotification | null;
    success: FormNotification | null;
}

export interface FormAction {
    type: FormActionTypes;
    payload?: { notification: FormNotification };
}

interface SubmissionStatusProps {
    header?: string;
    messages?: string[];
}

export interface NotificationProps {
    type: NotificationTypes;
    submissionStatus: SubmissionStatusProps;
}

export interface NotificationRef {
    scrollIntoView: () => void;
}
