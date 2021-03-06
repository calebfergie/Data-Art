//Created by calebfegie
//Thanks to the musixmatch team for developing a capable API and allowing me to call it
//Special thanks to this project for the correct ajax calls: https://codepen.io/brian_jenney/pen/dGKmyX

let lexicon = [["allArtists"]]; //full lexicon
let artistLexes = []; //artist specific lexicons
let lexStats = []; //stats about the lexicons

var colorWords = ["Amaranth", "Amber", "Amethyst", "Apricot", "Aquamarine", "Azure", "Baby blue", "Beige", "Black", "Blue", "Blue-green", "Blue-violet", "Blush", "Bronze", "Brown", "Burgundy", "Byzantium", "Carmine", "Cerise", "Cerulean", "Champagne", "Chartreuse green", "Chocolate", "Cobalt blue", "Coffee", "Copper", "Coral", "Crimson", "Cyan", "Desert sand", "Electric blue", "Emerald", "Erin", "Gold", "Gray", "Green", "Harlequin", "Indigo", "Ivory", "Jade", "Jungle green", "Lavender", "Lemon", "Lilac", "Lime", "Magenta", "Magenta rose", "Maroon", "Mauve", "Navy blue", "Ocher", "Olive", "Orange", "Orange-red", "Orchid", "Peach", "Pear", "Periwinkle", "Persian blue", "Pink", "Plum", "Prussian blue", "Puce", "Purple", "Raspberry", "Red", "Red-violet", "Rose", "Ruby", "Salmon", "Sangria", "Sapphire", "Scarlet", "Silver", "Slate gray", "Spring bud", "Spring green", "Tan", "Taupe", "Teal", "Turquoise", "Violet", "Viridian", "White", "Yellow"];

//function initated by search button
function searchArtist(artistQuery) {
  $.ajax({
    type: "GET",
    data: {
      apikey: "4b1d0a7217d69d1e460f71835255d50f",
      q_artist: artistQuery,
      format: "jsonp",
      // callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/artist.search",
    dataType: "jsonp",
    // jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  }).done(function(data) {
    console.log(data);
    let artistID = data.message.body.artist_list[0].artist.artist_id;
    let artistName = data.message.body.artist_list[0].artist.artist_name;
    console.log("search for " + artistQuery + " returned " + artistName);
    artistLexes.push([simpleName(artistName)]); //create a sub-array for the artist specifically
    lexStats.push([artistName, [0, 0, 0, 0]]); // create a line in a table of album, song, total word count, and unique wordCount
    $("#artistsSpotlight").append($("<div class=\"artistBox\" id=\"artistBox" + artistLexes.length + "\" artistName=" + simpleName(artistName) + "><container class=\"artistName\" id=name" + simpleName(artistName) + "></container><container class=\"artistPhoto\" id=photo" + simpleName(artistName) + "></container><container class=\"artistWordcount\" id=wordCount" + simpleName(artistName) + "></br></container><container class=\"artistLexicon\" id=lex" + simpleName(artistName) + "></container></div>"));
    $("#name" + simpleName(artistName)).append(artistName + "</br>");
    // console.log("searchArtist ran");
    getAlbums(artistID, artistLexes.length - 1);
  });
};

//triage of API calls - all albums, then all songs, then all lyrics
function getAlbums(artistID, lexPosition) {
  $.ajax({
    type: "GET",
    data: {
      apikey: "4b1d0a7217d69d1e460f71835255d50f",
      artist_id: artistID,
      format: "jsonp",
      // callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/artist.albums.get",
    dataType: "jsonp",
    // jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  }).done(function(data) {
    let albumList = data.message.body.album_list;
    lexStats[lexPosition][1][0] = lexStats[lexPosition][1][0] + 1; //add one to the album counter for this artist
    // console.log("getAlbums ran");
    for (i in albumList) {
      let albumID = albumList[i].album.album_id;
      getSongs(albumID, lexPosition);
    }
  });
};

function getSongs(albumID, lexPosition) {
  // http://api.musixmatch.com/ws/1.1/album.tracks.get?apikey=0980b0d4c04de99715efa813020dc6db&album_id=28578970
  $.ajax({
    type: "GET",
    data: {
      apikey: "4b1d0a7217d69d1e460f71835255d50f",
      album_id: albumID,
      format: "jsonp",
      // callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/album.tracks.get",
    dataType: "jsonp",
    // jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  }).done(function(data) {
    let trackList = data.message.body.track_list;
    lexStats[lexPosition][1][1] = lexStats[lexPosition][1][1] + 1; //add one to the song counter for this artist
    // console.log("getSongs ran");
    for (i in trackList) {
      let trackID = trackList[i].track.track_id
      getLyrics(trackID, lexPosition);
    }
  })
};

function getLyrics(trackID, lexPosition) {
  $.ajax({
    type: "GET",
    data: {
      apikey: "4b1d0a7217d69d1e460f71835255d50f",
      track_id: trackID,
      format: "jsonp",
      // callback: "jsonp_callback"
    },
    url: "https://api.musixmatch.com/ws/1.1/track.lyrics.get",
    dataType: "jsonp",
    // jsonpCallback: 'jsonp_callback',
    contentType: 'application/json',
    error: function(jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      console.log(textStatus);
      console.log(errorThrown);
    }
  }).done(function(data) {
    let lyrics = data.message.body.lyrics.lyrics_body; //get the full lyrics_body field from the api
    if (lyrics == undefined) {
      console.log("no lyrics for song " + data)
    } // if the lyrics are noth there/ready
    else {
      lyrics = lyrics.substr(0, lyrics.length - 74); //remove legalese in the beginning
      lyrics = lyrics.trim(); // remove excess spaces
      lyrics = lyrics.replace(/\n|\r/g, " "); // replace line breaks with spaces
      lyrics = lyrics.replace(/\?|\,|\.|\!|\(|\)/g, "") // replace punctuation with nothing - based on https://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex
      lyrics = lyrics.split(" "); // split the lyrics into an array by spaces
      //more ambitions: pluralization, pop/shift etc. javascript issues

      //finally check to see if it is a color word and add it to the lexicon if it is
      // console.log("getSongs ran");
      for (i in lyrics) {
        // console.log(colorWords.indexOf(upperCase(lyrics[i])));
        if (colorWords.indexOf(upperCase(lyrics[i])) >= 0) {
          console.log("found a color word: " + lyrics[i]);
          lexStats[lexPosition][1][2] = lexStats[lexPosition][1][2] + 1; //add one to the word/lyric counter
          lexicalize(lowerCase(lyrics[i]), lexPosition);
        }
      }
    }
  }).always(function() {
    // console.log("getLyrics ran");
    updateLexStats(lexStats);
  })
};

//COLOR MGMT


//DATA MGMT
//add word to lexicons
function lexicalize(word, lexPosition) {
  let wordTuple = lexicon[0].find(lexTuple => lexTuple[0] === word);
  if (wordTuple) {
    ++wordTuple[1];
  } else {
    wordTuple = [word, 1];
    lexicon[0].push(wordTuple);
    lexStats[lexPosition][1][3] = lexStats[lexPosition][1][3] + 1; //add one to the unique word/lyric counter
  }
  let artistWordTuple = artistLexes[lexPosition].find(lexTuple => lexTuple[0] === word);
  if (artistWordTuple) {
    ++artistWordTuple[1];
  } else {
    artistWordTuple = [word, 1];
    artistLexes[lexPosition].push(artistWordTuple);
  }
}
//lowercase - adapted from https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
function lowerCase(string) {
  return string.charAt(0).toLowerCase() + string.slice(1);
}

function upperCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

//dictionary sorting - adapted from https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript
function sortDictByFreq(dict, entries) {
  // Create topEntries array
  let topEntries = Object.keys(dict).map(function(key) {
    return [key, dict[key]];
  });

  // Sort the array based on the second element
  topEntries.sort(function(first, second) {
    return second[1] - first[1];
  });

  // Create a new array with only the 40 topEntries
  topEntries = topEntries.slice(0, entries);
  return topEntries;
};
//remove all weird items from artist name
function simpleName(name) {
  name = name.replace(/\ /g, "");
  name = name.replace(/\?|\,|\.|\!|\(|\)/g, "");
  return name;
}
//updates the wordcount shown on the screen
function updateLexStats(lexStats) {
  let totalWords = 0;
  for (i in lexStats) {
    let elementName = "#wordCount" + simpleName(lexStats[i][0]);
    $(elementName).html("");
    $(elementName).append(lexStats[i][1][2] + " words in lexicon<br/>")
    totalWords = totalWords + lexStats[i][1][2]
    $("#wordCountAllartists").html("");
    $("#wordCountAllartists").append(totalWords + " total words in lexicon");
  }
}

// D3 stuff
function showAnalysis(dataSet, domElement, topX) {
  let startPos = 1;                                     // the first element in the dataset is the artist name, so skip over dataset[0]
  let shortList = dataSet.sort((a, b) => b[1] - a[1]);  // sort the values large to small
  let valuesList = [];                                  // make temporary lists to feed into D3 (values, labels, numberlabelss)
  let labelsList = [];
  let numberLabelsList = [];
  for (let i = startPos; i < shortList.length; i++) {
    valuesList.push(shortList[i][1]);
    numberLabelsList.push(shortList[i][1] + " times");
    //labelsList.push(shortList[i][0]+" ("+shortList[i][1]+")");
    labelsList.push(shortList[i][0]);
  }

  var wordSum = d3.sum(shortList.slice(1),function(d){return d[1]});
  d3.select(".bigSVG").selectAll("*").remove(); //remove previous rects on the big canvas

  //make the canvas and draw the data
  var svg = d3.select("#" + domElement).append("svg")
    .attr("height", "100%")
    .attr("width", "100%")
    .attr("id", domElement + "svg")

  svg.selectAll("rect")
    .data(shortList.slice(1))
    .enter().append("rect")
    .attr("height", "15")
    .attr("width", function(d) {
      return d[1]/wordSum * 100;
    }) //will need to adjust for size of dataset
    .attr("fill", d => d[0])
    .attr("x", "100")
    .attr("y", function(d, i) {
      return (i * 20) + 15
    });

  svg.selectAll("text")
    .data(labelsList)
    .enter().append("text")
    .attr("id", "wordLabel")
    .text(function(d) {
      return d
    })
    .attr("x", "0")
    .attr("y", function(d, i) {
      return (i * 20) + 23
    });

  svg.selectAll("dataLabel")
    .data(numberLabelsList)
    .enter().append("text")
    .attr("id", "dataLabel")
    .text(function(d) {
      return d
    })
    .attr("x", "102")
    .attr("y", function(d, i) {
      return (i * 20) + 27
    });

  var bigSVG = d3.select('#backgroundGraph')
    .append('svg') // create an <svg> element
    .attr('width', "100%")
    .attr('height', "100%")
    // .attr("preserveAspectRatio", "xMinYMin meet") // set its dimentions
    // .attr("viewBox", "0 0 960 500")
    .attr('class', 'bigSVG')

  var rects = bigSVG.selectAll('rect').data(shortList.slice(1));
  var newRects = rects.enter();

  var sumValue = d3.sum(shortList.slice(1), function(d, i) {
    return d[1];
  });

  var maxCount = d3.max(shortList.slice(1), function(d, i) {
    return d[1];
  });

  var canvasWidth = parseInt(d3.select('#backgroundGraph').style("width"))
  var x = d3.scaleLinear()
    .range([0, canvasWidth])
    .domain([0, maxCount]);

  let rectSumPart2 = 0;
  newRects.append('rect')
    .attr('x', (data) => {
      const oldValue = rectSumPart2;
      const width = data[1] / sumValue * canvasWidth;
      rectSumPart2 += width;
      return oldValue;
    })
    .attr('y', 0)
    .attr('height', 1000)
    .attr('width', function(d, i) {
      return x(d[1]);
    })
    .attr('fill', (d) => d[0]);
}

//PAGE INTERACTION
//Search button
$(function() {
  var form = $('#artistSearch'); // Get the form
  // Set up an event listeners for the forms and buttons
  $(form).submit(function(event) {
    event.preventDefault(); // Stop the browser from submitting the form.
    let searchedArtist = $("#artist").serialize().substr(7, $("#artist").serialize().length);
    if ($('#artistBox0').length == 0) { // if the "all arists" box is not there, make one.
      $("#artistsSpotlight").append($("<div class=\"artistBox\" id=\"artistBox0\" artistName=\"allArtists\">All artists<container class=\"artistName\" id=\"nameallArtists\"></container><container class=\"artistPhoto\" id=\"photoallArtists\"></container><container class=\"artistWordcount\" id=\"wordCountallArtists\"></br></container><container class=\"artistLexicon\" id=\"lexallArtists\">"));
    };
    searchArtist(searchedArtist);
  })
})

// mouseover and clicking of artist boxes
$("#artistsSpotlight").on("mouseover", '.artistBox', function() {
    $(this).addClass("highlight"); // highlight on mouseover
  })
  .on("mouseleave", '.artistBox', function() {
    $(this).removeClass("highlight"); // un-highlight on mouseover
  })
  .on("click", '.artistBox', function() { //when its clicked...
    console.log("clicked on " + $(this).attr('artistName'));

    //toggle the freq chart
    let artistBox = $(this).attr('id');
    if ($("#" + artistBox + "svg").length == 0) { //if nothing is there, make a chart
      if ($(this).attr('artistName') == "allArtists") // if its the all artist box, use the lexicon
      {
        showAnalysis(lexicon[0], artistBox, 10)
      } else {
        for (i in artistLexes) { //otherwise use the artists lexicon
          if (artistLexes[i][0] == $(this).attr('artistName')) {
            showAnalysis(artistLexes[i], artistBox, lexStats[i][1][3] + 1);
          }
        }
      }
    } else {
      d3.select("#" + artistBox + "svg").remove();
    } // remove a chart (toggle) if there was one alredy
  })
