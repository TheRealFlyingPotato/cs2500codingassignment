function beginSolving() {
	//parse input
	g_board = $("#probleminput")[0].value.split(",");
	for (var k = 0; k < g_board.length; k++)
		g_board[k] = parseInt(g_board[k]);

	//create dynamic programming tracker
	g_foundSections = [];
	for (var k = 0; k < g_board.length; k++)
	{
		g_foundSections.push([]);
		for (var j = 0; j < g_board.length; j++)
			g_foundSections[k].push(-1);
	}

	//begin computation
	var result = getBestScore(0, g_board.length - 1, 0)[0];

	//display result
	$("#solutions").append("<div>" + g_board + " &#8594; " + result + "</div>");

}


function toInt(bool) { //because javascript bool -> int is a pain
	return (bool ? 1 : 0) 
}

function getBestScore(startI, endI, player) { // player: 0 for starting player, 1 for second player.
	if (g_foundSections[startI][endI] == -1) // if the score for the region is not yet determined
	{
		if (startI == endI - 1) //dealing with an section of size 2
		{
			var playerScores = [0, 0];
			if (g_board[startI] > g_board[endI]) {
				playerScores[toInt(player)] = g_board[startI];
				playerScores[toInt(!player)] = g_board[endI];
			} 
			else {
				playerScores[toInt(!player)] = g_board[startI];
				playerScores[toInt(player)] = g_board[endI];
			}
		}
		else //dealing with anything larger than a section of size 2
		{
			var optionA = getBestScore(startI, endI - 1, toInt(!player));
			var optionB = getBestScore(startI + 1, endI, toInt(!player));
			if (optionA[toInt(player)] + g_board[endI] > optionB[toInt(player)] + g_board[startI]) {
				var playerScores = optionA;
				playerScores[toInt(player)] += g_board[endI];
			}
			else {
				var playerScores = optionB;
				playerScores[toInt(player)] += g_board[startI];

			// storing information:
			//	from the current player goes into the first slot, from the other player goes to the second slot
			g_foundSections[startI][endI][0] = playerScores[player];
			g_foundSections[startI][endI][1] = playerScores[toInt(!player)];
			}
		}
	}
	else
	{
		var playerScores = [];
		playerScores[player] = g_foundSections[startI][endI][0];
		playerScores[toInt(!player)] = g_foundSections[startI][endI][1];
	
	}

	return playerScores;

}