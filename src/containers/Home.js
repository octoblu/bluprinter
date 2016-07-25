import React from 'react'
import { AppBar, AppBarPrimary, AppBarSecondary } from 'zooid-ui'
import Page from 'zooid-page'

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

      <Page title="Page Title">
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
      </Page>
    </div>
  )
}

export default Home
