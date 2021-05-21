import 'raf/polyfill'
import { configure } from 'enzyme'
// temporary until official enzyme-adapter-react-17 is released
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

configure({ adapter: new Adapter() })
