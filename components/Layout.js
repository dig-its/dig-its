import { Component } from 'react';
import Head from 'next/head';
import { Container, Navbar, NavbarBrand } from 'reactstrap';
import GithubRibbon from './GithubRibbon';
import ReactGA from 'react-ga';

export default class extends Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false
        };
    }

    componentDidMount = () => {
        if (window.location.hostname != 'localhost') {
            ReactGA.initialize('UA-111542732-1');
            ReactGA.pageview(window.location.pathname + window.location.search);
        }
    };

    toggle() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render() {
        return (
            <div>
                <Head>
                    <title>Dig-Its</title>
                    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
                    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css"
                        integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb"
                        rel="stylesheet"
                        crossorigin="anonymous" />
                </Head>
                <Container>
                    <GithubRibbon />
                    <h1>Dig-Its</h1>

                    {this.props.children}
                </Container>
            </div>
        );
    };
}