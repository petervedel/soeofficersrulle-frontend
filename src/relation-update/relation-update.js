import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import userState from '../app/user-state'
import { RelationForm } from './relation-update-form'
import { updateRelation, fetchPerson } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

class RelationUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userState: null
        }

        this.props.showBreadCrumbs(true);
    }

    componentDidMount() {
        this.fetchPersons()
    }

    fetchPersons() {
        fetchPerson(this.props.match.params.person_id, userState().loggedIn).then(personObj => {
            fetchPerson(this.props.match.params.relativeId, userState().loggedIn).then(relativeObj => {
                this.setState({
                    data: {
                        person: personObj.data,
                        relative: relativeObj.data
                    },
                    userState: userState()
                })
            })
        })
    }

    render() {
        const TheForm = withFormik({
            mapPropsToValues({
                relative,
                person,
                originalCopy_relative,
                originalCopy_person,
                typeOfRelation
            }) {
                return {
                    relative: relative,
                    person: person,
                    originalCopy_relative: originalCopy_relative,
                    originalCopy_person: originalCopy_person,
                    typeOfRelation: typeOfRelation
                }
            },
            handleSubmit: (
                values,
                {
                    resetForm,
                    setStatus,
                    setSubmitting
                }
            ) => {
                let obj = {}

                obj = {
                    parent: values.relative,
                    child: values.person,
                }


                updateRelation(obj, this.props.match.params.relationId).then(() => {
                    this.fetchPersons()
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
                            id="relation_update.title"
                            defaultMessage="*translation missing*"
                        />
                    </CardTitle>
                    <TheForm
                        relative={this.state.data.relative}
                        person={this.state.data.person}
                        originalCopy_relative={this.state.data.relative}
                        originalCopy_person={this.state.data.person}
                        typeOfRelation={this.props.match.params.typeOfRelation === 'parent' ? 'Parent' : 'Child'}
                    />
                </div >
            )
        } else {
            return (
                <div>Loading...</div>
            )
        }

    }
}

RelationUpdate.propTypes = {
    intl: intlShape.isRequired
};
RelationUpdate = injectIntl(RelationUpdate);

export default RelationUpdate
