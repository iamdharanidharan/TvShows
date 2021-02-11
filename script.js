function getTvShows() {
    var query = document.getElementById('query').value;
    getShowByQuery(encodeURI(query));
};

async function getShowByQuery(query) {
    document.getElementById('results-container').innerText = '';

    try {
        var requestShow = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
        var responseJSON = await requestShow;
        var data = await responseJSON.json();
        buildContents(data);
    }
    catch (e) {
        console.log(e);
    }
}

function buildContents(shows) {

    var outputElement = document.getElementById('results-container');
    var resultRow = document.createElement('div');
    resultRow.setAttribute('class', 'row');

    for (obj in shows) {
        try {
            var colDiv = document.createElement('div');
            colDiv.setAttribute('class', 'col-lg-3 col-xl-3 col-md-3 col-sm-6 col-xs-12');

            var card = document.createElement('div');
            card.setAttribute('class', 'card d-inline');
            card.setAttribute('style', 'width: 18rem;');

            var img = document.createElement('img');
            img.setAttribute('class', 'card-img-top');

            if (shows[obj].show.image != null) {
                if (shows[obj].show.image.medium != null) {
                    img.setAttribute('src', shows[obj].show.image.medium);
                }
                else if (shows[obj].show.image.original != null) {
                    img.setAttribute('src', shows[obj].show.image.original);
                }
            }
            else {
                img.setAttribute('src', 'http://via.placeholder.com/210x295');
            }
            card.append(img);

            var cardBody = document.createElement('div');
            cardBody.setAttribute('class', 'card-body');
            var h5 = document.createElement('h5');
            h5.setAttribute('class', 'card-title');
            h5.innerText = shows[obj].show.name;
            cardBody.append(h5);

            if (shows[obj].show.summary != null) {
                var summaryText = shows[obj].show.summary;
                summaryText = summaryText.replace(/(<([^>]+)>)/ig, '');
                if (summaryText.length > 97) {
                    summaryText = summaryText.substring(0, 100);
                    var lastSpaceIndex = summaryText.lastIndexOf(' ');
                    summaryText = summaryText.substring(0, lastSpaceIndex);
                    summaryText += '&hellip;';
                }
                var summary = document.createElement('p');
                summary.setAttribute('class', 'card-text');
                summary.innerHTML = summaryText;
                cardBody.append(summary);
            }
            card.append(cardBody);

            cardBody = document.createElement('div');
            cardBody.setAttribute('class', 'card-body');

            var genres = document.createElement('div');
            var strong = document.createElement('strong');
            strong.innerText = 'Genres: ';
            var genresText = 'Not Available   ';
            if(shows[obj].show.genres.length !=0)
                genresText = '';
            for (x in shows[obj].show.genres) {
                genresText += shows[obj].show.genres[x] + ' | ';
            }
            genresText = genresText.substring(0,genresText.length-3);
            var txtNode = document.createTextNode(genresText);
            genres.append(strong, txtNode);
            cardBody.append(genres);

            var premiere = document.createElement('div');
            strong = document.createElement('strong');
            strong.innerText = 'Premiered On: ';
            var premiereText = 'Not available';
            if (shows[obj].show.premiered != null) {
                premiereText = shows[obj].show.premiered;
            }
            txtNode = document.createTextNode(premiereText);
            premiere.append(strong, txtNode);
            cardBody.append(premiere);

            var schedule = document.createElement('div');
            strong = document.createElement('strong');
            strong.innerText = 'Schedule: ';
            var scheduleText = 'Not running';
            if (shows[obj].show.schedule.time != '' || shows[obj].show.schedule.days.length != 0) {
                scheduleText = shows[obj].show.schedule.time + ' ';
                for (x in shows[obj].show.schedule.days) {
                    scheduleText += shows[obj].show.schedule.days[x] + ' ';
                }
            }

            txtNode = document.createTextNode(scheduleText);
            schedule.append(strong, txtNode);
            cardBody.append(schedule);

            var network = document.createElement('div');
            strong = document.createElement('strong');
            strong.innerText = 'Network: ';
            txtNode = document.createTextNode(shows[obj].show.network.name);
            network.append(strong, txtNode);
            cardBody.append(network);

            card.append(cardBody);
            colDiv.append(card);

            resultRow.append(colDiv);
        }
        catch (error) {
            console.log(error);
        }
    }
    if (shows.length == 0) {
        var notFound = document.createElement('p');
        notFound.className = 'col text-center';
        notFound.innerText = 'Oops!!';
        var small = document.createElement('small');
        small.className = 'col text-muted text-center';
        small.innerText = 'No records found. Try a different search!';
        notFound.append(small);
        resultRow.append(notFound);
    }
    outputElement.append(resultRow);
}

// Page container
var divContainer = document.createElement('div');
divContainer.setAttribute('class', 'container bg-light');

//Page Header Text (Jumbotron)
var jumbotron = document.createElement('div');
jumbotron.setAttribute('class', 'jumbotron');
var h1 = document.createElement('h1');
h1.setAttribute('class', 'display-4');
h1.innerHTML = 'TV Shows';
var p = document.createElement('p');
p.setAttribute('class', 'lead');
p.innerHTML = 'Search for your favourite TV shows. !!!Responsive Design!!!';
jumbotron.append(h1, p);

divContainer.append(jumbotron);


var rowDiv = document.createElement('div');
rowDiv.className = 'row justify-content-center align-items-center mb-3';

var divInputContainer = document.createElement('div');
divInputContainer.setAttribute('class', 'col-xl-4 col-lg-4 col-md-8 col-sm-8 col-12 m-1');

var divButtonContainer = document.createElement('div');
divButtonContainer.setAttribute('class', 'col-lg-2 col-xl-2 col-md-4 col-sm-4 col-12 m-1');

var inputBox = document.createElement('input');
inputBox.type = 'text';
inputBox.className = 'form-control';
inputBox.id = 'query';
inputBox.placeholder = 'TV Shows';
divInputContainer.append(inputBox);

var button = document.createElement('button');
button.className = 'btn btn-primary btn-block';
button.onclick = getTvShows;
button.innerText = 'Search';
divButtonContainer.append(button);

rowDiv.append(divInputContainer, divButtonContainer);
divContainer.append(rowDiv);

rowDiv = document.createElement('div');
rowDiv.className = 'row';

var resultsDiv = document.createElement('div');
resultsDiv.className = 'col';
resultsDiv.id = 'results-container';

rowDiv.append(resultsDiv);
divContainer.append(rowDiv);

document.body.append(divContainer);
