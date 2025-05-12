import { Component } from "react";
import Head from "next/head";
import { Container } from "reactstrap";
import ReactGA from "react-ga4";
import Script from "next/script";

import GithubRibbon from "./GithubRibbon";

export default class Layout extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
    };
  }

  componentDidMount = () => {
    if (window.location.hostname !== "localhost") {
      ReactGA.initialize([{ trackingId: "G-X43JKMZ9SV" }]);
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
      });
    }
  };

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }

  render() {
    return (
      <div>
        <Head>
          <title>Dig-Its</title>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
        </Head>
        <Container>
          <GithubRibbon />
          <h1>Dig-Its</h1>

          {this.props.children}

          <Script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-X43JKMZ9SV"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'G-X43JKMZ9SV');
            `}
          </Script>
        </Container>
      </div>
    );
  }
}
