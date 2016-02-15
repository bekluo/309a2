var game_area = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 400;
		this.canvas.height = 700;
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
var gamescore = 0;
var countdown;
var bug_interval;
var end_interval;
var level = 1;
var high1 = 0;
var high2 = 0;

high1 = Math.max(high1, localStorage.getItem("high1"));
high2 = Math.max(high1, localStorage.getItem("high2"));

function start_game() {
	game_area.start();
	paused = false;
	game_area.canvas.addEventListener('click', bug_click, false);
	game_area.canvas.addEventListener('click', toggle_pause, false);
	while (food.length != 5) {
		make_food();
	}
	countdown = setInterval(time_countdown, 1000);
	bug_interval = setInterval(spawn_bug, 1000 + 2000*Math.random());
	end_interval = setInterval(check_end, 100);
	draw_topbar();
	draw_score();
}


function update_game_area() {
	game_area.clear();
	draw_countdown();
	draw_topbar();
	draw_score();
	if (bugs.length > 0) {
		for (i = 0; i < bugs.length; i++) {
			// If not paused, call function to change bug's x and y
			if (!paused) {
				// function to update bug location
				bugs[i].x += bug_trajectory(bugs[i])[0];
				bugs[i].y += bug_trajectory(bugs[i])[1];
			}
			bugs[i].update();
		}	
	}

	if (food.length > 0) {
		for (i = 0; i < food.length; i++) {
			update_food(food[i][0], food[i][1]);
		}
	}
	// If there are still bugs and food left, see if any are touching
	if (food.length > 0 && bugs.length > 0) {
		check_bug_to_food();
	}
	if (!paused) {
		draw_pause_button();
	}
	if (paused) {
		draw_play_button();
	}

}

function update_food(x, y) {
	var img = document.getElementById("watermelon");
	context.drawImage(img, x, y, 35, 35);
}

function rand_color() {
	var num = Math.random();
	if (num <= .33) {
		return "orange";
	}
	if (num > .33 && num <= .66) {
		return "red";
	}
	if (num > .66) {
		return "black";
	}

}

function make_food() {
	var img = document.getElementById("watermelon");
	context = game_area.context;
	// If the list isn't empty
	if (food.length > 0) {
		// Compare a random point to food already placed
		x = Math.random() * 370;
		y = Math.random() * 450 + 220;
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
		y = Math.random() * 450 + 220;
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
	context.moveTo(170, 20);
	context.lineTo(170, 60);
	context.moveTo(190, 20);
	context.lineTo(190, 60);
	context.stroke();
}

function draw_countdown() {
	context.clearRect(0, 0, 150, 80);
	context.fillStyle = "black";
	context.font = "20px Arial";
	context.fillText(time + " sec", 80, 50);
}

function time_countdown() {
	if (!paused) {
		time -=1;
	}
	if (time <=0) {
		clearInterval(countdown);
	}
}

function draw_score() {
	context.fillStyle = "black";
	context.font = "20px Arial";
	context.fillText(gamescore, 330, 50);
}

function draw_topbar() {
	// bar line
	context.beginPath();
	context.moveTo(0, 80);
	context.lineTo(400, 80);
	context.stroke();

	context.fillStyle = "black";
	context.font = "20px Arial";
	context.fillText("Time: ", 20, 50);
	context.fillText("Score: ", 260, 50);
}

function draw_2() {
	context.fillStyle = "black";
	context.font = "20px Arial";
	context.fillText("Level 2 will begin in 3 seconds...", 58, 200);
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

function bug_trajectory(bug) {
	deltaX = bug.dest[0] - bug.x;
	deltaY = bug.dest[1] - bug.y;
	hypotenuse = distance(bug.x, bug.y, bug.dest[0], bug.dest[1]);
	moveX = ((deltaX / hypotenuse) * bug.speed) / 50;
	moveY = ((deltaY / hypotenuse) * bug.speed) / 50;
	return [moveX, moveY];
}

function check_bug_to_food() {
	for (var i = 0; i < bugs.length; i++) {
		// index of food closest to this bug
		food_index = find_closest_food(bugs[i]);
		foodX = food[food_index][0];
		foodY = food[food_index][1];
		if (distance(bugs[i].x, bugs[i].y, foodX, foodY) <= 37) {
			food.splice(food_index, 1);
			// if a food is eaten, update every bug's dest
			for (j = 0; j < bugs.length; j++) {
				bugs[j].dest = food[find_closest_food(bugs[j])];
			}
		}
	}
}

function spawn_bug() {
	x = 380 * Math.random();
	y = 100;
	new_bug = new bug(rand_color(), x, y);
	new_bug.set_dest();
	bugs.push(new_bug);
	clearInterval(bug_interval);
	bug_interval = setInterval(spawn_bug, 1000 + 2000*Math.random());
}

function bug(color, x, y) {
    this.color = color;    
    // use these to keep track of bug coordinate
    this.x = x;
    this.y = y;
    this.dest = null;
    context = game_area.context;
    var radius = 5;
	context.fillStyle = color;
	if (color == "orange") {
		level == 1 ? this.speed = 60 : this.speed = 80;
	}

	if (color == "red") {
		level == 1 ? this.speed = 75 : this.speed = 100;
	}
 
	if (color == "black") {
		level == 1 ? this.speed = 150 : this.speed = 200;
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
    this.set_dest = function() {
    	this.dest = food[find_closest_food(this)];
    }
}

function bug_click(event) {
	if (!paused) {
		x = event.offsetX;
		y = event.offsetY;

		for (var i = 0; i < bugs.length; i++) {
			if (distance(bugs[i].x, bugs[i].y, x, y) < 30) {
				if (!paused) {
					if (bugs[i].color == "orange") {
						gamescore += 1;
					}
					else if (bugs[i].color == "red") {
						gamescore += 3;
					}
					else if (bugs[i].color == "black") {
						gamescore += 5;
					}
					bugs.splice(i, 1);
				}	
			}
		}
	}
}

function distance(x1, y1, x2, y2) {
	return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function check(value) {

	if (localStorage.getItem("high1") == undefined) {
		localStorage.setItem("high1", 0);
	} 
	if (localStorage.getItem("high2") == undefined) {
		localStorage.setItem("high2", 0);
	}

	if (value == 1) {
		document.getElementById("score_display").innerHTML = high1;
	}
	else {
		document.getElementById("score_display").innerHTML = high2;
	}
}

function toggle_pause(event) {
	x = event.offsetX;
	y = event.offsetY;

	if (x >= 180 && x <= 225 && y >= 20 && y <= 60) {
		if (!paused) {
			context.clearRect(175, 30, 55, 50);
			draw_play_button();
			clearInterval(bug_interval);
			paused = true;
		}
		else {
			context.clearRect(175, 30, 55, 50);
			draw_pause_button();
			bug_interval = setInterval(spawn_bug, 1000 + 2000*Math.random());
			paused = false;
		}
	}
}


function check_end() {
	if (food.length == 0) {
		clearInterval(end_interval);
		clearInterval(bug_interval);
		clearInterval(game_area.interval);
		clearInterval(countdown);
		high_score();
		time = 60;
		bugs = [];
		lose();
	}

	if (time == 0) {
		clearInterval(end_interval);
		clearInterval(bug_interval);
		clearInterval(game_area.interval);
		clearInterval(countdown);
		high_score();
		time = 60;
		bugs = [];
		win();
	}
}

function high_score() {
	if ((level == 1) && (gamescore >= localStorage.getItem("high1")) ) {
		localStorage.setItem("high1", gamescore);
	} 
	else if ((level == 2) && (gamescore >= localStorage.getItem("high2")) ) {
		localStorage.setItem("high2", gamescore);
	}

}

function lose() {
	var restart = confirm("Game Over! \nScore: " + gamescore + "\nReplay?");
	level = 1;
	gamescore = 0;
	if (restart) {
		game_page();
	}
	else {
		home_page();
	}
}

function win() {
	if (level == 1) {
		level = 2;
		gamescore = 0;
		setTimeout(start_game, 3000);
		draw_2();
	}

	else {
		level = 1;
		var restart = confirm("You beat Level 2! \nScore: " + gamescore
			+ "\nReplay?");
		gamescore = 0;
		if (restart) {
			game_page();
		}
		else {
			home_page();
		}
	}
}

function game_page() {
	document.getElementById("homepage").style.visibility = "hidden";
	game_area.canvas.style.visibility = "visible";
	document.getElementById("homepage").style.display = "none";
	game_area.canvas.style.display = "block";
	start_game();
}

function home_page() {
	document.getElementById("homepage").style.visibility = "visible";
	document.getElementById("homepage").style.display = "block";
	game_area.canvas.style.display = "none";
	game_area.canvas.style.visibility = "hidden";
}