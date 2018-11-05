import React, { Component } from 'react'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'
import { CardTitle } from 'reactstrap'
import userState from '../app/user-state'
import { RelationForm } from './relation-create-form'
import { createRelation, deleteRelation, fetchRelations, fetchPerson } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import Chance from "chance"
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

const chance = new Chance()

class RelationCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userState: null
        }

        this.props.showBreadCrumbs(true);
    }


    componentDidMount() {
        this.fetchPersonAndRelations()
    }

    fetchPersonAndRelations() {
        fetchPerson(this.props.match.params.person_id, userState().loggedIn).then(personObj => {
            fetchRelations(this.props.match.params.person_id, userState().loggedIn).then(relationsObj => {
                this.setState({
                    data: {
                        person: personObj.data,
                        relations: relationsObj.data,
                    },
                    copied: this.copied(),
                    userState: userState()
                })
            })
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
                        deleteRelation(id).then(() => {
                            this.fetchPersonAndRelations()
                        }).catch(() => {
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

    renderParentRelations(relations) {
        const { parents } = relations
        return _.map(parents, parent => {
            return (
                <tr key={`${chance.guid()}`}>
                    <td>{`${parent.surname}, ${parent.givenName}`}</td>
                    <td>
                        <FormattedMessage
                            id={parent.gender === 'Female' ? 'relation_create.mother' : 'relation_create.father'}
                            defaultMessage="*translation missing*"
                        />
                    </td>
                    <td>
                        <FormattedMessage
                            id={parent.officerId != null ? "globals_confirm.yes" : "globals_confirm.no"}
                            defaultMessage="*translation missing*"
                        />
                    </td>
                    {this.state.userState &&
                        (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                        <td>
                            <button
                                onClick={() => {
                                    let fullname = `${parent.surname}, ${parent.givenName}`
                                    this.confirmDeletion(fullname, parent.relationID)
                                }}
                                className={`btn btn-sm btn-secondary mr-2`}
                            >
                                <FormattedMessage id="globals_btn.delete" defaultMessage="*translation missing*" />
                            </button>
                            <Link
                                to={`/search/${this.props.match.params.officer_id != null ? "officer/" + this.props.match.params.officer_id + "/" : "person/"}${this.state.data.person.id}/update/relations/relative/update/${parent.relationID}/${parent.id}/${'parent'}`}
                                className='btn btn-sm btn-secondary'
                            >
                                <FormattedMessage
                                    id="globals_btn.edit"
                                    defaultMessage="*translation missing*"
                                />
                            </Link>
                        </td>}
                </tr>
            )
        })
    }
    renderChildrenRelations(relations) {
        const { children } = relations
        return _.map(children, child => {
            return (
                <tr key={`${chance.guid()}`}>
                    <td>{`${child.surname}, ${child.givenName}`}</td>
                    <td>{
                        <FormattedMessage
                            id="relation_create.child"
                            defaultMessage="*translation missing*"
                        />
                    }</td>
                    {child.officerId != null ? <td>{
                        <FormattedMessage
                            id="globals_confirm.yes"
                            defaultMessage="*translation missing*"
                        />
                    }</td> : <td>{
                        <FormattedMessage
                            id="globals_confirm.no"
                            defaultMessage="*translation missing*"
                        />
                    }</td>}
                    {this.state.userState &&
                        (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                        <td>
                            <button
                                onClick={() => {
                                    let fullname = `${child.surname}, ${child.givenName}`
                                    this.confirmDeletion(fullname, child.relationID)
                                }}
                                className={`btn btn-sm btn-secondary mr-2`}
                            >
                                <FormattedMessage
                                    id="globals_btn.delete"
                                    defaultMessage="*translation missing*"
                                />
                            </button>
                            <Link
                                to={`/search/${this.props.match.params.officer_id != null ? "officer/" + this.props.match.params.officer_id + "/" : "person/"}${this.state.data.person.id}/update/relations/relative/update/${child.relationID}/${child.id}/${'child'}`}
                                className='btn btn-sm btn-secondary'
                            >
                                <FormattedMessage
                                    id="globals_btn.edit"
                                    defaultMessage="*translation missing*"
                                />
                            </Link>
                        </td>}
                </tr>
            )
        })
    }

    copied() {
        let copied = (localStorage.getItem('copiedObject') !== null && JSON.parse(localStorage.getItem('copiedObject')))
        if (typeof (copied) === 'object') {
            return copied
        } else {
            return ''
        }
    }

    render() {
        const TheForm = withFormik({
            mapPropsToValues({
                copied,
                person,
                typeOfRelation
            }) {
                return {
                    copied: copied || null,
                    person: person || '',
                    typeOfRelation: typeOfRelation || ''
                }
            },
            handleSubmit: (
                values,
                {
                    resetForm
                }
            ) => {
                let obj = {}
                if (values.typeOfRelation.typeOfRelation === "Parent") {
                    obj = {
                        parent: values.copied,
                        child: values.person,
                    }
                } else if (values.typeOfRelation.typeOfRelation === "Child") {
                    obj = {
                        parent: values.person,
                        child: values.copied,
                    }
                }


                createRelation(obj).then(() => {
                    this.fetchPersonAndRelations()
                    resetForm(values)
                }).catch((error) => {
                    console.log(error);
                });
            }
        })(RelationForm);

        if (this.state.data) {
            return (
                <div className="col-md-12 col-lg-8 col-lx-6 mb-4">
                    <CardTitle>
                        <FormattedMessage
                            id="relation_create.title"
                            defaultMessage="*translation missing*"
                        />
                    </CardTitle>
                    <TheForm
                        copied={this.state.copied.person}
                        person={this.state.data.person}
                    />
                    <br />
                    <br />
                    <div>
                        <table className="table table-sm">
                            <thead>
                                <tr>
                                    <th>
                                        <FormattedMessage
                                            id="person.full_name"
                                            defaultMessage="*translation missing*"
                                        />
                                    </th>
                                    <th>
                                        <FormattedMessage
                                            id="relation_create.is_of_relation"
                                            defaultMessage="*translation missing*"
                                        />
                                    </th>
                                    <th>
                                        <FormattedMessage
                                            id="globals_form.is_officer"
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
                                {this.renderParentRelations(this.state.data.relations)}
                                {this.renderChildrenRelations(this.state.data.relations)}
                            </tbody>
                        </table>
                    </div>
                </div >
            )
        } else {
            return (
                <FormattedMessage
                    id="globals.loading"
                    defaultMessage="*translation missing*"
                />
            )
        }

    }
}

RelationCreate.propTypes = {
    intl: intlShape.isRequired
};
RelationCreate = injectIntl(RelationCreate);

export default RelationCreate
