import { Component } from 'react'

import NonBreakingSpace from './NonBreakingSpace'

export default class extends Component {
  size = 45

  select = () => {
    if (this.props.value) {
      this.props.onClick(this.props.index)
    }
  }

  shouldComponentUpdate = nextProps => {
    if (this.props.value !== nextProps.value) {
      return true
    }

    if (this.isSelected() && !this.isSelected(nextProps.selected)) {
      return true
    }

    if (!this.isSelected() && this.isSelected(nextProps.selected)) {
      return true
    }

    return false
  }

  isSelected = (selected = this.props.selected) => {
    return selected === this.props.index
  }

  render = () => {
    return (
      <div
        className={'cell' + (this.isSelected() ? ' selected' : '')}
        style={{ cursor: this.props.value ? 'pointer' : 'default' }}
        onClick={this.select}>
        <style jsx>{`
          .cell {
            width: 11.1%;
            border-color: silver;
            border-style: solid;
            border-width: 0 1px 1px 0;
            float: left;
            color: darkblue;
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .cell:before {
            content: '';
            float: left;
            padding-top: 100%;
          }

          .cell.selected {
            background-color: darkblue;
            color: white;
          }

          .value {
            font-family: Mali, Consolas, monospace;
            font-size: 45px;
          }

          @media (max-width: 1580px) {
            .value {
              font-size: 35px;
            }
          }

          @media (max-width: 980px) {
            .value {
              font-size: 30px;
            }
          }

          @media (max-width: 320px) {
            .value {
              font-size: 15px;
            }
          }
        `}</style>

        <div className="value">{this.props.value || <NonBreakingSpace />}</div>
      </div>
    )
  }
}
