// Json earthquake data URl.
let equakeUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// d3 function to return data from URL
d3.json(equakeUrl).then(function (data) {
    
    createFeatures(data.features);
});

function createFeatures(equakeData) {

    // Function to for popups and features array
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>${feature.properties.place}<br>Magnitude: ${feature.properties.mag}</h3><hr><p>${new Date(feature.properties.time)}</p>`);
    }

    // Geojson layers that fill colors based on coordinates and level
    let equakes = L.geoJSON(equakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            let radius = feature.properties.mag * 5;
            if (feature.geometry.coordinates[2] > 90) {
                fillcolor = '#de2d26';
            }
            else if (feature.geometry.coordinates[2] >= 70) {
                fillcolor = '#fc9272';
            }
            else if (feature.geometry.coordinates[2] >= 50) {
                fillcolor = '#feb24c';
            }
            else if (feature.geometry.coordinates[2] >= 30) {
                fillcolor = '#ffeda0';
            }
            else if (feature.geometry.coordinates[2] >= 10) {
                fillcolor = '#addd8e';
            }
            else fillcolor = '#31a354';

            return L.circleMarker(latlng, {
                radius: radius,
                color: 'black',
                fillColor: fillcolor,
                fillOpacity: 1,
                weight: 1
            });
        }

    });

    // Create map
    createMap(equakes);
}

function createMap(equakes) {

    // Base tile layer
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // BaseMap
    let baseMaps = {
        "Street Map": street,
        "Topographic Map": topo
    };

    // Map overlay
    let overlayMaps = {
        Earthquakes: equakes
    };

    // Create our map with layers
    let myMap = L.map("map", {
        center: [
            37.09, -95.71
        ],
        zoom: 5,
        layers: [street, equakes]
    });

    // Layers control details
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    //Legend
    let legend = L.control({
        position: "bottomright"
    });

    
    legend.onAdd = function () {
        let div = L.DomUtil.create("div", "legend");

        let grades = [-10, 10, 30, 50, 70, 90];
        let colors = [
            "#31a354",
            "#addd8e",
            "#ffeda0",
            "#feb24c",
            "#fc9272",
            "#de2d26"
        ];

        // Loop through data
        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                "<i style= 'background: " + colors[i] + "'></i> " +
                grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "</br>" : "+");
        }
        return div;
    };

    
    legend.addTo(myMap);

}