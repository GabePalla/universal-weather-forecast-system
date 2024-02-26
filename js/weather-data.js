const solarDataBody = document.querySelector('[data-solar-data-body]');
const moonPhaseDataBody = document.querySelector('[data-moon-phase-data-body]')


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
}

displayDataGenerator();
