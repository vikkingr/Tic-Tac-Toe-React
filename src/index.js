import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    
    return (
        <button 
        className="square" 
        onClick={() => props.onClick()}
        >
            {props.value}
        </button>
    );

}

class Board extends React.Component {

    renderSquare(i) {

        return (
            
            // Pass the props down. Lift the state up. Refactored.
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    // Set up the initial state.
    constructor(props) {
        super(props);

        // Set the history state here;
        this.state = {

            history: [
                
                {
                
                // Initialize the array to nulls for the beginning.
                squares: Array(9).fill(null)

                }

            ],

            // Keep track of steps, for time travel.
            stepNumber: 0,

            // Is 'X' the next symbol? Is it 'X''s turn??
            xIsNext: true,

        };

    }// end constructor()

    handleClick(i) {

        // Get the history sorted so we can display the past moves.
        const history = this.state.history.slice(0, this.state.stepNumber + 1);

        // Get the current results.
        const current = history[history.length - 1];

        // Get the actual squares array and copy it for immutability.
        const squares = current.squares.slice();

        // Check for a win or if a square is already filled before doing anything else.
        if(calculateWinner(squares) || squares[i]) {

            return;

        }// end if

        // Access the ith entry of the array and insert an 'X' or 'O'.
        squares[i] = this.state.xIsNext ? 'X': 'O';

        // Use this.setState to change squares with our local copy and using history to keep a log.
        this.setState({

            history: history.concat([{

                squares: squares,

            }]),
            squares: squares,

            // Update our stepNumber
            stepNumber: history.length,

            // Update xIsNext to alternate between 'X' and 'O'.
            xIsNext: !this.state.xIsNext,
        });

    }// end handleClick()

    // jumpTo(): Used to jump to steps in the game.
    jumpTo(step) {

        this.setState({

            stepNumber: step,

            xIsNext: (step % 2) === 0,

        });// end setState()

    }// end jumpTo()

    render() {

        // Use the most recent history entry to display the game's status.
        const history = this.state.history;

        // Assign the current value.
        const current = history[this.state.stepNumber];

        // Store the winner in main memory.
        const winner = calculateWinner(current.squares);

        // Let's define our move moments in time that we can jump to using the map() function
        const moves = history.map((step, move) => {

            // Decision handling.
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            
            return (

                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>

            )
        });

        // Declare the status for later use.
        let status;

        // Decide the display.
        if(winner) {

            status = 'Winner: ' + winner; 

        }// end if()
        else {

            status = 'Next player: ' + (this.state.xIsNext? 'X': 'O');

        }// end else

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                    
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}

                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

// Helper function to calculate the winner.

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}