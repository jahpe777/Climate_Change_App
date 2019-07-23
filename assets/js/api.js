//click event for submit
function citySubmit() {
    $(".submit").click(function (event) {
        event.preventDefault();
        var city = 
        $('.tempTextContainer').empty()
        $(".loader-container").show()
        $(".tempModal").css("display", "flex");
        handleSubmitCity(latitude, longitude);
    });
    $(".close").click(function (event) {
        event.preventDefault();
        $(".tempModal").css("display", "none");
    });
}

//click event for markers
function latLngSubmit(marker) {
    google.maps.event.addListener(marker, "click", function (event) {
        var latitude = event.latLng.lat();
        var longitude = event.latLng.lng();
        console.log(latitude)
        console.log(longitude)
        $('.tempTextContainer').empty()
        $(".loader-container").show()
        $(".tempModal").css("display", "flex");
        handleSubmit(latitude, longitude);
    });
    $(".close").click(function (event) {
        event.preventDefault();
        $(".tempModal").css("display", "none");
    });
}


/*citySubmit();*/

//handle the search term 
function handleSubmitCity (city) {
    console.log('handling city submit')
    fetch(`https://app.climate.azavea.com/api/climate-data/${city}/RCP85?dataset=LOCA`, {
            headers: {
                Authorization: "token 8428d0e3ca7a3f5862681ad13cb428d7e6f77a9d"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            $(".loader-container").hide()
            displayData(data)
        })
        .catch(error => {
            console.log(error)
            alert('error fetching results')
        })
}


//get the lat, lng
function handleSubmit(lat, lng) {
    console.log('handling submit')
    fetch(`https://app.climate.azavea.com/api/climate-data/${lat}/${lng}/RCP85?dataset=LOCA&years=2019,2020,2030,2040,2050,2060,2070,2080,2090,2100`, {
            headers: {
                Authorization: "token 8428d0e3ca7a3f5862681ad13cb428d7e6f77a9d"
            }
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            $(".loader-container").hide()
            displayData(data)
        })
        .catch(error => {
            console.log(error)
            alert('error fetching results')
        })
}


function getCurrentDay() {
    let now = new Date();
    let start = new Date(now.getFullYear(), 0, 0);
    let diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    let oneDay = 1000 * 60 * 60 * 24;
    let day = Math.floor(diff / oneDay);
    return day
}    


function displayData(data) {
    let day = getCurrentDay()
    let htmlString = ""
    let keys = Object.keys(data.data)
    for (let key of keys) {
        htmlString += `<p>Temperature for ${key} | ${conversion(data.data[key].tasmax[day-1])}°F</p>`
    }
    $(".tempTextContainer").append(htmlString)
};


//kelvin to fahrenheit
function conversion(kelvin) {
    const celsius = kelvin -273;
    let fahrenheit = Math.floor(celsius * (9/5) + 32);
    return fahrenheit
};


/*function displayResults(responseJson) {
    console.log(responseJson);
    $("#js-results-list").empty();
      $("#js-results-list").append(
        <h3>${responseJson.data.tasmax}</h3>
      )}; */


function initMap() {
    var coordinates = {
        lat: cities[0].geometry.coordinates[1],
        lng: cities[0].geometry.coordinates[0]
    };
    var map = new google.maps.Map(
        document.getElementById("map"), {
            zoom: 3,
            center: coordinates
        });
    for (let city of cities) {
        //   console.log(city)
        var marker = new google.maps.Marker({
            position: {
                lat: city.geometry.coordinates[1],
                lng: city.geometry.coordinates[0]
            },
            map: map
        });
        //  pinClick(marker); // pass each marker to the pin click function to set the listener
        latLngSubmit(marker);
    }

    var marker = new google.maps.Marker({
        position: coordinates,
        map: map
    });
};


fetch(`https://app.climate.azavea.com/api/climate-data/${cities[0].geometry.coordinates[1]}/${cities[0].geometry.coordinates[0]}/RCP85?dataset=LOCA`, {
        headers: {
            Authorization: "token 8428d0e3ca7a3f5862681ad13cb428d7e6f77a9d"
        }
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log(data);
    });