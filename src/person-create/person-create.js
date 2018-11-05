import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import moment from 'moment'
import { PersonCreateForm } from './person-create-form'
import { createPerson } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import Yup from 'yup'
import { Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'

class PersonCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            person: '',
            officerdata: '',
            redirect: false,
            isOfficer: false,
        }

        this.props.showBreadCrumbs(false);
    }

    render() {
        const checkboxIsChecked = () => {
            return document.getElementById("checkbox").checked
        }

        const cleanValues = (values) => {
            var valuesCopy = Object.assign({}, values);
            Object.keys(valuesCopy).forEach((key) => (valuesCopy[key] === null || valuesCopy[key] === '') && delete valuesCopy[key]);

            if (valuesCopy.gender != null) {
                valuesCopy.gender = valuesCopy.gender.gender
            }


            return valuesCopy
        }

        const TheForm = withFormik({
            mapPropsToValues({
                givenName,
                surname,
                dateOfBirth,
                gender,
                dateOfDeath,
                appointedNumber,
                dodabNumber,
                appointedUntil,
                isOfficer,
            }) {
                return {
                    givenName: givenName || '',
                    surname: surname || '',
                    dateOfBirth: dateOfBirth ? moment(dateOfBirth).format("DD/MM/YYYY") : '',
                    gender: gender || {
                        label: <FormattedMessage
                            id="person.gender_male"
                            defaultMessage="*translation missing*"
                        />, gender: "Male"
                    },
                    dateOfDeath: dateOfDeath ? moment(dateOfDeath).format("DD/MM/YYYY") : '',
                    appointedNumber: appointedNumber || '',
                    dodabNumber: dodabNumber || '',
                    appointedUntil: appointedUntil ? moment(appointedUntil).format("DD/MM/YYYY") : '',
                    isOfficer: isOfficer || '',
                }
            },
            validationSchema: Yup.object().shape({
                givenName: Yup.string().max(40).required(
                    <FormattedMessage
                        id="globals_form_validation.given_name"
                        defaultMessage="*translation missing*"
                    />
                ),
                surname: Yup.string().max(40).required(
                    <FormattedMessage
                        id="globals_form_validation.surname"
                        defaultMessage="*translation missing*"
                    />
                ),
                dateOfBirth: Yup.string().nullable().required(
                    <FormattedMessage
                        id="globals_form_validation.born"
                        defaultMessage="*translation missing*"
                    />
                ),
                gender: Yup.string().nullable().min(2).required(
                    <FormattedMessage
                        id="globals_form_validation.gender"
                        defaultMessage="*translation missing*"
                    />
                ),
                dodabNumber: Yup.number().max(99999999999),
                appointedNumber: Yup.number().max(99999999999),
                appointedUntil: Yup.string()
            }),
            handleSubmit: (
                values,
                {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }
            ) => {
                this.setState({ isOfficer: checkboxIsChecked() })
                createPerson(cleanValues(values)).then((createdObject) => {
                    console.log(createdObject)
                    if (this.state.isOfficer)
                        this.setState({
                            officer: {
                                id: createdObject.data.id
                            },
                            person: {
                                id: createdObject.data.person.id
                            }
                        })
                    if (!this.state.isOfficer)
                        this.setState({
                            person: {
                                id: createdObject.data.id
                            }
                        })
                    this.setState({ redirect: true })
                    setSubmitting(false)
                    setStatus({ success: true })
                }).catch(() => {
                    setSubmitting(false)
                    setStatus({ error: true })
                })
            }, enableReinitialize: true
        })(PersonCreateForm);
        if (this.state.redirect && this.state.isOfficer === true) {
            return <Redirect to={{ pathname: "/search/officer/" + this.state.officer.id + "/" + this.state.person.id + "/update/promotion" }} />
        } else if (this.state.redirect) {
            return <Redirect to={{ pathname: "/search/person/" + this.state.person.id }} />
        }
        return (
            <div className="col-md-12 col-lg-8 col-lx-6 mb-4">
                <CardTitle>
                    <FormattedMessage
                        id="person_create.title"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <TheForm
                    givenName={this.state.person.givenName}
                    surname={this.state.person.surname}
                    dateOfBirth={this.state.person.dateOfBirth ? moment(this.state.person.dateOfBirth, "dd/MM/yyyy") : null}
                    gender={this.state.person.gender}
                    appointedNumber={this.state.officerdata.appointedNumber}
                    dodabNumber={this.state.officerdata.dodabNumber}
                    dateOfDeath={this.state.person.dateOfDeath ? moment(this.state.person.dateOfDeath, "dd/MM/yyyy") : null}
                    appointedUntil={this.state.officerdata.appointedUntil}
                />
            </div >
        )
    }
}

export default PersonCreate;