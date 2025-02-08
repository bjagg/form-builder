import React, {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    ReactPortal,
} from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faExclamationCircle,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faExclamationCircle, faCheckCircle);

enum NotificationType {
    SUCCESS = 'SUCCESS',
    ERROR = 'ERROR',
}

interface SubmissionStatusProps {
    messageHeader?: string;
    messages?: string[];
}

interface NotificationProps {
    type: NotificationType;
    submissionStatus?: SubmissionStatusProps;
}

const Notification = (props: NotificationProps) => {
    const { type, submissionStatus } = props;
    return (
        <div
            id="form-builder-notification"
            className={`alert ${type === NotificationType.ERROR ? 'alert-danger' : 'alert-success'}`}
            role="alert"
        >
            {type === NotificationType.ERROR ? (
                <h3>
                    <FontAwesomeIcon
                        icon="exclamation-circle"
                        style={{ width: '1em' }}
                    />{' '}
                    {submissionStatus?.messageHeader}
                </h3>
            ) : (
                <>
                    <FontAwesomeIcon
                        icon="check-circle"
                        style={{ width: '1em' }}
                    />{' '}
                    Your form was successfully submitted.
                </>
            )}
            {submissionStatus?.messages &&
                submissionStatus.messages.length > 0 && (
                    <ul>
                        {submissionStatus?.messages.map(
                            (
                                item:
                                    | string
                                    | number
                                    | boolean
                                    | ReactElement<
                                          any,
                                          string | JSXElementConstructor<any>
                                      >
                                    | Iterable<ReactNode>
                                    | ReactPortal
                                    | null
                                    | undefined,
                                index: Key | null | undefined,
                            ) => <li key={index}>{item}</li>,
                        )}
                    </ul>
                )}
        </div>
    );
};

export default Notification;
