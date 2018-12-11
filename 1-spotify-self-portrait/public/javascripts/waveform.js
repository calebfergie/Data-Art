var songFileList = "../metadata/SongFileList-mp3-json.csv"
var songList;
var wave_json;
var node, x, max_val, y, bar_height;
var chartNo = 0;

var width = 880,
  height = 480;

d3.csv(songFileList, function(error, csv) {
  //for (i=0; i < csv.length; i++){console.log(csv[i].fileName)};
  for (i = 0; i < csv.length; i++) {
    addWaveform("../super-small-song-jsons/" + csv[i].fileName);
  };
});


function addWaveform(fileName) {
  d3.json(fileName, function(error, json) {
    console.log("adding json file: " + fileName);
    wave_json = json.data.slice(1, json.data.length);
    svg_render(wave_json, chartNo, ".waveform > .svg");
    chartNo++;
    console.log("added json file: " + fileName);
  })
};

function svg_render(data, chartNo, svg) {

  var node = d3.select(svg).append("svg")
    .attr("class", "chart" + chartNo)
    .attr("width", width)
    .attr("height", height)
    // .attr("margin-left", "40px")
    .style("position", "absolute")
    // .style("text-align", "center")

    // .style("left", svg.position)

    // make all songs the same "height" by changing this guy
  var x = d3.scale.linear().range([width, -width]);
  var max_val = d3.max(data, function(d) {
    return d;
  });
  x.domain([-max_val, max_val]);
  var y = d3.scale.linear().domain([0, data.length]);
  var bar_height = height / data.length;

  var chart = node.attr("width", width).attr("height", height);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g") // svg "group"
    .attr("transform", function(d, i) {
      return "translate(0," + i * bar_height + ")";
    });

  bar.append("rect")
    .attr("x", function(d) {
        var xv = (width - Math.abs(x(d) / 2) - width / 2 + 2);
      return xv;
    })
    .attr("height", bar_height)
    .attr("width", function(d) {
      return Math.abs(x(d));
    });

  // var axis = d3.svg.axis()
  //   .scale(y)
  //   .ticks(12)
  //   .orient("left");
  //
  // d3.select(".svg").append("svg")
  //   .attr("class", "axis")
  //   .attr("width", 60)
  //   .attr("height", height)
  //   .append("g")
  //   .attr("transform", "translate(" + (height/2) + ",40)")
  //   .call(axis);
}

// function d(s) {
//   console.log("log: " + s);
// }
