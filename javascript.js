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
var bugs = [];
var food = [];
var paused = false;

function start_game() {
	game_area.start();
	// call function that calls while loop and puts bugs on the screen until can't
	bug = new bug(30, 30, "orange", 10, 120);
	bugs.push(bug);
	for (i = 0; i < 5; i++) {
		make_food();
	}
}

function update_game_area() {
	game_area.clear();
	if (bugs.length > 0) {
		for (i = 0; i < bugs.length; i++) {
			bugs[i].y += 1;
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
	console.log(food);
	// If the list isn't empty
	if (food.length > 0) {
		// Compare a random point to food already placed
		x = Math.random() * 370;
		y = Math.random() * 450 + 120;
		free = true;
		for (i = 0; i < food.length; i++) {
			if (distance(food[i][0], x, food[i][1], y) < 50) {
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

function bug(width, height, color, x, y){
    this.color = color;    
    // use these to keep track of bug coordinate
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    context = game_area.context;
    context.fillStyle = color;
    context.fillRect(this.x, this.y, this.width, this.height);
    //var radius = 5;

	/*// Draw head
	context.beginPath();
	context.arc(15 * x, 5 * y, radius, Math.PI-1, 2*Math.PI + 1);
	context.strokeStyle = color;
	context.stroke();
	context.fillStyle = color;
	context.fill();

	// Draw middle
	context.beginPath();
	context.arc(15 * x, 11 * y, radius - 2, Math.PI-1, 2*Math.PI + 1);
	context.stroke();
	context.fillStyle = color;
	context.fill();
	context.strokeStyle = color;
    // save state
    context.save();
    // scale canvas
    context.scale(1, 1.75);
    // draw circle which will be stretched into an oval
    context.beginPath();
    context.arc(15 * x, 13 * y, radius, 0, 2 * Math.PI, false);
    // restore to original state
    context.restore();
    // Apply styling to oval
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = color;
    context.stroke();
    // Draw legs; go from point on body outwards
    //1 left
    context.moveTo(12, 12);
    context.lineTo(3, 8);
    context.stroke();
    //2 left
    context.moveTo(10, 18);
    context.lineTo(3, 18);
    context.stroke();
    //3 left
    context.moveTo(10, 25);
    context.lineTo(3, 28);
    context.stroke();
    //1 right
    context.moveTo(18, 12);
    context.lineTo(27, 8);
    context.stroke();
    //2 right
    context.moveTo(20, 18);
    context.lineTo(27, 18);
    context.stroke();
    //3 right
    context.moveTo(20, 25);
    context.lineTo(27, 28);
    context.stroke();*/

    this.update = function() {
    	context.fillStyle = color;
    	context.fillRect(this.x, this.y, this.width, this.height);
    }
}

function draw_pause_button() {
	context.beginPath();
	context.lineTo(175, 30);
	context.moveTo(175, 80);
	context.lineTo(175, 30);
	context.moveTo(230, 55);
	context.lineTo(230, 55);
	context.moveTo(230, 80);
	context.stroke();
}

function draw_play_button() {
	context.beginPath();
	context.lineTo(190, 30);
	context.moveTo(190, 80);
	context.lineTo(215, 30);
	context.moveTo(215, 80);
	context.stroke();
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
		context.clearRect(190, 30, 55, 50);
		draw_play_button;
		paused = false;
	}

	else {
		context.clearRect(190, 30, 55, 50);
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

