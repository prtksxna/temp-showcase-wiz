document.addEventListener('DOMContentLoaded', function() {
  var input = document.getElementById('input');
  var output = document.getElementById('output');

  // Remove styling from text
  input.addEventListener('paste', function (e) {
    e.preventDefault();
    var text = e.clipboardData.getData("text/plain");
    document.execCommand("insertHTML", false, text);
  });

  input.addEventListener('keyup', function () {
    getInfo(input.innerText);
    return false;
  });

  getInfo(input.innerText);
});

renderInfo = function (info) {
  var output = document.getElementById('output');
  var entities = document.getElementById('entities');
  var wordFreq = document.getElementById('word-freq');
  var sentimentTable = document.getElementById('sentiment-table');

  // Marked up
  output.innerHTML = info.taggedText;

  // Entitiy list
  entities.innerHTML = '';
  info.entities.forEach( function (e) {
    entities.innerHTML += '<li class="' + e.type + '">' + e.value + '</li>';
  } );

  // Document info
  document.getElementById('sentences-stat').innerHTML = info.documentInfo.sentences;
  document.getElementById('words-stat').innerHTML = info.documentInfo.words;
  document.getElementById('tokens-stat').innerHTML = info.documentInfo.tokens;

  // Word frequency
  wordFreq.innerHTML = ''
  info.wordFreq.forEach(function (f) {
    wordFreq.innerHTML += '<tr>' +
      '<td>' + f[0] + '</td>' +
      '<td>' + f[1] + '</td>' +
      '</tr>';
  })

  // Sentiment
  sentimentTable.innerHTML = '';
  info.sentiments.forEach(function (s) {
    sentimentTable.innerHTML += '<tr>' +
      '<td class="sentence-emoji">' + getSentimentEmoji(s.sentiment) + '</td>' +
      '<td class="sentence-text">' + s.sentence + '</td>' +
      '<td>' + s.sentiment + '</td>' +
      '</tr>';
  })
}

getSentimentEmoji = function (s) {
  if( s > 1 ) return '😃';
  if( s > 0 ) return '😊';
  if( s < -1 ) return '😢';
  if( s < 0 ) return '☹️';
  if( s === 0 ) return '😶';
}

getInfo = function (v) {
  fetch(
    'https://showcase-serverless.herokuapp.com/pos-tagger',
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({sentence: v})
    })
    .then(function (res) {
      return res.json();
    }).then(function (info) {
      renderInfo(info);
    })
  return;
}
