import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Form, Field } from 'formik'
import VirtualizedSelect from 'react-virtualized-select'
import { FormattedMessage } from 'react-intl'

const setInvalid = () => {
    if (document.getElementById("genderSelect"))
        document.getElementById("genderSelect").getElementsByClassName("Select-control")[0].classList.add("select-is-invalid")
}

const setValid = () => {
    if (document.getElementById("genderSelect"))
        document.getElementById("genderSelect").getElementsByClassName("Select-control")[0].classList.remove("select-is-invalid")
}

export const UserUpdateForm = ({
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
    handleReset,
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
                    name="username"
                    className={`form-control ${touched.username && errors.username ? 'is-invalid' : ''}`}
                />
                {touched.username && errors.username && <p className="invalid-feedback">{errors.username}</p>}
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
                {touched.email && errors.email && <p className="invalid-feedback">{errors.email}</p>}
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
            <div className="form-group">
                <div className="row">
                    <div className="col">
                        <label>
                            <FormattedMessage
                                id="user.valid_from"
                                defaultMessage="*translation missing*"
                            />
                        </label>
                        <DatePicker
                            name="from"
                            selected={values.from ? moment(values.from, "DD/MM/YYYY") : null}
                            onChange={text => moment(text).isValid() ? setFieldValue('from', moment(text).format("DD/MM/YYYY")) : setFieldValue('from', null)}
                            dateFormat="DD/MM/YYYY"
                            placeholderText="DD/MM/YYYY"
                            className={`form-control ${touched.from && errors.from ? 'is-invalid' : ''}`}
                        />
                        {touched.from && errors.from && <p className="invalid-feedback d-inline">{errors.from}</p>}
                    </div>
                    <div className="col">
                        <label>
                            <FormattedMessage
                                id="user.valid_to"
                                defaultMessage="*translation missing*"
                            />
                        </label>
                        <DatePicker
                            name="until"
                            selected={values.until ? moment(values.until, "DD/MM/YYYY") : null}
                            onChange={text => setFieldValue('until', moment(text).format("DD/MM/YYYY"))}
                            dateFormat="DD/MM/YYYY"
                            placeholderText="DD/MM/YYYY"
                            className={`form-control ${touched.until && errors.until ? 'is-invalid' : ''}`}
                        />
                        {touched.until && errors.until && <p className="invalid-feedback d-inline">{errors.until}</p>}
                    </div>
                </div>
            </div>
            <div className="form-group" id="genderSelect">
                <label>
                    <FormattedMessage
                        id="user.role"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <VirtualizedSelect options={values.roles}
                    name="causeOfDeath"
                    value={values.role}
                    onChange={value => setFieldValue('role', value)}
                    className={`Select is-clearable is-searchable Select--single ${touched.role && errors.role ? setInvalid() : setValid()}`}
                />
                {touched.role && errors.role && <p className="invalid-feedback d-inline">{errors.role}</p>}
            </div>
            <button disabled={isSubmitting} className="btn btn-primary">
                <FormattedMessage
                    id="globals_btn.update"
                    defaultMessage="*translation missing*"
                />
            </button>
            {status && status.error && <p className="text-danger p-2">
                <FormattedMessage
                    id="globals_form_update.error"
                    defaultMessage="*translation missing*"
                />
            </p>}
        </Form >
    )
