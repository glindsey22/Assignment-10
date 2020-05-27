/*-------------------------------- SVG SETUP ----------------------------------*/

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg = svg.append("svg")
         .attr("width", width)
         .attr("height", height);

var legend_squares;

var legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(400, 100)");

/*------------------------------- COLOR SCALES --------------------------------*/

// Using quantile instead of quantize because Dublin/Total are outliers and skew the scale, quantile bins in a way that makes the number of items in each bin more even
var color = d3.scaleQuantile()
              .range(d3.schemeYlGn[5]); // These schemes returns a 5 element array representing five points in the interpolation between the colors, in this case yellow and green

var colorThird = d3.scaleQuantile()
                   .range(d3.schemeRdPu[5]);

var colorPercent = d3.scaleQuantile()
                     .range(d3.schemePuBuGn[5]);

/*----------------------------- CREATE PROJECTION -----------------------------*/

// I got this projection from: https://bost.ocks.org/mike/map/ and modified it slightly
// Creates the projection. The projection determines how the map is transformed / streched / scaled
var projection = d3.geoAlbers() // Typically used for the US because of its default values, but I am not using the default values
                   .center([0, 55.4]) // The projection's center in longitude/latitute (degrees)
                   .rotate([4.4, 0]) // Rotation is by the three axses, in this case we just rotate the longitude by 4.4 degrees
                   .parallels([50, 60]) // Set which parallels we are viewing between on the map (in latitudes (degrees))
                   .scale(6000) // Scale / Zoom in on Ireland (decreasing makes the map smaller)
                   .translate([width / 2, height / 2 - 250]); // Offsets the center coordinates

// d3.geoPath() generates the path that we will that we will append later by taking in a projection, which I defined above 
var path = d3.geoPath()
             .projection(projection);

/*---------------- FUNCTION FOR ADDING COMMAS TO NUMBER STRINGS ---------------*/

// Made this function so I can turn strings like "1000" into "1,000" etc.
function addCommas(someString) {
    var new_string = "";
    var counter = 1;
    for (var i = (someString.length - 1); i >= 0; i--) {
        if ((counter % 3) != 0 || i == 0) {
            new_string = someString.charAt(i) + new_string;
            counter++;
        } else {
            new_string = "," + someString.charAt(i) + new_string;
            counter++;
        }
    }
    return new_string;
}

/*---------------------------- LOAD POPULATION DATA ---------------------------*/

// Define a dictionary to store the population data in so we can use it later
var pop_dict_2016 = {};

d3.csv("pop_2011_2016_updated.csv").then(function (data) {
    
    console.log("CSV data:", data);

    // Fill the population dictionary
    data.forEach(function (d) {
        pop_dict_2016[d.Region] = parseFloat(d.Pop_2016);
    });
    
    // Quantile takes in all data values as the domain, note that the outliers are included
    // d3.values returns the values from the dictionary as an array that we can use as the color scale domain
    color.domain(d3.values(pop_dict_2016));
    console.log("2016 population color scale domain:", color.domain());
    console.log("2016 population color scale thresholds:", color.quantiles());
    
    // Draw the colored squares in the legend
    legend_squares = legend.append("g");
    legend_squares.selectAll("rect")
                  .data(color.range())
                  .enter()
                  .append("rect")
                  .attr("x", 5)
                  .attr("y", function (d, i) {
                      return (20 * i + 5);
                  })
                  .attr("width", 10)
                  .attr("height", 10)
                  .attr("fill", function (d) {
                      //console.log(d);
                      return d;
                  });
    
    // Add the text for the legend 
    var thresholds = color.quantiles(); // Returns the tresholds for each of the colors in the range
    thresholds.push(1000000); // Push an extra element to thresholds so that the length is 5 not 4
    legend.selectAll("text")
          .data(thresholds)
          .enter()
          .append("text")
          .attr("id", "legend_text")
          .attr("x", 20)
          .attr("y", function(d,i){return (20 * i + 14)})
          .attr("fill", "grey")
          .attr("text-anchor", "start")
          .attr("font-size", 10)
          .text(function (d, i) {
              //console.log("d:", d);
              if (i == 0) {
                  return "0 - " + Math.round(thresholds[i]);
              } else if (i > 0 && i < thresholds.length - 1) {
                  return Math.round(thresholds[i - 1] + 1) + " - " + Math.round(thresholds[i]);
              } else {
                  return ">= " + Math.round(thresholds[i - 1] + 1);
              }
          });

    legend.append("text")
          .attr("id", "legend_title")
          .attr("x", 75 / 2)
          .attr("y", -5)
          .attr("fill", "grey")
          .attr("text-anchor", "middle")
          .attr("font-size", 10)
          .text("Population in '000s");

    legend.append("rect")
          .attr("height", 100)
          .attr("width", 75)
          .attr("x", 0)
          .attr("y", 0)
          .attr("fill", "none")
          .attr("stroke", "grey");
    
    console.log("pop_dict_2016:", pop_dict_2016);
});

/*---------------------------- LOAD GEO DATA ----------------------------------*/

// JSON: JavaScript Object Notation (data as javascript objects)
// GeoJSON: JSON objects, best for storing geographical data 
// d3.json loads data using the same method that d3.csv does
// NOTE: this function does not necessarily finish executing before the code that follows it

d3.json("Ireland.json").then(function (json) {
    
    console.log("Json file:", json);
    console.log("Features:", json.features);

    // Fix for fill not working was found on: https://stackoverflow.com/questions/54947126/geojson-map-with-d3-only-rendering-a-single-path-in-a-feature-collection
    // From my understanding of the above stack overflow post, my polygons and multipolygons have coordinates the are made up of polygons that are made up of rings and these rings are [long, lat] but I need [lat, lon] in order to fill the paths properly
    // The code below iterates through the features and their polygons and reverses each ring
    var features = json.features;
    features.forEach(function (feature) {
        if (feature.geometry.type == "MultiPolygon") {
            feature.geometry.coordinates.forEach(function (polygon) {
                polygon.forEach(function (ring) {
                    ring.reverse();
                })
            })
        } else if (feature.geometry.type == "Polygon") {
            feature.geometry.coordinates.forEach(function (ring) {
                ring.reverse();
            })
        }
    });
    
    // Draw the map, pass in the features of the geoJSON file as the data
    // The path is the path generator we defined above, it takes the geoJSON data along with the projection data and returns the correct path string to draw each county
    svg.selectAll("path")
        .data(json.features)
        .enter()
        .append("path")
        .attr("id", function (d) {
            return d.properties.NAME_1;
        })
        .attr("d", path)
        .style("fill", function (d) {
            var county_name = d.properties.NAME_1;
            var county_pop = pop_dict_2016[county_name];
            console.log("The population of this", county_name, "in 2016 is:", county_pop);
            return color(county_pop);
        })
        .style("stroke", "grey")
        .append("title")
        .attr("id", function (d) {
            return d.properties.NAME_1;
        })
        .text(function (d) {
            var county_name = d.properties.NAME_1;
            var pop_string = Math.round(pop_dict_2016[county_name] * 1000).toString();

            return county_name + "'s population: " + addCommas(pop_string);
        });
});

/*------------------------ LOAD THIRD LEVEL DATA ------------------------------*/

var third_level_dict = {};
var percent_dict = {};

d3.csv("third_level_2016.csv").then(function (data) {
    console.log("CSV data:", data);

    data.forEach(function (d) {
        third_level_dict[d.County] = parseFloat(d.Total.replace(/,/g, ''));
    });
    
    // d3.values returns the values from the dictionary as an array that we can use as the color scale domain
    colorThird.domain(d3.values(third_level_dict));

    //Quantile takes in all possible values as the domain, note that the outliers are included
    console.log("2016 student color scale domain:", colorThird.domain());
    console.log("2016 student color scale thresholds:", colorThird.quantiles());
    
    console.log("third_level_dict:", third_level_dict);
});

/*--------------------------- UPDATE FUNCTION ---------------------------------*/

function update_visuals(option, colorScale, dictionary) {
    console.log("Updating to", option);

    if (option == "o1") {
        d3.select("#header")
          .transition()
          .duration(1000)
          .text("Ireland's 2016 Population by County")
          .style("color", colorScale.range()[3]);
    } else if (option == "o3") {
        d3.select("#header")
          .transition()
          .duration(1000)
          .text("Ireland's 2016/2017 Percent of County Population in Third Level")
          .style("color", colorScale.range()[3]);
        
        // Since d3.csv won't necessarily have been done running, we wait until the update function to population the percent dictionary
        // Fetch the keys from third_level_dict so we can use the county names
        console.log("Keys of third_level_dict:", d3.keys(third_level_dict));

        for (var i = 0; i < d3.keys(third_level_dict).length; i++) {
            var county = d3.keys(third_level_dict)[i];
            //console.log("County:", county);
            percent_dict[county] = +((third_level_dict[county] / (pop_dict_2016[county] * 1000)) * 100).toFixed(2);
        };

        colorScale.domain(d3.values(percent_dict));
        dictionary = percent_dict;
        console.log("Percent dictionary:", percent_dict);
    } else {
        d3.select("#header")
          .transition()
          .duration(1000)
          .text("Ireland's 2016/2017 Third Level (Higher Education) Students by County of Origin")
          .style("color", colorScale.range()[3]);
    }

    svg.selectAll("path")
        .datum(dictionary) // I use datum because I do not want to create new elements (datum does not perform a join), it passes the dictionary to every element as a whole. The main reason I used datum is because it worked and data did not
        .transition()
        .duration(1000)
        .style("fill", function (d) {
            //console.log("D:", d);
            //console.log("dictionary[" + this.id + "] is:", dictionary[this.id]);
            return colorScale(dictionary[this.id]);
        })

    svg.selectAll("title")
        .datum(dictionary)
        .text(function (d) {
            var county_name = this.id,
                value_string;
            if (option == "o1") {
                value_string = Math.round(dictionary[county_name] * 1000).toString();
                return county_name + "'s population: " + addCommas(value_string);
            } else if (option == "o3") {
                value_string = dictionary[county_name].toString();
                return county_name + "'s percent in third level: " + value_string;
            } else {
                value_string = Math.round(dictionary[county_name]).toString();
                return county_name + "'s third level students: " + addCommas(value_string);
            }


        });

    legend_squares.selectAll("rect")
        .datum(colorScale.range())
        .transition()
        .duration(1000)
        .attr("fill", function (d, i) {
            //console.log(d[i]); // Print this to see the colors, note that this shows d is the whole color range array
            return d[i];
        });
    
    // Thresholds retrieved the same as before
    var thresholds = colorScale.quantiles();
    thresholds.push(1000000);
    console.log("Thresholds:", thresholds);

    // Update the legend's text
    legend.selectAll("text").text(function (d, i) {
        if (this.id == "legend_title") {
            if (option == "o1") return "Population in '000s";
            else if (option == "o3") return "% Population in Third Level";
            else return "Third Level Students";
        } else {
            if (option != "o3") {
                if (i == 0) {
                    return "0 - " + Math.round(thresholds[i]);
                } else if (i > 0 && i < thresholds.length - 1) {
                    return Math.round(thresholds[i - 1] + 1) + " - " + Math.round(thresholds[i]);
                } else {
                    return ">= " + addCommas((Math.round(thresholds[i - 1] + 1).toString()));
                }
            } else {
                if (i == 0) {
                    return "0 - " + (thresholds[i]).toFixed(2);
                } else if (i > 0 && i < thresholds.length - 1) {
                    return (thresholds[i - 1] + 0.01).toFixed(2) + " - " + (thresholds[i]).toFixed(2);
                } else {
                    return ">= " + (thresholds[i - 1] + 0.01).toFixed(2);
                }
            }
        }
    });
}

/*--------------------------- SELECT FUNCTION ---------------------------------*/

// When options is changed, call the update function with appropriate parameters
d3.select("#options").on("change", function (d) {
    // this.value is the current value of the select element
    selectedGroup = this.value;
    console.log("Selected group:", selectedGroup);
    if (selectedGroup == "o1") {
        console.log("Population 2016 selected");
        update_visuals(selectedGroup, color, pop_dict_2016);
    } else if (selectedGroup == "o3") {
        console.log("Percent selected");
        update_visuals(selectedGroup, colorPercent, percent_dict);
    } else {
        console.log("Third level selected");
        update_visuals(selectedGroup, colorThird, third_level_dict);
    }
});
