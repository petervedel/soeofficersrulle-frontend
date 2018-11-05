import React from 'react'
import { BrowserRouter, Route, Switch, Redirect, Link } from 'react-router-dom'
import {
    Card,
    CardBody
} from 'reactstrap'
import 'bootstrap/dist/css/bootstrap.css'
import '../index.css'
import MyNavBar from './navbar'
import PersonCreate from '../person-create/person-create'
import PersonUpdate from '../person-update/person-update'
import PersonDetail from '../person-detail/person-detail'
import OfficerDetail from '../officer-detail/officer-detail'
import SearchFormComponent from '../search/search'
import SignInFormComponent from '../login/login'
import UserSearchFormComponent from '../user-search/user-search'
import OfficerCorpsSearchFormComponent from '../officer-corps/officer-corps-search'
import UserCreate from '../user-create/user-create'
import UserUpdate from '../user-update/user-update'
import RelationCreate from '../relation-create/relation-create'
import RelationUpdate from '../relation-update/relation-update'
import PromotionCreate from '../promotion-create/promotion-create'
import PromotionUpdate from '../promotion-update/promotion-update'
import UserDetail from '../user-detail/user-detail'
import UploadFile from '../system/upload_file'
import userState from './user-state'
import langState from './lang-state'
import messages from './messages'
import Breadcrumbs from './breadcrumbs'
import { IntlProvider, FormattedMessage } from 'react-intl'
import 'babel-polyfill';

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userState: userState(),
            langState: langState(),
            showBreadCrumbs: true,
            copied: { person: null, officer: null }
        }
    }

    myCallback = () => {
        this.setState({
            userState: userState()
        })
    }

    langSwitcher = () => {
        this.setState({
            langState: langState()
        })
    }

    showBreadCrumbs = (bool) => {
        this.setState({
            showBreadCrumbs: bool
        })
    }

    copied = (data) => {
        this.setState({
            copied: data
        })
    }

    clearCopied = () => {
        localStorage.removeItem('copiedObject')
        this.setState({
            copied: { person: null, officer: null }
        })
    }

    componentDidMount() {
        if (this.state.copied.person === null) {
            let copied = (localStorage.getItem('copiedObject') !== null && JSON.parse(localStorage.getItem('copiedObject')))
            if (typeof (copied) === 'object') {
                this.setState({
                    copied: copied
                })
            } else {
                this.setState({
                    copied: { person: null, officer: null }
                })
            }
        }
    }

    render() {
        return (
            <IntlProvider
                locale={this.state.langState}
                messages={messages[this.state.langState]}
            >
                <BrowserRouter>
                    <div>
                        <MyNavBar userState={this.state.userState} callBackLangSwitcher={this.langSwitcher} />
                        <div className="app-container">
                            <div className={`${!this.state.showBreadCrumbs ? "breadcrumbs-container my-clear-fix" : "breadcrumbs-container"}`}>
                                {this.state.showBreadCrumbs && <Breadcrumbs />}
                                {this.state.copied.person !== null && <div className="relation-in-clip">
                                    <div>
                                        <Link to={`${this.state.copied.officer !== null ? "/search/officer/" + this.state.copied.officer.id + "/" + this.state.copied.person.id : "/search/person/" + this.state.copied.person.id}`} className={`my-relations-link`}>
                                            <FormattedMessage
                                                id="globals_label.copied_person"
                                                defaultMessage="*translation missing*"
                                            /><span>{this.state.copied !== null ? this.state.copied.person.surname + ", " + this.state.copied.person.givenName : ''}</span>
                                        </Link>
                                        <button
                                            onClick={() => this.clearCopied()}
                                            type="button"
                                            className="btn btn-sm bg-primary text-white ml-2">
                                            <FormattedMessage
                                                id="globals_btn.clear_copied"
                                                defaultMessage="*translation missing*"
                                            />
                                        </button>
                                    </div>
                                </div>}
                            </div>
                            <Card>
                                <CardBody>
                                    <Switch>
                                        {/* from search */}
                                        <Route exact path="/search/officer/:officer_id/:person_id/update/relations/relative/update/:relationId/:relativeId/:typeOfRelation" render={routeProps => <RelationUpdate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/search/officer/:officer_id/:person_id/update/promotion/:promoId" render={routeProps => <PromotionUpdate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/search/officer/:officer_id/:person_id/update/promotion" render={routeProps => <PromotionCreate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/search/officer/:officer_id/:person_id/update/relations" render={routeProps => <RelationCreate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/search/officer/:officer_id/:person_id/update" render={routeProps => <PersonUpdate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/search/officer/:officer_id/:person_id" render={routeProps => <OfficerDetail {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} copied={this.copied} />} />
                                        <Route exact path="/search/person/:person_id/update/relations/relative/update/:relationId/:relativeId/:typeOfRelation" render={routeProps => <RelationUpdate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/search/person/:person_id/update/relations" render={routeProps => <RelationCreate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/search/person/:person_id/update" render={routeProps => <PersonUpdate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/search/person/:person_id" render={routeProps => <PersonDetail {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} copied={this.copied} />} />

                                        {/* from admin */}
                                        <Route exact path='/system/user_search/user/:user_id/update' render={routeProps => <UserUpdate {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/system/user_search/user/:user_id" render={routeProps => <UserDetail {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/system/add_user" render={routeProps => <UserCreate {...routeProps} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/system/user_search" render={routeProps => <UserSearchFormComponent {...routeProps} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/system/add_content" render={routeProps => <PersonCreate {...routeProps} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/system/upload_file" render={routeProps => <UploadFile {...routeProps} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/system" render={() => <Redirect to={{ pathname: "/search" }} />} />

                                        {/* primary routes (primary navigation) */}
                                        <Route exact path="/search" render={routeProps => <SearchFormComponent {...routeProps} showBreadCrumbs={this.showBreadCrumbs} />} />
                                        <Route exact path="/officer_corps" render={routeProps => <OfficerCorpsSearchFormComponent {...routeProps} userState={this.state} showBreadCrumbs={this.showBreadCrumbs} />} />


                                        {/* log out of session */}
                                        <Route exact path='/' render={routeProps => <SignInFormComponent {...routeProps} callbackFromParent={this.myCallback} showBreadCrumbs={this.showBreadCrumbs} />} />
                                    </Switch>
                                </CardBody>
                                <br />
                            </Card>
                        </div>
                        <footer className="footer">
                            <div className="footer-container">
                                <div className="text-muted">Søofficersrullen - copyright 2017-2018</div>
                                <div className="text-muted"><a href="mailto:kontakt@soeofficersrullen.dk?Subject=soeofficersrullen.dk" target="_top">kontakt@soeofficersrullen.dk</a></div>
                            </div>
                        </footer>
                    </div>
                </BrowserRouter>
            </IntlProvider>
        )
    }
}


export default App