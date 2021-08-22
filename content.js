chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
	if (msg.action == 'dataPlant') {
		const plant = JSON.parse(msg.data);

		setTimePlant(plant);
		sendResponse(true);
	}
	if (msg.action == 'dataMultiplePlants') {
		const plants = JSON.parse(msg.data);

		setTimePlants(plants);
		sendResponse(true);
	}

	sendResponse(false);
});

function setTimePlant(plant) {
	const waterInfo = plant.activeTools.find((tool) => tool.type === 'WATER');
	const waterEndTime = waterInfo.endTime;
	const dateEnds = new Date(waterEndTime);
	const dateNow = new Date();
	const formatted = dateEnds.getHours() + ':' + dateEnds.getMinutes() + ':' + dateEnds.getSeconds();

	if (document.getElementById('timerList')) document.getElementById('timerList').remove();

	var container = document.createElement('div');
	var time = document.createElement('div');
	var timeLeft = document.createElement('div');
	var title = document.createElement('div');

	container.style.backgroundColor = 'rgba(26,29,40,.3)';
	container.style.borderRadius = '24px';
	container.style.padding = '1rem 0.75rem';
	container.style.color = '#ffffff';
	container.style.fontSize = '20px';
	container.style.marginBottom = '1.5rem';
	container.id = 'timerList';

	title.style.fontWeight = '700';
	title.style.marginBottom = '20px';

	time.innerText = 'RESET TIME: ' + formatted;
	timeLeft.innerText = 'TIME LEFT: ' + ((dateEnds.getTime() - dateNow.getTime()) / 60000).toFixed(2) + ' min';
	title.innerHTML = 'Timers';
	title.className = 'active-tools-title';

	container.append(title);
	container.append(time);
	container.append(timeLeft);

	var checkExist = setInterval(function () {
		if (document.getElementsByClassName('xl:tw-col-span-4').length) {
			console.log('Exists!');
			document.getElementsByClassName('xl:tw-col-span-4')[0].prepend(container);
			clearInterval(checkExist);
		}
		console.log('memory leak');
	}, 500);

	setTimeout(() => {
		clearInterval(checkExist);
	}, 5000);
}

function setTimePlants(plants) {
	const classes =
		'tw-mt-0 sm:tw-mt-0 sm:tw-p-4 tw-grid tw-grid-cols-1 sm:tw-grid-cols-1 md:tw-grid-cols-1 lg:tw-grid-cols-2 xl:tw-grid-cols-3 tw-gap-3';
	let container = document.createElement('div');

	if (document.getElementById('timerList')) document.getElementById('timerList').remove();

	container.style.backgroundColor = 'rgba(26,29,40,.8)';
	container.style.borderRadius = '24px';
	container.style.padding = '2rem 1.5rem';
	container.style.color = '#ffffff';
	container.style.fontSize = '20px';
	container.style.marginBottom = '1rem';
	container.id = 'timerList';

	var elems = document.querySelectorAll('*');

	plants.forEach((plant) => {
		const waterInfo = plant.activeTools.find((tool) => tool.type === 'WATER');
		const waterEndTime = waterInfo.endTime;
		const dateEnds = new Date(waterEndTime);
		const dateNow = new Date();
		const formatted = dateEnds.getHours() + ':' + dateEnds.getMinutes() + ':' + dateEnds.getSeconds();

		const soon = dateEnds.getTime() - dateNow.getTime() < 600000;

		var time = document.createElement('div');

		time.innerText =
			(plant.plantId ? plant.plantId : plant._id) +
			' - ' +
			formatted +
			' LEFT: ' +
			((dateEnds.getTime() - dateNow.getTime()) / 60000).toFixed(2) +
			' min';

		console.log(time);
		if ((dateEnds.getTime() - dateNow.getTime()) / 60000 < 0) time.style.color = '#ff4444';

		if (soon) {
			if (plant.plantId) {
				let elementFound = Array.from(elems).find((elem) => elem.textContent == plant.plantId);
				elementFound.style.fontSize = '22px';
				elementFound.style.color = '#22ff22';
			}
			container.append(time);
		}
	});

	var checkExist = setInterval(function () {
		if (document.getElementsByClassName(classes).length) {
			console.log('Exists!');
			document.getElementsByClassName(classes)[0].prepend(container);
			clearInterval(checkExist);
		}
		console.log('memory leak');
	}, 500);

	setTimeout(() => {
		clearInterval(checkExist);
	}, 5000);
}
