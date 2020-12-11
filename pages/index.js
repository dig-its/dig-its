import Layout from '../components/Layout'
import ErrorBoundary from '../components/ErrorBoundary'
import Game from '../components/Game'

const Index = () => (
  <ErrorBoundary>
    <Layout>
      <Game />
    </Layout>
  </ErrorBoundary>
)

export default Index
