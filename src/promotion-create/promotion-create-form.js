import React from 'react'
import moment from 'moment'
import _ from 'lodash'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Form } from 'formik'
import VirtualizedSelect from 'react-virtualized-select'
import 'react-select/dist/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import langState from '../app/lang-state'
import { FormattedMessage } from 'react-intl'

const setInvalid = () => {
    if (document.getElementById("rankSelect"))
        document.getElementById("rankSelect").getElementsByClassName("Select-control")[0].classList.add("select-is-invalid")
}

const setValid = () => {
    if (document.getElementById("rankSelect"))
        document.getElementById("rankSelect").getElementsByClassName("Select-control")[0].classList.remove("select-is-invalid")
}

const pickedDate = (values, date) => {
    if (date !== null) {
        values.callbackToParent(date)
    }
}

export const PromotionForm = ({
    values,
    touched,
    errors,
    status,
    isSubmitting,
    setFieldValue,
}) => (
        <Form>
            <div className="form-group">
                <label>
                    <FormattedMessage
                        id="promotion_create.date"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <DatePicker
                    name="dateOfPromotion"
                    selected={values.dateOfPromotion ?
                        moment(values.dateOfPromotion, "D/M YYYY") :
                        null}
                    onChange={(text) => {
                        pickedDate(values, moment(text).format("DD/MM/YYYY"))
                    }}
                    dateFormat="D/M YYYY"
                    placeholderText="D/M YYYY"
                    autoComplete="off"
                    className={`form-control ${touched.dateOfPromotion && errors.dateOfPromotion ? 'is-invalid' : ''}`}
                />
                {touched.dateOfPromotion && errors.dateOfPromotion && <p className="invalid-feedback d-inline">{errors.dateOfPromotion}</p>}
            </div>
            <div className="form-group" id="rankSelect">
                <label>
                    <FormattedMessage
                        id="officer.rank"
                        defaultMessage="*translation missing*"
                    />
                </label>
                <VirtualizedSelect options={
                    _.map(values.activeRanksOnDate, rank => {
                        const currentLang = langState().toString()
                        return {
                            label: currentLang === 'da' ? rank.rankName : rank.rankNameEn,
                            rank: rank
                        }
                    })
                }
                    placeholder={
                        <FormattedMessage
                            id="globals_label.select_placeholder"
                            defaultMessage="*translation missing*"
                        />
                    }
                    name="rank"
                    value={values.rank}
                    onChange={value => setFieldValue('rank', value)}
                    className={`Select is-clearable is-searchable Select--single ${touched.rank && errors.rank ? setInvalid() : setValid()}`}
                    disabled={
                        !moment(moment(values.dateOfPromotion, "DD/MM/YYYY")).isValid() ||
                        moment(moment(values.dateOfPromotion, "DD/MM/YYYY")).isValid() === null
                    }
                />
                {touched.rank && errors.rank && <p className="invalid-feedback d-inline">{errors.rank}</p>}
            </div>
            <button disabled={isSubmitting} className="btn btn-primary">
                <FormattedMessage
                    id="globals_btn.create"
                    defaultMessage="*translation missing*"
                />
            </button>
            {status && status.error && <p className="text-danger p-2">
                <FormattedMessage
                    id="globals_form_create.error"
                    defaultMessage="*translation missing*"
                />
            </p>}
        </Form>
    )