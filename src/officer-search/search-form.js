import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Form } from 'formik'
import { FormattedMessage } from 'react-intl'

export const OfficerSearchForm = ({
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
                        id="officer_search_form.date_of_service"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <DatePicker
                    name="date"
                    selected={values.date ? moment(values.date, "DD/MM/YYYY") : null}
                    onChange={text => setFieldValue('date', moment(text).format("DD/MM/YYYY"))}
                    placeholderText="DD/MM/YYYY"
                    dateFormat="DD/MM/YYYY"
                    className={`form-control ${touched.date && errors.date ? 'is-invalid' : ''}`}
                />
                {touched.date && errors.date && <p className="invalid-feedback">{errors.date}</p>}
            </div>
            <button disabled={isSubmitting} className="btn btn-primary">
                <FormattedMessage
                    id="globals_label.search"
                    defaultMessage="*translation missing*"
                />
            </button>
        </Form>
    )