import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import { CardTitle } from 'reactstrap'
import moment from 'moment'
import userState from '../app/user-state'
import { PromotionForm } from './promotion-create-form'
import { fetchOfficer, deletePromotion, createPromotion, fetchPromotions, fetchActiveRanksOnDate } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import { Tooltip } from 'reactstrap'
import Yup from 'yup'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class TooltipItem extends React.Component {
    constructor(props) {
        super(props)

        this.toggle = this.toggle.bind(this)
        this.state = {
            userState: null,
            tooltipOpen: false,
        }
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    render() {
        return (
            <span>
                <Tooltip placement={"bottom"} isOpen={this.state.tooltipOpen} target={'Tooltip-' + this.props.id} toggle={this.toggle}>
                    <FormattedMessage
                        id="person_detail_tooltip.only_last_is_editable"
                        defaultMessage="*translation missing*"
                    />
                </Tooltip>
            </span>
        );
    }
}

class PromotionCreate extends Component {
    constructor(props) {
        super(props)

        let today = new Date()

        this.state = {
            userState: null,
            promotions: [],
            activeRanksOnDate: [],
        }

        this.props.showBreadCrumbs(true);
    }


    componentDidMount() {
        this.fetch()
    }

    fetch() {
        fetchOfficer(this.props.match.params.officer_id, userState().loggedIn).then(officersObj => {
            fetchPromotions(officersObj.data.id).then(promotionsObj => {
                this.setState({
                    data: {
                        promotions: promotionsObj.data,
                        officer: officersObj.data,
                    },
                    userState: userState()
                })
            })
        })
        let date = {
            date: this.state.dateOfPromotion
        }
        fetchActiveRanksOnDate(date).then(
            response => {
                this.setState({ activeRanksOnDate: response.data })
            },
            errors => {
                this.setState({ activeRanksOnDate: [] });
            }
        );
    }

    renderOfficerAppointments(officer, promotions) {
        let count = 0
        return _.map(promotions, promotion => {
            count++
            if (count !== Object.keys(promotions).length) {
                return (
                    <tr key={`${promotion.dateOfPromotion}-${promotion.rank.id}`}>
                        <td>{promotion.dateOfPromotion}</td>
                        <td>{promotion.rank.rankName}</td>
                        {this.state.userState &&
                            (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                            <td>
                                <TooltipItem key={count} id={count} />
                                <span id={`Tooltip-${count}`}>
                                    <Link
                                        to={`delete`}
                                        className='btn btn-sm btn-secondary mr-2 disabled'
                                    >
                                        <FormattedMessage
                                            id="globals_btn.delete"
                                            defaultMessage="*translation missing*"
                                        />
                                    </Link>
                                    <Link
                                        to={`/officer/${officer.id}/${officer.person.id}/update/promotion/${promotion.id}`}
                                        className='btn btn-sm btn-secondary disabled'
                                    >
                                        <FormattedMessage
                                            id="globals_btn.edit"
                                            defaultMessage="*translation missing*"
                                        />
                                    </Link>
                                </span>
                            </td>}
                    </tr>

                )
            } else {
                return (
                    <tr key={promotion.rank.id}>
                        <td>{promotion.dateOfPromotion}</td>
                        <td>{promotion.rank.rankName}</td>
                        {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                            <td>
                                <span>
                                    <button
                                        onClick={() => this.confirmDeletion(promotion.rank.rankName, promotion.id)}
                                        className={`btn btn-sm btn-secondary mr-2`}
                                    >
                                        <FormattedMessage
                                            id="globals_btn.delete"
                                            defaultMessage="*translation missing*"
                                        />
                                    </button>
                                    <Link
                                        to={`/search/officer/${officer.id}/${officer.person.id}/update/promotion/${promotion.id}`}
                                        className={`btn btn-sm btn-secondary`}
                                    >
                                        <FormattedMessage
                                            id="globals_btn.edit"
                                            defaultMessage="*translation missing*"
                                        />
                                    </Link>
                                </span>
                            </td>}
                    </tr>
                )
            }
        })
    }

    confirmDeletion = (name, id) => {
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
            message: `${are_you_sure} ${name}?`,
            buttons: [
                {
                    label: yes,
                    onClick: () =>
                        deletePromotion(id).then(response => {
                            fetchOfficer(this.props.match.params.officer_id, userState().loggedIn).then(response => {
                                let fetchedOfficer = response.data
                                fetchPromotions(response.data.id).then(response => {
                                    this.setState({
                                        data: {
                                            promotions: response.data,
                                            officer: fetchedOfficer,
                                            userState: userState()
                                        }
                                    })
                                })
                            })
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

    datePicked = (dateFromChild) => {
        this.setState({
            dateOfPromotion: dateFromChild
        })
        let pickedDateObj = {
            date: dateFromChild
        }
        fetchActiveRanksOnDate(pickedDateObj).then(
            response => {
                this.setState({ activeRanksOnDate: response.data })
            },
            errors => {
                this.setState({ activeRanksOnDate: [] });
            }
        );
    }

    render() {
        let that = this
        const TheForm = withFormik({
            mapPropsToValues({
                dateOfPromotion,
                callbackToParent,
                activeRanksOnDate,
                rankForPromotion
            }) {
                return {
                    dateOfPromotion: that.state.dateOfPromotion,
                    callbackToParent: that.datePicked,
                    activeRanksOnDate: that.state.activeRanksOnDate,
                    rankForPromotion: rankForPromotion ? rankForPromotion : ''
                }
            },
            validationSchema: Yup.object().shape({
                dateOfPromotion: Yup.string().nullable().required(
                    <FormattedMessage
                        id="globals_form_validation.date"
                        defaultMessage="*translation missing*"
                    />
                ),
            }),
            handleSubmit: (
                values,
                {
                    resetForm,
                    setStatus,
                    setSubmitting
                }
            ) => {
                let obj = {};
                if (values.rank != null) {
                    obj = {
                        dateOfPromotion: values.dateOfPromotion,
                        rank: values.rank.rank
                    }
                } else {
                    obj = {
                        dateOfPromotion: values.dateOfPromotion,
                    }
                }

                createPromotion(obj, this.props.match.params.officer_id).then(
                    promotion => {
                        setSubmitting(false)
                        resetForm(true)
                        this.setState({
                            dateOfPromotion: ''
                        })
                        this.fetch()
                        setStatus({ success: true })
                    },
                    errors => {
                        setSubmitting(false)
                        setStatus({ error: true })
                    }
                );
            }
        })(PromotionForm);
        if (this.state.data) {
            return (
                <div className="col-md-12 col-lg-8 col-lx-6">
                    <div className="mb-4">
                        <CardTitle>
                            <FormattedMessage
                                id="promotion_create.title"
                                defaultMessage="*translation missing*"
                            />
                        </CardTitle>
                        <TheForm
                            dateOfPromotion={moment(this.state.dateOfPromotion).format("DD/MM/YYYY")}
                            activeRanksOnDate={this.state.activeRanksOnDate}
                        />
                    </div>
                    <div>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>
                                        <FormattedMessage
                                            id="globals_label.date"
                                            defaultMessage="*translation missing*"
                                        />
                                    </th>
                                    <th>
                                        <FormattedMessage
                                            id="officer.commissioned"
                                            defaultMessage="*translation missing*"
                                        />
                                    </th>
                                    <th>
                                        <FormattedMessage
                                            id="globals_label.actions"
                                            defaultMessage="*translation missing*"
                                        />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderOfficerAppointments(this.state.data.officer, this.state.data.promotions)}
                            </tbody>
                        </table>
                    </div>
                </div >
            )
        } else {
            return (
                <div>Loading...</div>
            )
        }

    }
}

PromotionCreate.propTypes = {
    intl: intlShape.isRequired
};
PromotionCreate = injectIntl(PromotionCreate);

export default PromotionCreate
