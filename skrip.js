// Function that shows the dialog modal on the web page
const showModal = document.querySelector(".container dialog")
const showFunc = (() => {
    showModal.showModal()
})();

// Controls the text of the class inside it
const displayController = (() => {
    const displayMsg = (msg, rst) => {
        const setWin = document.querySelector(".turn-player")
        setWin.textContent = msg;
        const resetBtn = document.querySelector(".reset-game");
        resetBtn.textContent = rst;
    }

    return {
        displayMsg,
    }
})();

// The IIFE that will handle board
const boardGame = (() => {
     let board = ["","","","","","","","",""]
    
     // Render the board by adding divs and data attribute to each square
     const renderBoard = () => {
        let setBoard = "";
        board.forEach((square, index) => {
            setBoard += `<div class="square" data-square=${index}><span>${square}</span></div>`
        })
        document.querySelector(".board").innerHTML = setBoard;
        const getSquares = document.querySelectorAll(".square");
        
        // Click event for each squares
        getSquares.forEach((square) => {
            square.addEventListener("click", gameController.clickFunc)
        })
        getSquares.forEach((square) => {
            square.addEventListener("animationend", () => {
                square.classList.remove("anim")
            })

        })
    }

    // Update the board array and render it again
     const updateBoard = (index, value) => {
        board[index] = value;
        renderBoard();
     }

     const getBoard = () => board;

     return {
        renderBoard,
        updateBoard,
        getBoard,
     }
})();

// Function factory that will make the players
const makePlayer = (name, mark, num) => {
    if (name.length === 0) {
        return {
            name: "Player " + num,
            mark,
        }
    }
    else {
        return {
            name,
            mark
        }
    }
}

// IIFE that will handle the game logic
const gameController = (() => {
    let players = [];
    let activePlayer = 0;
    let gameEnd = false;

    // Set the player names, mark, and then start the game by rendering the board
    const start = () => { 
        
        players = [
            makePlayer(document.querySelector(".player1").value, "X", 1),
            makePlayer(document.querySelector(".player2").value, "O", 2)
        ]

    activePlayer = 0;
    gameEnd = false;
    boardGame.renderBoard();
    const getSquares = document.querySelectorAll(".square");
            getSquares.forEach((square) => {
                square.addEventListener("click", gameController.clickFunc)    
    })

    const p1 = document.querySelector(".p1");
    const p2 = document.querySelector(".p2");
    const turn = document.querySelector(".next-turn");
    p1.textContent = players[0].mark+ " : " + players[0].name;
    p2.textContent = players[1].mark+ " : " + players[1].name;
    turn.textContent = players[0].name + "'s turn";
}
    // Handle the click event of each square, add the mark of the current player, and check for win or tie
    const clickFunc = (e) => {
        const turn = document.querySelector(".next-turn");

        if (gameEnd) {
            return;
        }
        
        let dataValue = parseInt(e.currentTarget.dataset.square);
        
        if (boardGame.getBoard()[dataValue] !== "")
            return;

        boardGame.updateBoard(dataValue, players[activePlayer].mark);

        if (checkWinner(boardGame.getBoard(), players[activePlayer].mark)){
            turn.style.visibility = "hidden";
            displayController.displayMsg(players[activePlayer].name + " wins!", "Play Again")
            gameEnd = true;
        } else if (checkDraw(boardGame.getBoard())){
            turn.style.visibility = "hidden";
            gameEnd = true;
            displayController.displayMsg("It's a tie!", "Play Again")
        }

        activePlayer = activePlayer === 0 ? 1 : 0;
       
        turn.textContent = players[activePlayer].name + "'s turn";

    }

    // Reset the board game
    const reset = () => {
        for (i = 0; i < 9; i++) {
            boardGame.updateBoard(i, "")
        }
        boardGame.renderBoard();
        gameEnd = false;
        const turn = document.querySelector(".next-turn");
        turn.textContent = players[activePlayer].name + "'s turn";
    }

    return {
        start,
        clickFunc,
        reset,
    }
})();

// Checks the board if a player hits a winning condition
const checkWinner = (board) => {
    const winCondition = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < winCondition.length; i++){
        const [a, b, c] = winCondition[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// Check for a tie
const checkDraw = (board) => {
    return board.every(cell => cell !== "");
}

// Pass the reset function on the reset button via click event
const restartGame = document.querySelector(".reset-game");
restartGame.addEventListener("click", () => {
    gameController.reset();
    displayController.displayMsg("","")
    const turn = document.querySelector(".next-turn");
    turn.style.visibility = "visible";
})

// Start the game on button click
const startGame = document.querySelector(".start-game");
startGame.addEventListener("click", () => {
    gameController.start();
    const showBoard = document.querySelector(".board")
    showBoard.style.visibility = "visible";
    const getSquares = document.querySelectorAll(".square");
    getSquares.forEach((square) => {
        square.classList.add("anim")
    })
    showModal.close();
})