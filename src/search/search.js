import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import 'react-datepicker/dist/react-datepicker.css'
import { fetchRanks, fetchSearch } from '../_actions'
import { withFormik } from 'formik'
import ReactTable from "react-table"
import "react-table/react-table.css"
import { FormComponent } from "./search-form"
import Yup from 'yup'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class FormComponentComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoggedIn: false,
            data: [],
            columns: [
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
                            id="person.given_name"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "givenName"
                },
                {
                    Header:
                        <FormattedMessage
                            id="person.born"
                            defaultMessage="*translation missing*"
                        />,
                    accessor: "dateOfBirth"
                }
            ],
            surname: '',
            givenName: '',
            yearOfBirthFrom: '',
            yearOfBirthTo: '',
            isOfficer: true,
            appointedYearFrom: '',
            appointedYearTo: '',
            lastRank: '',
            ranks: [],
        }

        this.props.showBreadCrumbs(false);
    }

    componentDidMount() {
        let localStorageUserSession = (localStorage.getItem('userSession') != null && JSON.parse(localStorage.getItem('userSession')).userSession)
        if (typeof (localStorageUserSession) === 'object') {
            if (localStorageUserSession.id) {
                this.setState({ isLoggedIn: true })
            } else {
                this.setState({ isLoggedIn: false })
            }
        } else {
            this.setState({ isLoggedIn: false })
        }
        fetchRanks().then(
            response => {
                var result = []
                for (var i = 0; i < response.data.length; i++) {
                    result.push(
                        {
                            label: response.data[i].rankName,
                            rankID: response.data[i].id
                        }
                    )
                }
                this.setState({ ranks: result })
            },
            errors => {
                this.setState({ ranks: [] })
            }
        )
    }

    validateMethod() {
        return true
    }

    isOfficer = (values, bool) => {
        console.log(values)
        this.setState({
            appointedNumber: values.appointedNumber,
            appointedYearFrom: values.appointedYearFrom,
            appointedYearTo: values.appointedYearTo,
            dateOfDeath: values.dateOfDeath,
            givenName: values.givenName,
            isOfficer: bool,
            lastRank: values.lastRank,
            surname: values.surname,
            yearOfBirthFrom: values.yearOfBirthFrom,
            yearOfBirthTo: values.yearOfBirthTo
        })
    }


    render() {
        let that = this
        const officerColumns = [
            {
                Header:
                    <FormattedMessage
                        id="person.surname"
                        defaultMessage="*translation missing*"
                    />,
                accessor: "person.surname"
            },
            {
                Header:
                    <FormattedMessage
                        id="person.given_name"
                        defaultMessage="*translation missing*"
                    />,
                accessor: "person.givenName"
            },
            {
                Header:
                    <FormattedMessage
                        id="person.born"
                        defaultMessage="*translation missing*"
                    />,
                accessor: "person.dateOfBirth"
            },
            {
                Header:
                    <FormattedMessage
                        id="officer.nielsJuel_nr"
                        defaultMessage="*translation missing*"
                    />,
                accessor: "dodabNumber"
            },
            {
                Header:
                    <FormattedMessage
                        id="officer.tordenskjold_nr"
                        defaultMessage="*translation missing*"
                    />,
                accessor: "appointedNumber"
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
                        id="person.died"
                        defaultMessage="*translation missing*"
                    />,
                accessor: "person.dateOfDeath"
            }
        ]

        const personColumns = [
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
                        id="person.given_name"
                        defaultMessage="*translation missing*"
                    />,
                accessor: "givenName"
            },
            {
                Header:
                    <FormattedMessage
                        id="person.born"
                        defaultMessage="*translation missing*"
                    />,
                accessor: "dateOfBirth"
            }
        ]

        const cleanValues = (values) => {
            var valuesCopy = Object.assign({}, values)
            Object.keys(valuesCopy).forEach((key) => (valuesCopy[key] === null || valuesCopy[key] === '') && delete valuesCopy[key])

            if (valuesCopy.lastRank != null) {
                var rankID = valuesCopy.lastRank.rankID
                delete valuesCopy.lastRank

                valuesCopy.rankID = rankID
            }
            delete valuesCopy.isLoggedIn
            delete valuesCopy.ranks


            return valuesCopy
        }

        const TheForm = withFormik({
            mapPropsToValues({
                givenName,
                surname,
                yearOfBirthFrom,
                yearOfBirthTo,
                dateOfDeath,
                appointedYearFrom,
                appointedYearTo,
                isOfficer,
                lastRank,
                ranks,
                appointedNumber,
                callbackToParent
            }) {
                return {
                    givenName: givenName || '',
                    surname: surname || '',
                    yearOfBirthFrom: yearOfBirthFrom || '',
                    yearOfBirthTo: yearOfBirthTo || '',
                    dateOfDeath: dateOfDeath || '',
                    appointedYearFrom: appointedYearFrom || '',
                    appointedYearTo: appointedYearTo || '',
                    isOfficer: isOfficer || that.state.isOfficer,
                    lastRank: lastRank || '',
                    ranks: ranks || [],
                    appointedNumber: appointedNumber || '',
                    callbackToParent: that.isOfficer
                }
            },
            validationSchema: Yup.object().shape({
                yearOfBirthFrom: Yup.number().min(1000,
                    <FormattedMessage
                        id="person_search_form_validation.min_yob_from"
                        defaultMessage="*translation missing*"
                    />
                ).max(new Date().getFullYear(),
                    <FormattedMessage
                        id="person_search_form_validation.max_yob_from"
                        defaultMessage="*translation missing*"
                    />
                ).test('test',
                    <FormattedMessage
                        id="person_search_form_validation.fill_yob_to"
                        defaultMessage="*translation missing*"
                    />
                    , function () {
                        if (0 < document.getElementById('yearOfBirthFrom').value.length && document.getElementById('yearOfBirthTo').value.length === 0) {
                            return false
                        } else {
                            return true
                        }
                    }),
                yearOfBirthTo: Yup.number().min(1000,
                    <FormattedMessage
                        id="person_search_form_validation.min_yob_to"
                        defaultMessage="*translation missing*"
                    />
                ).max(new Date().getFullYear(),
                    <FormattedMessage
                        id="person_search_form_validation.max_yob_to"
                        defaultMessage="*translation missing*"
                    />
                ).test('test',
                    <FormattedMessage
                        id="person_search_form_validation.fill_yob_from"
                        defaultMessage="*translation missing*"
                    />
                    , function () {
                        if (0 < document.getElementById('yearOfBirthTo').value.length && document.getElementById('yearOfBirthFrom').value.length === 0) {
                            return false
                        } else {
                            return true
                        }
                    }),
                appointedYearFrom: Yup.number().min(1000,
                    <FormattedMessage
                        id="person_search_form_validation.min_ay_from"
                        defaultMessage="*translation missing*"
                    />
                ).max(new Date().getFullYear(),
                    <FormattedMessage
                        id="person_search_form_validation.max_ay_from"
                        defaultMessage="*translation missing*"
                    />
                ).test('test',
                    <FormattedMessage
                        id="person_search_form_validation.fill_comm_from"
                        defaultMessage="*translation missing*"
                    />
                    , function () {
                        if (0 < document.getElementById('appointedYearFrom').value.length && document.getElementById('appointedYearTo').value.length === 0) {
                            return false
                        } else {
                            return true
                        }
                    }),
                appointedYearTo: Yup.number().min(1000,
                    <FormattedMessage
                        id="person_search_form_validation.min_ay_to"
                        defaultMessage="*translation missing*"
                    />
                ).max(new Date().getFullYear(),
                    <FormattedMessage
                        id="person_search_form_validation.max_ay_to"
                        defaultMessage="*translation missing*"
                    />
                ).test('test',
                    <FormattedMessage
                        id="person_search_form_validation.fill_comm_to"
                        defaultMessage="*translation missing*"
                    />
                    , function () {
                        if (0 < document.getElementById('appointedYearTo').value.length && document.getElementById('appointedYearFrom').value.length === 0) {
                            return false
                        } else {
                            return true
                        }
                    }),
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
                let cleanedVal = cleanValues(values)
                var shouldSetOfficerColumns = false
                if (values.isOfficer) {
                    shouldSetOfficerColumns = true
                }

                fetchSearch(cleanedVal, this.state.isLoggedIn).then(
                    (response) => {
                        this.setState({
                            givenName: values.givenName,
                            surname: values.surname,
                            yearOfBirthFrom: values.yearOfBirthFrom,
                            yearOfBirthTo: values.yearOfBirthTo,
                            appointedYearTo: values.appointedYearTo,
                            appointedYearFrom: values.appointedYearFrom,
                            lastRank: values.lastRank,
                            appointedNumber: values.appointedNumber,
                            isOfficer: values.isOfficer,
                            data: response.data
                        })
                        if (shouldSetOfficerColumns) {
                            this.setState({ columns: officerColumns })
                        } else {
                            this.setState({ columns: personColumns })
                        }
                        resetForm(values)
                    }).catch((response) => {
                        console.log(response)
                        resetForm(values)
                    })
            },
            enableReinitialization: true,
        })(FormComponent)

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
                            id="globals_label.search"
                            defaultMessage="*translation missing*"
                        />
                    </CardTitle>

                    <TheForm
                        givenName={this.state.givenName}
                        surname={this.state.surname}
                        yearOfBirthFrom={this.state.yearOfBirthFrom}
                        yearOfBirthTo={this.state.yearOfBirthTo}
                        appointedYearFrom={this.state.appointedYearFrom}
                        appointedYearTo={this.state.appointedYearTo}
                        lastRank={this.state.lastRank}
                        isOfficer={this.state.isOfficer}
                        ranks={this.state.ranks}
                        appointedNumber={this.state.appointedNumber}
                    />
                </div>
                <ReactTable minRows="0"
                    data={this.state.data}
                    getTdProps={(state, rowInfo, column, instance) => {
                        return {
                            onClick: (e, handleOriginal) => {
                                if (rowInfo.original.appointedNumber) {
                                    this.props.history.push(`/search/officer/${rowInfo.original.id}/${rowInfo.original.person.id}`)
                                } else {
                                    this.props.history.push(`/search/person/${rowInfo.original.id}`)
                                }
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

FormComponentComponent.propTypes = {
    intl: intlShape.isRequired
};
FormComponentComponent = injectIntl(FormComponentComponent);

export default FormComponentComponent