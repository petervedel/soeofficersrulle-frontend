import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Form } from 'formik'
import { FormattedMessage } from 'react-intl'

export const PromotionForm = ({
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
                        id="promotion_create.date"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <DatePicker
                    name="dateOfPromotion"
                    selected={values.dateOfPromotion ? moment(values.dateOfPromotion, "DD/MM/YYYY") : null}
                    onChange={text => moment(text).isValid() ? setFieldValue('dateOfPromotion', moment(text).format("DD/MM/YYYY")) : setFieldValue('dateOfPromotion', null)}
                    dateFormat="DD/MM/YYYY"
                    className={`form-control ${touched.dateOfPromotion && errors.dateOfPromotion ? 'is-invalid' : ''}`}
                />
                {touched.dateOfPromotion && errors.dateOfPromotion && <p className="invalid-feedback d-inline">{errors.dateOfPromotion}</p>}
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
        </Form>
    )