import "./css/styles.css";
import layoutTemplate from "./hbs/layout.hbs";
import mapTemplate from "./hbs/map.hbs";


import module from "./js/module";


const appEl = document.getElementById("app");


const siteInfo = { title: "Sample WebPack+Handlebars Frontend" };
window.document.title = siteInfo.title;

appEl.innerHTML = layoutTemplate(siteInfo);
const contentEl = document.getElementById("content-pane");

contentEl.innerHTML = mapTemplate();


mapboxgl.accessToken = "pk.eyJ1IjoiamlhbGl4IiwiYSI6ImNsMmFmc3Z1NTA1MzQzanNpZ3NtZWJvdjMifQ.h2UspWbUGQ5xXEyw65_Elw";
let map;






let init = async function () {
    mapInit();

    document.getElementById("showMe").addEventListener("click", () => {
        if (map != null) {
            map.flyTo({ center: map.appSettings.user.position });
            map.appSettings.user.marker.togglePopup();
        }
    });
}

let mapInit = async function () {
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/jialix/cl2ai97y0002m15lmm9ageumu',
        center: [-75.765, 45.456],
        zoom: 13.5

    });
    map.appSettings = { user: { position: [0, 0] } };


    if ('permissions' in navigator) {

        let perm = await navigator.permissions.query({ name: 'geolocation' });
        console.log(perm);
        if (perm.state == "granted") {
            if ('geolocation' in navigator) {
                // geo
                navigator.geolocation.getCurrentPosition(function (position) {
                    let pos = position.coords;
                    console.log(pos.longitude, pos.latitude);

                    onLocateUser([pos.longitude, pos.latitude]);
                });

                // const locationWatch = navigator.geolocation.watchPosition((position) => {
                //     let pos = position.coords;
                //     map.setCenter([pos.longitude, pos.latitude]);
                // });
                //navigator.geolocation.clearWatch(locationWatch);

            } else {
                // no geo
                serverGeolocate();
            }
        } else {
            serverGeolocate();
        }
    } else {
        serverGeolocate();
    }


}


let serverGeolocate = async function () {
    let serverGeo = await (await fetch("http://localhost:3000/api/location")).json();
    //console.log(serverGeo);
    // map.setCenter([serverGeo.lng, serverGeo.lat]);
    onLocateUser([serverGeo.lng, serverGeo.lat]);
}


let onLocateUser = function (location) {
    map.appSettings.user.position = location;
    map.setCenter(location);
    console.log(location);
    map.appSettings.user.marker = new mapboxgl.Marker({ color: "#aa1acd" })
        .setLngLat(location)
        .setPopup(new mapboxgl.Popup().setHTML("<h1>Hello World!</h1>"))
        .addTo(map);
}
init();