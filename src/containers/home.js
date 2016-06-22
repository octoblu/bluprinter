import React from 'react'
import { AppBar, AppBarPrimary, AppBarSecondary, Page } from 'zooid-ui'
import Heading from 'zooid-heading'

const Home = () => {
  return (
    <div>
      <AppBar>
        <AppBarPrimary>
          <a
            className="OctobluAppBar-link OctobluAppBar-link--logo"
            href="https://app.octoblu.com"
          >
            <img
              className="OctobluAppBar-logo"
              alt="Octoblu"
              src="//d2zw6j512x6z0x.cloudfront.net/master/d48dc0bf063ecc1477d1163831ee8ff17efbbfae/assets/images/octoblu_logo.png"
            />
          </a>

          <nav className="OctobluAppBar-nav OctobluAppBar-nav--primary" role="navigation">
            <a className="OctobluAppBar-link" href="/">Bluprinter</a>
          </nav>
        </AppBarPrimary>

        <AppBarSecondary />
      </AppBar>

      <Page width="small">
        <Heading level={1}>IoT Apps</Heading>
      </Page>
    </div>

  )
}

export default Home
