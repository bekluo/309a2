var game_area = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 400;
		this.canvas.height = 600;
		this.context = this.canvas.getContext("2d");
		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.interval = setInterval(update_game_area, 20);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
// bug objects
var bugs = [];
// vegetable coordinates
var food = [];
var paused = false;
var time = 60;
var score = 0;
var delay = 0;

function start_game() {
	game_area.start();
	game_area.canvas.addEventListener('click', bug_click, false);

	//setInterval()
	//while (1) {
		bug1 = new bug("orange", 30, 30);
		bug2 = new bug("black", 50, 50);
		bug3 = new bug("red", 100, 50);
		bugs.push(bug1);
	//}
	for (i = 0; i < 5; i++) {
		make_food();
	}
	var interval = setInterval(time_countdown, 1000);
	//draw_pause_button();
	//console.log(food);
	//console.log(bugs);
}

function update_game_area() {
	game_area.clear();
	draw_pause_button();
	draw_countdown();
	if (bugs.length > 0) {
		for (i = 0; i < bugs.length; i++) {
			var time = 60;
			bugs[i].y += 1;
			bugs[i].x += 2;
			bugs[i].update();
		}	
	}
	if (food.length > 0) {
		for (i = 0; i < food.length; i++) {
			update_food(food[i][0], food[i][1]);
		}
	}

}

function update_food(x, y) {
	var img = document.getElementById("watermelon");
	context.drawImage(img, x, y, 35, 35);
}

function make_food() {
	var img = document.getElementById("watermelon");
	context = game_area.context;
	// If the list isn't empty
	if (food.length > 0) {
		// Compare a random point to food already placed
		x = Math.random() * 370;
		y = Math.random() * 450 + 120;
		free = true;
		for (i = 0; i < food.length; i++) {
			if (distance(food[i][0], food[i][1], x, y) < 50) {
				free = false;
			}

		}
		if (free) {
			context.drawImage(img, x, y, 35, 35);
			f = [x, y];
			food.push(f);
		}
		else {
			make_food();
		}
	}
	// If the list is empty
	else {
		x = Math.random() * 370;
		y = Math.random() * 450 + 120;
		context.drawImage(img, x, y, 35, 35);
		f = [x, y];
		food.push(f);
	}

}	

function draw_play_button() {
	context.beginPath();
	context.moveTo(180, 20);
	context.lineTo(180, 60);
	context.moveTo(180, 20);
	context.lineTo(225, 40);
	context.moveTo(225, 40);
	context.lineTo(180, 60);
	context.stroke();
}

function draw_pause_button() {
	context.beginPath();
	context.moveTo(190, 20);
	context.lineTo(190, 60);
	context.moveTo(215, 20);
	context.lineTo(215, 60);
	context.stroke();
}

function draw_countdown() {
	context.clearRect(0, 0, 150, 80);
	context.fillStyle = "black";
	context.font = "20px Arial";
	context.fillText(time + " sec", 30, 50);
}

function time_countdown() {
	time -=1;
}

function find_closest_food(bug) {
	min_distance = 750;
	i_food = 0;
	for (i = 0; i < food.length; i++) {
		if (distance(bug.x, bug.y, food[i][0], food[i][1]) < min_distance) {
			min_distance = distance(bug.x, bug.y, food[i][0], food[i][1]);
			i_food = i;
		}
	}
	// Return the index in food of the closest food to this bug
	return i_food;
}

function spawn_bug() {
	delay -= 1;
	if (delay <= 0) {
		x = 400 * Math.random();
		y = 10;
		delay = 1 + 2*Math.random();
		//setTimeout(function() {})
	}
}
function bug(color, x, y, dest) {
    this.color = color;    
    // use these to keep track of bug coordinate
    this.x = x;
    this.y = y;
    context = game_area.context;
    var radius = 5;
	context.fillStyle = color;
	if (color == "orange") {
		this.score = 1;
	}

	if (color == "red") {
		this.score = 3;
	}

	if (color == "black") {
		this.score = 5;
	}

	// Draw head
	context.beginPath();
	context.arc(x, y, radius, 0, 2*Math.PI);
	context.stroke();
	context.fill();

	// Draw middle
	context.beginPath();
	context.arc(x, y + 8, radius, 0, 2*Math.PI);
	context.stroke();
	context.fill();

    // draw end
    context.beginPath();
    context.arc(x, y + 16, radius, 0, 2*Math.PI);
    context.stroke();
    context.fill();

    // Draw legs; go from point on body outwards
    //1 left
    context.moveTo(x-4, y);
    context.lineTo(x-10, y-5);
    context.stroke();
    //1 right
    context.moveTo(x+4, y);
    context.lineTo(x+10, y-5);
    context.stroke();

    //2 left
    context.moveTo(x-4, y+5);
    context.lineTo(x-12, y+5);
    context.stroke();
    //2 right
    context.moveTo(x+4, y+5);
    context.lineTo(x+12, y+5);
    context.stroke();

    //3 left
    context.moveTo(x-5, y+10);
    context.lineTo(x-12, y+15);
    context.stroke();
    //3 right
    context.moveTo(x+5, y+10);
    context.lineTo(x+12, y+15);
    context.stroke();

    this.update = function() {
    	bug(color, this.x, this.y);
    }
}

function bug_click(event) {
	x = event.offsetX;
	y = event.offsetY;

	for (i = 0; i < bugs.length; i++) {
		if (distance(bugs[i].x, bugs[i].y, x, y) < 30) {
			console.log(distance);
			bugs.splice(i, 1);
			score += bug.score;
			document.getElementById("score").innerHTML = "Score: " + score;
		}
	}
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function check(value) {
	if (value == 1) {
		document.getElementById("score_display").innerHTML = "300";
	}
	else {
		document.getElementById("score_display").innerHTML = "100";
	}
}

function toggle_pause(paused) {
	if (paused) {
		context.clearRect(175, 30, 55, 50);
		draw_play_button;
		paused = false;
	}

	else {
		context.clearRect(175, 30, 55, 50);
		draw_pause_button;
		paused = true;
	}
}

function toggle_page() {
	var homepage = 	document.getElementById("homepage");
	var gamepage = document.getElementById("gamepage");
	if (homepage.style.display != "none") {
		homepage.style.display = "none";
		gamepage.style.visibility = "visible";
	}
	else {
		homepage.style.display = "initial";
		gamepage.style.display ="initial";
	}
	start_game();
}

