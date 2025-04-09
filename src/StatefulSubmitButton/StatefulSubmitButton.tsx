import React from 'react';
import Spinner from '../Spinner/Spinner';

import {
    UISchemaSubmitButtonOptions,
    getSubmitButtonOptions,
} from '@rjsf/utils';

import styles from './StatefulSubmitButton.module.scss';

const StatefulSubmitButton = (props: any) => {
    const { uiSchema } = props;
    const {
        submitText,
        norender,
        props: { isProcessing, disabled } = {},
    }: UISchemaSubmitButtonOptions = getSubmitButtonOptions(uiSchema);

    if (norender) {
        return null;
    }

    const isDisabled = disabled || isProcessing;

    return (
        <div className={styles.SubmitButtonWithProcessingState}>
            <button type="submit" disabled={isDisabled}>
                {submitText}
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
