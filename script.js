function layOutDay(events) {
	// call reset() function to clear all elements
	reset();
	// create necessary dom elements
	var timeDom = document.getElementById('time');
	var eventDom = document.getElementById('event');
	var subEventDom = document.createElement('div');
	subEventDom.id = 'subEvent';
	eventDom.appendChild(subEventDom);
	fillTimeText(timeDom);
	checkOverlap(events);
	// create and place all events
	for (var i = 0; i < events.length; i++) {
		// create subEventSlot div
		var subEventSlot = document.createElement('div');
		subEventSlot.className = 'subEventSlot';
		// create boundary div and append to subEventSlot
		var boundary = document.createElement('div');
		boundary.className = 'boundary';
		subEventSlot.appendChild(boundary);
		// create divHolder div and append to subEventSlot
		var divHolder = document.createElement('div');
		divHolder.style.display = 'inline-block'
		subEventSlot.appendChild(divHolder);
		// create scheduledEvent div and append to divHolder
		var scheduledEvent = document.createElement('div');
		scheduledEvent.className = 'scheduledEvent';
		var eventText = document.createTextNode('Sample Item');
		scheduledEvent.appendChild(eventText);
		divHolder.appendChild(scheduledEvent);
		// create eventLocation span and append to divHolder
		var eventLocation = document.createElement('span');
		var locationText = document.createTextNode('sample location');
		eventLocation.className = 'eventLocation';
		eventLocation.appendChild(locationText);
		divHolder.append(eventLocation);
		// set position and width for each event
		subEventSlot.style.marginTop = events[i].start + 'px';
		var marginLeft = (events[i].inLevel - 1) * (600 / (events[i].overlap.size + 1)) + 10;
		if (events[i].inLevel > 1) {
			marginLeft++;
		}
		subEventSlot.style.marginLeft = marginLeft + 'px';
		subEventSlot.style.height = events[i].end - events[i].start + 'px';
		subEventSlot.style.width = (600 / (events[i].overlap.size + 1)) + 'px';
		subEventDom.append(subEventSlot);
	}
};

// clear all event's children element
function reset() {
	var eventDom = document.getElementById('event');
	var timeDom = document.getElementById('time');
	while (eventDom.firstChild) {
		eventDom.removeChild(eventDom.firstChild);
	}
	while (timeDom.firstChild) {
		timeDom.removeChild(timeDom.firstChild);
	}
}
// fill out the time axis
function fillTimeText(dom) {
	var startTime = 9;
	for (var i = 0; i <= 24; i++) {
		var timeSlot = document.createElement('div');
		var hour = startTime + Math.floor(i / 2);
		var minute = i % 2 === 0 ? '00' : '30';
		if (minute === '00') {
			if (hour < 12) {
				var timeText = document.createTextNode(hour + ':' + minute + ' AM')
			} else {
				if (hour > 12) {
					hour = hour % 12;
				}
				var timeText = document.createTextNode(hour + ':' + minute + ' PM')
			}
			timeSlot.className = 'timeSlotRound';
			timeSlot.appendChild(timeText);
			dom.append(timeSlot);
		} else {
			if (hour < 12) {
				var timeText = document.createTextNode(hour + ':' + minute);
			} else {
				if (hour > 12) {
					hour = hour % 12;
				}
				var timeText = document.createTextNode(hour + ':' + minute);
			}
			timeSlot.className = 'timeSlotHalf';
			timeSlot.appendChild(timeText);
			dom.append(timeSlot);
		}
	}
} 

function isOverlap(start, end) {
	return start < end ? true : false;
}

function checkOverlap(input) {
	// create an object that tracks level of each input object
	var levels = {};
	levels['1'] = [];
	// loop through each input object
	for (var i = 0; i < input.length; i++) {
		// add name to the object, add overlap property to the object
		var currentLevel = 1;
		input[i].name = 'event' + i;
		input[i].overlap = new Set();
		input[i].inLevel;
		// check the level object to see if there's overlap or not, start from level 1
		var finished = false;
		var conflictEvents = [];
		while (!finished) {
		  finished = true;
		  if (levels[currentLevel] === undefined) {
		  	levels[currentLevel] = [];
		  }
			var levelArray = levels[currentLevel];
			for (var j = 0; j < levelArray.length; j++) {
				if (isOverlap(input[i].start, levelArray[j].end)) {
				  conflictEvents.push(levelArray[j]);
				  input[i].overlap.add(currentLevel);
				  currentLevel++;
				  finished = false;
					break;
				}
			}
			if (finished) {
				input[i].inLevel = currentLevel;
				levelArray.push(input[i]);
				conflictEvents.forEach(function(event) {
					event.overlap.add(currentLevel);
				});
				var maxLevel = Object.keys(levels).length;
				if (currentLevel < maxLevel) {
					for (var k = currentLevel + 1; k < maxLevel + 1; k++) {
						levelArray = levels[k];
						for (var l = 0; l < levelArray.length; l++) {
							if (isOverlap(input[i].start, levelArray[l].end)) {
								input[i].overlap.add(k);
							}
						}
					}
				}
			}
		}	
	}
	return levels;
}
