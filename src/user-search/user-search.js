import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import { fetchUserSearch } from '../_actions'
import { withFormik } from 'formik'
import ReactTable from "react-table";
import { UserSearchForm } from "./search-form"
import "react-table/react-table.css";
import 'react-datepicker/dist/react-datepicker.css'
import { FormattedMessage } from 'react-intl'


class UserSearchFormComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            columns: [
                {
                    Header:
                        <FormattedMessage
                            id="user.username"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "username"
                },
                {
                    Header:
                        <FormattedMessage
                            id="user.email"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "email"
                },
                {
                    Header:
                        <FormattedMessage
                            id="user.valid_from"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "from"
                },
                {
                    Header:
                        <FormattedMessage
                            id="user.valid_to"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "until"
                }
            ],
            username: '',
            email: '',
        };
    }

    render() {
        const cleanValues = (values) => {
            var userValues = Object.assign({}, values);
            if (userValues.username.length === 0) {
                delete userValues.username
            }
            if (userValues.email.length === 0) {
                delete userValues.email
            }
            return userValues
        }

        const TheForm = withFormik({
            mapPropsToValues({
                username,
                email,
            }) {
                return {
                    username: username || '',
                    email: email || '',
                }
            },
            handleSubmit: (
                values,
                {
                    resetForm,
                    setErrors,
                    setStatus,
                    setSubmitting
                }
            ) => {
                fetchUserSearch(cleanValues(values)).then(
                    response => {
                        setSubmitting(false)
                        this.setState({ data: response.data })
                        this.setState({ username: values.username })
                        this.setState({ email: values.email })
                    },
                    errors => {
                        setSubmitting(false)
                    }
                );
            },
            enableReinitialization: true,
        })(UserSearchForm);

        return (
            <div>
                <CardTitle>
                    <FormattedMessage
                        id="admin.search_user"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <br />
                <TheForm username={this.state.username}
                    email={this.state.email} />
                <br />
                <ReactTable minRows="0"
                    data={this.state.data}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                this.props.history.push(`/user/${rowInfo.original.id}`)
                                if (handleOriginal) {
                                    handleOriginal()
                                }
                            }
                        }
                    }}
                    columns={this.state.columns}
                    defaultPageSize={50}
                    className="-striped -highlight"
                />
            </div>
        )
    }
}

export default UserSearchFormComponent;