import React from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap'

import { Link } from 'react-router-dom'
import userState from './user-state'
import langState from './lang-state'
import { FormattedMessage } from 'react-intl'


export default class MyNavBar extends React.Component {

    constructor(props) {
        super(props)
        this.toggle = this.toggle.bind(this)
        this.state = {
            isOpen: false,
            userState: userState(),
            langState: langState
        }
    }

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            userState: nextProps.userState
        });
    }

    renderAdminMenu() {
        if (this.state.userState !== null && this.state.userState.isAdmin === true) {
            return (
                <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                        <FormattedMessage
                            id="globals_nav.admin"
                            defaultMessage="*translation missing*"
                        />
                    </Link>
                </li>
            )
        } else {
            return (
                <li className="nav-item">
                </li>
            )
        }
    }

    renderAddMenu() {
        if (this.state.userState !== null && (this.state.userState.isAdmin === true || this.state.userState.isContributer === true)) {
            return (
                <li className="nav-item">
                    <Link to="/person/create" className="nav-link">
                        <FormattedMessage
                            id="globals_nav.create"
                            defaultMessage="*translation missing*"
                        />
                    </Link>
                </li>
            )
        } else {
            return (
                <li className="nav-item">
                </li>
            )
        }
    }

    renderOfficerCorpsMenu() {
        return (
            <li className="nav-item">
                <Link to="/officer/corps" className="nav-link">
                    <FormattedMessage
                        id="globals_nav.officer_corps"
                        defaultMessage="*translation missing*"
                    />
                </Link>
            </li>
        )
    }

    renderSignInOrOut() {
        const onLogout = () => {
            localStorage.removeItem('userSession')
            this.setState({
                userState: userState()
            });
        }
        if (this.state.userState !== null && this.state.userState.loggedIn === true) {
            return (
                <li className="nav-item">
                    <Link to="/" onClick={onLogout} className="nav-link">
                        <FormattedMessage
                            id="globals_label.log_out"
                            defaultMessage="*translation missing*"
                        />
                    </Link>
                </li>
            )
        } else {
            return (
                <li className="nav-item">
                    <Link to="/login" className="nav-link">
                        <FormattedMessage
                            id="globals_label.log_in"
                            defaultMessage="*translation missing*"
                        />
                    </Link>
                </li >
            )
        }
    }

    setLangPref = (pref) => {
        localStorage.setItem(
            'langPref',
            JSON.stringify({
                pref
            })
        );
        this.setState({
            langState: langState()
        })
        this.props.callBackLangSwitcher();
    }

    render() {
        return (
            <Navbar color="light" light expand="md">
                <Link to="/" className="navbar-brand">Den Digitale YX-rulle</Link>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <li className="nav-item">
                            <Link to="/" className="nav-link">
                                <FormattedMessage
                                    id="globals_nav.search"
                                    defaultMessage="*translation missing*"
                                />
                            </Link>
                        </li>
                        {this.renderOfficerCorpsMenu()}
                        {this.renderAddMenu()}
                        {this.renderAdminMenu()}
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                <FormattedMessage
                                    id="globals_nav.lang_switcher"
                                    defaultMessage="*translation missing*"
                                />
                            </DropdownToggle>
                            <DropdownMenu >
                                <DropdownItem onClick={() => this.setLangPref('da')}>
                                    <div className="nav-link">
                                        Dansk
                                    </div>
                                </DropdownItem>
                                <DropdownItem onClick={() => this.setLangPref('en')}>
                                    <div className="nav-link">
                                        English
                                    </div>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                        {this.renderSignInOrOut()}
                    </Nav>
                </Collapse>
            </Navbar>
        )
    }
}