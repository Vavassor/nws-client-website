---
layout: layouts/default
permalink: /getting-started/
title: "Getting Started"
---

# Getting Started

## Installation

NWS Client is available as an [NPM](https://www.npmjs.com/) package.

To install NWS Client, run the command for your package manager in your terminal.

### NPM

```bash
npm i @vavassor/nws-client
```

### PNPM

```bash
pnpm add @vavassor/nws-client
```

### Yarn

```bash
yarn add @vavassor/nws-client
```

## Examples

The following example is for web apps. The [examples GitHub repository](https://github.com/Vavassor/nws-client-examples) includes examples for more platforms and web frameworks.

## Get a forecast

Suppose we want to display the current temperature and a forecast summary.

First, latitude and longitude coordinates are needed to get a forecast.

For now, we'll skip this and use arbitrary coordinates. In your app, you may need to use another package or API to get the coordinates you need. For example, in a web browser you could use [Geolocation.getCurrentPosition](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition) to get the user's device location.

### Get coordinate metadata

Forecasts are divided into 2.5km grids. Each NWS office is responsible for a section of the grid.
  
We need to determine what section of the grid our coordinates are in.

```ts
const point = await getPointGeoJson({
  latitude: 37.5247764,
  longitude: -77.5633017,
});
```

### Forecast summary

We can then pass that information to get the forecast.

```ts
const forecast = await getGridpointForecastGeoJson({
  forecastOfficeId: point.properties.gridId,
  gridX: point.properties.gridX,
  gridY: point.properties.gridY,
});
```

The forecast includes time periods for several days ahead. Since the time periods are sorted chronologically, the current time period is the first one.

```ts
const currentPeriod = forecast.properties.periods[0];
```

We can then get a forecast summary, like "Partly Sunny", from the `shortForecast` property.

```ts
const forecastSummary = currentPeriod.shortForecast;
```

### Current temperature

Most data returned by the API is in the form of a `QuantitativeValue`. This includes both a numeric value and the unit.

To get the temperature, we use the `getQuantitativeValue` utility. The unit code `"[degF]"` signifies that if the API didn't give us a unit, we should assume it's in fahrenheit.

```ts
const temperatureValue = getQuantitativeValue(currentPeriod.temperature, "[degF]");
```

To print out the temperature with its units, we can use the [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) API.

However, `getQuantitativeValue` returns a unit code using the [Unified Code for Units of Measure](https://ucum.org/) (UCUM) standard. Intl.NumberFormat uses a different type of code which is defined in the ECMAScript standard. So we can use `getEcmaScriptCode` to get the desired unit code.

In this case, `temperatureValue.unit` would be `"[degF]"` (UCUM) and `ecmaScriptUnit` would be `"fahrenheit"`. (ECMAScript)

```ts
const ecmaScriptUnit = getEcmaScriptCode(temperatureValue.unit);
```

Finally, we can format the temperature.

```ts
const temperature = new Intl.NumberFormat("en-US").format({
  style: "unit",
  unit: ecmaScriptUnit,
});
```

### Full example

```ts
import {
  getEcmaScriptCode,
  getGridpointForecastGeoJson,
  getPointGeoJson,
  getQuantitativeValue
} from "@vavassor/nws-client";

const logCurrentTemperature = async () => {
  const point = await getPointGeoJson({
    latitude: 37.5247764,
    longitude: -77.5633017,
  });

  const forecast = await getGridpointForecastGeoJson({
    forecastOfficeId: point.properties.gridId,
    gridX: point.properties.gridX,
    gridY: point.properties.gridY,
  });

  const currentPeriod = forecast.properties.periods[0];
  
  const forecastSummary = currentPeriod.shortForecast;

  const temperatureValue = getQuantitativeValue(currentPeriod.temperature, "[degF]");

  const ecmaScriptUnit = getEcmaScriptCode(temperatureValue.unit);

  const temperature = new Intl.NumberFormat("en-US").format({
    style: "unit",
    unit: ecmaScriptUnit,
  });

  console.log(`Conditions: ${forecastSummary}`);
  console.log(`Temperature: ${temperature}`);
};

logCurrentTemperature();
```

Sample output

```bash
Conditions: Partly Sunny
Temperature: 46 °F
```
