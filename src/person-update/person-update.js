import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import moment from 'moment'
import { PersonUpdateForm } from './person-update-form'
import { fetchPerson, updateOfficer, updatePerson, deletePerson, fetchOfficer } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import Yup from 'yup'
import { Redirect, Link } from 'react-router-dom';
import userState from '../app/user-state'
import { withRouter } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class PersonUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            officerAtInit: false,
            title: '',
            userState: '',
            person: null,
            officerdata: '',
            terminationCauses: [
                {
                    label:
                        <FormattedMessage
                            id="officer.terminated"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Terminated"
                },
                {
                    label:
                        <FormattedMessage
                            id="officer.killed_in_action"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Killed_in_action"
                },
                {
                    label:
                        <FormattedMessage
                            id="officer.accidental_death"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Accidental_death"
                },
                {
                    label:
                        <FormattedMessage
                            id="officer.transferred"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Transferred"
                },
                {
                    label:
                        <FormattedMessage
                            id="globals.other"
                            defaultMessage="*translation missing*"
                        />,
                    terminationCause: "Other"
                }
            ],
            genders: [
                {
                    label:
                        <FormattedMessage
                            id="person.gender_male"
                            defaultMessage="*translation missing*"
                        />,
                    gender: "Male"
                },
                {
                    label:
                        <FormattedMessage
                            id="person.gender_female"
                            defaultMessage="*translation missing*"
                        />,
                    gender: "Female"
                },
                {
                    label:
                        <FormattedMessage
                            id="person.gender_unknown"
                            defaultMessage="*translation missing*"
                        />,
                    gender: "Unknown"
                }
            ],
            didUpdate: false,
            redirect: false,
            isOfficer: false,
            gotError: false,
            errorMsg: '',
        }

        this.props.showBreadCrumbs(true);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ userState: nextProps.userState });
    }

    confirmDeletion = () => {
        const intl = this.props.intl;
        const confirm_delete = intl.formatMessage({
            id: "globals_confirm.confirm_delete",
            defaultMessage: "*translation missing*"
        });
        const are_you_sure = intl.formatMessage({
            id: "globals_confirm.are_you_sure",
            defaultMessage: "*translation missing*"
        });
        const yes = intl.formatMessage({
            id: "globals_confirm.yes",
            defaultMessage: "*translation missing*"
        });
        const no = intl.formatMessage({
            id: "globals_confirm.no",
            defaultMessage: "*translation missing*"
        });
        const alert_error = intl.formatMessage({
            id: "globals_confirm.error",
            defaultMessage: "*translation missing*"
        });
        confirmAlert(withRouter({
            title: confirm_delete,
            message: `${are_you_sure} ${this.state.person.givenName}?`,
            buttons: [
                {
                    label: yes,
                    onClick: () =>
                        deletePerson(this.props.match.params.person_id).then(response => {
                            this.props.history.push('/search')
                        }).catch(response => {
                            alert(alert_error)
                        })
                },
                {
                    label: no,
                    onClick: () => {
                    }
                }
            ]
        }))
    }

    componentDidMount() {
        fetchPerson(this.props.match.params.person_id).then(response => {
            this.setState({
                person: response.data,
                userState: userState(),
            })
        })
        if (this.props.match.params.officer_id) {
            fetchOfficer(this.props.match.params.officer_id, true).then(response => {
                this.setState({
                    isOfficer: true,
                    isOfficerAtInit: true,
                    officerdata: {
                        appointedNumber: response.data.appointedNumber,
                        dodabNumber: response.data.dodabNumber,
                        appointedUntil: response.data.appointedUntil,
                        terminationCause: response.data.terminationCause,
                        id: response.data.id
                    }
                })
            })
        }
    }

    render() {
        const checkboxIsChecked = () => {
            return document.getElementById("checkbox").checked
        }

        const cleanValues = (values) => {
            var valuesCopy = Object.assign({}, values);
            Object.keys(valuesCopy).forEach(function (element) {
                if (valuesCopy[element] === '') {
                    valuesCopy[element] = null
                }
            });

            if (valuesCopy.terminationCause) {
                valuesCopy.terminationCause = valuesCopy.terminationCause.terminationCause
            }
            if (valuesCopy.gender.gender) {
                valuesCopy.gender = valuesCopy.gender.gender
            }

            delete valuesCopy.terminationCauses
            delete valuesCopy.genders
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
                genders,
                isPerson
            }) {
                return {
                    givenName: givenName || '',
                    surname: surname || '',
                    dateOfBirth: dateOfBirth ? moment(dateOfBirth, "DD/MM/YYYY").format("DD/MM/YYYY") : '',
                    gender: gender || '',
                    dateOfDeath: dateOfDeath ? moment(dateOfDeath, "DD/MM/YYYY").format("DD/MM/YYYY") : '',
                    appointedNumber: appointedNumber || '',
                    dodabNumber: dodabNumber || '',
                    appointedUntil: appointedUntil ? moment(appointedUntil, "DD/MM/YYYY").format("DD/MM/YYYY") : '',
                    terminationCause: terminationCause || '',
                    isOfficer: isOfficer || '',
                    terminationCauses: terminationCauses || [],
                    genders: genders || [],
                    isPerson: isPerson
                }
            },
            validationSchema: Yup.object().shape({
                givenName: Yup.string(),
                surname: Yup.string(),
                dateOfBirth: Yup.string().nullable(),
                gender: Yup.string().nullable().min(2),
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
                delete values.isPerson
                this.setState({ isOfficer: checkboxIsChecked() })
                if (this.state.isOfficerAtInit) {
                    if (this.state.isOfficer)
                        values.personId = this.state.person.id
                    updateOfficer(cleanValues(values), this.props.match.params.officer_id).then(
                        officer => {
                            fetchOfficer(this.props.match.params.officer_id, true).then(response => {
                                this.setState({
                                    person: response.data.person,
                                    officerdata: {
                                        appointedNumber: response.data.appointedNumber,
                                        dodabNumber: response.data.dodabNumber,
                                        appointedUntil: response.data.appointedUntil,
                                        terminationCause: response.data.terminationCause
                                    }
                                })
                            })
                            setSubmitting(false);
                            resetForm();
                            setStatus({ success: true });
                            this.setState({
                                redirect: true
                            })
                        },
                        errors => {
                            setSubmitting(false);
                            setStatus({ error: true })
                            this.setState({
                                didUpdate: false,
                                gotError: true,
                                errorMsg: errors.response.statusText
                            })
                        }
                    )
                } else {
                    if (this.state.isOfficer)
                        values.personId = this.props.match.params.person_id
                    updatePerson(cleanValues(values), this.props.match.params.person_id).then(
                        person => {
                            if (this.state.isOfficer) {
                                fetchOfficer(person.data.id, true).then(response => {
                                    this.setState({
                                        person: response.data.person,
                                        officerdata: {
                                            id: person.data.id,
                                            appointedNumber: response.data.appointedNumber,
                                            dodabNumber: response.data.dodabNumber,
                                            appointedUntil: response.data.appointedUntil,
                                            terminationCause: response.data.terminationCause
                                        },
                                        redirect: true,
                                        isOfficerAtInit: true,
                                        isOfficer: true,
                                    })
                                })
                            } else {
                                fetchPerson(this.props.match.params.person_id).then(response => {
                                    this.setState({
                                        person: response.data,
                                        redirect: true,
                                        isOfficer: false
                                    })
                                })
                            }
                            setSubmitting(false);
                            resetForm();
                            setStatus({ success: true });
                        },
                        errors => {
                            setSubmitting(false);
                            setStatus({ error: true })
                            this.setState({
                                didUpdate: false,
                                gotError: true,
                                errorMsg: errors.response.statusText
                            })
                        }
                    )
                }
            }, enableReinitialize: true
        })(PersonUpdateForm);
        if (this.state.redirect && this.state.isOfficer === true) {
            return <Redirect to={{ pathname: "/search/officer/" + this.state.officerdata.id + "/" + this.state.person.id }} />
        }
        if (this.state.redirect && this.state.isOfficer === false) {
            return <Redirect to={{ pathname: "/search/person/" + this.state.person.id }} />
        }
        if (this.state.person === null) {
            return <div>
                <div className="font-weight-bold">
                    <FormattedMessage
                        id="globals.loading"
                        defaultMessage="*translation missing*"
                    />
                </div>
            </div>
        } else {
            return (
                <div className="col-md-12 col-lg-8 col-lx-6 mb-4">
                    <div className="d-flex mb-4">
                        <div className="mr-auto">
                            <CardTitle>{this.state.person &&
                                this.state.isOfficer ? <FormattedMessage
                                    id="person_update.update_officer"
                                    defaultMessage="*translation missing*"
                                /> :
                                <FormattedMessage
                                    id="person_update.update_person"
                                    defaultMessage="*translation missing*"
                                />
                            }</CardTitle>
                            {this.state.isOfficer &&
                                <Link to={`/search/officer/${this.state.officerdata.id}/${this.state.person.id}/update/promotion`} className="btn btn-sm btn-primary mr-2">
                                    <FormattedMessage
                                        id="globals_btn.promote"
                                        defaultMessage="*translation missing*"
                                    />
                                </Link>}
                            {this.state.isOfficer &&
                                <Link to={`/search/officer/${this.state.officerdata.id}/${this.state.person.id}/update/relations`} className="btn btn-sm btn-primary mr-2">
                                    <FormattedMessage
                                        id="globals_btn.relations"
                                        defaultMessage="*translation missing*"
                                    />
                                </Link>}
                            {this.state.person !== null && !this.state.isOfficer &&
                                <Link to={`/search/person/${this.state.person.id}/update/relations`} className="btn btn-sm btn-primary mr-2">
                                    <FormattedMessage
                                        id="globals_btn.relations"
                                        defaultMessage="*translation missing*"
                                    />
                                </Link>}
                            {this.state.userState !== '' && this.state.userState.isAdmin && <button onClick={this.confirmDeletion} className="btn btn-sm btn-secondary mr-2">
                                <FormattedMessage
                                    id="globals_btn.delete"
                                    defaultMessage="*translation missing*"
                                />
                            </button>}
                        </div>
                    </div>
                    <TheForm
                        givenName={this.state.person.givenName}
                        surname={this.state.person.surname}
                        dateOfBirth={this.state.person.dateOfBirth}
                        gender={this.state.person.gender}
                        appointedNumber={this.state.officerdata.appointedNumber}
                        dodabNumber={this.state.officerdata.dodabNumber}
                        dateOfDeath={this.state.person.dateOfDeath}
                        appointedUntil={this.state.officerdata.appointedUntil}
                        terminationCause={this.state.officerdata.terminationCause}
                        terminationCauses={this.state.terminationCauses}
                        genders={this.state.genders}
                        isOfficer={this.state.isOfficer}
                        btnText={this.state.btnText}
                        isPerson={!this.props.match.params.officer_id ? true : false}
                    />
                    {this.state.gotError && <p className="text-danger p-2">
                        <FormattedMessage
                            id="globals_form_update.error"
                            defaultMessage="*translation missing*"
                        />
                    </p>}
                    {this.state.didUpdate && <p className="text-success p-2">
                        <FormattedMessage
                            id="globals_form_update.success"
                            defaultMessage="*translation missing*"
                        />
                    </p>}
                </div >
            )
        }
    }
}

PersonUpdate.propTypes = {
    intl: intlShape.isRequired
}
PersonUpdate = injectIntl(PersonUpdate)

export default PersonUpdate