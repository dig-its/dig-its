import { Component } from 'react';
import Error from 'next/error';
import Raven from 'raven-js';

import version from '../version';

export default class extends Component {
    constructor(props) {
        super(props);

        this.state = {
            error: null,
            report: (process.env.NODE_ENV === 'production'),
        };

        console.log(version);

        if (this.state.report) {
            Raven.config('https://c351cbe16e2d4e9a956d36394557f7cd@sentry.io/299119').install();
        }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error });

        Raven.captureException(error, { extra: errorInfo });
    }

    render() {
        if (this.state.error) {
            return (
                <div
                    className="error"
                    onClick={() => this.state.report && Raven.lastEventId() && Raven.showReportDialog()}>

                    <Error />

                    {this.state.report &&
                        <style jsx>{`
                            .error {
                                cursor: pointer;
                            }
                        `}</style>
                    }
                </div>
            );
        } else {
            return this.props.children;
        }
    }
}