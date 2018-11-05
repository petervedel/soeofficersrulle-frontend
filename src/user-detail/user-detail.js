import React, { Component } from 'react'
import { CardTitle } from 'reactstrap'
import { Link } from 'react-router-dom'
import { fetchUser } from '../_actions'
import userState from '../app/user-state'
import { FormattedMessage } from 'react-intl'

class UserDetail extends Component {

    constructor(props) {
        super(props)

        this.state = {
            userState: ''
        }

        this.props.showBreadCrumbs(true);
    }

    shouldComponentUpdate(nextProps) {
        return this.state.userState !== nextProps.userState;
    }

    componentDidMount() {
        if (!this.state.user) {
            fetchUser(this.props.match.params.user_id).then(response => {
                this.setState({
                    user: response.data
                })
                this.setState({
                    userState: userState()
                })
            })
        }
    }

    renderUserDetails() {
        const { user } = this.state

        if (!this.state.user) {
            return <div>
                <FormattedMessage
                    id="globals.loading"
                    defaultMessage="*translation missing*"
                />
            </div>
        }

        return (
            <div className="col-md-12 col-lg-8 col-lx-6 mb-4">
                <CardTitle>
                    <FormattedMessage
                        id="globals_label.user_details"
                        defaultMessage="*translation missing*"
                    />
                </CardTitle>
                <div className="d-flex mb-4">
                    {this.state.userState && (this.state.userState.isAdmin || this.state.userState.isContributer) &&
                        <Link to={`/system/user_search/user/${user.id}/update`} className="btn btn-sm btn-secondary">
                            <FormattedMessage
                                id="globals_btn.edit"
                                defaultMessage="*translation missing*"
                            />
                        </Link>}
                </div>
                <div className="row mb-5">
                    <div className="col">
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="user.username"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                        <div className="font-weight-bold">
                            <FormattedMessage
                                id="user.email"
                                defaultMessage="*translation missing*"
                            />
                        </div>
                    </div>
                    <div className="col-6 col-sm-6 col-md-8 col-lg-8 col-xl-10">
                        <div> {user.username}</div>
                        <div>{user.email}</div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            this.renderUserDetails()
        )
    }
}

export default UserDetail