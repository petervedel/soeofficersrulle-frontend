import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { CardTitle } from 'reactstrap'
import { fetchPerson, fetchRelations } from '../_actions'
import userState from '../app/user-state'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class PersonDetail extends Component {
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
                    person: this.state.data.person,
                    officer: null
                }
            )
        );
        this.setState({ copyLabel: 'Kopieret!' })
        this.props.copied({ person: this.state.data.person, officer: null })
    }

    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps !== this.props) {
            this.fetch(nextProps.match.params.person_id)
        }
    }

    componentDidMount() { this.fetch(this.props.match.params.person_id) }

    fetch(id) {
        fetchPerson(id).then(personsObj => {
            fetchRelations(id).then(relationsObj => {
                this.setState({
                    data: {
                        relations: relationsObj.data,
                        person: personsObj.data
                    },
                    userState: userState()
                })
            })
        })
    }

    renderPersonDetails() {
        const { person, relations } = this.state.data
        return (
            <div className="mb-4 col-md-10 col-lg-8 col-lx-6">
                <CardTitle>
                    <FormattedMessage
                        id="globals_label.person_details"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <div className="d-flex mb-4">
                    <div>
                        {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                            <Link to={`/search/person/${person.id}/update`} className="btn btn-sm btn-secondary">
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
                            <td>{person.surname}, {person.givenName}</td>
                        </tr>
                        <tr>
                            <td>
                                <FormattedMessage
                                    id="person.born"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>{person.dateOfBirth}</td>
                        </tr>

                        <tr>
                            <td>
                                <FormattedMessage
                                    id="person.died"
                                    defaultMessage="*translation missing*"
                                />
                            </td>
                            <td>{person.dateOfDeath}</td>
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
                                                            id="person.unknown"
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
            </div>
        )
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
            return this.renderPersonDetails()

        }

    }



}


PersonDetail.propTypes = {
    intl: intlShape.isRequired
};
PersonDetail = injectIntl(PersonDetail);

export default PersonDetail