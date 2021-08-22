let getDataButton = document.getElementById('getData');

getDataButton.addEventListener('click', async () => {
	let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

	chrome.scripting.executeScript({
		target: { tabId: tab.id },
		function: reddenPage,
	});
});

function reddenPage() {
	var container = document.createElement('div');
	var time = document.createElement('div');
	var timeLeft = document.createElement('div');

	container.style.backgroundColor = 'rgba(26,29,40,.3)';
	container.style.borderRadius = '24px';
	container.style.padding = '2rem 1.5rem';
	container.style.color = '#ffffff';
	container.style.fontSize = '20px';

	time.innerText = 'RESET TIME: ';
	timeLeft.innerText = 'TIME LEFT: ';

	container.append(time);
	container.append(timeLeft);
	document.getElementsByClassName('xl:tw-col-span-4')[0].prepend(container);
}
