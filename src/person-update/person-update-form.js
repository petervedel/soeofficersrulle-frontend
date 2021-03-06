import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Form, Field } from 'formik'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import { FormattedMessage } from 'react-intl'

const setInvalid = () => {
    if (document.getElementById("genderSelect"))
        document.getElementById("genderSelect").getElementsByClassName("Select-control")[0].classList.add("select-is-invalid")
}

const setValid = () => {
    if (document.getElementById("genderSelect"))
        document.getElementById("genderSelect").getElementsByClassName("Select-control")[0].classList.remove("select-is-invalid")
}

const genderLabel = (gender) => {
    if (gender === "Male") {
        return {
            label: <FormattedMessage
                id="person.gender_male"
                defaultMessage="*translation missing*"
            />
            , gender: "Male"
        }
    } else if (gender === "Female") {
        return {
            label: <FormattedMessage
                id="person.gender_female"
                defaultMessage="*translation missing*"
            />,
            gender: "Female"
        }
    } else if (gender === "Unknown") {
        return {
            label: <FormattedMessage
                id="person.gender_unknown"
                defaultMessage="*translation missing*"
            />
            , gender: "Unknown"
        }
    } else {
        return gender
    }
}

const terminationCauseLabel = (cause) => {
    if (cause === "Terminated") {
        return {
            label: <FormattedMessage
                id="officer.terminated"
                defaultMessage="*translation missing*"
            />,
            terminationCause: "Terminated"
        }
    } else if (cause === "Killed_in_action") {
        return {
            label: <FormattedMessage
                id="officer.killed_in_action"
                defaultMessage="*translation missing*"
            />,
            terminationCause: "Killed_in_action"
        }
    } else if (cause === "Accidental_death") {
        return {
            label:
                <FormattedMessage
                    id="officer.accidental_death"
                    defaultMessage="*translation missing*"
                />,
            terminationCause
                :
                "Accidental_death"
        }
    } else if (cause === "Transferred") {
        return {
            label:
                <FormattedMessage
                    id="officer.transferred"
                    defaultMessage="*translation missing*"
                />,
            terminationCause: "Transferred"
        }
    } else if (cause === "Other") {
        return {
            label:
                <FormattedMessage
                    id="globals.other"
                    defaultMessage="*translation missing*"
                />,
            terminationCause: "Other"
        }
    } else {
        return cause
    }
}

export const PersonUpdateForm = ({
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
                        id="person.surname"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <Field
                    type="text"
                    name="surname"
                    className={`form-control ${touched.surname && errors.surname ? 'is-invalid' : ''}`}
                />
                {touched.surname && errors.surname && <p className="invalid-feedback">{errors.surname}</p>}
            </div>
            <div className="form-group">
                <label>
                    <FormattedMessage
                        id="person.given_name"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <Field
                    type="text"
                    name="givenName"
                    className={`form-control ${touched.givenName && errors.givenName ? 'is-invalid' : ''}`}
                />
                {touched.givenName && errors.givenName && <p className="invalid-feedback">{errors.givenName}</p>}
            </div>
            <div className="form-group">
                <label>
                    <FormattedMessage
                        id="person.born"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <DatePicker
                    name="dateOfBirth"
                    selected={values.dateOfBirth ? moment(values.dateOfBirth, "DD/MM/YYYY") : null}
                    onChange={text => moment(text).isValid() ? setFieldValue('dateOfBirth', moment(text).format("DD/MM/YYYY")) : setFieldValue('dateOfBirth', null)}
                    placeholderText="D/M YYYY"
                    dateFormat="D/M YYYY"
                    autoComplete="off"
                    className={`form-control ${touched.dateOfBirth && errors.dateOfBirth ? 'is-invalid' : ''}`}
                />
                {touched.dateOfBirth && errors.dateOfBirth && <p className="invalid-feedback d-inline">{errors.dateOfBirth}</p>}
            </div>
            <div className="form-group" id="genderSelect">
                <label>
                    <FormattedMessage
                        id="person.gender"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <VirtualizedSelect
                    options={values.genders}
                    placeholder={
                        <FormattedMessage
                            id="globals_label.select_placeholder"
                            defaultMessage="*translation missing*"
                        />
                    }
                    name="gender"
                    value={genderLabel(values.gender)}
                    onChange={value => setFieldValue('gender', value)}
                    className={`Select is-clearable is-searchable Select--single ${touched.gender && errors.gender ? setInvalid() : setValid()}`}

                />
                {touched.gender && errors.gender && <p className="invalid-feedback d-inline">{errors.gender}</p>}
            </div>
            <div className="form-group">
                <label>
                    <FormattedMessage
                        id="person.died"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <DatePicker
                    name="dateOfDeath"
                    selected={values.dateOfDeath ? moment(values.dateOfDeath, "DD/MM/YYYY") : null}
                    onChange={text => moment(text).isValid() ? setFieldValue('dateOfDeath', moment(text).format("DD/MM/YYYY")) : setFieldValue('dateOfDeath', null)}
                    placeholderText="D/M YYYY"
                    dateFormat="D/M YYYY"
                    autoComplete="off"
                    className={`form-control ${touched.dateOfDeath && errors.dateOfDeath ? 'is-invalid' : ''}`}
                />
                {touched.dateOfDeath && errors.dateOfDeath && <p className="invalid-feedback d-inline">{errors.dateOfDeath}</p>}
            </div>
            <div className="form-group">
                <div className="switch-label">
                    <FormattedMessage
                        id="globals_form.is_officer"
                        defaultMessage="*translation missing*"
                    />
                </div>
                <label className="switch">
                    <input
                        type="checkbox"
                        id="checkbox"
                        disabled={values.isOfficer}
                        onClick={text => setFieldValue("isOfficer", !values.isOfficer)}
                    />
                    <span className="slider round"></span>
                </label>
            </div>
            <div id="officerDetails" className={!values.isOfficer ? "d-none" : "d-inline form-group"} >
                <div className="form-group">
                    <label>
                        <FormattedMessage
                            id="officer.tordenskjold_nr"
                            defaultMessage="*translation missing*"
                        />
                    </label>
                    <Field
                        type="number"
                        id="appointedNumber"
                        name="appointedNumber"
                        className={`form-control ${touched.appointedNumber && errors.appointedNumber ? 'is-invalid' : ''}`}
                    />
                    {touched.appointedNumber && errors.appointedNumber && <p className="invalid-feedback">{errors.appointedNumber}</p>}
                </div>
                <div className="form-group">
                    <label>
                        <FormattedMessage
                            id="officer.nielsJuel_nr"
                            defaultMessage="*translation missing*"
                        />
                    </label>
                    <Field
                        type="number"
                        id="dodabNumber"
                        name="dodabNumber"
                        className={`form-control ${touched.dodabNumber && errors.dodabNumber ? 'is-invalid' : ''}`}
                    />
                    {touched.dodabNumber && errors.dodabNumber && <p className="invalid-feedback">{errors.dodabNumber}</p>}
                </div>
                <div className="form-group">
                    <label>
                        <FormattedMessage
                            id="officer.commissioned_until"
                            defaultMessage="*translation missing*"
                        />
                    </label>
                    <DatePicker
                        name="appointedUntil"
                        selected={values.appointedUntil ? moment(values.appointedUntil, "DD/MM/YYYY") : null}
                        onChange={text => moment(text).isValid() ? setFieldValue('appointedUntil', moment(text).format("DD/MM/YYYY")) : setFieldValue('appointedUntil', null)}
                        placeholderText="D/M YYYY"
                        dateFormat="D/M YYYY"
                        autoComplete="off"
                        className={`form-control ${touched.appointedUntil && errors.appointedUntil ? 'is-invalid' : ''}`}
                    />
                    {touched.appointedUntil && errors.appointedUntil && <p className="invalid-feedback d-inline">{errors.appointedUntil}</p>}
                </div>
                <div className="form-group">
                    <label>
                        <FormattedMessage
                            id="officer.cause_of_termination"
                            defaultMessage="*translation missing*"
                        />
                    </label>
                    <VirtualizedSelect options={values.terminationCauses}
                        placeholder={
                            <FormattedMessage
                                id="globals_label.select_placeholder"
                                defaultMessage="*translation missing*"
                            />
                        }
                        name="terminationCause"
                        value={terminationCauseLabel(values.terminationCause)}
                        onChange={value => setFieldValue('terminationCause', value)}
                    />
                    {touched.terminationCause && errors.terminationCause && <p className="invalid-feedback">{errors.terminationCause}</p>}
                </div>
            </div>
            <button disabled={isSubmitting} className="btn btn-primary">
                <FormattedMessage
                    id="globals_btn.save"
                    defaultMessage="*translation missing*"
                />
            </button>
            {status && status.error && <p className="text-danger p-2">
                <FormattedMessage
                    id="person_search.error"
                    defaultMessage="*translation missing*"
                />
            </p>}
        </Form>
    )