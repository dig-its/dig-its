import { shallow } from 'enzyme';

import Game from '../Game';

describe('The Game component', function () {
    beforeEach(function () {
        localStorage.removeItem('game');
    });

    describe('The component state', function () {
        it('should be initialized correctly', function () {
            const game = shallow(<Game />);

            expect(Object.keys(game.state())).toHaveLength(4);
            expect(game.state()).toHaveProperty('selected', null);
            expect(game.state()).toHaveProperty('won', false);
            expect(game.state()).toHaveProperty('undoStack', []);

            expect(game.state()).toHaveProperty('game');
            expect(game.state('game')).toHaveLength(27);
            game.state('game').forEach((v) => {
                expect(v).not.toBeNull();
                expect(v).toBeGreaterThanOrEqual(1);
                expect(v).toBeLessThanOrEqual(9);
            });
        });

        it('should load the previous game from local storage', function () {
            const grid = [4, null, 7, 9, null, 2];
            localStorage.setItem('game', JSON.stringify(grid));

            const game = shallow(<Game />);
            expect(game.state('game')).toEqual(grid);
        });

        it('should clean up empty rows upon loading', function () {
            const grid = [
                1, null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, 9,
                null, null, null, null, null, null, null, null, null,
                null, null, null, null, null, null, null, null, 9,
            ];

            localStorage.setItem('game', JSON.stringify(grid));

            const game = shallow(<Game />);

            let expected = game.state('game');
            expect(expected).toHaveLength(27);
            expect(expected[0]).toBe(1);
            expect(expected[17]).toBe(9);
            expect(expected[26]).toBe(9);

            expected.splice(26, 1);
            expected.splice(17, 1);
            expected.splice(0, 1);

            expect(expected).toHaveLength(24);
            expect(expected.every(e => e === null)).toBe(true);
        });
    });

    describe('The newGame() method', function () {
        it('should generate a grid with 27 random values', function () {
            const game = shallow(<Game />);

            const grid = game.state('game');

            game.instance().newGame();

            expect(game.state('game')).not.toBeNull();
            expect(game.state('game')).toHaveLength(27);
            game.state('game').forEach((v) => {
                expect(v).not.toBeNull();
                expect(v).toBeGreaterThanOrEqual(1);
                expect(v).toBeLessThanOrEqual(9);
            });
            expect(game.state('game')).not.toEqual(grid);
        });

        it('should reset the selected, won & undoStack state', function () {
            const game = shallow(<Game />);

            game.setState({
                selected: 123,
                won: true,
                undoStack: ['a', 'b', 'c'],
            });

            game.instance().newGame();

            expect(game.state('selected')).toBeNull();
            expect(game.state('won')).toBe(false);
            expect(game.state('undoStack')).toEqual([]);
        });

        it('should store the game in local storage', function () {
            const game = shallow(<Game />);

            game.instance().newGame();

            const grid1 = game.state('game');
            expect(grid1).not.toBeNull();
            expect(grid1).toHaveLength(27);

            game.instance().newGame();

            const grid2 = game.state('game');
            expect(grid2).not.toBeNull();
            expect(grid2).toHaveLength(27);

            expect(grid1).not.toEqual(grid2);
        });
    });

    describe('The completeGame() method', function () {
        it('should add null values at the end of incomplete rows', function () {
            const game = shallow(<Game />);

            let grid = [1, 2, 3];
            game.instance().completeGame(grid);
            expect(grid).toEqual([1, 2, 3, null, null, null, null, null, null]);
        });

        it('should not change anything if the row is already complete', function () {
            const game = shallow(<Game />);

            const grid = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            game.instance().completeGame(grid);
            expect(grid).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        });
    });

    describe('The onCellClicked() method', function () {
        describe('When first cell is clicked', function () {
            it('should store the selected index', function () {
                const game = shallow(<Game />);

                game.instance().newGame();
                expect(game.state('selected')).toBeNull();

                game.instance().onCellClicked(5);
                expect(game.state('selected')).toBe(5);
            });
        });

        describe('When second cell is clicked', function () {
            it('should clear both cells if they have the same value and are adjacent horizontally', function () {
                const game = shallow(<Game />);

                game.setState({ game: [1, 2, null, null, 2] });

                game.instance().onCellClicked(1);
                expect(game.state('selected')).toBe(1);

                game.instance().onCellClicked(4);

                expect(game.state('game')).toEqual([1, null, null, null, null]);
                expect(game.state('won')).toBe(false);
                expect(game.state('selected')).toBeNull();
            });

            it('should clear both cells if they add up to 10 and are adjacent vertically', function () {
                const game = shallow(<Game />);

                game.setState({
                    game: [
                        1, 2, 1, 1, 1, 1, 1, 1, 1,
                        null, null, null, null, null, null, null, null, null,
                        1, 8, 1, 1, 1, 1, 1, 1, 1,
                    ],
                });

                game.instance().onCellClicked(19);
                expect(game.state('selected')).toBe(19);

                game.instance().onCellClicked(1);

                expect(game.state('game')).toEqual([
                    1, null, 1, 1, 1, 1, 1, 1, 1,
                    null, null, null, null, null, null, null, null, null,
                    1, null, 1, 1, 1, 1, 1, 1, 1,
                ]);
                expect(game.state('won')).toBe(false);
                expect(game.state('selected')).toBeNull();
            });

            it('should select the second cell if both cells dont match', function () {
                const game = shallow(<Game />);

                game.setState({ game: [1, 2, 3] });

                game.instance().onCellClicked(1);
                expect(game.state('selected')).toBe(1);

                game.instance().onCellClicked(2);

                expect(game.state('game')).toEqual([1, 2, 3]);
                expect(game.state('won')).toBe(false);
                expect(game.state('selected')).toBe(2);
            });

            it('should select the second cell if both cells are not adjacent horizontally', function () {
                const game = shallow(<Game />);

                game.setState({ game: [1, 2, 7, 2] });

                game.instance().onCellClicked(1);
                expect(game.state('selected')).toBe(1);

                game.instance().onCellClicked(3);

                expect(game.state('game')).toEqual([1, 2, 7, 2]);
                expect(game.state('won')).toBe(false);
                expect(game.state('selected')).toBe(3);
            });

            it('should select the second cell if both cells are not adjacent vertically', function () {
                const game = shallow(<Game />);

                game.setState({
                    game: [
                        1, 2, 1, 1, 1, 1, 1, 1, 1,
                        null, 2, null, null, null, null, null, null, null,
                        1, 2, 1, 1, 1, 1, 1, 1, 1,
                    ],
                });

                game.instance().onCellClicked(1);
                expect(game.state('selected')).toBe(1);

                game.instance().onCellClicked(19);

                expect(game.state('game')).toEqual([
                    1, 2, 1, 1, 1, 1, 1, 1, 1,
                    null, 2, null, null, null, null, null, null, null,
                    1, 2, 1, 1, 1, 1, 1, 1, 1,
                ]);
                expect(game.state('won')).toBe(false);
                expect(game.state('selected')).toBe(19);
            });

            it('should clear selection if same cell is clicked', function () {
                const game = shallow(<Game />);

                game.setState({ game: [1, 2, 3] });

                game.instance().onCellClicked(1);
                expect(game.state('selected')).toBe(1);

                game.instance().onCellClicked(1);

                expect(game.state('game')).toEqual([1, 2, 3]);
                expect(game.state('won')).toBe(false);
                expect(game.state('selected')).toBeNull();
            });

            it('should mark the game as won when all grid cells are empty', function () {
                const game = shallow(<Game />);

                game.setState({ game: [null, 4, null, null, null, 6, null] });

                game.instance().onCellClicked(1);
                expect(game.state('selected')).toBe(1);

                game.instance().onCellClicked(5);

                expect(game.state('won')).toBe(true);
                expect(game.state('selected')).toBeNull();
            });

            it('should register the move on the undo stack when cells match', function () {
                const game = shallow(<Game />);

                game.setState({ game: [1, 7, 3] });
                game.instance().onCellClicked(2);

                expect(game.state('undoStack')).toHaveLength(0);

                game.instance().onCellClicked(1);

                expect(game.state('game')).toEqual([1, null, null]);
                expect(game.state('undoStack')).toHaveLength(1);
                expect(game.state('undoStack')).toEqual([{
                    index1: 2,
                    value1: 3,
                    index2: 1,
                    value2: 7,
                }]);
            });
        });
    });

    describe('The registerUndo() method', function () {
        it('should not keep more than 20 moves on the undo stack', function () {
            const game = shallow(<Game />);

            expect(game.state('undoStack')).toHaveLength(0);

            game.instance().registerUndo(0, 1, 2, 3);
            expect(game.state('undoStack')).toHaveLength(1);

            for (let i = 0; i < 19; i++) {
                game.instance().registerUndo(1, 2, 3, 4);
            }
            expect(game.state('undoStack')).toHaveLength(20);
            expect(game.state('undoStack')[0]).toEqual({
                index1: 0,
                value1: 1,
                index2: 2,
                value2: 3,
            });

            game.instance().registerUndo(2, 3, 4, 5);
            expect(game.state('undoStack')).toHaveLength(20);
            expect(game.state('undoStack')[0]).toEqual({
                index1: 1,
                value1: 2,
                index2: 3,
                value2: 4,
            });
        });
    });

    describe('The addMoreNumbers() method', function () {
        it('should repeat all values at the end of the grid', function () {
            const game = shallow(<Game />);

            game.setState({ game: [9, 8, 7, 6, 5, 4, 3, 2, 1] });

            game.instance().addMoreNumbers();

            expect(game.state('game')).toEqual([
                9, 8, 7, 6, 5, 4, 3, 2, 1,
                9, 8, 7, 6, 5, 4, 3, 2, 1,
            ]);
        });

        it('should remove empty values when repeating values', function () {
            const game = shallow(<Game />);

            game.setState({
                game: [
                    null, 9, 8, 7, 6, null, 4, 3, 2,
                    1,
                ],
            });

            game.instance().addMoreNumbers();

            expect(game.state('game')).toEqual([
                null, 9, 8, 7, 6, null, 4, 3, 2,
                1, 9, 8, 7, 6, 4, 3, 2, 1,
            ]);
        });

        it('should complete the last row', function () {
            const game = shallow(<Game />);

            game.setState({
                game: [
                    null, null, 3, null, 8, 9, null, 7, 2,
                    6,
                ],
            });

            game.instance().addMoreNumbers();

            expect(game.state('game')).toEqual([
                null, null, 3, null, 8, 9, null, 7, 2,
                6, 3, 8, 9, 7, 2, 6, null, null,
            ]);
        });

        it('should clear the undo stack', function () {
            const game = shallow(<Game />);

            game.setState({
                game: [1],
                undoStack: [{}, {}, {}],
            });

            expect(game.state('undoStack')).toHaveLength(3);

            game.instance().addMoreNumbers();

            expect(game.state('game')).toEqual([1, 1, null, null, null, null, null, null, null]);
            expect(game.state('undoStack')).toHaveLength(0);
        });
    });

    describe('The undo() method', function () {
        it('should update the grid and undo stack', function () {
            const game = shallow(<Game />);

            game.setState({
                game: [1, null, 3, 4, null, 6],
                undoStack: [
                    { john: 'doe' },
                    {
                        index1: 1,
                        value1: 2,
                        index2: 4,
                        value2: 5,
                    }]
            });

            game.instance().undo();

            expect(game.state('game')).toEqual([
                1, 2, 3, 4, 5, 6
            ]);
            expect(game.state('undoStack')).toHaveLength(1);
            expect(game.state('undoStack')[0]).toEqual({ john: 'doe' });
        });

        it('should do nothing if the undo stack was empty', function () {
            const game = shallow(<Game />);

            game.setState({
                game: [1, null, 3, 4, null, 6],
                selected: 3,
                undoStack: [],
            });

            game.instance().undo();

            expect(game.state('game')).toEqual([1, null, 3, 4, null, 6]);
            expect(game.state('selected')).toEqual(3);
            expect(game.state('undoStack')).toEqual([]);
        });

        it('should clear the current selection', function () {
            const game = shallow(<Game />);

            game.setState({
                game: [1, null, 3, 4, null, 6],
                selection: 3,
                undoStack: [{
                    index1: 1,
                    value1: 2,
                    index2: 4,
                    value2: 5,
                }]
            });

            game.instance().undo();

            expect(game.state('selected')).toBeNull();
        });
    });

    describe('The hasMoreMoves() method', function () {
        describe('For horizontally adjacent cells', function () {
            describe('On the same row', function () {
                it('should return true if both cells have the same value', function () {
                    const game = shallow(<Game />);

                    game.setState({
                        game: [
                            null, 3, null, null, 3, null, null
                        ]
                    });

                    expect(game.instance().hasMoreMoves()).toBe(true);
                });

                it('should return true if both cell values add up to 10', function () {
                    const game = shallow(<Game />);

                    game.setState({
                        game: [
                            null, 2, null, null, null, 8, null, null
                        ]
                    });

                    expect(game.instance().hasMoreMoves()).toBe(true);
                });

                it('should return false if both cell values dont match', function () {
                    const game = shallow(<Game />);

                    game.setState({
                        game: [
                            null, null, null, 2, null, 7, null, null
                        ]
                    });

                    expect(game.instance().hasMoreMoves()).toBe(false);
                });
            });

            describe('On a different row', function () {
                it('should return true if both cells have the same value', function () {
                    const game = shallow(<Game />);

                    game.setState({
                        game: [
                            null, 3, null, null, null, null, null, null, null,
                            null, null, null, null, null, null, null, null, null,
                            null, null, null, null, null, null, null, 3, null,
                        ]
                    });

                    expect(game.instance().hasMoreMoves()).toBe(true);
                });

                it('should return true if both cell values add up to 10', function () {
                    const game = shallow(<Game />);

                    game.setState({
                        game: [
                            null, 3, null, null, null, null, null, null, null,
                            null, null, null, null, null, null, null, null, null,
                            null, null, null, null, null, null, null, 7, null,
                        ]
                    });

                    expect(game.instance().hasMoreMoves()).toBe(true);
                });

                it('should return false if both cell values dont match', function () {
                    const game = shallow(<Game />);

                    game.setState({
                        game: [
                            null, 3, null, null, null, null, null, null, null,
                            null, null, null, null, null, null, null, null, null,
                            null, null, null, null, null, null, null, 9, null,
                        ]
                    });

                    expect(game.instance().hasMoreMoves()).toBe(false);
                });
            });
        });

        describe('For vertically adjacent cells', function () {
            it('should return true if both cells have the same value', function () {
                const game = shallow(<Game />);

                game.setState({
                    game: [
                        null, 3, null, null, null, 9, null, null, null,
                        null, null, null, 6, null, null, null, null, null,
                        null, 3, null, null, null, null, null, null, null,
                    ]
                });

                expect(game.instance().hasMoreMoves()).toBe(true);
            });

            it('should return true if both cell values add up to 10', function () {
                const game = shallow(<Game />);

                game.setState({
                    game: [
                        null, 7, null, null, null, 9, null, null, null,
                        null, null, null, 6, null, null, null, null, null,
                        null, 3, null, null, null, null, null, null, null,
                    ]
                });

                expect(game.instance().hasMoreMoves()).toBe(true);
            });

            it('should return false if both cell values dont match', function () {
                const game = shallow(<Game />);

                game.setState({
                    game: [
                        null, 3, null, null, null, 9, null, null, null,
                        null, null, null, 6, null, null, null, null, null,
                        null, 8, null, null, null, null, null, null, null,
                    ]
                });

                expect(game.instance().hasMoreMoves()).toBe(false);
            });
        });

        it('should work in combination with the undo function', function () {
            const game = shallow(<Game />);

            game.setState({
                game: [null, 1, null, 3, null, 7, null, 8]
            });

            expect(game.instance().hasMoreMoves()).toBe(true);

            game.instance().onCellClicked(5);
            expect(game.instance().hasMoreMoves()).toBe(true);

            game.instance().onCellClicked(3);
            expect(game.instance().hasMoreMoves()).toBe(false);
            expect(game.state('game')).toEqual([null, 1, null, null, null, null, null, 8]);

            game.instance().undo();
            expect(game.instance().hasMoreMoves()).toBe(true);
            expect(game.state('game')).toEqual([null, 1, null, 3, null, 7, null, 8]);
        });
    });
});
