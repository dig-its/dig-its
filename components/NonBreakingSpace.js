const NonBreakingSpace = ({ times = 1 }) => {
  let output = ''

  for (let i = 0; i < times; i++) {
    output += '\u00a0'
  }

  return output
}

export default NonBreakingSpace
