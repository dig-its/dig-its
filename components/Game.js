'use strict';

import { Component } from 'react';
import { Button, Badge } from 'reactstrap';
import _findLastIndex from 'lodash/findLastIndex';
import _chunk from 'lodash/chunk';
import FontAwesome from 'react-fontawesome';

import Grid from './Grid';
import NonBreakingSpace from './NonBreakingSpace';

export default class extends Component {
    state = {
        game: null,
        selected: null,
        won: false,
        undoStack: [],
    };

    componentDidMount = () => {
        let game;
        if (localStorage && (game = localStorage.getItem('game'))) {
            let rows = _chunk(JSON.parse(game), 9);

            game = [];
            rows.forEach(row => {
                if (row.some(v => v)) {
                    row.forEach(v => game.push(v));
                }
            });

            if (this.filteredGame(game).length > 0) {
                this.setState({ game });

                return;
            }
        }

        this.newGame();
    };

    newGame = () => {
        const game = [];

        for (let i = 0; i < 9 * 3; i++) {
            game.push(Math.ceil(Math.random() * 9));
        }

        this.setState({
            game,
            selected: null,
            won: false,
            undoStack: [],
        });
    };

    setState = (update) => {
        if ('game' in update && localStorage) {
            localStorage.setItem('game', JSON.stringify(update.game));
        }

        super.setState(update);
    };

    onCellClicked = (index) => {
        const newState = {};

        if (this.state.selected === null) {
            newState.selected = index;
        } else {
            if (this.state.selected !== index) {
                const previous = this.state.game[this.state.selected];
                const current = this.state.game[index];

                if ((previous === current || previous + current === 10) &&
                    this.cellsAreAdjacent(this.state.selected, index)) {

                    newState.undoStack = this.registerUndo(this.state.selected, previous, index, current);

                    newState.game = this.state.game;
                    newState.game[this.state.selected] = null;
                    newState.game[index] = null;

                    newState.selected = null;

                    this.checkWin();
                } else {
                    newState.selected = index;
                }
            } else {
                newState.selected = null;
            }
        }

        this.setState(newState);
    };

    registerUndo = (index1, value1, index2, value2) => {
        let undoStack = this.state.undoStack;
        undoStack.push({
            index1,
            value1,
            index2,
            value2,
        });

        while (undoStack.length > 20) {
            undoStack.shift();
        }

        return undoStack;
    };

    cellsAreAdjacent = (previousIndex, currentIndex) =>
        this.cellsAreAdjacentHorizontally(previousIndex, currentIndex) ||
        this.cellsAreAdjacentVertically(previousIndex, currentIndex);

    cellsAreAdjacentHorizontally = (previousIndex, currentIndex) => {
        let from, to;
        if (previousIndex < currentIndex) {
            from = previousIndex;
            to = currentIndex;
        } else {
            from = currentIndex;
            to = previousIndex;
        }

        let cells = this.state.game.slice(from + 1, to);

        return cells.every(v => v === null);
    };

    cellsAreAdjacentVertically = (previousIndex, currentIndex) => {
        let column = previousIndex % 9;

        if (column === currentIndex % 9) {
            let from, to;
            if (previousIndex < currentIndex) {
                from = previousIndex;
                to = currentIndex;
            } else {
                from = currentIndex;
                to = previousIndex;
            }

            for (let i = from + 9; i < to; i += 9) {
                if (this.state.game[i]) {
                    return false;
                }
            }

            return true;
        };

        return false;
    };

    addMoreNumbers = () => {
        let game = this.state.game;

        // Remove empty cells at the end
        let lastUsedCell = _findLastIndex(game);
        game.splice(lastUsedCell + 1);

        // Copy all non-empty cells to the end
        this.filteredGame().forEach(c => game.push(c));

        // Add empty values to complete the last row
        while (game.length % 9 !== 0) {
            game.push(null);
        }

        this.setState({
            game,
            undoStack: []
        });
    };

    filteredGame = (game = this.state.game) => {
        return game.filter(c => c);
    };

    undo = () => {
        let undoStack = this.state.undoStack;
        let item = undoStack.pop();
        if (item) {
            let game = this.state.game;
            game[item.index1] = item.value1;
            game[item.index2] = item.value2;

            this.setState({
                undoStack,
                game,
                selected: null
            });
        }
    };

    hasMoreMoves = () => {
        if (this.state.won) {
            return true;
        }

        // First find horizontally adjacent matches
        const filteredGame = this.filteredGame();
        if (this.hasMatch(filteredGame)) {
            return true;
        }

        // Then vertically adjacent matches
        for (let i = 0; i < 9; i++) {
            if (this.hasMatch(this.getColumn(i))) {
                return true;
            }
        }

        return false;
    };

    hasMatch = (series) => {
        for (let i = series.length - 1; i > 0; i--) {
            const first = series[i];
            const second = series[i - 1];

            if (first === second || first + second === 10) {
                return true;
            }
        }
    };

    getColumn = (index) => {
        return this.state.game
            .filter((v, i) => i % 9 === index)
            .filter(v => v);
    };

    checkWin = () => {
        if (this.filteredGame().length === 0) {
            this.setState({ won: true });
        }
    };

    render = () => {
        return (
            <div>
                <div className="my-3">
                    <Button color="success" onClick={this.newGame}>
                        <FontAwesome name="repeat" />
                        <NonBreakingSpace times={2} />
                        New game
                    </Button>
                    <NonBreakingSpace />
                </div>
                <h2 style={{ display: this.state.won ? 'block' : 'none' }}>You won, great!</h2>
                {this.state.game && !this.state.won &&
                    <div className="row">
                        <div className="col-sm-10 col-md-6">
                            <Grid grid={this.state.game}
                                selected={this.state.selected}
                                onCellClicked={this.onCellClicked} />
                        </div>
                        <div className="col-sm-2 col-md-6">
                            <div style={{ position: 'sticky', top: '100px' }}>
                                <div className="my-2">
                                    <Button color="primary"
                                        outline={this.hasMoreMoves()}
                                        disabled={this.state.won}
                                        onClick={this.addMoreNumbers}>
                                        <FontAwesome name="plus" spin={!this.hasMoreMoves()} />
                                        <NonBreakingSpace times={2} />
                                        Add more numbers
                                    </Button>
                                </div>
                                <div className="my-2">
                                    <Button color="secondary"
                                        outline
                                        disabled={!this.state.undoStack.length}
                                        onClick={this.undo}>
                                        <FontAwesome name="undo" />
                                        <NonBreakingSpace times={2} />
                                        Undo
                                        <NonBreakingSpace times={2} />
                                        <Badge color="primary" pill>{this.state.undoStack.length}</Badge>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    };
}