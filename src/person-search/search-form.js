import React from 'react'
import { Form, Field } from 'formik'
import "react-table/react-table.css"
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import VirtualizedSelect from 'react-virtualized-select'
import { FormattedMessage } from 'react-intl'

export const PersonSearchForm = ({
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
                        id="person.given_name"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <Field
                    type="text"
                    dirty="false"
                    name="givenName"
                    className={`form-control ${touched.givenName && errors.givenName ? 'is-invalid' : ''}`}
                />
            </div>
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
            </div>
            <div className="form-group">
                <div className="row">
                    <div className="col">
                        <label>
                            <FormattedMessage
                                id="person_search.born_in_year_from"
                                defaultMessage="*translation missing*"
                            />
                        </label>
                        <Field
                            type="number"
                            id="yearOfBirthFrom"
                            name="yearOfBirthFrom"
                            className={`form-control ${touched.yearOfBirthFrom && errors.yearOfBirthFrom ? 'is-invalid' : ''}`}
                        />
                        {touched.yearOfBirthFrom && errors.yearOfBirthFrom && <p className="invalid-feedback">{errors.yearOfBirthFrom}</p>}
                    </div>
                    <div className="col">
                        <label>
                            <FormattedMessage
                                id="person_search.born_in_year_to"
                                defaultMessage="*translation missing*"
                            />
                        </label>
                        <Field
                            type="number"
                            id="yearOfBirthTo"
                            name="yearOfBirthTo"
                            className={`form-control ${touched.yearOfBirthTo && errors.yearOfBirthTo ? 'is-invalid' : ''}`}
                        />
                        {touched.yearOfBirthTo && errors.yearOfBirthTo && <p className="invalid-feedback">{errors.yearOfBirthTo}</p>}
                    </div>
                </div>
            </div>
            <div>
                <label>
                    <FormattedMessage
                        id="globals_form.is_officer"
                        defaultMessage="*translation missing*"
                    />
                </label><br />
                <input
                    id="checkbox"
                    name="isOfficer"
                    type="checkbox"
                    defaultChecked={values.isOfficer}
                    onClick={text => setFieldValue("isOfficer", !values.isOfficer)}
                    className={`form-control ${touched.isOfficer && errors.isOfficer ? 'is-invalid' : ''}`}
                />
            </div>
            <br />
            <div id="officerDetails" className={values.isOfficer ? "d-inline" : "d-none"}>
                <div className="form-group">
                    <div className="row">
                        <div className="col">
                            <label>
                                <FormattedMessage
                                    id="person_search.commissioned_year_from"
                                    defaultMessage="*translation missing*"
                                />
                            </label>
                            <Field
                                type="number"
                                id="appointedYearFrom"
                                name="appointedYearFrom"
                                className={`form-control ${touched.appointedYearFrom && errors.appointedYearFrom ? 'is-invalid' : ''}`}
                            />
                            {touched.appointedYearFrom && errors.appointedYearFrom && <p className="invalid-feedback">{errors.appointedYearFrom}</p>}
                        </div>
                        <div className="col">
                            <label>
                                <FormattedMessage
                                    id="person_search.commissioned_year_to"
                                    defaultMessage="*translation missing*"
                                />
                            </label>
                            <Field
                                type="number"
                                id="appointedYearTo"
                                name="appointedYearTo"
                                className={`form-control ${touched.appointedYearTo && errors.appointedYearTo ? 'is-invalid' : ''}`}
                            />
                            {touched.appointedYearTo && errors.appointedYearTo && <p className="invalid-feedback">{errors.appointedYearTo}</p>}
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label>
                        <FormattedMessage
                            id="person_search.last_rank"
                            defaultMessage="*translation missing*"
                        />
                    </label>
                    <VirtualizedSelect options={values.ranks}
                        name="lastRank"
                        value={values.lastRank}
                        onChange={value => setFieldValue('lastRank', value)}
                    />
                </div>
            </div>
            <button disabled={isSubmitting} className="btn btn-primary">
                <FormattedMessage
                    id="globals_label.search"
                    defaultMessage="*translation missing*"
                />
            </button>
            {status && status.success && <p className="text-success p-2">
                <FormattedMessage
                    id="person_search.success"
                    defaultMessage="*translation missing*"
                />
            </p>}
            {errors && 0 < errors.length && <p className="text-danger p-2">
                <FormattedMessage
                    id="person_search.error"
                    defaultMessage="*translation missing*"
                />
            </p>}
        </Form>
    )