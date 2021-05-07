/* Global Variables */
const APIKEY = '2da47c7089d7143df5e5f0f3c1302f9c';
const URLWEATHER = `https://api.openweathermap.org/data/2.5/weather`;

// Create a new date instance dynamically with JS
let d = new Date();
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
let newDate = d.toLocaleDateString("en-US", options)

// Gets data from API
async function getData(url, APIKEY, params) {
    url = url + '?' + params[0] + ',' + params[1] + '&appid=' + APIKEY + '&' + params[2];
    const response = await fetch(url);
    const weatherdata = await response.json();
    weatherdata.date = newDate;
    weatherdata.feelings = params[3];
    
    return weatherdata;
};

//Saves data on server
async function saveData(route, data){
    const response = await fetch(route, {
        method: 'POST',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        redirect: 'follow',
        body: JSON.stringify(data),
    });
    return response.json();
};

//Gets all data from server
async function getSavedData(route){
    const response = await fetch(route, {
        method: 'GET',
        mode: 'cors',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        redirect: 'follow',
    });
    return response.json();
};

//Renders weather cards from saved data on server
function previousData (data, destination){
    
    //Removes current cards on DOM
    const card = document.querySelector('.card-container');
    if (card) {
        card.remove();
    }
    
    //Creates card's container
    const cardContainter = document.createElement('div');
    cardContainter.classList.add('card-container');

    data['all_weather'].forEach(param => {
        //Creates card
        const weatherCard = document.createElement('div');
        weatherCard.classList.add('card');
    
        //Creates card title
        const title = document.createElement('div');
        title.classList.add('flex', 'card-title');

        const titleLeft = document.createElement('div');
        titleLeft.textContent = param.name;
        title.appendChild(titleLeft);

        const titleRight = document.createElement('div');
        titleRight.textContent = param.date;
        title.appendChild(titleRight);

        //Appends to card
        weatherCard.appendChild(title);

        //Creates Card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('flex', 'card-body');

        const temp = document.createElement('span');
        temp.textContent = `Temperature: ${param.temp_min} -- ${param.temp} -- ${param.temp_max}`;
        cardBody.appendChild(temp);

        const feelsLike = document.createElement('span');
        feelsLike.textContent = `Feels Like: ${param.feels_like}`;
        cardBody.appendChild(feelsLike);
        
        const humidity = document.createElement('span');
        humidity.textContent = `huminidty: ${param.humidity}%`;
        cardBody.appendChild(humidity);

        const windSpeed = document.createElement('span');
        windSpeed.textContent = `Wind Speed: ${param.wind_speed}Km/hr`;
        cardBody.appendChild(windSpeed);

        const description = document.createElement('span');
        description.textContent = param.description;
        cardBody.appendChild(description);

        const feelings = document.createElement('span');
        feelings.textContent = `I'm, feeling: ${param.feelings}`;
        cardBody.appendChild(feelings);

        //Appends to card
        weatherCard.appendChild(cardBody);

        //Appends to card container
        cardContainter.appendChild(weatherCard);
    });

    //Appends to entry container
    destination.appendChild(cardContainter);
};

//Generates Recent entries
const buttonGetData = document.getElementById('generate');
buttonGetData.addEventListener('click', () => {
    //Grabs zip code
    const zipCode = document.getElementById('zip').value;
    //Grabs feelings
    const feelings = document.getElementById('feelings').value;
    //Array of params
    const params = [`zip=${zipCode}`, 'us', 'units=metric', feelings];

    getData(URLWEATHER, APIKEY, params)
        .then(data => saveData('/create', data))
        //.then(response => console.log(response)) 
        .catch(error => console.error('Error:', error))
        .then(() => getSavedData('/all_data'))
        .then(entries => {
            const destination = document.getElementById('entryHolder');
            previousData (entries, destination);
        });
});