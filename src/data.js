/**
 * Load data from a file
 */
export const getData = path =>
    new Promise((resolve, reject) => {
        const xmlhttp = new XMLHttpRequest();
        xmlhttp.open('GET', path);
        xmlhttp.onreadystatechange = () => {
            if (xmlhttp.readyState === XMLHttpRequest.DONE && xmlhttp.status === 200)
                return resolve(JSON.parse(xmlhttp.responseText));
        };

        xmlhttp.send();
    });
