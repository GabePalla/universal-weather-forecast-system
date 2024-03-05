const solarDataBody = document.querySelector('[data-solar-data-body]');
const moonPhaseDataBody = document.querySelector('[data-moon-phase-data-body]')
const generalDataBody = document.querySelector('[data-general-data-body]')


const solarDataMook = {
    "solarradiation": null,
    "solarenergy": 0,
    "uvindex": 10,
    "severerisk": 30,
    "sunrise": "06:03:48",
    "sunriseEpoch": 1707469428,
    "sunset": "19:17:53",
    "sunsetEpoch": 1707517073,
};

const moonPhaseDataMook = {
    "moonphase": 'Waxing crescent',
};

const GeneralDataMook = {
    "temp": "30",
    "conditions": "Rainy, Partially cloudy.",
    "description": "Similar temperatures continuing with a chance of rain tomorrow.Similar temperatures continuing with a chance of rain tomorrow.",
    "datetime": "04-02-2077",
    "latitude": "-28.7327",
    "longitude": "-51.7035",
    "name": "London, England, United Kingdom",
    "timezone": "Europe/London",
    "datetimeEpoch": 1709608620,
};

function dataGenerator(labelAndKeysList, requestResponse, htmlElement, dataUnit) {
    labelAndKeysList.forEach(element => {
        let dataElement = `
        <div>
            <label>${element.label}</label>
            <li>${requestResponse[element.key] === null || requestResponse[element.key] === 0 ? "-" : requestResponse[element.key]
            } ${requestResponse[element.key] === null || requestResponse[element.key] === 0 ? "" : element[dataUnit]
            }</li>
        </div> \n
        `;

        htmlElement.innerHTML = htmlElement.innerHTML.concat(dataElement);
    });
}

function generalDataGenerator(requestResponse, htmlElement, dataUnit, isCurrentConditions, locale) {

    const regexExp = new RegExp("[0-9]{2}:[0-9]{2}:[0-9]{2} [A-Za-z]+");
    const date = new Date(requestResponse['datetimeEpoch'] * 1000);
    
    let dataElement = `
        <div>
            <label>Temperature:</label>
            <li>${requestResponse['temp']} ${dataUnit === 'us' ? '°F' : '°C'}</li>
        </div>
        <div>
            <label>Conditions:</label>
            <li>${requestResponse['conditions']}</li>
        </div>
        <div>
            <label>Description:</label>
            <li>${requestResponse['description']}</li>
        </div>
        <div>
            <label>Date:</label>
            <li>${isCurrentConditions ? date.toUTCString().replace(regexExp, "") : requestResponse['datetime']}</li>
        </div>
        ${isCurrentConditions ? `
            <div>
                <label>Hour:</label>
                <li>${date.toLocaleTimeString(locale, {timeZone: requestResponse['timezone']})}</li>
            </div>
            ` : ''
        }
        <div>
            <label>Location:</label>
            <li>${requestResponse['name']}</li>
        </div>
        <div>
            <label>Latitude:</label>
            <li>${requestResponse['latitude']}</li>
        </div>
        <div>
            <label>Longitude:</label>
            <li>${requestResponse['longitude']}</li>
        </div>
    `;

    htmlElement.innerHTML = htmlElement.innerHTML.concat(dataElement);
}

async function getDataConfiguration() {
    try {
        const fetchReponse = await fetch('../conf/weather-data-config.json');
        return await fetchReponse.json();
    } catch (error) {
        throw new Error(error)
    }
}

async function displayDataGenerator() {
    const resultObject = await getDataConfiguration();
    dataGenerator(resultObject['solarData'], solarDataMook, solarDataBody, "metric");
    dataGenerator(resultObject['moonPhase'], moonPhaseDataMook, moonPhaseDataBody, "metric");
    generalDataGenerator(GeneralDataMook, generalDataBody, "metric", true, "pt-br");
}

displayDataGenerator();
