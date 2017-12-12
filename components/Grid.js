import { Component } from 'react';
import _isEqual from 'lodash/isEqual';
import _chunk from 'lodash/chunk';

import Cell from './Cell';

export default class extends Component {
    render = () => {
        const cells = [];

        const rows = _chunk(this.props.grid, 9);
        rows.forEach((row, i) => {
            if (row.some(v => v)) {
                row.forEach((value, j) => {
                    cells.push(
                        <Cell
                            key={`cell-${i}-${j}`}
                            index={(i * 9) + j}
                            value={value}
                            selected={this.props.selected}
                            onClick={this.props.onCellClicked} />
                    );
                });
            }
        });

        return (
            <div className="row mb-5">
                <style jsx>{`
                    .grid {
                        border-color: silver;
                        border-style: solid;                        
                        border-width: 1px 0 0 1px;
                        overflow: auto;
                    }
                `}</style>

                <div className="col-12">
                    <div className="grid">
                        {cells}
                    </div>
                </div>
            </div>
        );
    }
}