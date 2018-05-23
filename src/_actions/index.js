import axios from 'axios'
import { API_ROOT } from './api-config'

const auth = {
    username: 'test',
    password: 'YBNaKLms3HtaW2htwwYeRb8y'
}

const buildOfficerUpdateValues = (values, id, isOfficer) => {
    var officerValues = Object.assign({}, values)

    officerValues.person = {
        "id": officerValues.personId,
        "givenName": officerValues.givenName,
        "surname": officerValues.surname,
        "dateOfBirth": officerValues.dateOfBirth,
        "gender": officerValues.gender,
        "dateOfDeath": officerValues.dateOfDeath
    }
    delete officerValues.personId
    delete officerValues.givenName
    delete officerValues.surname
    delete officerValues.dateOfBirth
    delete officerValues.gender
    delete officerValues.dateOfDeath

    return officerValues
}

const buildPersonUpdateValues = (values) => {
    var personValues = Object.assign({}, values)

    delete personValues.appointedNumber
    delete personValues.appointedUntil
    delete personValues.dodabNumber
    delete personValues.terminationCause

    return personValues
}

const buildOfficerCreateValues = (values, person) => {
    var officerValues = Object.assign({}, values)
    delete officerValues.givenName
    delete officerValues.surname
    delete officerValues.dateOfBirth
    delete officerValues.gender
    delete officerValues.dateOfDeath

    officerValues.person = person.data
    return officerValues
}

const buildPersonCreateValues = (values) => {
    var personValues = Object.assign({}, values)
    delete personValues.appointedNumber
    delete personValues.appointedUntil
    delete personValues.dodabNumber
    delete personValues.terminationCause

    return personValues
}

// _____________________ GETs _____________________
export function fetchPersons() {
    return axios.get(`${API_ROOT}/person/all`, { auth })
}
export function fetchPerson(userId, callback) {
    return axios.get(`${API_ROOT}/person/${userId}`, { auth })
}
export function fetchRanks() {
    return axios.get(`${API_ROOT}/rank/all`, { auth })
}
export function fetchUser(userId, callback) {
    return axios.get(`${API_ROOT}/user/${userId}`, { auth })
}

export function fetchOfficer(officerId, isLoggedIn) {
    if (isLoggedIn) {
        return axios.get(`${API_ROOT}/officer/${officerId}`, { auth })
    } else {
        return axios.get(`${API_ROOT}/officer/${officerId}/limited`, { auth })
    }
}

// _____________________ POSTs _____________________
export function createPerson(values, callback) {
    if (values.isOfficer) {
        delete values.isOfficer
        return axios.post(`${API_ROOT}/person`, buildPersonCreateValues(values), { auth }).then((person) => {
            return axios.post(`${API_ROOT}/officer`, buildOfficerCreateValues(values, person), { auth })
        })
    } else {
        delete values.isOfficer
        return axios.post(`${API_ROOT}/person`, buildPersonCreateValues(values), { auth })
    }
}
export function verifyCredentials(values) {
    return axios.post(`${API_ROOT}/user/verify`, values, { auth })
}
export function fetchSearch(values, isLoggedIn) {
    if (values.isOfficer) {
        delete values.isOfficer
        if (isLoggedIn) {
            return axios.post(`${API_ROOT}/officer/search`, values, { auth })
        } else {
            return axios.post(`${API_ROOT}/officer/search/limited`, values, { auth })
        }
    } else {
        delete values.isOfficer
        return axios.post(`${API_ROOT}/person/search`, values, { auth })
    }
}
export function fetchUserSearch(values, callback) {
    return axios.post(`${API_ROOT}/user/search`, values, { auth })
}

export function createPromotion(values, id) {
    return axios.post(`${API_ROOT}/officer/${id}/promote`, values, { auth })
}

export function fetchActiveOfficers(values) {
    return axios.post(`${API_ROOT}/officer/activeOnDate`, values, { auth })
}

export function fetchPromotions(id) {
    return axios.get(`${API_ROOT}/officer/${id}/promotion/all`, { auth })
}
export function createUser(values) {
    return axios.post(`${API_ROOT}/user`, values, { auth })
}
export function uploadCSV(values) {
    return axios.post(`${API_ROOT}/person/upload`, values, { auth })
}

// _____________________ PUTs _____________________
export function updatePerson(values, id) {
    if (values.isOfficer) {
        delete values.isOfficer

        return axios.post(`${API_ROOT}/officer`, buildOfficerUpdateValues(values, id, false), { auth })
    } else {
        delete values.isOfficer
        return axios.put(`${API_ROOT}/person/${id}`, buildPersonUpdateValues(values), { auth })
    }
}

export function updateOfficer(values, id) {
    if (values.isOfficer) {
        delete values.isOfficer

        return axios.put(`${API_ROOT}/officer/${id}`, buildOfficerUpdateValues(values, id, true), { auth })
    }
}

export function updateUser(values, id) {
    return axios.put(`${API_ROOT}/user/${id}`, values, { auth })
}

export function updatePromotion(values, id) {
    return axios.put(`${API_ROOT}/promotion/${id}`, values, { auth })
}

// _____________________ DELETEs _____________________
export function deleteUser(id) {
    return axios.delete(`${API_ROOT}/user/${id}`, { auth })
}

export function deletePerson(id) {
    return axios.delete(`${API_ROOT}/person/${id}`, { auth })
}

export function deleteOfficer(id) {
    return axios.delete(`${API_ROOT}/officer/${id}`, { auth })
}

export function deletePromotion(id) {
    return axios.delete(`${API_ROOT}/promotion/${id}`, { auth })
}