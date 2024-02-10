const solarDataBody = document.querySelector('[data-solar-data-body]');

const jsonObj = {
    "solarradiation": null,
    "solarenergy": 0,
    "uvindex": 10,
    "severerisk": 30,
    "sunrise": "06:03:48",
    "sunriseEpoch": 1707469428,
    "sunset": "19:17:53",
    "sunsetEpoch": 1707517073,
};

const labelAndKeySolarDataValues = [
    {
        "label": "Solar Radiation:",
        "key": "solarradiation",
        "us": "W/m2",
        "metric": "W/m2",
        "uk": "W/m2"
    },
    {
        "label": "Solar Energy:",
        "key": "solarenergy",
        "us": "MJ/m2",
        "metric": "MJ/m2",
        "uk": "MJ/m2"
    },
    {
        "label": "UV index:",
        "key": "uvindex",
        "us": "",
        "metric": "",
        "uk": ""
    },
    {
        "label": "Severe Risk:",
        "key": "severerisk",
        "us": "",
        "metric": "",
        "uk": ""
    },
    {
        "label": "Sunrise hour:",
        "key": "sunrise",
        "us": "",
        "metric": "",
        "uk": ""
    },
    {
        "label": "Sunset hour:",
        "key": "sunset",
        "us": "",
        "metric": "",
        "uk": ""
    },
]


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

dataGenerator(labelAndKeySolarDataValues, jsonObj, solarDataBody, "metric");
