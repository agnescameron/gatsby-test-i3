import { Link } from "gatsby"
import * as React from 'react'
import Layout from './components/layout'

const AboutPage = () => {
  return (
    <Layout>
    <h1>About</h1>
    <p>This is the web version of the I³ Open Innovation Dataset Index – a collection of innovation datasets, and related tools, platforms and resources used by the broader research community. This site uses a Github and Google Sheets-based infrastructure to version and manage the files. Everything on this site may be edited collectively -- guidelines for doing so are listed below, but feel free to <a href="mailto:agnescam@mit.edu">get in touch</a> with any questions.</p>

    <p>This index is part of the <a href="https://iii.pubpub.org/">Information Innovation Initiative</a>, supported by the <a href="https://sloan.org/">Alfred P. Sloan Foundation.</a></p>

    <h2>Contribution Guidelines</h2>

    <p>You can contribute to this site, either by can editing our <a href="https://docs.google.com/spreadsheets/d/1bdyhGrj0oNz-_qW3Rv2GNGqhZZ73rgj-DYWePLA_1Ms/edit#gid=1389884911">google sheet</a> (updates made to the sheet will take a couple of minutes to display), 
    or by making a pull request to our <a href="https://github.com/Innovation-Information-Initiative/Open-Innovation-Dataset-Index">GitHub repository</a>.</p>

    <h3>Edit this site using Google Sheets</h3>

    <div class="videoContainer">
      <iframe class="video" src="https://www.youtube.com/embed/4MetDevXStU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    <p>The I³ Index <a href="https://docs.google.com/spreadsheets/d/1bdyhGrj0oNz-_qW3Rv2GNGqhZZ73rgj-DYWePLA_1Ms/edit#gid=1389884911">Google Sheet</a> can be used to create new records, and edit existing ones. To add a new record, navigate to the bottom of the sheet and begin to add data. A script will automatically generate a UUID for the record, and within around 15 minutes the changes you have made will be reflected on the site.</p>

    <p>Note: it is only possible to modify the 'infobox' section of a page using the google sheet, as that's where structured data is stored. For more longform edits, or to contribute to or edit a collection, see the Github contribution guidelines below.</p>

    <h3>Edit this site using Github</h3>

    <div class="videoContainer">
      <iframe class="video" src="https://www.youtube.com/embed/r17j-0TusGI" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
    </div>

    <p>The I³ <a href="https://github.com/Innovation-Information-Initiative/Open-Innovation-Dataset-Index">Open Innovation Dataset Index Github repository</a> can be used to edit any aspect of this website, and valid edits to datasets, collections, and tools will be automatically integrated without the need to wait for manual checks.</p>

    <p>In order to make an edit using Github, you will need a Github account, but it is not necessary to download git software or make a copy of the repository (unless you prefer to work in that way). A full guide to adding and editing files using the Github interface may be found <a href="https://docs.github.com/en/repositories/working-with-files/managing-files/creating-new-files">here</a> </p>

    <p>You do not need write access to the repository to make edits to the site. Instead, you will need to open a 'pull request' containing the proposed edits, which will be checked for validity and auto-merged by a Github action that listens for changes. This script will also update the Google Sheet, so there is no need to edit both. For a full guide to making pull requests using the Github interface, see <a href="https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request-from-a-fork">here</a></p>

    <h3>Use this Dataset</h3>

    <p>Up-to-date CSV copies of the datasets and tools are maintained <a href="https://github.com/Innovation-Information-Initiative/Open-Innovation-Dataset-Index/tree/main/index_archive">here</a>, and may be downloaded/used/distributed under the terms of the MIT License.</p>
    </Layout>
  )
}


export const Head = () => <title>iiindex -> about</title>


export default AboutPage
