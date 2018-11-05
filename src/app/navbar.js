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

    renderSystemMenu() {
        if ((this.state.userState !== null) && (this.state.userState.isAdmin === true || this.state.userState.isContributer === true)) {
            return (
                <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>
                        <FormattedMessage
                            id="globals_nav.system"
                            defaultMessage="*translation missing*"
                        />
                    </DropdownToggle>
                    <DropdownMenu right>
                        <DropdownItem>
                            <Link to="/system/add_content" className={`nav-link ${window.location.pathname.toString() === '/system/add_content' ? 'active' : ''}`}>
                                <FormattedMessage
                                    id="globals_nav.create"
                                    defaultMessage="*translation missing*"
                                />
                            </Link>
                        </DropdownItem>
                        {this.renderAdditionalOptions()}
                    </DropdownMenu>
                </UncontrolledDropdown>
            )
        } else {
            return (
                <span></span>
            )
        }
    }

    renderAdditionalOptions() {
        if (this.state.userState !== null && this.state.userState.isAdmin === true) {
            return (
                <span>
                    <DropdownItem>
                        <Link to="/system/upload_file" className={`nav-link ${window.location.pathname.toString() === '/system/upload_file' ? 'active' : ''}`}>
                            <FormattedMessage
                                id="system.file_upload_actions"
                                defaultMessage="*translation missing*"
                            />
                        </Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to="/system/add_user" className={`nav-link ${window.location.pathname.toString() === '/system/add_user' ? 'active' : ''}`}>
                            <FormattedMessage
                                id="system.create_user"
                                defaultMessage="*translation missing*"
                            />
                        </Link>
                    </DropdownItem>
                    <DropdownItem>
                        <Link to="/system/user_search" className={`nav-link ${window.location.pathname.toString() === '/system/user_search' ? 'active' : ''}`}>
                            <FormattedMessage
                                id="system.user_search"
                                defaultMessage="*translation missing*"
                            />
                        </Link>
                    </DropdownItem>
                </span>
            )
        } else {
            return (
                <span></span>
            )
        }
    }

    renderOfficerCorpsMenu() {
        return (
            <li className="nav-item">
                <Link to="/officer_corps" className={`nav-link ${window.location.pathname.toString() === '/officer_corps' ? 'active' : ''}`}>
                    <FormattedMessage
                        id="globals_nav.officer_corps"
                        defaultMessage="*translation missing*"
                    />
                </Link>
            </li>
        )
    }

    renderSignInOrOut() {
        if (this.state.userState !== null && this.state.userState.loggedIn === true) {
            return (
                <li className="nav-item">
                    <Link to="/" className="nav-link">
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
                    <Link to="/" className={`nav-link ${window.location.pathname.toString() === '/' ? 'active' : ''}`}>
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
            <Navbar expand="md" color="faded" light>
                <Link to="/search" className="navbar-brand"><img src="/logo.png" height="40" alt="" /> <span className="ml-2">Søofficersrullen</span></Link>
                <NavbarToggler onClick={this.toggle} />
                <Collapse isOpen={this.state.isOpen} navbar>
                    <Nav className="ml-auto" navbar>
                        <li className="nav-item">
                            <a href="http://soeofficer.landing.dev.nordkern.dk/" className="nav-link">
                                <FormattedMessage
                                    id="globals_label.home"
                                    defaultMessage="*translation missing*"
                                />
                            </a>
                        </li>
                        <li className="nav-item">
                            <Link to="/search" className={`nav-link ${window.location.pathname.toString() === '/search' ? 'active' : ''}`}>
                                <FormattedMessage
                                    id="globals_nav.search"
                                    defaultMessage="*translation missing*"
                                />
                            </Link>
                        </li>
                        {this.renderOfficerCorpsMenu()}
                        {this.renderSystemMenu()}
                        <UncontrolledDropdown nav inNavbar>
                            <DropdownToggle nav caret>
                                <FormattedMessage
                                    id="globals_nav.lang_switcher"
                                    defaultMessage="*translation missing*"
                                />
                            </DropdownToggle>
                            <DropdownMenu right>
                                <DropdownItem onClick={() => this.setLangPref('da')}>
                                    <div className={`nav-link ${langState().toString() === 'da' ? 'active' : ''}`}>
                                        Dansk
                                    </div>
                                </DropdownItem>
                                <DropdownItem onClick={() => this.setLangPref('en')}>
                                    <div className={`nav-link ${langState().toString() === 'en' ? 'active' : ''}`}>
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