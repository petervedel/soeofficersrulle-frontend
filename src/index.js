import React from 'react'
import { render } from 'react-dom'
import { addLocaleData } from 'react-intl'
import en from 'react-intl/locale-data/en'
import da from 'react-intl/locale-data/da'
import App from './app/app'

addLocaleData(en)
addLocaleData(da)

render(
    <App />, document.getElementById('app')
)