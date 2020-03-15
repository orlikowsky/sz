function setOtherCountries() {
    var urlOtherCountries = 'https://services9.arcgis.com/N9p5hsImWXAccRNI/ArcGIS/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/2/query?where=OBJECTID+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Country_region%2CConfirmed%2CDeaths%2CRecovered&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=Confirmed+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=false&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';


    $.get(urlOtherCountries, function (data) {
        let covidData = JSON.parse(data);
        appendData(covidData);
    });

}

function setPolishData() {
    var url = 'https://services9.arcgis.com/N9p5hsImWXAccRNI/ArcGIS/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/2//query?where=Country_Region+%3D+%27Poland%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Confirmed%2CDeaths%2CRecovered&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';

    $.get(url, function (data) {
        var covidPolishData = JSON.parse(data);

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
    let infected = covidPolishData.features[0].properties.Confirmed;
    let deaths = covidPolishData.features[0].properties.Deaths;
    let cured = covidPolishData.features[0].properties.Recovered;
    let curedPercentage = parseFloat(cured*100/infected).toFixed(2);
    let deathsPercentage = parseFloat(deaths*100/infected).toFixed(2);

    $('.infected').append(infected);
    $('.deaths').append(deaths);
    $('.deathsPercentage').append(deathsPercentage+' %');
    $('.cured').append(cured);
    $('.curedPercentage').append(curedPercentage+ ' %');
}

function setCookiePolish(covidData) {
    var date = new Date();
    var minutes = 10;
    date.setTime(date.getTime() + (minutes * 60 * 1000));

    $.cookie('arcgisPolishData', JSON.stringify(covidData), {expires: date});
}

function checkCookie(cookieName = 'arcgisData') {
    if($.cookie(cookieName) === undefined) {
        return false;
    }

    return JSON.parse($.cookie(cookieName));
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
});