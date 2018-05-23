import React from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Form, Field } from 'formik'
import "react-table/react-table.css"
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import { FormattedMessage } from 'react-intl'

export const UserSearchForm = ({
    values,
    touched,
    errors,
    dirty,
    status,
    isSubmitting,
    handleChange,
    setFieldValue,
    handleBlur,
    handleSubmit,
}) => (
        <Form>
            <div className="form-group">
                <label>
                    <FormattedMessage
                        id="user.username"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <Field
                    type="text"
                    dirty="false"
                    name="username"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                />
            </div>
            <div className="form-group">
                <label>
                    <FormattedMessage
                        id="user.email"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <Field
                    type="text"
                    name="email"
                    className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                />
            </div>
            <button disabled={isSubmitting} className="btn btn-primary">
                <FormattedMessage
                    id="globals_btn.search"
                    defaultMessage="*translation missing*"
                />
            </button>
            {status && status.success && <p className="text-success p-2">
                <FormattedMessage
                    id="globals_search.success"
                    defaultMessage="*translation missing*"
                />
            </p>}
            {errors && 0 < errors.length && <p className="text-success p-2">
                <FormattedMessage
                    id="globals_search.error"
                    defaultMessage="*translation missing*"
                />
            </p>}
        </Form>
    )