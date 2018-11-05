import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import { Redirect } from 'react-router-dom'
import { LoginForm } from './login-form'
import { verifyCredentials } from '../_actions'
import { withFormik } from 'formik'
import Yup from 'yup'
import userState from '../app/user-state'
import { FormattedMessage } from 'react-intl'

class SignInFormComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }

        this.props.showBreadCrumbs(false);
        this.setUserSettings(null)
    }

    setUserSettings = (result) => {
        let userSession
        if (result !== null) {
            userSession = result.data
            localStorage.setItem(
                'userSession',
                JSON.stringify({
                    userSession
                })
            );
            this.setState({
                userState: userState()
            })
            this.props.callbackFromParent();
        } else {
            localStorage.removeItem('userSession')
            this.setState({
                userState: userState()
            });
            this.props.callbackFromParent();
        }


    }

    render() {
        const TheForm = withFormik({
            mapPropsToValues({
                username,
                password,
            }) {
                return {
                    username: '',
                    password: '',
                }
            },
            validationSchema: Yup.object().shape({
                username: Yup.string().required('Username is required'),
                password: Yup.string().required('Password is required'),
            }),
            handleSubmit: (
                values,
                {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting,
                }
            ) => {
                verifyCredentials(values).then(
                    result => {
                        setSubmitting(false);
                        resetForm();
                        setStatus({
                            success: true
                        });
                        setErrors("")
                        this.setUserSettings(result)
                    },
                    errors => {
                        setSubmitting(false);
                        setStatus({ error: true });
                    }
                );
            }
        })(LoginForm)

        if (!this.state.userState) {
            return (
                <div className="col-md-6 col-lg-4 col-lx-3 mb-4">
                    <CardTitle>
                        <FormattedMessage
                            id="globals_label.log_in"
                            defaultMessage="*translation missing*"
                        />
                    </CardTitle>
                    <TheForm />
                </div >
            )
        } else {
            return (
                <Redirect to={{ pathname: "/search" }} />
            )
        }

    }
}

export default SignInFormComponent;