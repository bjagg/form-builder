import React, { useEffect, useState, useReducer } from 'react';

import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import Form, { IChangeEvent } from '@rjsf/core';

import oidc from '@uportal/open-id-connect';

import StatefulSubmitButton from '../StatefulSubmitButton/StatefulSubmitButton';

import Notification from '../Notification';

const schema: RJSFSchema = {
    $schema: 'http://json-schema.org/draft-06/schema#',
    $id: 'http://localhost:8090/communication-preferences.json',
    title: 'Communication Preferences',
    description:
        'Please review your information that we have on file to make sure that our records are up-to-date.  Failure to provide current information can cause our self service not to work for you.',
    type: 'object',
    properties: {
        contact_information: {
            $id: '/properties/contact_information',
            description:
                'Be aware that confidential information may be sent to the cell numbers and/or email address provided here.',
            type: 'object',
            properties: {
                primary_cell_number: {
                    $id: '/properties/contact_information/primary_cell_number',
                    title: 'Primary Cell Number',
                    type: 'string',
                    pattern: '^\\d{3}-\\d{3}-\\d{4}$',
                },
                secondary_cell_number: {
                    $id: '/properties/contact_information/secondary_cell_number',
                    title: 'Secondary Cell Number',
                    description:
                        '(This number can be used to keep parents informed.)',
                    type: 'string',
                    pattern: '^\\d{3}-\\d{3}-\\d{4}$',
                },
                email_address: {
                    $id: '/properties/contact_information/email_address',
                    title: 'Email Address',
                    type: 'string',
                    format: 'email',
                },
            },
        },
        channels: {
            $id: '/properties/channels',
            description:
                'The following messaging services are available for you to subscribe.  Some services are available at multiple campuses;  your primary campus will be selected by default.',
            type: 'object',
            properties: {
                taco_truck: {
                    $id: '/properties/channels/taco_truck',
                    title: 'Taco Truck',
                    description:
                        'This service keeps you informed about where to find tacos on campus',
                    type: 'object',
                    properties: {
                        receive: {
                            $id: '/properties/channels/taco_truck/receive',
                            type: 'string',
                            enum: ['Yes', 'No'],
                        },
                        locations: {
                            $id: '/properties/channels/taco_truck/locations',
                            type: 'array',
                            items: {
                                type: 'string',
                                enum: [
                                    'Fresno City College',
                                    'Clovis Community College',
                                    'Reedley College',
                                ],
                            },
                            uniqueItems: true,
                        },
                    },
                },
            },
        },
        preserve_selections: {
            $id: '/properties/preserve_selections',
            description:
                'Preserve subscribed notifications when no longer taking classes.  Review the Subscription Policy for more details.',
            type: 'boolean',
        },
    },
};

interface FormBuilderProps {
    fbmsBaseUrl: string;
    fbmsFormFname: string;
    oidcUrl: string;
    showErrorList?: false | 'top' | 'bottom';
    styles?: string;
}

enum NotificationType {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

enum FormActionTypes {
    SET_LOADING = 'SET_LOADING',
    SET_ERROR = 'SET_ERROR',
    SET_SUCCESS = 'SET_SUCCESS',
}

interface Notification {
    header: string;
    messages: string[];
}

interface FormConfig {
    formVersion?: string;
    formFname: string;
    schema?: {};
    uiSchema: {};
}

interface FormState {
    isLoading: boolean;
    errors: Notification | null;
    success: Notification | null;
}

interface FormAction {
    type: FormActionTypes;
    payload?: { notification: Notification };
}

const FormBuilder = ({
    fbmsBaseUrl,
    fbmsFormFname,
    oidcUrl,
    showErrorList,
    styles,
}: FormBuilderProps) => {
    console.log(fbmsBaseUrl);
    console.log(fbmsFormFname);
    console.log(showErrorList);
    console.log(oidcUrl);
    console.log(styles);

    const initialState = {
        isLoading: false,
        errors: null,
        success: null,
    };

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
                    errors: formAction.payload?.notification as Notification,
                    success: null,
                };
            case FormActionTypes.SET_SUCCESS:
                return {
                    ...formState,
                    isLoading: false,
                    errors: null,
                    success: formAction.payload?.notification as Notification,
                };
            default:
                return formState;
        }
    };

    const [formState, dispatch] = useReducer(formReducer, initialState);
    const { isLoading, success, errors } = formState;

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
                norender: hasValidSchema(schema),
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

    const handleOidcError = (err: unknown) => {
        console.log(err); // check err structure
        dispatch({
            type: FormActionTypes.SET_ERROR,
            payload: {
                notification: {
                    header: 'There was a problem authorizing this request.',
                    messages: ['Get an appropriate error message here'],
                },
            },
        });
    };

    const handleFbmsError = (err: { type: string; messageHeader: string }) => {
        console.log(err); // check err structure
        const messageHeader =
            err.type === 'submission'
                ? 'There was a problem submitting your form.'
                : 'There was a problem finding your form.';
        dispatch({
            type: FormActionTypes.SET_ERROR,
            payload: {
                notification: { header: messageHeader, messages: [''] },
            },
        });
    };

    const handleChange = (data: IChangeEvent<{}, RJSFSchema, any>) => {
        setFormData(data.formData as {});
    };

    const getToken = async () => {
        try {
            return await oidc({ userInfoApiUrl: oidcUrl, timeout: 18000 });
        } catch (err) {
            console.error('getToken:  ', err);
            handleOidcError(err);
        }
    };

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
                const schema = payload.schema;
                setFormConfig({
                    ...formConfig,
                    formVersion: fbmsFormVersion,
                    uiSchema, // * * * might need to spread existing ui:submitButtonOptions to new value along with payload.metadata
                    schema,
                });
                fetchFormData();
            }
        } catch (err) {
            console.error(err); // check error structure
            // handleFbmsError(err);
        }
    };

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
            // handleFbmsError(err);
        }
    };

    const transformBody = (formData: {}, username: string) => {
        const { formFname, formVersion } = formConfig;
        return {
            username: username,
            formFname: formFname,
            formVersion: formVersion,
            timestamp: Date.now(),
            answers: formData,
        };
    };

    const handleFormSubmit = async (userFormData: any) => {
        dispatch({ type: FormActionTypes.SET_LOADING });
        const token = await getToken();

        if (token?.decoded.sub && token?.encoded) {
            const body = transformBody(userFormData, token?.decoded.sub);

            try {
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
                // this.setState({ submissionStatus });  * * *  NEED THIS ? ? ? ? ?

                if (!response.ok) {
                    submissionStatus.type = 'submission';
                    handleFbmsError(submissionStatus);
                    throw new Error(response.statusText);
                }

                fetchFormData();

                /* Note: for...of was not used here because of IE */
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
                scrollToNotification();
            } catch (err) {
                console.error(err);
                scrollToNotification();
            }
        }
    };

    const scrollToNotification = () => {
        const element = document.getElementById('form-builder-notification');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
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
     */
    const transformErrors = (errors: any[]) =>
        errors.map((err) => {
            // Add a guard clause to check if property exists
            if (!err.property) {
                console.log('Error object missing property:', err);
                return err;
            }
            const { property, name } = err;
            // property might now include '.', so handle it properly
            const pathParts = property.split('.');
            const prefix = pathParts.join('.properties.').substring(1); // remove leading period (.)
            const messageLocation = prefix + '.messages.' + name;
            const customMessage = get(schema, messageLocation);
            if (customMessage) {
                err.message = customMessage;
            }
            return err;
        });

    return (
        <>
            {errors && (
                <Notification
                    type={NotificationType.ERROR}
                    submissionStatus={errors}
                />
            )}
            {success && (
                <Notification
                    type={NotificationType.SUCCESS}
                    submissionStatus={success}
                />
            )}
            <Form
                schema={schema}
                uiSchema={formConfig.uiSchema}
                formData={formData}
                onChange={handleChange}
                onSubmit={handleFormSubmit}
                showErrorList={showErrorList ?? 'top'}
                transformErrors={transformErrors}
                validator={validator}
                templates={{
                    ButtonTemplates: { SubmitButton: StatefulSubmitButton },
                }}
            />
        </>
    );
};

export default FormBuilder;
