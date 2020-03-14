function setOtherCountries() {
    var urlOtherCountries = 'https://services9.arcgis.com/N9p5hsImWXAccRNI/ArcGIS/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/2/query?where=OBJECTID+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Country_region%2CConfirmed%2CDeaths%2CRecovered&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=Confirmed+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=false&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';

    var cookieCovid = checkCookie();

    console.log(cookieCovid);

    if(cookieCovid !== false) {
        appendData(cookieCovid);
    }

    $.get(urlOtherCountries, function (data) {
        let covidData = JSON.parse(data);

        setCookie(covidData);
        appendData(covidData);
    });

}

function setPolishData() {
    var url = 'https://services1.arcgis.com/YmCK8KfESHdxUQgm/ArcGIS/rest/services/KoronawirusPolska_czas/FeatureServer/0/query?where=Potwierdzone+%3E+0&objectIds=&time=&resultType=none&outFields=Potwierdzone%2CWyleczone%2CSmiertelne&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=Potwierdzone+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=1&sqlFormat=none&f=pgeojson&token=';

    var cookieCovid = checkCookie('arcgisPolishData');

    if(cookieCovid !== false) {
        //appendData(cookieCovid);
    }

    $.get(url, function (data) {
        var covidPolishData = JSON.parse(data);

        setCookie(covidPolishData, 'arcgisPolishData')
        appendPolishData(covidPolishData);
    });
}

function appendData(covidData) {
    covidData.features.forEach(function (value, index, array) {
        let country = value.properties.Country_Region;
        let infected = value.properties.Confirmed;
        let deaths = value.properties.Deaths;
        let cured = value.properties.Recovered;
        let curedPercentage = parseFloat(cured*100/infected).toFixed(2);
        let deathsPercentage = parseFloat(deaths*100/infected).toFixed(2);

        $('.otherCountries').append(
            '<tr>' +
            '<td>'+country+'</td>' +
            '<td>'+infected+'</td>' +
            '<td>'+curedPercentage+' %</td>' +
            '<td>'+cured+'</td>' +
            '<td>'+deathsPercentage+' %</td>' +
            '<td>'+deaths+'</td>' +
            '</tr>'
        );
    });
}

function appendPolishData(covidPolishData) {
    let infected = covidPolishData.features[0].properties.Potwierdzone;
    let deaths = covidPolishData.features[0].properties.Smiertelne;
    let cured = covidPolishData.features[0].properties.Wyleczone;
    let curedPercentage = parseFloat(cured*100/infected).toFixed(2);
    let deathsPercentage = parseFloat(deaths*100/infected).toFixed(2);

    $('.infected').append(infected);
    $('.deaths').append(deaths);
    $('.deathsPercentage').append(deathsPercentage+' %');
    $('.cured').append(cured);
    $('.curedPercentage').append(curedPercentage+ ' %');
}

function setCookie(covidData, cookieName = 'arcgisData') {
    var date = new Date();
    var minutes = 10;
    date.setTime(date.getTime() + (minutes * 60 * 1000));

    $.cookie(cookieName, JSON.stringify(covidData), {expires: date});
}

function checkCookie(cookieName = 'arcgisData') {
    var cookie = $.cookie(cookieName);

    if(cookie !== undefined) {
        return JSON.parse(cookie);
    }
    return false;
}

function checkVisited() {
    var cookie = $.cookie('visited');

    if(cookie === undefined) {
        $('.modal-content').show();
    }
}

var setVisited = function () {
    $.cookie('visited', 'yes', {expires: 180});
    $('.modal-content').hide();
}

$(document).ready(function () {
    checkVisited();
    setPolishData();
    setOtherCountries();
    setCookie();
});