const solarDataBody = document.querySelector('[data-solar-data-body]');
const moonPhaseDataBody = document.querySelector('[data-moon-phase-data-body]');
const generalDataBody = document.querySelector('[data-general-data-body]');
const windDataBody = document.querySelector('[data-wind-data-body]');
const rainSnowDataBody = document.querySelector('[data-rain-snow-data-body]');
const environmentalDataBody = document.querySelector('[data-environmental-data-body]');


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

const generalDataMook = {
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

const windDataMook = {
    "windgust": 42.1,
    "windspeed": 18.4,
    "winddir": 200,
};

const rainSnowDataMook = {
    "precip": 0,
    "precipprob": 16.1,
    "precipcover": 0,
    "preciptype": "rain, snow",
    "snow": 0,
    "snowdepth": 0,
};

const environmentalDataMook = {
    "tempmax": 27.9,
    "tempmin": 10.9,
    "feelslikemax": 27.2,
    "feelslikemin": 10.9,
    "feelslike": 17.3,
    "dew": 11.6,
    "humidity": 73.4,
    "pressure": 1016.8,
    "cloudcover": 0.2,
    "visibility": 20.6,
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
                <li>${date.toLocaleTimeString(locale, { timeZone: requestResponse['timezone'] })}</li>
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

function windDataGenerator(requestResponse, htmlElement, dataUnit) {
    let dataElement = `
        <div>
            <label>Wind speed:</label>
            <li>${requestResponse['windspeed']} ${dataUnit === 'us' ? 'mph' : 'kph'}</li>
        </div>
        <div>
            <label>Wind direction:</label>
            <li>${requestResponse['winddir']}° ${windDirectionDesc(requestResponse['winddir'])}</li>
        </div>
        <div>
            <label>Wind gust:</label>
            <li>${requestResponse['windgust']} ${dataUnit === 'us' ? 'mph' : 'kph'}</li>
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

function windDirectionDesc(dir) {

    if (dir >= 340 && dir <= 360 || dir >= 0 && dir <= 20) {
        return "North";
    }

    if (dir > 20 && dir < 70) {
        return "North/East";
    }

    if (dir >= 70 && dir <= 110) {
        return "East";
    }

    if (dir > 110 && dir < 160) {
        return "South/East";
    }

    if (dir >= 160 && dir <= 200) {
        return "South";
    }

    if (dir > 200 && dir < 250) {
        return "South/West";
    }

    if (dir >= 250 && dir <= 290) {
        return "West";
    }

    if (dir > 290 && dir < 340) {
        return "North/West";
    }
}

async function displayDataGenerator() {
    const resultObject = await getDataConfiguration();
    dataGenerator(resultObject['solarData'], solarDataMook, solarDataBody, "metric");
    dataGenerator(resultObject['moonPhase'], moonPhaseDataMook, moonPhaseDataBody, "metric");
    dataGenerator(resultObject['rainSnowData'], rainSnowDataMook, rainSnowDataBody, "metric");
    dataGenerator(resultObject['environmentalData'], environmentalDataMook, environmentalDataBody, "metric");
    generalDataGenerator(generalDataMook, generalDataBody, "metric", true, "pt-br");
    windDataGenerator(windDataMook, windDataBody, "metric");
}

displayDataGenerator();
