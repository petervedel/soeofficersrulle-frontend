import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import moment from 'moment'
import { UserCreateForm } from './user-create-form'
import { createUser } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import Yup from 'yup'
import { Redirect } from 'react-router-dom';
import { FormattedMessage } from 'react-intl'

class UserCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            user: '',
            roles: [
                {
                    label:
                        <FormattedMessage
                            id="globals_label.administrator"
                            defaultMessage="*translation missing*"
                        />,
                    role: "administrator"
                },
                {
                    label:
                        <FormattedMessage
                            id="globals_label.contributor"
                            defaultMessage="*translation missing*"
                        />,
                    role: "contributor"
                },
                {
                    label:
                        <FormattedMessage
                            id="globals_label.priviledged_reader"
                            defaultMessage="*translation missing*"
                        />,
                    role: "privileged_read"
                }
            ],
            redirect: false
        }

        this.props.showBreadCrumbs(false);
    }

    render() {
        const cleanValues = (values) => {
            var valuesCopy = Object.assign({}, values)
            Object.keys(valuesCopy).forEach((key) => (valuesCopy[key] === null || valuesCopy[key] === '') && delete valuesCopy[key])
            if (valuesCopy.role && valuesCopy.role.role) {
                valuesCopy.role = valuesCopy.role.role
            }
            delete valuesCopy.btnText
            delete valuesCopy.roles
            return valuesCopy
        }

        const TheForm = withFormik({
            mapPropsToValues({
                username,
                email,
                from,
                until,
                role,
                password,
                roles,
            }) {
                return {
                    username: username || '',
                    email: email || '',
                    from: from ? moment(from).format("DD/MM/YYYY") : '',
                    until: until ? moment(until).format("DD/MM/YYYY") : '',
                    role: role || '',
                    password: password || '',
                    roles: roles || [],
                }
            },
            validationSchema: Yup.object().shape({
                username: Yup.string().required(
                    <FormattedMessage
                        id="globals_form_validation.username"
                        defaultMessage="*translation missing*"
                    />
                ),
                email: Yup.string().email(
                    <FormattedMessage
                        id="globals_form_validation.email_format"
                        defaultMessage="*translation missing*"
                    />
                ).required(
                    <FormattedMessage
                        id="globals_form_validation.email"
                        defaultMessage="*translation missing*"
                    />
                ),
                from: Yup.string().required(
                    <FormattedMessage
                        id="globals_form_validation.valid_from_date"
                        defaultMessage="*translation missing*"
                    />
                ),
                until: Yup.string().required(
                    <FormattedMessage
                        id="globals_form_validation.valid_to_date"
                        defaultMessage="*translation missing*"
                    />
                ),
                role: Yup.string().required(
                    <FormattedMessage
                        id="globals_form_validation.role"
                        defaultMessage="*translation missing*"
                    />
                ),
                password: Yup.string().required(
                    <FormattedMessage
                        id="globals_form_validation.password"
                        defaultMessage="*translation missing*"
                    />
                ),
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
                createUser(cleanValues(values)).then(
                    user => {
                        setSubmitting(false)
                        resetForm()
                        setStatus({
                            success: true
                        })
                        this.setState({
                            redirect: true,
                            user: user.data
                        })
                    },
                    errors => {
                        setSubmitting(false)
                        setStatus({ error: true })
                    }
                )
            }, enableReinitialize: true
        })(UserCreateForm)
        if (this.state.redirect) {
            return <Redirect to={{ pathname: "/system/user_search/user/" + this.state.user.id }} />
        }
        return (
            <div className="col-md-12 col-lg-8 col-lx-6 mb-4">
                <CardTitle>
                    <FormattedMessage
                        id="user_create.create"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <TheForm
                    username={this.state.user.username}
                    email={this.state.user.email}
                    from={this.state.user.from}
                    until={this.state.user.until}
                    role={this.state.user.role}
                    roles={this.state.roles}
                />
            </div >
        )
    }
}

export default UserCreate