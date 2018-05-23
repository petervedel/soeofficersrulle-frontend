import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import moment from 'moment'
import { PromotionForm } from './promotion-create-form'
import { createPromotion, fetchPromotions } from '../_actions'
import 'react-datepicker/dist/react-datepicker.css'
import { withFormik } from 'formik'
import Yup from 'yup'
import { FormattedMessage } from 'react-intl'

class PromotionCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            promotions: []
        }
    }

    fetchPromotions() {
        fetchPromotions(this.props.match.params.id).then(
            response => {
                this.setState({ promotions: response.data })
            },
            errors => {
                this.setState({ promotions: [] });
            }
        );
    }

    componentWillMount() {
        this.fetchPromotions()
    }

    render() {
        const TheForm = withFormik({
            mapPropsToValues({
                dateOfPromotion,
            }) {
                return {
                    dateOfPromotion: dateOfPromotion ? moment(dateOfPromotion).format("DD/MM/YYYY") : ''
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
                createPromotion(values, this.props.match.params.id).then(
                    promotion => {
                        setSubmitting(false)
                        resetForm()
                        setStatus({ success: true })
                        this.fetchPromotions()
                    },
                    errors => {
                        setSubmitting(false)
                        setStatus({ error: true })
                    }
                );
            }
        })(PromotionForm);
        return (
            <div>
                <CardTitle>
                    <FormattedMessage
                        id="promotion_create.title"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <br />
                <TheForm />
                <div>
                    <table>
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
                            {this.state.promotions.map((row, i) =>
                                <tr key={i}>
                                    <td>{row.dateOfPromotion}</td>
                                    <td>{row.rank.rankName}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        )
    }
}

export default PromotionCreate;