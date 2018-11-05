import React from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { Form, Field } from 'formik'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import { FormattedMessage } from 'react-intl'

const setInvalid = () => {
    if (document.getElementById("rankSelect"))
        document.getElementById("rankSelect").getElementsByClassName("Select-control")[0].classList.add("select-is-invalid")
}

const setValid = () => {
    if (document.getElementById("rankSelect"))
        document.getElementById("rankSelect").getElementsByClassName("Select-control")[0].classList.remove("select-is-invalid")
}

export const RelationForm = ({
    values,
    touched,
    errors,
    status,
    isSubmitting,
    setFieldValue,
}) => (
        <Form>
            <div className="form-group">
                <label>
                    <FormattedMessage
                        id="relation_create.person"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <Field
                    type="text"
                    name="copied"
                    disabled={true}
                    value={values.copied !== null ? values.copied.surname + ", " + values.copied.givenName + " - " + values.copied.dateOfBirth : ""}
                    className={`form-control`}
                />
            </div>
            <div className="form-group" id="typeOfRelationSelect">
                <label>
                    <FormattedMessage
                        id="relation_create.is_of_relation"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <VirtualizedSelect options={[
                    {
                        label:
                            <FormattedMessage
                                id="relation_create.parent"
                                defaultMessage="*translation missing*"
                            />,
                        typeOfRelation: "Parent"
                    },
                    {
                        label:
                            <FormattedMessage
                                id="relation_create.child"
                                defaultMessage="*translation missing*"
                            />,
                        typeOfRelation: "Child"
                    }
                ]}
                    placeholder={
                        <FormattedMessage
                            id="globals_label.select_placeholder"
                            defaultMessage="*translation missing*"
                        />
                    }
                    name="typeOfRelation"
                    value={values.typeOfRelation}
                    onChange={value => { setFieldValue('typeOfRelation', value) }}
                    className={`Select is-clearable is-searchable Select--single ${touched.typeOfRelation && errors.typeOfRelation ? setInvalid() : setValid()}`}
                />
                {touched.typeOfRelation && errors.typeOfRelation && <p className="invalid-feedback d-inline">{errors.typeOfRelation}</p>}
            </div>
            <div className="form-group">
                <label>
                    <FormattedMessage
                        id="relation_create.to_person"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <Field
                    type="text"
                    name="person"
                    disabled={true}
                    value={`${values.person.surname}, ${values.person.givenName} - ${values.person.dateOfBirth}`}
                    className={`form-control`}
                />
            </div>
            <button disabled={isSubmitting || values.copied === null} className="btn btn-primary" >
                <FormattedMessage
                    id="globals_btn.create"
                    defaultMessage="*translation missing*"
                />
            </button>
            {status && status.error && <p className="text-danger p-2">
                <FormattedMessage
                    id="globals_form_create.error"
                    defaultMessage="*translation missing*"
                />
            </p>}
        </Form>
    )