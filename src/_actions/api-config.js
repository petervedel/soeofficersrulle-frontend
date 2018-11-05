let backendHost;

const hostname = window.location.hostname;

if (hostname.includes(".dev.")) {
    backendHost = 'http://api.soeofficer.dev.nordkern.dk';
} else if (hostname.includes(".stage.")) {
    backendHost = 'http://api.soeofficer.stage.nordkern.dk';
} else if (hostname.includes("localhost")) {
    backendHost = 'http://api.soeofficer.dev.nordkern.dk';
}

export const API_ROOT = `${backendHost}`;