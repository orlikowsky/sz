function setOtherCountries() {
    let urlOtherCountries = 'https://services9.arcgis.com/N9p5hsImWXAccRNI/ArcGIS/rest/services/Z7biAeD8PAkqgmWhxG2A/FeatureServer/2/query?where=OBJECTID+%3E+0&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=Country_region%2CConfirmed%2CDeaths%2CRecovered&returnGeometry=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=Confirmed+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=false&quantizationParameters=&sqlFormat=none&f=pgeojson&token=';

    $.get(urlOtherCountries, function (data) {
        let covidData = JSON.parse(data);

        let infected = covidData.features[0].properties.Confirmed;
        let deaths = covidData.features[0].properties.Deaths;
        let cured = covidData.features[0].properties.Recovered;
        let curedPercentage = parseFloat(cured*100/infected).toFixed(2);
        let deathsPercentage = parseFloat(deaths*100/infected).toFixed(2);

        covidData.features.forEach(function (value, index, array) {
            let country = value.properties.Country_Region;
            let infected = value.properties.Confirmed;
            let deaths = value.properties.Deaths;
            let cured = value.properties.Recovered;
            let curedPercentage = parseFloat(cured*100/infected).toFixed(2);
            let deathsPercentage = parseFloat(deaths*100/infected).toFixed(2);

            $('.otherCountries').append(
                '<tr>' +
                '   <td>'+country+'</td>' +
                '   <td>'+infected+'</td>' +
                '   <td>'+curedPercentage+' %</td>' +
                '   <td>'+cured+'</td>' +
                '   <td>'+deathsPercentage+' %</td>' +
                '   <td>'+deaths+'</td>' +
                '</tr>'
            );
        });
    });

}

function setPolishData() {
    let url = 'https://services1.arcgis.com/YmCK8KfESHdxUQgm/ArcGIS/rest/services/KoronawirusPolska_czas/FeatureServer/0/query?where=Potwierdzone+%3E+0&objectIds=&time=&resultType=none&outFields=Potwierdzone%2CWyleczone%2CSmiertelne&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnDistinctValues=false&cacheHint=false&orderByFields=Potwierdzone+desc&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=1&sqlFormat=none&f=pgeojson&token=';

    $.get(url, function (data) {
        let covidPolishData = JSON.parse(data);

        infectedPL = covidPolishData.features[0].properties.Potwierdzone;
        deathsPL = covidPolishData.features[0].properties.Smiertelne;
        curedPL = covidPolishData.features[0].properties.Wyleczone;
        curedPercentagePL = parseFloat(curedPL*100/infectedPL).toFixed(2);
        deathsPercentagePL = parseFloat(deathsPL*100/infectedPL).toFixed(2);

        $('#infected').append(infectedPL);
        $('#deaths').append(deathsPL);
        $('#deathsPercentage').append(deathsPercentagePL+' %');
        $('#cured').append(curedPL);
        $('#curedPercentage').append(curedPercentagePL+ ' %');
        scroll();
    });
}

function setMargins(){
    $('.number, .kraje').css('margin-top', $('.main-head').outerHeight());
}

function scroll(elemId = 'step1'){
    $([document.documentElement, document.body]).animate({
        scrollTop: $("#"+elemId).offset().top
    }, 1000);

    switch (elemId){
        case 'step1':
            var c = new CountUp("infected",0,infectedPL);
            break;
        case 'step2':
            var c = new CountUp("cured",0,curedPL);
            break;
        case 'step3':
            var c = new CountUp("deaths",0,deathsPL);
            break;
        default:
            return false;
    }

    c.start();
}

function setUpMenu(){
    $('.menu-bullet').click(function(e){
        e.preventDefault();
        var step = $(this).data('step');
        console.log(step);
        scroll('step'+step);
    });
}

$(document).ready(function () {
    setPolishData();
    setOtherCountries();
    setMargins();
    setUpMenu();
});