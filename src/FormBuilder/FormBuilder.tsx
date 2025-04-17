import React, { useRef, useEffect, useState, useReducer } from 'react';

import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { RJSFValidationError } from '@rjsf/utils';
import Form, { IChangeEvent } from '@rjsf/core';

// import oidc from '@uportal/open-id-connect';

import { NotificationTypes } from '../types/shared';
import {
    FormConfig,
    FormBuilderProps,
    FormState,
    FormAction,
    FormActionTypes,
    FormNotification,
} from './FormBuilder.types';

import ValidationErrorList from '../ValidationErrorList/ValidationErrorList';
import StatefulSubmitButton from '../StatefulSubmitButton/StatefulSubmitButton';

import Notification from '../Notification';

const FormBuilder = ({
    fbmsBaseUrl,
    fbmsFormFname,
    // oidcUrl,
    showErrorList,
}: FormBuilderProps) => {
    const initialState = {
        isLoading: false,
        errors: null,
        success: null,
    };

    const notificationRef = useRef<HTMLDivElement>(null);
    const errorListRef = useRef<HTMLDivElement>(null);

    const formReducer = (formState: FormState, formAction: FormAction) => {
        switch (formAction.type) {
            case FormActionTypes.SET_LOADING:
                return {
                    ...formState,
                    isLoading: true,
                    errors: null,
                    success: null,
                };
            case FormActionTypes.SET_ERROR:
                return {
                    ...formState,
                    isLoading: false,
                    errors: formAction.payload
                        ?.notification as FormNotification,
                    success: null,
                };
            case FormActionTypes.SET_SUCCESS:
                return {
                    ...formState,
                    isLoading: false,
                    errors: null,
                    success: formAction.payload
                        ?.notification as FormNotification,
                };
            default:
                return formState;
        }
    };

    const [formState, dispatch] = useReducer(formReducer, initialState);
    const { isLoading, success, errors } = formState;

    const [validationErrors, setValidationErrors] = useState<
        RJSFValidationError[]
    >([]);

    useEffect(() => {
        if (errors || success) {
            if (notificationRef.current) {
                notificationRef.current.scrollIntoView({
                    behavior: 'smooth',
                });
            }
            return;
        } else if (errorListRef.current && validationErrors?.length > 0) {
            errorListRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [errors, success, errorListRef, validationErrors]);

    const hasValidSchema = (schema: RJSFSchema) => {
        if (schema.properties && Object.keys(schema.properties).length === 0) {
            return true;
        }
    };

    const [formConfig, setFormConfig] = useState<FormConfig>({
        formFname: fbmsFormFname,
        uiSchema: {
            'ui:submitButtonOptions': {
                submitText: 'Submit',
                norender: hasValidSchema({}),
                props: {
                    isProcessing: isLoading,
                    disabled: false,
                },
            },
        },
    });
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchSchema();
    }, []);

    /**
     * Returns the value from the provided rjsf schema for the given field represented by path
     * @param obj The rjsf schema object
     * @param path The full path of the field
     * @param defaultValue The default value to be returned if the field does not exist
     * @returns The value for the field with the specified path
     */
    const get = (obj: RJSFSchema, path: string, defaultValue = undefined) => {
        const keys = Array.isArray(path) ? path : path.split('.');
        let result = obj;
        for (const key of keys) {
            if (result === null || result === undefined) {
                return defaultValue;
            }
            result = result[key];
        }
        return result === undefined ? defaultValue : result;
    };

    /**
     * Processes an error received from Open ID Connect
     * @param err The error to be processed
     */
    const handleOidcError = (err: unknown) => {
        console.error(err);
        dispatch({
            type: FormActionTypes.SET_ERROR,
            payload: {
                notification: {
                    header: 'There was a problem authorizing this request.',
                },
            },
        });
    };

    /**
     * Processes an error received from the FBMS
     * @param err The error to be processed
     */
    const handleFbmsError = (
        err: { type: string; messageHeader: string } | unknown,
    ) => {
        const messageHeader =
            typeof err === 'object' &&
            err !== null &&
            'type' in err &&
            (err as any).type === 'submission'
                ? 'There was a problem submitting your form.'
                : 'There was a problem finding your form.';

        dispatch({
            type: FormActionTypes.SET_ERROR,
            payload: {
                notification: { header: messageHeader },
            },
        });
    };

    /**
     * Updates the state representing the form's data
     * @param data The data currently entered on the form
     */
    const handleChange = (data: IChangeEvent<{}, RJSFSchema, any>) => {
        setFormData(data.formData as {});
    };

    /**
     * Obtains the JWT token for the user and session
     * @returns The session JWT token for the user
     */
    const getToken = async () => {
        try {
            // return await oidc({ userInfoApiUrl: oidcUrl, timeout: 18000 });
            return {
                encoded:
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                decoded: {
                    sub: '1234567890',
                    name: 'John Doe',
                    iat: 1516239022,
                },
            };
        } catch (err) {
            console.error(err);
            handleOidcError(err);
        }
    };

    /**
     * Fetches and stores in state the schema and other config for the rjsf Form
     */
    const fetchSchema = async () => {
        try {
            const encodedToken = (await getToken())?.encoded;
            if (encodedToken) {
                const response = await fetch(
                    `${fbmsBaseUrl}/api/v1/forms/${formConfig.formFname}`,
                    {
                        credentials: 'same-origin',
                        headers: {
                            Authorization: 'Bearer ' + encodedToken,
                            'content-type': 'application/jwt',
                        },
                    },
                );
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                const payload = await response.json();
                const fbmsFormVersion = payload.version;
                const uiSchema = payload.metadata;
                const schemaWithoutVersion = { ...payload.schema };
                delete schemaWithoutVersion.$schema;
                setFormConfig({
                    ...formConfig,
                    formVersion: fbmsFormVersion,
                    uiSchema,
                    schema: schemaWithoutVersion,
                });
                fetchFormData();
            }
        } catch (err) {
            console.error(err);
            handleFbmsError(err);
        }
    };

    /**
     * Fetches the form data for the specific user
     */
    const fetchFormData = async () => {
        // Add a random query string token to the URL to get around the way
        // Safari caches content, despite explicit Cache-Control header settings.
        const submissionUrl = `${fbmsBaseUrl}/api/v1/submissions/${formConfig.formFname}?safarifix=${Math.random()}`;

        try {
            const encodedToken = (await getToken())?.encoded;
            if (encodedToken) {
                const response = await fetch(submissionUrl, {
                    credentials: 'same-origin',
                    headers: {
                        Authorization: 'Bearer ' + encodedToken,
                        'content-type': 'application/jwt',
                    },
                });

                if (!response.ok) {
                    if (response.status !== 404) {
                        throw new Error(response.statusText);
                    } else {
                        return;
                    }
                }

                const payload = await response.json();
                const formData = payload.answers;
                setFormData(formData);
            }
        } catch (err) {
            console.error(err); // check err structure
            handleFbmsError(err);
        }
    };

    /**
     * Creates a body object for the form submission
     * @param formData The data as entered on the form
     * @param username The username for the active session
     * @returns An object containing all of the necessary data
     */
    const transformSubmissionBody = (formData: {}, username: string) => {
        const { formFname, formVersion } = formConfig;
        return {
            username: username,
            formFname: formFname,
            formVersion: formVersion,
            timestamp: Date.now(),
            answers: formData,
        };
    };

    /**
     * Converts a JSON object to a plain Javascript object while avoiding circular references
     * @param obj The JSON object to be converted
     * @returns A plain Javascript object representation of the JSON object
     */
    const sanitizeForJson = (obj: any) => {
        const cache = new Set();
        return JSON.parse(
            JSON.stringify(obj, (key, value) => {
                // Exclude SchemaEnv objects and schema references
                if (key === 'root' || key === 'refs' || key === 'schema') {
                    return undefined;
                }

                // Handle circular references
                if (typeof value === 'object' && value !== null) {
                    if (cache.has(value)) {
                        return undefined; // Avoid circular reference
                    }
                    cache.add(value);
                }

                return value;
            }),
        );
    };

    /**
     * Handles submission of the form data
     * @param userFormData The data captured by the form
     */
    const handleFormSubmit = async (userFormData: any) => {
        dispatch({ type: FormActionTypes.SET_LOADING });
        const token = await getToken();
        if (token?.decoded.sub && token?.encoded) {
            try {
                const body = transformSubmissionBody(
                    sanitizeForJson(userFormData),
                    token?.decoded.sub,
                );

                const response = await fetch(
                    `${fbmsBaseUrl}/api/v1/submissions/${formConfig.formFname}`,
                    {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: {
                            Authorization: 'Bearer ' + token?.encoded,
                            'content-type': 'application/json',
                        },
                        body: JSON.stringify(body),
                    },
                );

                let submissionStatus = await response.json();

                if (!response.ok) {
                    submissionStatus.type = 'submission';
                    handleFbmsError(submissionStatus);
                    throw new Error(response.statusText);
                    // dispatch({
                    //     type: FormActionTypes.SET_SUCCESS,
                    //     payload: {
                    //         notification: {
                    //             header: 'Your form was successfully submitted.',
                    //             messages: submissionStatus.messages,
                    //         },
                    //     },
                    // });
                }

                fetchFormData();

                //  for...of was not used here because of IE
                const entries = response.headers.entries();
                let formForward,
                    item = entries.next();
                while (!item.done) {
                    let headerName = item.value[0],
                        headerValue = item.value[1];
                    if (headerName.toLowerCase() === 'x-fbms-formforward') {
                        formForward = headerValue;
                        break;
                    }
                    item = entries.next();
                }

                if (formForward) {
                    setFormConfig({ ...formConfig, formFname: formForward });
                    fetchSchema();
                }
                dispatch({
                    type: FormActionTypes.SET_SUCCESS,
                    payload: {
                        notification: {
                            header: 'Your form was successfully submitted.',
                            messages: submissionStatus.messages,
                        },
                    },
                });
            } catch (err) {
                console.error(err);
            }
        }
    };

    /**
     * Allows any message from a validation rule to be overridden.
     * Overrides come from a "messages" object, with a property matching the
     * rule that will be overridden.
     * For example to override a string pattern, that following schema could be
     * used.
     *
     * "example": {
     *   "type": "string",
     *   "pattern": "^[A-Z]{3}$",
     *   "messages": {
     *     "pattern": "Must be three upper case letters"
     *   }
     * }
     * @param errors The array of errors
     * @returns An array of transformed errors
     */
    const transformErrors = (errors: any[]) =>
        errors.map((err) => {
            if (!err.property) {
                return err;
            }
            const { property, name } = err;
            const pathParts = property.split('.');
            const prefix = pathParts.join('.properties.').substring(1); // remove leading period (.)
            const messageLocation = prefix + '.messages.' + name;
            const customMessage = get(
                formConfig.schema as RJSFSchema,
                messageLocation,
            );
            if (customMessage) {
                err.message = customMessage;
            }
            return err;
        });

    /**
     * Creates a custom validation error list template for use with the rjsf Form
     * @param props Any props passed to the custom validation error list component
     * @returns an instance of ValidationErrorList
     */
    const ValidationErrorListTemplate = (props: any) => (
        <ValidationErrorList {...props} ref={errorListRef} />
    );

    const currentUiSchema = {
        ...formConfig.uiSchema,
        'ui:submitButtonOptions': {
            ...(formConfig.uiSchema['ui:submitButtonOptions'] || {}),
            props: {
                ...(formConfig.uiSchema['ui:submitButtonOptions']?.props || {}),
                isProcessing: isLoading,
                disabled: isLoading,
            },
        },
    };

    return (
        <>
            {(errors || success) && (
                <Notification
                    ref={notificationRef}
                    type={
                        errors
                            ? NotificationTypes.ERROR
                            : NotificationTypes.SUCCESS
                    }
                    submissionStatus={(errors || success) as FormNotification}
                />
            )}
            {formConfig.schema && (
                <Form
                    schema={formConfig.schema as RJSFSchema}
                    uiSchema={currentUiSchema}
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleFormSubmit}
                    onError={(errors: RJSFValidationError[]) =>
                        setValidationErrors(errors)
                    }
                    showErrorList={showErrorList ?? 'top'}
                    transformErrors={transformErrors}
                    validator={validator}
                    templates={{
                        ButtonTemplates: { SubmitButton: StatefulSubmitButton },
                        ErrorListTemplate: ValidationErrorListTemplate,
                    }}
                />
            )}
        </>
    );
};

export default FormBuilder;
