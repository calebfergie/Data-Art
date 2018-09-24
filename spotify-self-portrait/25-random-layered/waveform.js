var songFileList = "../metadata/newSongFileList.csv"
var songList;
var wave_json;
var node, x, max_val, y, bar_height;
var chartNo = 0;

var width = 880,
  height = 880;

d3.csv(songFileList, function(error, csv) {
  //for (i=0; i < csv.length; i++){console.log(csv[i].fileName)};
  for (i = 0; i < 1; i++) {
    console.log("adding json file: " + csv[i].fileName);
    addWaveform("../songs-json-files/" + csv[i].fileName);
  };
});


function addWaveform(fileName) {
  d3.json(fileName, function(error, json) {
    wave_json = json.data.slice(1, json.data.length);
    svg_render(wave_json, chartNo, ".waveform > .svg");
    chartNo = chartNo +1;
  })
};

function svg_render(data, chartNo, svg) {

  var node = d3.select(svg).append("svg")
    .attr("class", "chart" + chartNo)
    .attr("width", width)
    .attr("height", height)
    .style("position", "absolute")
    .style("top", "-150px");
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
      var xv = height - Math.abs(x(d) / 2) - height / 2 + 2;
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

function d(s) {
  console.log("log: " + s);
}
