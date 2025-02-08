import React, { useEffect, useReducer } from 'react';

import Notification from './Notification';
import CustomForm from './CustomForm/CustomForm';

interface FormBuilderProps {
    fbmsBaseUrl: string;
}

enum NotificationType {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

enum FormActionTypes {
    START_LOADING = 'START_LOADING',
    SET_ERROR = 'SET_ERROR',
    SET_SUCCESS = 'SET_SUCCESS',
    SET_SUBMISSION_STATUS = 'SET_SUBMISSION_STATUS',
}

const initialState = {
    isLoading: true,
    hasError: true,
    hasSuccess: true,
    submissionStatus: {
        messageHeader: 'Error',
        messages: ['Error 1', 'Error 2'],
    },
};

const formReducer = (state: any, action: { type: any; payload?: any }) => {
    switch (action.type) {
        case FormActionTypes.START_LOADING:
            return {
                ...state,
                isLoading: true,
                hasError: false,
                hasSuccess: false,
            };
        case FormActionTypes.SET_ERROR:
            return {
                ...state,
                isLoading: false,
                hasError: true,
                hasSuccess: false,
            };
        case FormActionTypes.SET_SUCCESS:
            return {
                ...state,
                isLoading: false,
                hasError: false,
                hasSuccess: true,
            };
        case FormActionTypes.SET_SUBMISSION_STATUS:
            return {
                ...state,
                submissionStatus: {
                    messageHeader: 'Form Submitted',
                    messages: action.payload.messages,
                },
            };
        default:
            return state;
    }
};

const FormBuilder = (props: FormBuilderProps) => {
    const { fbmsBaseUrl } = props;
    const [state, dispatch] = useReducer(formReducer, initialState);
    const { isLoading, hasSuccess, hasError, submissionStatus } = state;

    useEffect(() => {
        fetchSchema();
    }, []);

    const fetchSchema = async () => {
        console.log('got here');
    };

    const handleFormSubmit = () => {
        dispatch({ type: FormActionTypes.START_LOADING });
        console.log('form submitted');
    };

    return (
        <div>
            {(hasError || hasSuccess) && (
                <Notification
                    type={
                        hasError
                            ? NotificationType.ERROR
                            : NotificationType.SUCCESS
                    }
                    submissionStatus={submissionStatus}
                />
            )}
            <CustomForm
                fbmsBaseUrl={fbmsBaseUrl}
                onSubmitHandler={handleFormSubmit}
                isProcessing={isLoading}
            />
        </div>
    );
};

export default FormBuilder;
