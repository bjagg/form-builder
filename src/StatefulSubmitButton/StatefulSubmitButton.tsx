import React from 'react';
import Spinner from '../Spinner/Spinner';

import {
    UISchemaSubmitButtonOptions,
    getSubmitButtonOptions,
} from '@rjsf/utils';

import styles from './StatefulSubmitButton.module.scss';

const StatefulSubmitButton = (props: any) => {
    const { uiSchema } = props;
    console.log('uiSchema: ', uiSchema);
    const {
        submitText,
        norender,
        props: { disabled, className, isProcessing } = {},
    }: UISchemaSubmitButtonOptions = getSubmitButtonOptions(uiSchema);
    console.log('className: ', className);
    console.log('submitText: ', submitText);
    console.log('disabled: ', disabled);
    console.log('isProcessing: ', isProcessing);

    if (norender) {
        return null;
    }

    const isDisabled = disabled || isProcessing;

    return (
        <div className={styles.SubmitButtonWithProcessingState}>
            <button type="submit" disabled={isDisabled}>
                Submit
            </button>
            {isProcessing && (
                <>
                    <Spinner />
                    <span>Processing your request... Please wait.</span>
                </>
            )}
        </div>
    );
};

export default StatefulSubmitButton;
