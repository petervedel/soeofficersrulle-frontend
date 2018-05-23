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
    }

    setUserSettings = (result) => {
        let userSession = result.data
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
                <div>
                    <CardTitle>
                        <FormattedMessage
                            id="globals_label.log_in"
                            defaultMessage="*translation missing*"
                        />
                    </CardTitle>
                    <br />
                    <TheForm />
                </div >
            )
        } else {
            return (
                <Redirect to={{ pathname: "/" }} />
            )
        }

    }
}

export default SignInFormComponent;