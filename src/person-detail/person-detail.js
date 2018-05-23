import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { fetchOfficer, fetchPromotions, fetchPerson, deletePromotion } from '../_actions'
import userState from '../app/user-state'
import { Tooltip } from 'reactstrap'
import { withRouter } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class TooltipItem extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            userState : '',
            tooltipOpen: false
        };
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
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

class PersonDetail extends Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            userState: '',
            tooltipOpen: false,
        }
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ userState: nextProps.userState });
    }

    shouldComponentUpdate(nextProps) {
        return this.state.userState !== nextProps.userState;
    }

    componentWillMount() {
        if (this.props.match.params.type === 'officer') {
            if (!this.state.officer) {
                fetchOfficer(this.props.match.params.id,userState().loggedIn).then(response => {
                    let fetchedOfficer = response.data
                    fetchPromotions(response.data.id).then(response => {
                        this.setState({
                            promotions: response.data,
                            officer: fetchedOfficer,
                            userState : userState()
                        })
                    })
                })
            }
        }
        else {
            if (!this.state.person) {
                fetchPerson(this.props.match.params.id).then(response => {
                    this.setState({
                        person: response.data
                    })
                    this.setState({
                        userState: userState()
                    })
                })
            }
        }
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
                            fetchOfficer(this.props.match.params.id,userState().loggedIn).then(response => {
                                let fetchedOfficer = response.data
                                fetchPromotions(response.data.id).then(response => {
                                    this.setState({
                                        promotions: response.data,
                                        officer: fetchedOfficer,
                                        userState: userState()
                                    })
                                })
                            })
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
    };

    disabled() {
        return null
    }

    renderOfficerAppointments(officer, promotions) {
        let count = 0
        return _.map(promotions, promotion => {
            count++
            if (count !== Object.keys(promotions).length) {
                return (
                    <tr key={promotion.rank.id}>
                        <td>{promotion.dateOfPromotion}</td>
                        <td>{promotion.rank.rankName}</td>
                        {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) && <td>
                            <TooltipItem key={count} id={count} />
                            <span id={`Tooltip-${count}`} className="pb-2">
                                <Link
                                    to={`delete`}
                                    className='btn btn-sm btn-danger mr-2 disabled'
                                >
                                    <FormattedMessage
                                        id="globals_btn.delete"
                                        defaultMessage="*translation missing*"
                                    />
                                </Link>
                                <Link
                                    to={`/officer/${officer.id}/promotion/${promotion.id}/update`}
                                    className='btn btn-sm bg-secondary text-white disabled'
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
                        {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) && <td>
                            <span className="pb-2">
                                <button
                                    onClick={() => this.confirmDeletion(promotion.rank.rankName, promotion.id)}
                                    className={`btn btn-sm btn-danger mr-2`}
                                >
                                    <FormattedMessage
                                        id="globals_btn.delete"
                                        defaultMessage="*translation missing*"
                                    />
                                </button>
                                <Link
                                    to={`/officer/${officer.id}/promotion/${promotion.id}/update`}
                                    className={`btn btn-sm bg-secondary text-white`}
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

    renderOfficerDetails() {
        const { officer, promotions } = this.state
        return (
            <div className="container">
                <div className="d-flex mb-4">
                    <div>
                        {console.log(this.state.userState)}
                        {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                            <Link to={`/officer/${officer.id}/update`} className="btn btn-sm bg-secondary text-white">
                                <FormattedMessage
                                    id="globals_btn.edit"
                                    defaultMessage="*translation missing*"
                                />
                            </Link>}
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col">
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="person.full_name"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="person.born"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="officer.retired"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="person.died"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="officer.tordenskjold_nr"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-8 col-lg-8 col-xl-10">
                        <div>{officer.person.givenName} {officer.person.surname || <br />}</div>
                        <div>{officer.person.dateOfBirth || <br />}</div>
                        <div>{officer.appointedUntil || <br />}</div>
                        <div>{officer.person.dateOfDeath || <br />}</div>
                        <div>{this.state.officer.appointedNumber || <br />}</div>
                    </div>
                </div>
                {0 < promotions.length &&
                <table className="table">
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
                            {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                            <th>
                                <FormattedMessage
                                    id="globals_label.actions"
                                    defaultMessage="*translation missing*"
                                />
                            </th>}
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderOfficerAppointments(officer, promotions)}
                    </tbody>
                </table>}
            </div>
        )
    }

    renderPersonDetails() {
        const { person } = this.state
        return (
            <div className="container">
                <div className="d-flex mb-4">
                    <div>
                        {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                            <Link to={`/person/${person.id}/update`} className="btn btn-sm bg-secondary text-white">
                                <FormattedMessage
                                    id="globals_btn.edit"
                                    defaultMessage="*translation missing*"
                                />
                            </Link>}
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col">
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="person.full_name"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="person.born"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="person.died"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-8 col-lg-8 col-xl-10">
                        <div> {person.givenName} {person.surname}</div>
                        <div>{person.dateOfBirth}</div>
                        <div> {person.dateOfDeath}</div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const { officer, person } = this.state
        if (!officer && !person) {
            return <div>
                <div className="font-weight-bold">
                    <FormattedMessage
                        id="globals.loading"
                        defaultMessage="*translation missing*"
                    />
                </div>
            </div>
        }
        if (officer) {
            return this.renderOfficerDetails()
        }
        if (person) {
            return this.renderPersonDetails()
        }
    }
}

PersonDetail.propTypes = {
    intl: intlShape.isRequired
};
PersonDetail = injectIntl(PersonDetail);

export default PersonDetail