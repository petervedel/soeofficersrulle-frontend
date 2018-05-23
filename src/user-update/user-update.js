import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import moment from 'moment'
import { UserUpdateForm } from './user-update-form'
import { fetchUser, updateUser, deleteUser } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import Yup from 'yup'
import { withRouter } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import userState from '../app/user-state'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class UserUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userState: '',
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
            didUpdate: false,
            gotError: false,
            errorMsg: '',
        }
    }


    componentWillReceiveProps(nextProps) {
        this.setState({ userState: nextProps.userState });
    }

    shouldComponentUpdate(nextProps) {
        return this.state.userState !== nextProps.userState;
    }


    componentWillMount() {
        if (this.props.match.params.id) {
            fetchUser(this.props.match.params.id).then(response => {
                this.setState({
                    user: response.data
                })
                this.setState({
                    userState: userState()
                })
            })
        }
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
            message: `${are_you_sure} ${this.state.user.username}?`,
            buttons: [
                {
                    label: yes,
                    onClick: () =>
                        deleteUser(this.props.match.params.id).then(response => {
                            this.props.history.push('/')
                        }).catch(response => {
                            alert(alert_error)
                        })
                },
                {
                    label: no,
                    onClick: () => { }
                }
            ]
        }))
    };

    render() {
        const cleanValues = (values) => {
            var valuesCopy = Object.assign({}, values);
            Object.keys(valuesCopy).forEach((key) => (valuesCopy[key] === null || valuesCopy[key] === '') && delete valuesCopy[key]);

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
                    from: from ? moment(from,"DD/MM/YYYY").format("DD/MM/YYYY") : '',
                    until: until ? moment(until,"DD/MM/YYYY").format("DD/MM/YYYY") : '',
                    role: role || '',
                    password: password || '',
                    roles: roles || [],
                }
            },
            validationSchema: Yup.object().shape({
                username: Yup.string(),
                email: Yup.string(),
                from: Yup.string(),
                until: Yup.string(),
                role: Yup.string(),
                password: Yup.string(),
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
                updateUser(cleanValues(values), this.props.match.params.id).then(
                    user => {
                        setSubmitting(false);
                        resetForm();

                        fetchUser(this.props.match.params.id).then(response => {
                            this.setState({
                                user: response.data,
                                didUpdate: true
                            })
                        })
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
                );
            }, enableReinitialize: true
        })(UserUpdateForm);
        return (
            <div>
                <div className="d-flex">
                    <div className="mr-auto">
                        <CardTitle>
                            <FormattedMessage
                                id="user_update.update"
                                defaultMessage="*translation missing*"
                            />
                        </CardTitle>
                    </div>
                    <div>
                        {this.state.userState && this.state.userState.isAdmin &&
                            <button onClick={this.confirmDeletion} className="btn btn-sm bg-secondary text-white">
                                <FormattedMessage
                                    id="globals_btn.delete"
                                    defaultMessage="*translation missing*"
                                />
                            </button>}
                    </div>
                </div>
                <br />
                <TheForm
                    username={this.state.user.username}
                    email={this.state.user.email}
                    from={this.state.user.from}
                    until={this.state.user.until}
                    role={this.state.user.role}
                    roles={this.state.roles}
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

UserUpdate.propTypes = {
    intl: intlShape.isRequired
}
UserUpdate = injectIntl(UserUpdate)

export default UserUpdate