import React from 'react'
import { Form, Field } from 'formik'
import { FormattedMessage } from 'react-intl'

export const LoginForm = ({
    values,
    touched,
    errors,
    status,
    isSubmitting,
}) => (
        <Form>
            <div className={status && status.success === true ? "hide-signin-form" : ""}>
                <div className="form-group">
                    <label>
                        <FormattedMessage
                            id="user.username"
                            defaultMessage="*translation missing*"
                        />
                    </label>
                    <Field
                        type="text"
                        name="username"
                        className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                    />
                    {touched.username && errors.username && <p className="invalid-feedback">{errors.username}</p>}
                </div>
                <div className="form-group">
                    <label>
                        <FormattedMessage
                            id="user.password"
                            defaultMessage="*translation missing*"
                        />
                    </label>
                    <Field
                        type="password"
                        name="password"
                        className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                    />
                    {touched.password && errors.password && <p className="invalid-feedback">{errors.password}</p>}
                </div>
                <button disabled={isSubmitting} className="btn btn-primary">
                    <FormattedMessage
                        id="globals_label.log_in"
                        defaultMessage="*translation missing*"
                    />
                </button>
                {status && status.error && <p className="text-danger p-2">
                    <FormattedMessage
                        id="login_form.login_error"
                        defaultMessage="*translation missing*"
                    />
                </p>}
            </div>
        </Form>
    )