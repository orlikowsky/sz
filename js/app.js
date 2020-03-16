function setOtherCountries() {
    var urlOtherCountries = 'https://services9.arcgis.com/N9p5hsImWXAccRNI/ArcGIS/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/2/query?where=OBJECTID+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Country_region%2CConfirmed%2CDeaths%2CRecovered&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=Confirmed+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=false&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';


    $.get(urlOtherCountries, function (data) {
        let covidData = JSON.parse(data);
        appendData(covidData);
    });

}

function setPolishData() {
    var url = 'https://services1.arcgis.com/YmCK8KfESHdxUQgm/ArcGIS/rest/services/KoronawirusPolska_czas/FeatureServer/0/query?where=Potwierdzone+%3E+0&objectIds=&time=&resultType=none&outFields=Potwierdzone%2CWyleczone%2CSmiertelne&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=Potwierdzone+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=1&sqlFormat=none&f=pgeojson&token=';

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

        if (country === 'Poland') {
            return;
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

        if (country === 'China') {
            $('.china').append('<td>Chiny</td>');
            $('.china').append('<td>'+infected+'</td>');
            $('.china').append('<td class="tdCured">'+curedPercentage+' %</td>');
            $('.china').append('<td>'+cured+'</td>');
            $('.china').append('<td class="tdDeaths">'+deaths+'</td>');
        }

        if (country === 'Germany') {
            $('.germany').append('<td>Niemcy</td>');
            $('.germany').append('<td>'+infected+'</td>');
            $('.germany').append('<td class="tdCured">'+curedPercentage+' %</td>');
            $('.germany').append('<td>'+cured+'</td>');
            $('.germany').append('<td class="tdDeaths">'+deaths+'</td>');
        }

        if (country === 'Italy') {
            $('.italy').append('<td>Włochy</td>');
            $('.italy').append('<td>'+infected+'</td>');
            $('.italy').append('<td class="tdCured">'+curedPercentage+' %</td>');
            $('.italy').append('<td>'+cured+'</td>');
            $('.italy').append('<td class="tdDeaths">'+deaths+'</td>');
        }

        if (country === 'United Kingdom') {
            $('.uk').append('<td>Wielka Brytania</td>');
            $('.uk').append('<td>'+infected+'</td>');
            $('.uk').append('<td class="tdCured">'+curedPercentage+' %</td>');
            $('.uk').append('<td>'+cured+'</td>');
            $('.uk').append('<td class="tdDeaths">'+deaths+'</td>');
        }
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

    $('.poland').append('<td>Polska</td>');
    $('.poland').append('<td>'+infected+'</td>');
    $('.poland').append('<td class="tdCured">'+curedPercentage+'</td>');
    $('.poland').append('<td>'+cured+'</td>');
    $('.poland').append('<td class="tdDeaths">'+deaths+'</td>');

    createCanvas();
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

function createCanvas() {
    var element = $('.tableForCanvas'); // global variable
    var getCanvas; // global variable

    html2canvas(element, {
        onrendered: function (canvas) {
            $(".previewImage").append(canvas);
            getCanvas = canvas;
        }
    });


}

new Tablesort(document.getElementById('covidTable'));

$(document).ready(function () {
    checkVisited();
    setPolishData();
    setOtherCountries();
});

