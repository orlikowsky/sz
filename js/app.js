function setOtherCountries() {
    var urlOtherCountries = 'https://services1.arcgis.com/0MSEUqKaxRlEPj5g/ArcGIS/rest/services/ncov_cases/FeatureServer/2/query?where=OBJECTID+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Country_Region%2CConfirmed%2CDeaths%2CRecovered&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=Confirmed+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';


    $.get(urlOtherCountries, function (data) {
        let covidData = JSON.parse(data);
        console.log(covidData);
        appendData(covidData);
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

        if (country === 'Poland') {
            $('.infected').append(infected);
            $('.deaths').append(deaths);
            $('.deathsPercentage').append(deathsPercentage+' %');
            $('.cured').append(cured);
            $('.curedPercentage').append(curedPercentage+ ' %');
        }

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

function checkVisited() {
    var cookie = $.cookie('visited');

    if(cookie === undefined) {
        $('.modal-content').show();
    }
}

var setVisited = function () {
    $.cookie('visited', 'yes', {expires: 180});
    $('.modal-content').hide();
};

if(window.location.pathname !== '/canvas.html') {
    new Tablesort(document.getElementById('covidTable'));
}

$(document).ready(function () {
    checkVisited();
    setOtherCountries();
});

