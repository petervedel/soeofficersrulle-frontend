let backendHost;

const hostname = window.location.hostname;
function getDomainName(hostName) {
    return hostName.substring(hostName.lastIndexOf(".", hostName.lastIndexOf(".") - 1) + 1);
}

if (hostname.includes(".dev.")) {
    backendHost = 'http://api.soeofficer.dev.nordkern.dk';
} else if (hostname.includes(".stage.")) {
    backendHost = 'http://api.soeofficer.stage.nordkern.dk';
} else if (hostname.includes("localhost")) {
    backendHost = 'http://localhost:8081';
}

export const API_ROOT = `${backendHost}`;