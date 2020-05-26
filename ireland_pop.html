<!-- Population data from: https://www.cso.ie/en/releasesandpublications/ep/p-rsdgi/regionalsdgsireland2017/nt/#indicatorTitle_175227 -->
<!DOCTYPE html>

<meta charset="utf-8">
<style>
    h1 {
        color: rgb(49, 163, 84);
    }

</style>

<head>
    <title>Ireland Map Assignment 10</title>
</head>

<body>
    <h1> Ireland's 2016 Population by Region </h1>

    <svg width="960" height="500"></svg>
    <script src="//d3js.org/d3.v5.min.js"></script>
    <script src="//d3js.org/topojson.v2.min.js"></script>
    <select id="options">
        <option value="o1">Population by County</option>
        <option value="o2">Third Level by County</option>
    </select>
    <script>
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

        // From: https://bost.ocks.org/mike/map/
        var projection = d3.geoAlbers()
            .center([0, 55.4])
            .rotate([4.4, 0])
            .parallels([50, 60])
            .scale(6000)
            .translate([width / 2, height / 2 - 250]);

        // Using quantile instead of quantize because Dublin/Total are outliers and skew the scale, quantile bins in a way that makes the number of items in each bin more even
        var color = d3.scaleQuantile()
            .range(d3.schemeYlGn[5]);

        var colorThird = d3.scaleQuantile()
            .range(d3.schemeOranges[5]);

        console.log("Color range for third level:", colorThird.range());

        var path = d3.geoPath()
            .projection(projection);

        var pop_dict_2016 = {};
        var for_scale = [];

        function addCommas(someString) {
            //console.log("Adding commas to", someString);
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
            //console.log("The string is now:", new_string);
            return new_string;
        }

        d3.csv("pop_2011_2016_updated.csv").then(function(data) {
            console.log("CSV data:", data);

            data.forEach(function(d) {
                pop_dict_2016[d.Region] = parseFloat(d.Pop_2016);
                for_scale.push(pop_dict_2016[d.Region]);
            });

            color.domain(for_scale);

            //Quantile takes in all possible values as the domain, note that the outliers are included
            console.log("2016 population color scale domain:", color.domain());
            console.log("2016 population color scale thresholds:", color.quantiles());
            console.log("Color scale threshold type:", typeof(color.quantiles()));
            
            legend_squares = legend.append("g");
            
            legend_squares.selectAll("rect").attr("class", "legend_squares")
                .data(color.range())
                .enter().append("rect")
                .attr("x", 5)
                .attr("y", function(d, i) {
                    return (20 * i + 5);
                })
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", function(d) {
                    console.log(d);
                    return d;
                });

            var thresholds = color.quantiles();
            thresholds.push(1000000);
            thresholds.forEach(function(d, i) {
                legend.append("text").attr("id", "legend_text")
                    .attr("x", 20)
                    .attr("y", (20 * i + 14))
                    .attr("fill", "grey")
                    .attr("text-anchor", "start")
                    .attr("font-size", 10)
                    .text(function(d) {
                        //console.log("d:", d);
                        if (i == 0) {
                            return "0 - " + Math.round(thresholds[i]);
                        } else if (i > 0 && i < thresholds.length - 1) {
                            return Math.round(thresholds[i - 1] + 1) + " - " + Math.round(thresholds[i]);
                        } else {
                            return ">= " + Math.round(thresholds[i - 1] + 1);
                        }
                    });
            });

            legend.append("text").attr("id", "legend_title")
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
        });

        console.log("pop_dict_2016:", pop_dict_2016);

        d3.json("geo_IRL_1.json").then(function(json) {
            console.log("Json file:", json);
            console.log("Features:", json.features);

            // Fix for fill not working was found on: https://stackoverflow.com/questions/54947126/geojson-map-with-d3-only-rendering-a-single-path-in-a-feature-collection
            var features = json.features;
            features.forEach(function(feature) {
                if (feature.geometry.type == "MultiPolygon") {
                    feature.geometry.coordinates.forEach(function(polygon) {
                        polygon.forEach(function(ring) {
                            ring.reverse();
                        })
                    })
                } else if (feature.geometry.type == "Polygon") {
                    feature.geometry.coordinates.forEach(function(ring) {
                        ring.reverse();
                    })
                }
            });

            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path").attr("id", function(d) {
                    return d.properties.NAME_1;
                })
                .attr("d", path)
                .style("fill", function(d) {
                    var county_name = d.properties.NAME_1;
                    var county_pop = pop_dict_2016[county_name];
                    console.log("The population of this", county_name, "in 2016 is:", county_pop);
                    return color(county_pop);
                })
                .style("stroke", "grey")
                .append("title").attr("id", function(d) {
                    return d.properties.NAME_1;
                })
                .text(function(d) {
                    var county_name = d.properties.NAME_1;
                    var pop_string = Math.round(pop_dict_2016[county_name] * 1000).toString();

                    return county_name + "'s 2016 Population: " + addCommas(pop_string);
                });
        });


        var third_level_dict = {};
        var third_level_scale = [];


        d3.csv("third_level_2016.csv").then(function(data) {
            console.log("CSV data:", data);

            data.forEach(function(d) {
                third_level_dict[d.County] = parseFloat(d.Total.replace(/,/g, ''));
                third_level_scale.push(parseFloat(d.Total.replace(/,/g, '')));
            });

            console.log("third level scale:", third_level_scale);
            colorThird.domain(third_level_scale);

            //Quantile takes in all possible values as the domain, note that the outliers are included
            console.log("2016 student color scale domain:", colorThird.domain());
            console.log("2016 student color scale thresholds:", colorThird.quantiles());
        });

        console.log("third_level_dict:", third_level_dict);

        function update_visuals(option, colorScale, dictionary) {
            console.log("Updating to", option);
            
            svg.selectAll("path")
                .datum(dictionary)
                .transition()
                .duration(1000)
                .style("fill", function(d) {
                    console.log("dictionary[" + this.id + "] is:", dictionary[this.id]);
                    return colorScale(dictionary[this.id]);
                })
                
             svg.selectAll("title")
                .datum(dictionary)
                .text(function(d) {
                    var county_name = this.id,
                        value_string 
                    if(option == "o1"){
                        value_string = Math.round(dictionary[county_name] * 1000).toString();
                        return county_name + "'s 2016 population: " + addCommas(value_string);
                    } else {
                        value_string = Math.round(dictionary[county_name]).toString();
                        return county_name + "'s 2016 third level students: " + addCommas(value_string);
                    }
                    
                    
                });
            
            legend_squares.selectAll("rect")
                .datum(colorScale.range())
                .attr("fill", function(d, i) {
                    console.log(d[i]);
                    return d[i];
                });
            
            var thresholds = colorScale.quantiles();
            thresholds.push(1000000);
            
            legend.selectAll("text").text(function(d, i){
                if(this.id == "legend_title"){
                    if(option == "o1") return "Population in '000s";
                    else return "Third Level Students";
                } else {
                    if (i == 0) {
                            return "0 - " + Math.round(thresholds[i]);
                        } else if (i > 0 && i < thresholds.length - 1) {
                            return Math.round(thresholds[i - 1] + 1) + " - " + Math.round(thresholds[i]);
                        } else {
                            return ">= " + addCommas((Math.round(thresholds[i - 1] + 1).toString()));
                        }
                }
            });
        }


        d3.select("#options").on("change", function(d) {
            console.log("Chaaaaaaaaaaaaaanging");
            selectedGroup = this.value;
            console.log("Selected group:", selectedGroup);
            if (selectedGroup == "o1") {
                console.log("Population 2016 selected");
                update_visuals(selectedGroup, color, pop_dict_2016);
            } else {
                console.log("other one");
                update_visuals(selectedGroup, colorThird, third_level_dict);
            }
        })


        //loadPopData();

    </script>
</body>
