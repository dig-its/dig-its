import { shallow } from 'enzyme';

import Grid from '../Grid';
import Cell from '../Cell';

describe('The Grid component', function () {
    it('should render cells', function () {
        const game = [1, 2, 3, 4, 5];
        const clickHandler = () => { };
        const grid = shallow(<Grid grid={game} selected={3} onCellClicked={clickHandler} />);

        let cells = grid.find(Cell);

        expect(cells).toHaveLength(5);

        expect(cells.get(0).key).toBe('cell-0-0');
        expect(cells.get(0).props.index).toBe(0);
        expect(cells.get(0).props.value).toBe(1);
        expect(cells.get(0).props.selected).toBe(3);
        expect(cells.get(0).props.onClick).toBe(clickHandler);

        expect(cells.get(1).key).toBe('cell-0-1');
        expect(cells.get(1).props.index).toBe(1);
        expect(cells.get(1).props.value).toBe(2);
        expect(cells.get(1).props.selected).toBe(3);
        expect(cells.get(1).props.onClick).toBe(clickHandler);

        expect(cells.get(2).key).toBe('cell-0-2');
        expect(cells.get(2).props.index).toBe(2);
        expect(cells.get(2).props.value).toBe(3);
        expect(cells.get(2).props.selected).toBe(3);
        expect(cells.get(2).props.onClick).toBe(clickHandler);

        expect(cells.get(3).key).toBe('cell-0-3');
        expect(cells.get(3).props.index).toBe(3);
        expect(cells.get(3).props.value).toBe(4);
        expect(cells.get(3).props.selected).toBe(3);
        expect(cells.get(3).props.onClick).toBe(clickHandler);

        expect(cells.get(4).key).toBe('cell-0-4');
        expect(cells.get(4).props.index).toBe(4);
        expect(cells.get(4).props.value).toBe(5);
        expect(cells.get(4).props.selected).toBe(3);
        expect(cells.get(4).props.onClick).toBe(clickHandler);
    });

    it('also renders empty cells', function () {
        const game = [1, null, 3, null, 5];
        const clickHandler = () => { };
        const grid = shallow(<Grid grid={game} selected={3} onCellClicked={clickHandler} />);

        let cells = grid.find(Cell);
        expect(cells).toHaveLength(5);

        expect(cells.get(0).key).toBe('cell-0-0');
        expect(cells.get(0).props.index).toBe(0);
        expect(cells.get(0).props.value).toBe(1);
        expect(cells.get(0).props.selected).toBe(3);
        expect(cells.get(0).props.onClick).toBe(clickHandler);

        expect(cells.get(1).key).toBe('cell-0-1');
        expect(cells.get(1).props.index).toBe(1);
        expect(cells.get(1).props.value).toBeNull();
        expect(cells.get(1).props.selected).toBe(3);
        expect(cells.get(1).props.onClick).toBe(clickHandler);

        expect(cells.get(2).key).toBe('cell-0-2');
        expect(cells.get(2).props.index).toBe(2);
        expect(cells.get(2).props.value).toBe(3);
        expect(cells.get(2).props.selected).toBe(3);
        expect(cells.get(2).props.onClick).toBe(clickHandler);

        expect(cells.get(3).key).toBe('cell-0-3');
        expect(cells.get(3).props.index).toBe(3);
        expect(cells.get(3).props.value).toBeNull();
        expect(cells.get(3).props.selected).toBe(3);
        expect(cells.get(3).props.onClick).toBe(clickHandler);

        expect(cells.get(4).key).toBe('cell-0-4');
        expect(cells.get(4).props.index).toBe(4);
        expect(cells.get(4).props.value).toBe(5);
        expect(cells.get(4).props.selected).toBe(3);
        expect(cells.get(4).props.onClick).toBe(clickHandler);
    });

    it('can render multiple rows', function () {
        const game = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            1, 2, 3, 4, 5, 6, 7, 8, 9,
        ];
        const grid = shallow(<Grid grid={game} />);

        let cells = grid.find(Cell);
        expect(cells).toHaveLength(27);

        expect(cells.get(0).key).toBe('cell-0-0');
        expect(cells.get(0).props.index).toBe(0);
        expect(cells.get(0).props.value).toBe(1);

        expect(cells.get(8).key).toBe('cell-0-8');
        expect(cells.get(8).props.index).toBe(8);
        expect(cells.get(8).props.value).toBe(9);

        expect(cells.get(9).key).toBe('cell-1-0');
        expect(cells.get(9).props.index).toBe(9);
        expect(cells.get(9).props.value).toBe(1);

        expect(cells.get(17).key).toBe('cell-1-8');
        expect(cells.get(17).props.index).toBe(17);
        expect(cells.get(17).props.value).toBe(9);

        expect(cells.get(18).key).toBe('cell-2-0');
        expect(cells.get(18).props.index).toBe(18);
        expect(cells.get(18).props.value).toBe(1);

        expect(cells.get(26).key).toBe('cell-2-8');
        expect(cells.get(26).props.index).toBe(26);
        expect(cells.get(26).props.value).toBe(9);
    });

    it('should not render cells in empty rows', function () {
        const game = [
            1, 2, 3, 4, 5, 6, 7, 8, 9,
            null, null, null, null, null, null, null, null, null,
            1, 2, 3, 4, 5, 6, 7, 8, 9,
        ];
        const grid = shallow(<Grid grid={game} />);

        let cells = grid.find(Cell);
        expect(cells).toHaveLength(18);

        expect(cells.get(0).key).toBe('cell-0-0');
        expect(cells.get(0).props.index).toBe(0);
        expect(cells.get(0).props.value).toBe(1);

        expect(cells.get(8).key).toBe('cell-0-8');
        expect(cells.get(8).props.index).toBe(8);
        expect(cells.get(8).props.value).toBe(9);

        expect(cells.get(9).key).toBe('cell-2-0');
        expect(cells.get(9).props.index).toBe(18);
        expect(cells.get(9).props.value).toBe(1);

        expect(cells.get(17).key).toBe('cell-2-8');
        expect(cells.get(17).props.index).toBe(26);
        expect(cells.get(17).props.value).toBe(9);
    });
});