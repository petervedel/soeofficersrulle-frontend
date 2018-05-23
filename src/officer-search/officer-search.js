import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import 'react-datepicker/dist/react-datepicker.css'
import { fetchActiveOfficers } from '../_actions'
import { withFormik } from 'formik'
import ReactTable from "react-table";
import "react-table/react-table.css";
import { OfficerSearchForm } from "./search-form"
import Yup from 'yup'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class OfficerSearchFormComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            columns: [
                {
                    Header:
                        <FormattedMessage
                            id="person.given_name"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "givenName"
                },
                {
                    Header:
                        <FormattedMessage
                            id="person.surname"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "surname"
                },
                {
                    Header:
                        <FormattedMessage
                            id="officer.commissioned"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "appointedDate"
                },
                {
                    Header:
                        <FormattedMessage
                            id="person.born"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "dateOfBirth"
                },
                {
                    Header:
                        <FormattedMessage
                            id="officer.rank"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "rankName"
                },
            ],
            givenName: '',
            surname: '',
            dateOfBirth: '',
            rankName: '',
            appointedDate: '',
        };
    }

    render() {
        const cleanValues = (values) => {
            var valuesCopy = Object.assign({}, values);
            Object.keys(valuesCopy).forEach((key) => (valuesCopy[key] === null || valuesCopy[key] === '') && delete valuesCopy[key]);

            return valuesCopy
        }

        const TheForm = withFormik({
            mapPropsToValues({
                date,
            }) {
                return {
                    date: date || '',
                }
            },
            validationSchema: Yup.object().shape({
                date: Yup.string().required(
                    <FormattedMessage
                        id="officer_search_form_validation.value"
                        defaultMessage="*translation missing*"
                    />
                )
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
                fetchActiveOfficers(cleanValues(values)).then(
                    response => {
                        setSubmitting(false)
                        this.setState({ date: values.date })
                        this.setState({ data: response.data })
                    },
                    errors => {
                        setSubmitting(false)
                    }
                );
            },
            enableReinitialization: true,
        })(OfficerSearchForm);

        const intl = this.props.intl;
        const rows = intl.formatMessage({
            id: "globals_table.rows",
            defaultMessage: "*translation missing*"
        });
        return (
            <div>
                <CardTitle>
                    <FormattedMessage
                        id="globals_label.search"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <br />
                <TheForm date={this.state.date} />
                <br />
                <ReactTable minRows="0"
                    data={this.state.data}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                this.props.history.push(`/officer/${rowInfo.original.id}`)
                                if (handleOriginal) {
                                    handleOriginal()
                                }
                            }
                        }
                    }}
                    columns={this.state.columns}
                    defaultPageSize={50}
                    className="-striped -highlight"
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


OfficerSearchFormComponent.propTypes = {
    intl: intlShape.isRequired
};
OfficerSearchFormComponent = injectIntl(OfficerSearchFormComponent);

export default OfficerSearchFormComponent