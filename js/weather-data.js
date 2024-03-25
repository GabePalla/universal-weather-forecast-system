const solarDataBody = document.querySelector('[data-solar-data-body]');
const moonPhaseDataBody = document.querySelector('[data-moon-phase-data-body]');
const generalDataBody = document.querySelector('[data-general-data-body]');
const windDataBody = document.querySelector('[data-wind-data-body]');
const rainSnowDataBody = document.querySelector('[data-rain-snow-data-body]');
const environmentalDataBody = document.querySelector('[data-environmental-data-body]');
const sourceDataBody = document.querySelector('[data-source-data-body]');
const stationsDataBody = document.querySelector('[data-stations-data-body]');

const viewPortHeight = window.innerHeight;

function dataGenerator(labelAndKeysList, requestResponse, htmlElement, dataUnit) {
    labelAndKeysList.forEach(element => {
        let dataElement = `
        <div>
            <label>${element.label}</label>
            <li>${apiResponseFieldValidation(requestResponse[element.key]) ? "-" : requestResponse[element.key]
            } ${apiResponseFieldValidation(requestResponse[element.key]) ? "" : element[dataUnit]
            }</li>
        </div> \n
        `;

        htmlElement.innerHTML = htmlElement.innerHTML.concat(dataElement);
    });
}

function generalDataGenerator(requestResponse, fullObject, htmlElement, dataUnit, locale, isCurrentConditions) {

    const regexExp = new RegExp("[0-9]{2}:[0-9]{2}:[0-9]{2} [A-Za-z]+");
    const date = new Date(requestResponse['datetimeEpoch'] * 1000);
    const description = descriptionFieldpreProcessingData(isCurrentConditions, requestResponse, fullObject);

    let dataElement = `
        <div>
            <label>Temperature:</label>
            <li>${apiResponseFieldValidation(requestResponse['temp']) ? '-' : requestResponse['temp']} ${dataUnit === 'us' ? '°F' : '°C'}</li>
        </div>
        <div>
            <label>Conditions:</label>
            <li>${apiResponseFieldValidation(requestResponse['conditions']) ? '-' : requestResponse['conditions']}</li>
        </div>
        <div>
            <label>Description:</label>
            <li>${apiResponseFieldValidation(description) ? '-' : description}</li>
        </div>
        <div>
            <label>Date:</label>
            <li>${date.toUTCString().replace(regexExp, "")}</li>
        </div>
        <div>
            <label>Hour:</label>
            <li>${date.toLocaleTimeString(locale, { timeZone: requestResponse['timezone'] })}</li>
        </div>
        <div>
            <label>Location:</label>
            <li>${apiResponseFieldValidation(fullObject['resolvedAddress']) ? '-' : fullObject['resolvedAddress']}</li>
        </div>
        <div>
            <label>Latitude:</label>
            <li>${apiResponseFieldValidation(fullObject['latitude']) ? '-' : fullObject['latitude']}</li>
        </div>
        <div>
            <label>Longitude:</label>
            <li>${apiResponseFieldValidation(fullObject['longitude']) ? '-' : fullObject['longitude']}</li>
        </div>
    `;

    htmlElement.innerHTML = htmlElement.innerHTML.concat(dataElement);
}

function windDataGenerator(requestResponse, htmlElement, dataUnit) {
    let dataElement = `
        <div>
            <label>Wind speed:</label>
            <li>${apiResponseFieldValidation(requestResponse['windspeed']) ? '-' : requestResponse['windspeed']} ${dataUnit === 'us' ? 'mph' : 'kph'}</li>
        </div>
        <div>
            <label>Wind direction:</label>
            <li>${apiResponseFieldValidation(requestResponse['winddir']) ? '-' : requestResponse['winddir']}° ${windDirectionDesc(requestResponse['winddir'])}</li>
        </div>
        <div>
            <label>Wind gust:</label>
            <li>${apiResponseFieldValidation(requestResponse['windgust']) ? '-' : requestResponse['windgust']} ${dataUnit === 'us' ? 'mph' : 'kph'}</li>
        </div>
    `;

    htmlElement.innerHTML = htmlElement.innerHTML.concat(dataElement);
}

function stationsDataGenerator(requestResponse, htmlElement) {
    Object.entries(requestResponse).forEach(([key, value]) => {
        let dataElement = `
        <tr>
            <td>${value.name}</td>
            <td>${value.id}</td>
            <td>${value.distance / 1000}km</td>
            <td>${value.latitude}</td>
            <td>${value.longitude}</td>
        </tr>
    `;
        htmlElement.innerHTML = htmlElement.innerHTML.concat(dataElement);
    })
}

function barChartGenerator(width, height, color, valueList) {
    const labelList = ["03:00:00", "06:00:00", "09:00:00", "12:00:00", "15:00:00", "18:00:00", "21:00:00"];
    const configuration = {
        width: width,
        height: height,
        baseHeight: height * 0.875,
        domain_y: {
            min: 0,
            max: 100
        },
        domain_x: {
            min: null,
            max: null
        },
        range_y: {
            min: 0,
            max: height - (height * 0.2)
        },
        range_x: {
            min: 1,
            max: width
        },
        font_size: height * 0.055
    };

    let scale_x = d3.scaleBand()
        .domain(valueList.map(resp => resp.datetime))
        .range([configuration.range_x.min, configuration.range_x.max]);

    let scale_y = d3.scaleLinear()
        .domain([configuration.domain_y.min, configuration.domain_y.max])
        .range([configuration.range_y.min, configuration.range_y.max]);

    let container = d3.select(".graph-one");

    container
        .append("svg")
        .attr("class", "graph-svg");

    let svg = d3.select(".graph-svg");

    svg
        .attr("width", configuration.width)
        .attr("height", configuration.height);

    svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", configuration.width)
        .attr("y2", 0)
        .attr("stroke", color)
        .attr("stroke-width", 2);

    // svg
    //     .append("line")
    //     .attr("x1", 0)
    //     .attr("y1", 0)
    //     .attr("x2", 0)
    //     .attr("y2", scale_y(configuration.domain_y.max) + (configuration.baseHeight - scale_y(configuration.domain_y.max)))
    //     .attr("stroke", color)
    //     .attr("stroke-width", 2);

    // svg
    //     .append("line")
    //     .attr("x1", configuration.width)
    //     .attr("y1", 0)
    //     .attr("x2", configuration.width)
    //     .attr("y2", scale_y(configuration.domain_y.max) + (configuration.baseHeight - scale_y(configuration.domain_y.max)))
    //     .attr("stroke", color)
    //     .attr("stroke-width", 2);

    svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", scale_y(configuration.domain_y.max) + (configuration.baseHeight - scale_y(configuration.domain_y.max)))
        .attr("x2", configuration.width)
        .attr("y2", scale_y(configuration.domain_y.max) + (configuration.baseHeight - scale_y(configuration.domain_y.max)))
        .attr("stroke", color)
        .attr("stroke-width", 2);

    svg
        .append("g")
        .attr("class", "graph-container");

    let graphContainer = d3.select(".graph-container");

    graphContainer
        .selectAll(".graph-bar-container")
        .data(valueList)
        .join("g")
        .attr("class", "graph-bar-container")
        .append("rect")
        .attr("fill", color)
        .attr("x", (d) => scale_x(d.datetime))
        .attr("y", (d) => (configuration.baseHeight) - scale_y(d.precipprob))
        .attr("width", scale_x.bandwidth() - 1)
        .attr("height", (d) => scale_y(d.precipprob));

    let graphBarContainer = d3.selectAll(".graph-bar-container");

    graphBarContainer
        .data(valueList)
        .append("text")
        .text(function (d) {
            return `${(d.precipprob).toFixed(0)}%`
        })
        .attr("class", "txt")
        .attr("fill", color)
        .attr("font-size", configuration.font_size)
        .attr('text-anchor', 'middle')
        .attr("x", (d) => scale_x(d.datetime) + (scale_x.bandwidth() / 2))
        .attr("y", (d) => (configuration.baseHeight - 2) - scale_y(d.precipprob));

    svg
        .append("g")
        .attr("class", "graph-time-container");

    let graphTimeContainer = d3.select(".graph-time-container");

    graphTimeContainer
        .selectAll("txt-time")
        .data(labelList)
        .join("text")
        .text(function (d) {
            return d
        })
        .attr("class", "txt-time")
        .attr("fill", color)
        .attr("font-size", configuration.font_size)
        .attr('text-anchor', 'middle')
        .attr("x", (d) => scale_x(d) + (scale_x.bandwidth() / 2))
        .attr("y", configuration.baseHeight + configuration.font_size);
}

async function getDataConfiguration() {
    try {
        const fetchReponse = await fetch('../conf/weather-data-config.json');
        return await fetchReponse.json();
    } catch (error) {
        throw new Error(error)
    }
}

async function getMockData() {
    const fetchReponse = await fetch('../mockdata.json');
    return await fetchReponse.json();
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

function preProcessingData(responseObject, isCurrentConditions) {
    if (isCurrentConditions) {
        return responseObject['currentConditions'];
    } else {
        return responseObject['days'][0];
    }
}

function apiResponseFieldValidation(field) {
    if (field === null || field === 0 || field === undefined) {
        return true;
    } else {
        return false;
    }
}

function descriptionFieldpreProcessingData(isCurrentConditions, requestResponse, fullObject) {
    if (isCurrentConditions) {
        return fullObject['description'];
    } else {
        return requestResponse['description'];
    }
}

async function displayDataGenerator(isCurrentConditions, dataUnit, locale) {
    const dataConfiguration = await getDataConfiguration();
    const apiResponse = await getMockData();

    const responseObject = preProcessingData(apiResponse, isCurrentConditions);

    dataGenerator(dataConfiguration['solarData'], responseObject, solarDataBody, dataUnit);
    dataGenerator(dataConfiguration['moonPhase'], responseObject, moonPhaseDataBody, dataUnit);
    dataGenerator(dataConfiguration['rainSnowData'], responseObject, rainSnowDataBody, dataUnit);
    dataGenerator(dataConfiguration['environmentalData'], responseObject, environmentalDataBody, dataUnit);
    dataGenerator(dataConfiguration['sourceDara'], responseObject, sourceDataBody, dataUnit);
    stationsDataGenerator(apiResponse['stations'], stationsDataBody)
    generalDataGenerator(responseObject, apiResponse, generalDataBody, dataUnit, locale, isCurrentConditions);
    windDataGenerator(responseObject, windDataBody, dataUnit);
    barChartGenerator(758, 206, "#2AFB97", responseObject['hours'])
}

displayDataGenerator(false, "metric", "pt-br");
