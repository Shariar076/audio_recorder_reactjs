import React__default, { Component } from 'react';

var styles = {"recorder_library_box":"_styles-module__recorder_library_box__1ceqH","recorder_box":"_styles-module__recorder_box__2fG9h","recorder_box_inner":"_styles-module__recorder_box_inner__dt3-T","mic_icon":"_styles-module__mic_icon__1dpop","microphone_icon_sec":"_styles-module__microphone_icon_sec__3neb0","mic_icon_svg":"_styles-module__mic_icon_svg__3wi1g","reco_header":"_styles-module__reco_header__1lB9c","h2":"_styles-module__h2__2N9dq","close_icons":"_styles-module__close_icons__3-aC9","record_section":"_styles-module__record_section__3bC73","duration_section":"_styles-module__duration_section__1YOWG","btn_wrapper":"_styles-module__btn_wrapper__1Yplu","btn":"_styles-module__btn__1Pz2d","clear_btn":"_styles-module__clear_btn__2gd2_","upload_btn":"_styles-module__upload_btn__37kfa","duration":"_styles-module__duration__f2DT8","recorder_page_box":"_styles-module__recorder_page_box__17RTH","help":"_styles-module__help__eV_dK","record_controller":"_styles-module__record_controller__qxztz","icons":"_styles-module__icons__2uz65","stop":"_styles-module__stop__1bSom","pause":"_styles-module__pause__3nQu5","play_icons":"_styles-module__play_icons__3O0Io","pause_icons":"_styles-module__pause_icons__2ACrw","stop_icon":"_styles-module__stop_icon__oEOY-"};

const audioType = 'audio/*';

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      time: {},
      miliseconds: 0,
      recording: false,
      medianotFound: false,
      audios: [],
      audioBlob: null,
      stream: null
    };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  handleAudioPause(e) {
    e.preventDefault();
    clearInterval(this.timer);
    this.mediaRecorder.pause();
    this.setState({
      pauseRecord: true
    });
  }

  handleAudioStart(e) {
    e.preventDefault();
    this.startTimer();
    this.mediaRecorder.resume();
    this.setState({
      pauseRecord: false
    });
  }

  startTimer() {
    this.timer = setInterval(this.countDown, 100);
  }

  countDown() {
    this.setState(prevState => {
      const miliseconds = prevState.miliseconds + 100;
      return {
        time: this.milisecondsToTime(miliseconds),
        miliseconds: miliseconds
      };
    });
    this.props.handleCountDown(this.state.time);
  }

  milisecondsToTime(milisecs) {
    let secs = milisecs / 1000;
    let hours = Math.floor(secs / (60 * 60));
    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);
    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);
    let obj = {
      h: hours,
      m: minutes,
      s: seconds,
      ms: milisecs
    };
    return obj;
  }

  async initRecorder() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;

    if (navigator.mediaDevices) {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      if (this.props.mimeTypeToUseWhenRecording) {
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: this.props.mimeTypeToUseWhenRecording
        });
      } else {
        this.mediaRecorder = new MediaRecorder(stream);
      }

      this.chunks = [];

      this.mediaRecorder.ondataavailable = e => {
        if (e.data && e.data.size > 0) {
          this.chunks.push(e.data);
        }
      };

      this.stream = stream;
    } else {
      this.setState({
        medianotFound: true
      });
      console.log('Media Decives will work only with SSL.....');
    }
  }

  async startRecording(e) {
    e.preventDefault();
    this.chunks = [];
    await this.initRecorder();
    this.mediaRecorder.start(10);
    this.startTimer();
    this.setState({
      recording: true
    });
  }

  stopRecording(e) {
    clearInterval(this.timer);
    this.setState({
      time: {}
    });
    e.preventDefault();

    if (this.stream.getAudioTracks) {
      const tracks = this.stream.getAudioTracks();
      tracks.forEach(track => {
        track.stop();
      });
    } else {
      console.log('No Tracks Found');
    }

    this.mediaRecorder.stop();
    this.setState({
      recording: false,
      pauseRecord: false
    });
    this.saveAudio();
  }

  handleReset(e) {
    if (this.state.recording) {
      this.stopRecording(e);
    }

    this.setState({
      time: {},
      miliseconds: 0,
      recording: false,
      medianotFound: false,
      audios: [],
      audioBlob: null
    }, () => {
      this.props.handleReset(this.state);
    });
  }

  saveAudio() {
    const blob = new Blob(this.chunks, {
      type: audioType
    });
    const audioURL = window.URL.createObjectURL(blob);
    const audios = [audioURL];
    this.setState({
      audios,
      audioBlob: blob
    });
    this.props.handleAudioStop({
      url: audioURL,
      blob: blob,
      chunks: this.chunks,
      duration: this.state.time
    });
  }

  render() {
    const {
      recording,
      audios,
      time,
      medianotFound,
      pauseRecord
    } = this.state;
    const {
      showUIAudio,
      title,
      audioURL,
      disableFullUI
    } = this.props;

    if (disableFullUI) {
      return null;
    }

    return /*#__PURE__*/React__default.createElement("div", {
      className: styles.recorder_library_box
    }, /*#__PURE__*/React__default.createElement("div", {
      className: styles.recorder_box
    }, /*#__PURE__*/React__default.createElement("div", {
      className: styles.recorder_box_inner
    }, !this.props.hideHeader ? /*#__PURE__*/React__default.createElement("div", {
      className: styles.reco_header
    }, /*#__PURE__*/React__default.createElement("h2", {
      className: styles.h2
    }, title), /*#__PURE__*/React__default.createElement("span", {
      className: styles.close_icons
    })) : null, !medianotFound ? /*#__PURE__*/React__default.createElement("div", {
      className: styles.record_section
    }, /*#__PURE__*/React__default.createElement("div", {
      className: styles.btn_wrapper
    }, /*#__PURE__*/React__default.createElement("button", {
      onClick: () => this.props.handleAudioUpload(this.state.audioBlob),
      className: `${styles.btn} ${styles.upload_btn}`,
      disabled: this.props.uploadButtonDisabled
    }, "Upload"), /*#__PURE__*/React__default.createElement("button", {
      onClick: e => this.handleReset(e),
      className: `${styles.btn} ${styles.clear_btn}`
    }, "Clear")), /*#__PURE__*/React__default.createElement("div", {
      className: styles.duration_section
    }, /*#__PURE__*/React__default.createElement("div", {
      className: styles.audio_section
    }, audioURL !== null && showUIAudio ? /*#__PURE__*/React__default.createElement("audio", {
      controls: true
    }, /*#__PURE__*/React__default.createElement("source", {
      src: audios[0],
      type: "audio/ogg"
    }), /*#__PURE__*/React__default.createElement("source", {
      src: audios[0],
      type: "audio/mpeg"
    })) : null), /*#__PURE__*/React__default.createElement("div", {
      className: styles.duration
    }, /*#__PURE__*/React__default.createElement("span", {
      className: styles.mins
    }, time.m !== undefined ? `${time.m <= 9 ? '0' + time.m : time.m}` : '00'), /*#__PURE__*/React__default.createElement("span", {
      className: styles.divider
    }, ":"), /*#__PURE__*/React__default.createElement("span", {
      className: styles.secs
    }, time.s !== undefined ? `${time.s <= 9 ? '0' + time.s : time.s}` : '00')), !recording ? /*#__PURE__*/React__default.createElement("p", {
      className: styles.help
    }, "Press the microphone to record") : null), !recording ? /*#__PURE__*/React__default.createElement("a", {
      onClick: e => this.startRecording(e),
      href: " #",
      className: styles.mic_icon
    }, /*#__PURE__*/React__default.createElement("span", {
      className: styles.microphone_icon_sec
    }, /*#__PURE__*/React__default.createElement("svg", {
      className: styles.mic_icon_svg,
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg",
      x: "0px",
      y: "0px",
      viewBox: "0 0 1000 1000",
      enableBackground: "new 0 0 1000 1000"
    }, /*#__PURE__*/React__default.createElement("g", null, /*#__PURE__*/React__default.createElement("path", {
      d: "M500,683.8c84.6,0,153.1-68.6,153.1-153.1V163.1C653.1,78.6,584.6,10,500,10c-84.6,0-153.1,68.6-153.1,153.1v367.5C346.9,615.2,415.4,683.8,500,683.8z M714.4,438.8v91.9C714.4,649,618.4,745,500,745c-118.4,0-214.4-96-214.4-214.4v-91.9h-61.3v91.9c0,141.9,107.2,258.7,245,273.9v124.2H346.9V990h306.3v-61.3H530.6V804.5c137.8-15.2,245-132.1,245-273.9v-91.9H714.4z"
    }))))) : /*#__PURE__*/React__default.createElement("div", {
      className: styles.record_controller
    }, /*#__PURE__*/React__default.createElement("a", {
      onClick: e => this.stopRecording(e),
      href: " #",
      className: `${styles.icons} ${styles.stop}`
    }, /*#__PURE__*/React__default.createElement("span", {
      className: styles.stop_icon
    })), /*#__PURE__*/React__default.createElement("a", {
      onClick: !pauseRecord ? e => this.handleAudioPause(e) : e => this.handleAudioStart(e),
      href: " #",
      className: `${styles.icons} ${styles.pause}`
    }, pauseRecord ? /*#__PURE__*/React__default.createElement("span", {
      className: styles.play_icons
    }) : /*#__PURE__*/React__default.createElement("span", {
      className: styles.pause_icons
    })))) : /*#__PURE__*/React__default.createElement("p", {
      style: {
        color: '#fff',
        marginTop: 30,
        fontSize: 25
      }
    }, "Seems the site is Non-SSL"))));
  }

}
Recorder.defaultProps = {
  hideHeader: false,
  mimeTypeToUseWhenRecording: null,
  handleCountDown: data => {}
};

export { Recorder };
//# sourceMappingURL=index.modern.js.map
