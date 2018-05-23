import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import moment from 'moment'
import { PromotionForm } from './promotion-update-form'
import { updatePromotion, fetchPromotions } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import _ from 'lodash'
import Yup from 'yup'
import { FormattedMessage } from 'react-intl'

class PromotionUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            promotionToUpdate: {},
            rankName: ''
        }
    }

    setPromotionState() {
        fetchPromotions(this.props.match.params.id).then(response => {
            _.map(response.data, promotion => {
                if (JSON.stringify(promotion.id) === this.props.match.params.promoId) {
                    this.setState({
                        promotionToUpdate: promotion,
                        rankName: promotion.rank.rankName
                    })
                }
            })
        })
    }

    componentWillMount() {
        this.setPromotionState()
    }

    render() {
        const TheForm = withFormik({
            mapPropsToValues({
                dateOfPromotion,
            }) {
                return {
                    dateOfPromotion: dateOfPromotion ? moment(dateOfPromotion,"DD/MM/YYYY").format("DD/MM/YYYY") : ''
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
                    setErrors,
                    setStatus,
                    setSubmitting
                }
            ) => {
                let promotionToUpdateCopy = JSON.parse(JSON.stringify(this.state.promotionToUpdate))
                promotionToUpdateCopy.dateOfPromotion = values.dateOfPromotion

                updatePromotion(promotionToUpdateCopy, this.state.promotionToUpdate.id).then(
                    promotion => {
                        setSubmitting(false)
                        resetForm()
                        setStatus({ success: true })
                        this.setPromotionState()
                    },
                    errors => {
                        setSubmitting(false)
                        setStatus({ error: true })
                    }
                );
            }
        })(PromotionForm);
        if (this.state.promotionToUpdate !== {}) {
            return (
                <div>
                    <CardTitle>
                        <FormattedMessage
                            id="promotion_update.title"
                            defaultMessage="*translation missing*"
                        />
                    </CardTitle>
                    <br />
                    <div><FormattedMessage
                        id="promotion_update.note"
                        defaultMessage="*translation missing*"
                    />{` ${this.state.rankName}`}</div>
                    <br />
                    <TheForm
                        dateOfPromotion={this.state.promotionToUpdate.dateOfPromotion}
                    />
                </div >
            )
        } else {
            return (
                <div>
                    <FormattedMessage
                        id="globals.loading"
                        defaultMessage="*translation missing*"
                    />
                </div>
            )
        }

    }
}

export default PromotionUpdate;