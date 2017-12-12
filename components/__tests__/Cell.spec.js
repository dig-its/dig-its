import { shallow } from 'enzyme';

import Cell from '../Cell';

describe('The Cell component', function () {
    describe('The select() method', function () {
        it('should bubble the event if value is not empty', function () {
            const handler = jest.fn();
            const cell = shallow(<Cell value={1} index={123} onClick={handler} />);

            cell.simulate('click');

            expect(handler).toHaveBeenCalledWith(123);
        });

        it('should not bubble the event if value is empty', function () {
            const handler = jest.fn();
            const cell = shallow(<Cell value={null} onClick={handler} />);

            cell.simulate('click');

            expect(handler).not.toHaveBeenCalled();
        });
    });

    describe('The shouldComponentUpdate() method', function () {
        it('should update when the value changes', function () {
            const cell = shallow(<Cell value={1} />);

            const spy = jest.spyOn(cell.instance(), 'render');

            cell.setProps({ value: 2 });

            expect(spy).toHaveBeenCalled();
        });

        it('should not update when the value remains the same', function () {
            const cell = shallow(<Cell value={null} />);

            const spy = jest.spyOn(cell.instance(), 'render');

            cell.setProps({ value: null });

            expect(spy).not.toHaveBeenCalled();
        });

        it('should update when the selected index changes to the current index', function () {
            const cell = shallow(<Cell value={1} index={2} selected={3} />);

            const spy = jest.spyOn(cell.instance(), 'render');

            cell.setProps({ selected: 2 });

            expect(spy).toHaveBeenCalled();
        });

        it('should update when the selected index changes from the current index', function () {
            const cell = shallow(<Cell value={1} index={2} selected={2} />);

            const spy = jest.spyOn(cell.instance(), 'render');

            cell.setProps({ selected: null });

            expect(spy).toHaveBeenCalled();
        });

        it('should not update when irrelevant selected index change occurs', function () {
            const cell = shallow(<Cell value={1} index={2} selected={3} />);

            const spy = jest.spyOn(cell.instance(), 'render');

            cell.setProps({ selected: 4 });

            expect(spy).not.toHaveBeenCalled();
        });

        it('should not update when the selected index updates and stays the same', function () {
            const cell = shallow(<Cell value={1} index={2} selected={2} />);

            const spy = jest.spyOn(cell.instance(), 'render');

            cell.setProps({ selected: 2 });

            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('The render() method', function () {
        it('should assign CSS class "selected" when the cell is selected', function () {
            const cell = shallow(<Cell value={1} index={2} selected={2} />);

            expect(cell.is('.selected')).toBe(true);
        });

        it('should assign not CSS class "selected" when the cell is not selected', function () {
            const cell = shallow(<Cell value={1} index={2} selected={3} />);

            expect(cell.is('.selected')).toBe(false);
        });

        it('should use the pointer cursor when the value is not empty', function () {
            const cell = shallow(<Cell value={1} />);

            expect(cell.render().css('cursor')).toBe('pointer');
        });

        it('should use the arrow cursor when the value is empty', function () {
            const cell = shallow(<Cell value={null} />);

            expect(cell.render().css('cursor')).toBe('default');
        });

        it('should display the value if it is not empty', function () {
            const cell = shallow(<Cell value={6} />);

            expect(cell.find('.value').text()).toBe('6');
        });

        it('should display a non-breaking space if the value is empty', function () {
            const cell = shallow(<Cell value={null} />);

            expect(cell.find('.value').text()).toBe('\u00a0');
        });
    });
});