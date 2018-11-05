import React from 'react'
import { NavLink } from 'react-router-dom'
import withBreadcrumbs from 'react-router-breadcrumbs-hoc'
import { injectIntl, FormattedMessage, intlShape } from 'react-intl'

// define custom breadcrumbs for routes
const routes = [
    {
        path: '/system/user_search/user/:user_id',
        breadcrumb:
            <FormattedMessage
                id="globals_label.user_details"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/system/user_search/user/:user_id/update',
        breadcrumb:
            <FormattedMessage
                id="globals_btn.edit"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/system/add_content',
        breadcrumb:
            <FormattedMessage
                id="person_create.title"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/system/upload_file',
        breadcrumb:
            <FormattedMessage
                id="system.file_upload_actions"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/system/add_user',
        breadcrumb:
            <FormattedMessage
                id="system.create_user"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/system/user_search',
        breadcrumb:
            <FormattedMessage
                id="user_detail.user_search"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/officer/:officer_id/:person_id/update/relations/relative/update/:relationId/:relativeId/:typeOfRelation',
        breadcrumb:
            <FormattedMessage
                id="globals_label.update_relations"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/officer/:officer_id/:person_id/update/relations',
        breadcrumb:
            <FormattedMessage
                id="globals_btn.relations"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/officer/:officer_id/:person_id/update/promotion/:promoId',
        breadcrumb:
            <FormattedMessage
                id="promotion_update.title"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/officer/:officer_id/:person_id/update/promotion',
        breadcrumb:
            <FormattedMessage
                id="globals_btn.promote"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/officer/:officer_id/:person_id/update',
        breadcrumb:
            <FormattedMessage
                id="globals_btn.edit"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/officer/:officer_id/:person_id',
        breadcrumb:
            <FormattedMessage
                id="globals_label.officer_details"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/person/:person_id/update/relations/relative/update/:relationId/:relativeId/:typeOfRelation',
        breadcrumb:
            <FormattedMessage
                id="globals_label.update_relations"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/person/:person_id/update/relations',
        breadcrumb:
            <FormattedMessage
                id="globals_btn.relations"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/person/:person_id/update',
        breadcrumb:
            <FormattedMessage
                id="person_update.update_person"
                defaultMessage="*translation missing*"
            />
    },
    {
        path: '/search/person/:person_id',
        breadcrumb:
            <FormattedMessage
                id="globals_label.person_details"
                defaultMessage="*translation missing*"
            />
    },

    {
        path: '/system',
        breadcrumb:
            <FormattedMessage
                id="globals_nav.system"
                defaultMessage="*translation missing*"
            />
    },  
    {
        path: '/search',
        breadcrumb:
            <FormattedMessage
                id="globals_label.search"
                defaultMessage="*translation missing*"
            />
    },



]



// map & render your breadcrumb components however you want.
// each `breadcrumb` has the props `key`, `location`, and `match` included!
const Breadcrumbs = ({ breadcrumbs }) => (
    <div id="myBreadcrumb">
        {breadcrumbs.map((breadcrumb, index) => (
            <span key={breadcrumb.key}>
                <NavLink to={breadcrumb.props.match.url}>
                    {breadcrumb}
                </NavLink>
                {(index < breadcrumbs.length - 1) && <i> / </i>}
            </span>
        ))}
    </div>
)




Breadcrumbs.propTypes = {
    intl: intlShape.isRequired
}

export default injectIntl(withBreadcrumbs(routes, { disableDefaults: true })(Breadcrumbs))
