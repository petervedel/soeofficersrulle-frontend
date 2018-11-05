import React, { Component } from 'react'
import _ from 'lodash'
import { CardTitle } from 'reactstrap'
import { Link } from 'react-router-dom'
import { fetchOfficer, fetchPromotions, fetchRelations } from '../_actions'
import userState from '../app/user-state'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class OfficerDetail extends Component {
    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this);
        this.state = {
            userState: null,
            tooltipOpen: false,
            data: null,
            copied: { person: null, officer: null },
            copyLabel: 'Kopiere til relation'
        }
        this.enableCopy = this.enableCopy.bind(this);

        this.props.showBreadCrumbs(true);
    }

    enableCopy() {
        localStorage.setItem(
            'copiedObject',
            JSON.stringify(
                {
                    officer: this.state.data.officer,
                    person: this.state.data.officer.person
                }
            )
        );
        this.setState({ copyLabel: 'Kopieret!' })
        this.props.copied({
            officer: this.state.data.officer,
            person: this.state.data.officer.person
        })
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.fetch(nextProps.match.params.officer_id)
        }
    }

    componentDidMount() { this.fetch(this.props.match.params.officer_id) }


    fetch(id) {
        fetchOfficer(id, userState().loggedIn).then(officersObj => {
            fetchPromotions(officersObj.data.id).then(promotionsObj => {
                fetchRelations(officersObj.data.person.id).then(relationsObj => {
                    this.setState({
                        data: {
                            promotions: promotionsObj.data,
                            officer: officersObj.data,
                            relations: relationsObj.data
                        },
                        userState: userState()
                    })
                })
            })
        })
    }

    renderOfficerDetails() {
        const { officer, promotions, relations } = this.state.data
        return (
            <div className="col-md-12 col-lg-8 col-lx-6 mb-4">
                <CardTitle>
                    <FormattedMessage
                        id="globals_label.officer_details"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <div className="d-flex mb-4">
                    <div>
                        {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                            <Link to={`/search/officer/${officer.id}/${officer.person.id}/update`} className="btn btn-sm btn-secondary">
                                <FormattedMessage
                                    id="globals_btn.edit"
                                    defaultMessage="*translation missing*"
                                />
                            </Link>}
                        {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                            <button
                                onClick={this.enableCopy}
                                type="button"
                                className="btn btn-sm bg-primary text-white ml-2">
                                {this.state.copyLabel}
                            </button>
                        }
                    </div>
                </div>
                <table className="table table-sm">
                    <tbody>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="person.full_name"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>{officer.person.surname}, {officer.person.givenName}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="person.born"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>{officer.person.dateOfBirth}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="officer.retired"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>{officer.appointedUntil}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="person.died"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>{officer.person.dateOfDeath}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="officer.tordenskjold_nr"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>{officer.appointedNumber}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="officer.nielsJuel_nr"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>{officer.dodabNumber}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="relation_create.parents"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>
                                {relations.parents.length < 1 ? <div>
                                    <FormattedMessage
                                        id="relation_create.unknown"
                                        defaultMessage="*translation missing*"
                                    />
                                </div> :
                                    relations.parents.length > 0 ?
                                        relations.parents.map((item, i) =>
                                            <div key={i}>
                                                <Link to={`/search/${item.officerId != null ? 'officer' : 'person'}/${item.officerId != null ? item.officerId + "/" + item.id : item.id}/`} >
                                                    {item.gender === "Male" ?
                                                        <FormattedMessage
                                                            id="person.father"
                                                            defaultMessage="*translation missing*"
                                                        />
                                                        : ""}
                                                    {item.gender === "Female" ?
                                                        <FormattedMessage
                                                            id="person.mother"
                                                            defaultMessage="*translation missing*"
                                                        />
                                                        : ""}
                                                    {item.gender === "Unknown" ?
                                                        <FormattedMessage
                                                            id="relation_create.unknown"
                                                            defaultMessage="*translation missing*"
                                                        />
                                                        : ""}: {item.surname}, {item.givenName} {item.officerId != null ? " *" : ""}
                                                </Link>
                                            </div>
                                        ) :
                                        <br />
                                }
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="person.children"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>
                                {relations.children.length < 1 ? <div>
                                    <FormattedMessage
                                        id="relation_create.unknown"
                                        defaultMessage="*translation missing*"
                                    />
                                </div> :
                                    relations.children.map((item, i) =>
                                        <div key={i}>
                                            <Link to={`/search/${item.officerId != null ? 'officer' : 'person'}/${item.officerId != null ? item.officerId + "/" + item.id : item.id}/`} >
                                                {item.surname}, {item.givenName}{item.officerId != null ? " *" : ""}
                                            </Link>
                                        </div>
                                    )}
                            </td>
                        </tr>
                    </tbody>
                </table>

                {promotions.length > 0 &&
                    <div>
                        <h1>
                            <FormattedMessage
                                id="officer.commissioned"
                                defaultMessage="*translation missing*"
                            />
                        </h1>
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
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderOfficerAppointments(promotions)}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        )
    }

    renderOfficerAppointments(promotions) {
        return _.map(promotions, promotion => {
            return (
                <tr key={promotion.id}>
                    <td>{promotion.dateOfPromotion}</td>
                    <td>{promotion.rank.rankName}</td>
                </tr>
            )
        })
    }

    render() {
        if (this.state.data === null) {
            return <div>
                <div className="font-weight-bold">
                    <FormattedMessage
                        id="globals.loading"
                        defaultMessage="*translation missing*"
                    />
                </div>
            </div>
        } else {
            return this.renderOfficerDetails()
        }
    }
}

OfficerDetail.propTypes = {
    intl: intlShape.isRequired
};
OfficerDetail = injectIntl(OfficerDetail);

export default OfficerDetail