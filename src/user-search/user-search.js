import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import { fetchUserSearch } from '../_actions'
import { withFormik } from 'formik'
import ReactTable from "react-table";
import { UserSearchForm } from "./search-form"
import "react-table/react-table.css";
import 'react-datepicker/dist/react-datepicker.css'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'


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

        this.props.showBreadCrumbs(false);
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
        const intl = this.props.intl;
        const rows = intl.formatMessage({
            id: "globals_table.rows",
            defaultMessage: "*translation missing*"
        });
        return (
            <div>
                <div className="col-md-12 col-lg-8 col-lx-6 mb-4">
                <CardTitle>
                    <FormattedMessage
                        id="user_detail.user_search"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <TheForm username={this.state.username}
                    email={this.state.email} />
                </div>
                <ReactTable minRows="0"
                    data={this.state.data}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                this.props.history.push(`/system/user_search/user/${rowInfo.original.id}`)
                                if (handleOriginal) {
                                    handleOriginal()
                                }
                            }
                        }
                    }}
                    columns={this.state.columns}
                    defaultPageSize={50}
                    className=""
                    previousText={
                        <FormattedMessage
                            id="globals_table.previous"
                            defaultMessage="*translation missing*"
                        />
                    }
                    nextText={
                        <FormattedMessage
                            id="globals_table.next"
                            defaultMessage="*translation missing*"
                        />
                    }
                    loadingText={
                        <FormattedMessage
                            id="globals.loading"
                            defaultMessage="*translation missing*"
                        />
                    }
                    noDataText={
                        <FormattedMessage
                            id="globals_table.no_rows"
                            defaultMessage="*translation missing*"
                        />
                    }
                    pageText={
                        <FormattedMessage
                            id="globals_table.page"
                            defaultMessage="*translation missing*"
                        />
                    }
                    ofText={
                        <FormattedMessage
                            id="globals_table.of"
                            defaultMessage="*translation missing*"
                        />
                    }
                    rowsText={rows}
                />
            </div>
        )
    }
}

UserSearchFormComponent.propTypes = {
    intl: intlShape.isRequired
};
UserSearchFormComponent = injectIntl(UserSearchFormComponent);

export default UserSearchFormComponent
