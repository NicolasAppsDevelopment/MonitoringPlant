// You must include popup.js file in the page if you want to use this file

const API_IP_ADDRESS = "91.160.147.139";
const PHP_API_PORT = "38080";
const NODEJS_API_PORT = "32881";

/**
 * Sends a POST request to retrieve data from an URL address and the data retrieval depends on the settings.
 * @param {string} url Where the data are
 * @param {any} settings Data recovery settings
 * @param {boolean} retrieveJSON If true, the returned data will be in json format. If false, the returned data will be in Blob format.
 * @returns {(any|Blob|null)} Response from the location where the data are. Null if a communication error occurs, blob or json if the request is sent and received (even if the request is not successful the server reply a JSON error).
 */
async function post(url, settings, retrieveJSON = true) {
    try {
        const response = await fetch(url, {
            method: 'post',
            body: JSON.stringify(settings),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 200) {
            if (retrieveJSON) {
                let res = await response.json();
                if (res["success"]) {
                    if (res["data"] != undefined) {
                        return res["data"];
                    }
                    return res;
                } else {
                    displayError(res["error"]["title"], "La requête a retourné une erreur... " + res["error"]["message"]);
                }
            } else {
                let data = await response.blob();
                return data;
            }
        } else {
            let res = await response.json();
            displayError(res["error"]["title"], "La requête a retourné une erreur... " + res["error"]["message"]);
        }
    } catch (e) {
        displayError("Erreur d'émission/réception de la requête", "La requête vers l'adresse \"" + url + "\" n'a pas pu être émise/reçu correctement... " + e.toString());
    }

    return null;
}

/**
 * Sends a GET request to retrieve data from an url address.
 * @param {string} url Where the data are
 * @param {boolean} retrieveJSON If true, the returned data will be in json format. If false, the returned data will be a Blob object.
 * @returns {(any|Blob|null)} Response from the location where the data are. Null if a communication error occurs, blob or json if the request is sent and received (even if the request is not successful the server reply a JSON error).
 */
async function get(url, retrieveJSON = true) {
    try {
        const response = await fetch(url, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });
        if (response.status === 200) {
            if (retrieveJSON) {
                let res = await response.json();
                if (res["success"]) {
                    if (res["data"] != undefined) {
                        return res["data"];
                    }
                    return res;
                } else {
                    displayError(res["error"]["title"], "La requête a retourné une erreur... " + res["error"]["message"]);
                }
            } else {
                let data = await response.blob();
                return data;
            }
        } else {
            let res = await response.json();
            displayError(res["error"]["title"], "La requête a retourné une erreur... " + res["error"]["message"]);
        }
    } catch (e) {
        displayError("Erreur d'émission/réception de la requête", "La requête vers l'adresse \"" + url + "\" n'a pas pu être émise/reçu correctement... " + e.toString());
    }

    return null;
}

/**
 * Download a file from an url address linked to an URL (with POST settings if provided).
 * @param {string} filename Name of the file to download
 * @param {string} url Where the data are
 * @param {any} settings POST settings (if provided it will be a POST request, if not it will be a GET request)
 * @returns {boolean} True if the download has been launched, false in case of error
 */
async function downloadFile(filename, url, settings = null) {
    let data = null;
    if (settings == null) {
        data = await get(url, false);
    } else {
        data = await post(url, settings, false);
    }

    if (data != null) {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        return true;
    } else {
        return false;
    }
}

/**
 * Sends a request to retrieve JSON data from an url address linked to a php file and the data retrieval depends on the settings.
 * @param {string} url Where the data are
 * @param {any} settings Data recovery settings
 * @returns {(any|null)} Response from the location where the data are. Null if the request is not sent or not received at the url address, json if the request is sent and received. Json contains data from the url address.
 */
async function phpPost(url, settings) {
    return await post("http://" + API_IP_ADDRESS + ":" + PHP_API_PORT + "/" + url, settings);
}

/**
 * Sends a request to retrieve JSON data from an url address linked to a php file.
 * @param {string} url Where the data are
 * @returns {(any|null)} Response from the location where the data are. Null if the request is not sent or not received at the url address, json if the request is sent and received. Json contains data from the url address.
 */
async function phpGet(url) { 
    return await get("http://" + API_IP_ADDRESS + ":" + PHP_API_PORT + "/" + url);
}

/**
 * Sends a request to retrieve JSON data from an url address linked to a NodeJS WEB API path.
 * @param {string} url Where the data are
 * @param {boolean} retrieveJSON If true, the returned data will be in json format. If false, the returned data will be a Blob object.
 * @returns {(any|Blob|null)} Response from the location where the data are. Null if a communication error occurs, blob or json if the request is sent and received (even if the request is not successful the server reply a JSON error).
 */
async function nodeJsGet(url, retrieveJSON = true) { 
    return await get("http://" + API_IP_ADDRESS + ":" + NODEJS_API_PORT + "/" + url, retrieveJSON);
}

/**
 * Download a file from an url address linked to a php file.
 * @param {string} filename Name of the file to download
 * @param {string} url Where the data are
 * @param {any} settings POST settings (if provided it will be a POST request, if not it will be a GET request)
 * @returns {boolean} True if the download has been launched, false in case of error
 */
async function phpDownload(filename, url, settings = null) {
    return await downloadFile(filename, "http://" + API_IP_ADDRESS + ":" + PHP_API_PORT + "/" + url, settings);
}

/**
 * Download a file from an url address linked to a NodeJS WEB API path.
 * @param {string} filename Name of the file to download
 * @param {string} url Where the data are
 * @param {any} settings POST settings (if provided it will be a POST request, if not it will be a GET request)
 * @returns {boolean} True if the download has been launched, false in case of error
 */
async function nodeJsDownload(filename, url, settings = null) {
    return await downloadFile(filename, "http://" + API_IP_ADDRESS + ":" + NODEJS_API_PORT + "/" + url, settings);
}