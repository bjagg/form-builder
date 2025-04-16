import React, { forwardRef } from 'react';
import { ErrorListProps } from '@rjsf/utils';

const ValidationErrorList = forwardRef<HTMLDivElement, ErrorListProps>(
    (props, ref) => {
        const { errors = [] } = props;

        if (errors.length === 0) {
            return null;
        }

        return (
            <div
                ref={ref}
                className="panel panel-danger errors"
                style={{ scrollMarginTop: '20px' }}
                role="alert"
            >
                <div className="panel-heading">
                    <h3 className="panel-title">
                        {errors.length} Error{errors.length !== 1 ? 's' : ''}{' '}
                        Found
                    </h3>
                </div>
                <ul className="list-group">
                    {errors.map((error, i) => (
                        <li key={i} className="list-group-item text-danger">
                            {error.stack}
                        </li>
                    ))}
                </ul>
            </div>
        );
    },
);

export default ValidationErrorList;
