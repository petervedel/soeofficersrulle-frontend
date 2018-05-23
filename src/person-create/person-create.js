import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import moment from 'moment'
import { PersonCreateForm } from './person-create-form'
import { createPerson, fetchPerson } from '../_actions'
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
            terminationCauses: [
                {
                    label:
                        <FormattedMessage
                            id="officer.terminated"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Afsked"
                },
                {
                    label:
                        <FormattedMessage
                            id="officer.killed_in_action"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Dræbt_i_tjeneste"
                },
                {
                    label:
                        <FormattedMessage
                            id="officer.accidental_death"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Dødsulykke"
                },
                {
                    label:
                        <FormattedMessage
                            id="officer.transferred"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Overført_til_andet_værn"
                },
                {
                    label:
                        <FormattedMessage
                            id="globals.other"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Andet"
                }
            ],
            redirect: false,
            isOfficer: false,
        }
    }

    componentWillMount() {
        if (this.props.match.params.id) {
            fetchPerson(this.props.match.params.id).then(response => {
                this.setState({
                    person: response.data
                })
                if (response.data.appointedNumber) {
                    this.setState({
                        officerdata: {
                            appointedNumber: response.data.appointedNumber,
                            dodabNumber: response.data.dodabNumber,
                            appointedUntil: response.data.appointedUntil,
                            terminationCause: response.data.terminationCause
                        }
                    })
                }
            })
        }
    }

    render() {
        const checkboxIsChecked = () => {
            return document.getElementById("checkbox").checked
        }

        const cleanValues = (values) => {
            var valuesCopy = Object.assign({}, values);
            Object.keys(valuesCopy).forEach((key) => (valuesCopy[key] === null || valuesCopy[key] === '') && delete valuesCopy[key]);

            if (valuesCopy.terminationCause != null) {
                valuesCopy.terminationCause = valuesCopy.terminationCause.terminationCause
            }

            if (valuesCopy.gender != null) {
                valuesCopy.gender = valuesCopy.gender.gender
            }

            delete valuesCopy.terminationCauses


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
                terminationCause,
                isOfficer,
                terminationCauses,
            }) {
                return {
                    givenName: givenName || '',
                    surname: surname || '',
                    dateOfBirth: dateOfBirth ? moment(dateOfBirth).format("DD/MM/YYYY") : '',
                    gender: gender || { label: "Mand", gender: "Mand" },
                    dateOfDeath: dateOfDeath ? moment(dateOfDeath).format("DD/MM/YYYY") : '',
                    appointedNumber: appointedNumber || '',
                    dodabNumber: dodabNumber || '',
                    appointedUntil: appointedUntil ? moment(appointedUntil).format("DD/MM/YYYY") : '',
                    terminationCause: terminationCause || '',
                    isOfficer: isOfficer || '',
                    terminationCauses: terminationCauses || [],
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
                dodabNumber: Yup.number().max(99999999999).test('test',
                    <FormattedMessage
                        id="globals_form_validation.tordenskjold_nr"
                        defaultMessage="*translation missing*"
                    />
                    , function () {
                        if (document.getElementById('appointedNumber').value.length === 0 && document.getElementById('dodabNumber').value.length === 0 && checkboxIsChecked()) {
                            return false
                        } else {
                            return true
                        }
                    }),
                appointedNumber: Yup.number().max(99999999999).test('test',
                    <FormattedMessage
                        id="globals_form_validation.tordenskjold_nr"
                        defaultMessage="*translation missing*"
                    />
                    , function () {
                        if (document.getElementById('appointedNumber').value.length === 0 && document.getElementById('dodabNumber').value.length === 0 && checkboxIsChecked()) {
                            return false
                        } else {
                            return true
                        }
                    }),
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
                createPerson(cleanValues(values)).then(
                    person => {
                        if (this.state.isOfficer)
                            this.setState({ officer: { id: person.data.id } })
                        if (!this.state.isOfficer)
                            this.setState({ person: { id: person.data.id } })
                        this.setState({ redirect: true })
                        setSubmitting(false)
                        setStatus({ success: true })
                    },
                    errors => {
                        setSubmitting(false)
                        setStatus({ error: true })
                    }
                );
            }, enableReinitialize: true
        })(PersonCreateForm);
        if (this.state.redirect && this.state.isOfficer === true) {
            return <Redirect to={{ pathname: "/officer/" + this.state.officer.id + "/promotion" }} />
        } else if (this.state.redirect) {
            return <Redirect to={{ pathname: "/person/" + this.state.person.id }} />
        }
        return (
            <div>
                <CardTitle>
                    <FormattedMessage
                        id="person_create.title"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <br />
                <TheForm
                    givenName={this.state.person.givenName}
                    surname={this.state.person.surname}
                    dateOfBirth={this.state.person.dateOfBirth ? moment(this.state.person.dateOfBirth, "dd/MM/yyyy") : null}
                    gender={this.state.person.gender}
                    appointedNumber={this.state.officerdata.appointedNumber}
                    dodabNumber={this.state.officerdata.dodabNumber}
                    dateOfDeath={this.state.person.dateOfDeath ? moment(this.state.person.dateOfDeath, "dd/MM/yyyy") : null}
                    appointedUntil={this.state.officerdata.appointedUntil}
                    terminationCause={this.state.officerdata.terminationCause}
                    terminationCauses={this.state.terminationCauses}
                />
            </div >
        )
    }
}

export default PersonCreate;