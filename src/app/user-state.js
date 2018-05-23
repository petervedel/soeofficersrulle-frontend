const userState = () => {
    let userSession = (localStorage.getItem('userSession') != null && JSON.parse(localStorage.getItem('userSession')).userSession)

    const roleChecker = (roleToCheck) => {
        switch (roleToCheck) {
            case 'administrator':
                return {
                    isAdmin: true,
                    isContributer: false,
                    isPrivileged_read: false,
                    loggedIn: true,
                };

            case 'contributor':
                return {
                    isadmin: false,
                    isContributer: true,
                    isPrivileged_read: false,
                    loggedIn: true,
                };

            case 'privileged_read':
                return {
                    isAdmin: false,
                    isContributer: false,
                    isPrivileged_read: true,
                    loggedIn: true,
                };

            default:
                return {
                    isAdmin: false,
                    isContributer: false,
                    isPrivileged_read: false,
                    loggedIn: false,
                };
        }
    }
    if (typeof (userSession) === 'object') {
        if (userSession.id) {
            return roleChecker(userSession.role)
        } else {
            return roleChecker('default')
        }
    } else {
        return roleChecker('default')
    }
}

export default userState