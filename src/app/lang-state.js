const langState = () => {
    let langPref = (localStorage.getItem('langPref') !== null && JSON.parse(localStorage.getItem('langPref')))

    let setLocalStorage = (pref) => {
        localStorage.setItem(
            'langPref',
            JSON.stringify({
                pref
            })
        );
    }

    if (typeof (langPref) === 'object') {
        return langPref.pref
    } else {
        setLocalStorage('da')
        return 'da'
    }
}

export default langState