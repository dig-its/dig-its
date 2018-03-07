import { Button } from 'reactstrap';

import Layout from '../components/Layout';
import ErrorBoundary from '../components/ErrorBoundary';
import Game from '../components/Game';

export default () => (
    <ErrorBoundary>
        <Layout>
            <Game />
        </Layout>
    </ErrorBoundary>
);