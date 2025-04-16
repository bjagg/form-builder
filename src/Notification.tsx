import React, { forwardRef, Key } from 'react';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faExclamationCircle,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { NotificationTypes } from './types/shared';
import { NotificationProps } from './FormBuilder/FormBuilder.types';

library.add(faExclamationCircle, faCheckCircle);

const Notification = forwardRef<HTMLDivElement, NotificationProps>(
    (props, ref) => {
        const { type, submissionStatus } = props;
        return (
            <div
                ref={ref}
                className={`alert ${type === NotificationTypes.ERROR ? 'alert-danger' : 'alert-success'}`}
                style={{ scrollMarginTop: '20px' }}
                role="alert"
            >
                {type === NotificationTypes.ERROR ? (
                    <h3>
                        <FontAwesomeIcon
                            icon="exclamation-circle"
                            style={{ width: '1em' }}
                        />{' '}
                        {submissionStatus.header}
                    </h3>
                ) : (
                    <>
                        <FontAwesomeIcon
                            icon="check-circle"
                            style={{ width: '1em' }}
                        />{' '}
                        {submissionStatus.header}
                    </>
                )}
                {submissionStatus.messages &&
                    submissionStatus.messages?.length > 0 && (
                        <ul>
                            {submissionStatus.messages.map(
                                (item: string, index: Key) => (
                                    <li key={index}>{item}</li>
                                ),
                            )}
                        </ul>
                    )}
            </div>
        );
    },
);

export default Notification;
