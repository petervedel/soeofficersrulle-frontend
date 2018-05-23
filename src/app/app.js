import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
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
import PersonSearchFormComponent from '../person-search/person-search'
import SignInFormComponent from '../login/login'
import UserSearchFormComponent from '../user-search/user-search'
import OfficerSearchFormComponent from '../officer-search/officer-search'
import UserCreate from '../user-create/user-create'
import UserUpdate from '../user-update/user-update'
import PromotionCreate from '../promotion-create/promotion-create'
import PromotionUpdate from '../promotion-update/promotion-update'
import UserDetail from '../user-detail/user-detail'
import AdminDashBoard from '../admin/admin'
import userState from './user-state'
import langState from './lang-state'
import messages from './messages'
import { IntlProvider } from 'react-intl'
import 'babel-polyfill';

class App extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            userState: userState(),
            langState: langState()
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
                            <Card>
                                <CardBody>
                                    <Switch>
                                        {/*   NOTE that Route's with longest paths should be top most,
                                            this is because Switch uses match and not exact */}

                                        <Route exact path="/dashboard" component={AdminDashBoard} />

                                        <Route exact path='/login' render={
                                            routeProps => <SignInFormComponent {...routeProps} callbackFromParent={this.myCallback} />}
                                        />

                                        <Route exact path="/user/create" component={UserCreate} />
                                        <Route exact path="/user/search" component={UserSearchFormComponent} />
                                        <Route path="/officer/:id/promotion/:promoId/update" component={PromotionUpdate} />
                                        <Route path="/officer/:id/promotion" component={PromotionCreate} />
                                        <Route exact path="/officer/corps" component={OfficerSearchFormComponent} />

                                        <Route path='/user/:id/update' render={
                                            routeProps => <UserUpdate {...routeProps} userState={this.state} />}
                                        />

                                        <Route path="/user/:id" render={
                                            routeProps => <UserDetail {...routeProps} userState={this.state} />}
                                        />
                                        <Route path="/:type/create" component={PersonCreate} />
                                        <Route path="/:type/:id/update" component={PersonUpdate} />
                                        <Route path="/:type/:id" render={
                                            routeProps => <PersonDetail {...routeProps} userState={this.state} />}
                                        />

                                        <Route exact path="/" component={PersonSearchFormComponent} />
                                    </Switch>
                                </CardBody>
                                <br />
                            </Card>
                        </div>
                    </div>
                </BrowserRouter>
            </IntlProvider>
        )
    }
}

export default App