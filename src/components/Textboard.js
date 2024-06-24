import React, { Component } from 'react';
import styles from '../styles.module.css';
import axios from "axios"
import { Button, Collapse } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import constants from './Constants'

class Textboard extends Component {

	constructor(props) {
		super(props);
		this.state = {
			text: "Can't connect to backend",
			showTutorial: false
		};
	}


	componentDidMount() {
		this.updateText();
	}
	getText() {
		return this.state.text;
	}
	updateText() {
		axios({
			method: 'get',
			url: `${constants.backend_api_url}/symptom?type=${constants.symptom_type}`,
			timeout: 4000
		})
			.then(response => {
				this.setState({ text: response.data.text });
				this.props.onTextUpdate(response.data.text);
				this.props.onReset();
			})
			.catch(error => console.error('timeout exceeded'))

	}

	logoutHandler(e) {
		localStorage.clear()
		window.location.reload(false);
	}


	render() {
		return (
			<div>
				<div className={styles.logout_box}>
					<Button
						onClick={e => this.logoutHandler(e)}
					>
						Logout
					</Button>
				</div>
				<div className={styles.help_box}>
					<Button
						onClick={() => this.setState({ showTutorial: !this.state.showTutorial })}
						aria-controls="example-collapse-text"
						aria-expanded={this.state.showTutorial}
					>
						Tutorial
					</Button>
					<Collapse in={this.state.showTutorial}>
						<div id="example-collapse-text">
							<ol>
								<li>Please choose a silent environment for recording.</li>
								<li>Click record(mic) icon to start recording. Please use headphones if possible.</li>
								<li>Utter only the text that appears under <b>Symptom</b> in the black area. Plase utter clearly.</li>
								<li>You can pause and continue while recording.</li>
								<li>Click the stop button when you are finished.</li>
								<li>You can listen to your recording and clear it if there's any problem by clicking the <b>Clear</b> button.</li>
								<li>Upload the recording by clicking <b>Upload</b> button.</li>
								<li>Click <b>Next</b> to get a new text and start again.</li>
								<li>Try to upload as many recording as you can.</li>
							</ol>
						</div>
					</Collapse>
				</div>
				<div className={styles.text_library_box}>
					<div className={styles.text_box}>
						<div className={styles.text_box_inner}>
							{
								!this.props.hideHeader ?
									<div className={styles.text_header}>
										<h2 className={styles.h2}>Symptom</h2>
									</div> :
									null
							}
							{

								<div className={styles.text}>

									<h2 >{this.state.text}</h2>
									<div className={styles.btn_wrapper}>
										<button
											onClick={() => this.updateText()}
											className={`${styles.btn}`}
											disabled={this.props.nextButtonDisabled}
										>
											Next
										</button>
									</div>
								</div>

							}
						</div>
					</div>
				</div>
			</div>
		)
	}
}
export default Textboard;