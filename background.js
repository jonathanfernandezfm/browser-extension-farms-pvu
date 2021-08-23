let cache = {};

const urlToPlant = 'https://marketplace.plantvsundead.com/#/farm/';
const urlToServer = 'https://pvu-plants-tracker.herokuapp.com/add-plant';
// const urlToServer = 'http://localhost:4000/add-plant';

var filter = { urls: ['https://backend-farm.plantvsundead.com/farms/*'] };
var opt_extraInfoSpec = ['requestHeaders'];

chrome.webRequest.onBeforeSendHeaders.addListener(
	async (details) => {
		console.log('SNIFF', details);

		const url = details.url;
		if (details.initiator !== 'https://marketplace.plantvsundead.com') return;

		let data = checkCache(url);

		if (!data) {
			const json = await redoRequest(url, details);
			data = json.data;
			console.log('REQUEST', data);

			if (json.status !== 0) return;

			saveDatabase(data);
			setCache(url, data);
		} else {
			console.log('CACHED', data);
		}

		sendDataToClient(data, details);
	},
	filter,
	opt_extraInfoSpec
);

function sendDataPlant(data, details) {
	chrome.tabs.sendMessage(details.tabId, { action: 'dataPlant', data: JSON.stringify(data) }, function (response) {});
}

function sendDataMultiplePlants(data, details) {
	chrome.tabs.sendMessage(
		details.tabId,
		{ action: 'dataMultiplePlants', data: JSON.stringify(data) },
		function (response) {}
	);
}

async function redoRequest(url, details) {
	const headers = {};
	details.requestHeaders.forEach((header) => {
		headers[header.name] = header.value;
	});

	const response = await fetch(url, { headers });
	const json = await response.json();
	return json;
}

function checkCache(url) {
	const cached = cache[url];
	if (!cached) return;

	const timeNow = new Date().getTime();
	const timeCache = cached.time;

	if (timeNow - timeCache < 120000) return cached.data;
	else return;
}

function setCache(url, data) {
	cache[url] = { data, time: new Date().getTime() };
}

function sendDataToClient(data, details) {
	if (data.length) {
		// ARRAY OF PLANTS
		sendDataMultiplePlants(data, details);
		requestsDone = {};
	} else if (data.activeTools) {
		// INDIVIDUAL PLANT
		sendDataPlant(data, details);
		// outputTime(data);
	} else {
		// INDIVIDUAL PLANT DIFFERENT RESPONSE
		sendDataPlant(data.plant, details);
		// outputTime(data.plant);
	}
}

function saveDatabase(data) {
	if (data.length) {
	} else if (data.activeTools) {
		const waterInfo = data.activeTools.find((tool) => tool.type === 'WATER');

		const body = {
			url: urlToPlant + data._id,
			id: data.id,
			id_plant: data._id,
			time: waterInfo.endTime,
			coordinate_x: '0',
			coordinate_y: '0',
			image: '123',
		};

		console.log(body);

		fetch(urlToServer, { method: 'POST', body: JSON.stringify(body) })
			.then((res) => {
				console.log(res);
			})
			.catch((err) => console.log(err));
	} else {
		const waterInfo = data.plant.activeTools.find((tool) => tool.type === 'WATER');

		const body = {
			url: urlToPlant + data.plant._id,
			id: data.plant.id,
			id_plant: data.plant._id,
			time: waterInfo.endTime,
			coordinate_x: '0',
			coordinate_y: '0',
			image: '123',
		};

		fetch(urlToServer, { method: 'POST', body: JSON.stringify(body) })
			.then((res) => {
				console.log(res);
			})
			.catch((err) => console.log(err));
	}
}

function outputTime(plant) {
	const waterInfo = plant.activeTools.find((tool) => tool.type === 'WATER');
	const waterEndTime = waterInfo.endTime;
	const dateEnds = new Date(waterEndTime);
	const dateNow = new Date();
	const formatted = dateEnds.getHours() + ':' + dateEnds.getMinutes() + ':' + dateEnds.getSeconds();

	console.log(dateEnds.getTime() - dateNow.getTime() < 300000);
	console.log(formatted);
	if (dateEnds.getTime() - dateNow.getTime() < 300000) {
		// 5 minutes
		console.log('URL: ' + urlToPlant + plant.plantId);
		console.log('%c' + formatted, 'color:green');
	}
}
