const sheetId = "1d5pu4202nJhalDYrmrlgaLA7mPWKZ7At-tY0mYosRnk"
const apiKey = "AIzaSyAvQDVEvgVkEZJcuymHXUOtwlMz_kDtKQc";
const apiUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/moms-birthday:append?valueInputOption=RAW&key=${apiKey}`;

export function setBlessing(data) {
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            values: [
                [data.blesser, data.blessing]
            ]
        })
    })
        .then(response => response.json())
        .then(result => {
            console.log("Data successfully sent to Google Sheets:", result);
        })
        .catch(error => {
            console.error("Error sending data to Google Sheets:", error);
        });
}

export function setGuest(data) {
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            values: [
                [data.guest, data.isComing]
            ]
        })
    })
        .then(response => response.json())
        .then(result => {
            console.log("Data successfully sent to Google Sheets:", result);
        })
        .catch(error => {
            console.error("Error sending data to Google Sheets:", error);
        });
}

export function isGuestComing(data) {
    return fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(result => {
            console.log("Data successfully retrieved from Google Sheets:", result);

            const guest = result.values.find(item => item.guest === data.guest);

            if (guest) {
                return guest.isComming;
            } else {
                console.log(`${data.guest} not found in the guest list.`);
                return false;
            }
        })
        .catch(error => {
            console.error("Error retrieving data from Google Sheets:", error);
            return false;
        });
}

export function getData() {
    return fetch(apiUrl, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(result => {
            console.log("Data successfully retrieved from Google Sheets:", result);
            return result
        })
        .catch(error => {
            console.error("Error retrieving data from Google Sheets:", error);
            return false;
        });
}




