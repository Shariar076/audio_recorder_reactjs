import React from 'react'
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios"
import Textboard from './components/Textboard'
import Recorder from './components/Recorder'
import './dist/index.css'
import constants from './components/Constants'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: null,
      nextButtonDisabled: false,
      audioDetails: {
        url: null,
        blob: null,
        chunks: null,
        duration: {
          h: 0,
          m: 0,
          s: 0
        }
      }
    }
    this.uploadButtonDisabled = true;
  }

  handleAudioStop(data) {
    this.setState({ audioDetails: data });
    this.uploadButtonDisabled = false;
  }
  handleAudioUpload(file) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("transcript", this.state.text);
    formData.append("type", constants.symptom_type);
    // formData.set("id_token", localStorage.getItem('accessToken'));
    const token = localStorage.getItem('accessToken');
    axios
      .post(`${constants.backend_api_url}/file`, formData, {
        headers: {
          'authorization': token
        }
      })
      .then(res => console.log(res))
      .catch(err => console.warn(err));
    this.handleReset();
  }
  handleReset() {
    const reset = {
      url: null,
      blob: null,
      chunks: null,
      duration: {
        h: 0,
        m: 0,
        s: 0
      }
    };
    this.setState({ audioDetails: reset, nextButtonDisabled: false });
    this.uploadButtonDisabled = true;
  }

  handleTextUpdate(text) {
    this.setState({ text: text });
    this.uploadButtonDisabled = true;
  }

  disableNextButton() {
    this.setState({ nextButtonDisabled: true });
  }

  render() {
    if (localStorage.getItem('accessToken') == null || localStorage.getItem('accessToken') == "") {
      if (window.location.hash != null && window.location.hash != "") {
        var hash = window.location.hash;

        var access_token = new URLSearchParams(hash).get('access_token');
        var id_token = hash.match(/\#(?:id_token)\=([\S\s]*?)\&/)[1];
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('identityToken', id_token);
        window.location = `https://speech.medaihealth.com/${constants.symptom_type}`;
      }
    }
    if (localStorage.getItem('accessToken') == null || localStorage.getItem('accessToken') == "") {
      // default
      // window.location = 'https://neuralogicspeechrecorder.auth.ap-southeast-1.amazoncognito.com/login?client_id=1lakm97d7042be0i02od7gt4m2&response_type=token&scope=openid&redirect_uri=https://speech.medaihealth.com';
      // sylhet
      // window.location = 'https://neuralogicspeechrecordersylhet.auth.ap-southeast-1.amazoncognito.com/login?client_id=3aiugte9ce538mrech5b5sup2a&response_type=token&scope=openid&redirect_uri=https://speech.medaihealth.com/sylhet';
      // ctg
      window.location = 'https://neuralogicspeechrecorderctg.auth.ap-southeast-1.amazoncognito.com/login?client_id=1oopdug378g99tgv1sf4vo0tsh&response_type=token&scope=openid&redirect_uri=https://speech.medaihealth.com/ctg';
    } else {
      return (
        <Router basename={`/${constants.symptom_type}`}>
          <div style={{ backgroundImage: `linear-gradient(floralwhite, white)`, height: "100vh" }}>
            <Textboard
              onTextUpdate={this.handleTextUpdate.bind(this)}
              onReset={this.handleReset.bind(this)}
              nextButtonDisabled={this.state.nextButtonDisabled}
            />
            <Recorder
              record={true}
              title={"Recorder"}
              audioURL={this.state.audioDetails.url}
              showUIAudio
              uploadButtonDisabled={this.uploadButtonDisabled}
              disableNextButton={() => this.disableNextButton()}
              handleAudioStop={data => this.handleAudioStop(data)}
              handleAudioUpload={data => this.handleAudioUpload(data)}
              handleReset={() => this.handleReset()}
              mimeTypeToUseWhenRecording={`audio/webm`}
            />
          </div>
        </Router>
      )
    }
  }
}

export default App
