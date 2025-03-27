import { initJsPsych } from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import fullscreenPlugin from '@jspsych/plugin-fullscreen';
import imageButtonResponse from '@jspsych/plugin-image-button-response';
import surveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import bikeImg from './assets/new_03_blur.png';

const API_URL = "https://motion-blur-experiment.onrender.com/api"

async function sendDataToServer(responseData){
  try {
    const res = await fetch(`${API_URL}/responses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(responseData),
    });
    const data = await res.json();
    console.log("Server Response:", data);
  } catch (error) {
    console.error("Error sending data:", error);
  }
};
// Import your images
// import imagePath from './assets/new_03_blur.png';  // Ensure the correct path to your image

const jsPsych = initJsPsych();

const imageOptions = {image1: [bikeImg, ['Bicycle', 'Car', 'Person', 'Scooter', 'Dog']]};
// Define the main timeline array
const timeline = [];


// Welcome screen
timeline.push({
  type: htmlKeyboardResponse,
  stimulus: '<p>Welcome! Press any key to start the experiment.</p>',
});

const instructions = {
  type: htmlKeyboardResponse,
  stimulus: `
    <p>In this experiment, an image will appear in the center 
    of the screen.</p><p> There will be a blurred object highlighted in a geometric box, and 
    you will be asked two questions about the object.</p>
    <p>1. <strong>What is the object?</strong> - pick the best choice amongst the provided options</p>
      <p>2. <strong>In what direction is the object moving?</strong> - pick the best choice amongst the provided options</p>
    <div style='width: 700px;'>
    <div style='float: left;'><img src='img/blue.png'></img>
    <p class='small'><strong>Press the F key</strong></p></div>
    <div style='float: right;'><img src='img/orange.png'></img>
    <p class='small'><strong>Press the J key</strong></p></div>
    </div>
    <p>Press any key to begin.</p>
  `,
  post_trial_gap: 1500
};

timeline.push(instructions)
// // Fullscreen Mode
// timeline.push({
//   type: fullscreenPlugin,
//   fullscreen_mode: true,
// });

// Modify createQuestionSlide to send data
const createQuestionSlide = (imagePath, questionText, options, trialType) => {
  return {
    type: surveyMultiChoice,
    preamble: `
      <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%;">
        <img src="${imagePath}" style="max-width: 50vw; max-height: 50vh; display: block; margin-bottom: 20px;">
      </div>
    `,
    questions: [
      {
        prompt: `<div style="text-align: center; font-size: 22px; font-weight: bold;">${questionText}</div>`,
        options: options,
        required: true,
      }
    ],
    data: { task: 'response', trial_type: trialType, image: imagePath},
    on_finish: (data) => {
      console.log("Data received from jsPsych:", data); // Debugging log
    
      const responseValue = Object.values(data.response)[0]; // Extract response value
      const payload = {
        image: data.image || "No image provided",  // Ensure image is included
        selection: responseValue || "Null",
        trialType: trialType || "No trial type provided", // Ensure trialType is included
      };
    
      console.log("Payload being sent:", payload); // Debugging log
      sendDataToServer(payload);
    },
  };
};

// Define Question Texts
const objectQuestionText = 'What is this object?';
const motionQuestionText = 'What direction is this object moving in?';

// Add Object Identification Question


Object.values(imageOptions).forEach(([imagePath, objectOptions])=>{

  timeline.push(createQuestionSlide(
    imagePath,
    objectQuestionText, 
    objectOptions, 
    'object identification'
  ));

  // Add Motion Direction Question
  timeline.push(createQuestionSlide(imagePath,
  motionQuestionText, 
  ['Up', 'Down', 'Left', 'Right', 'Into screen', 'Out of screen'], 
  'motion_direction'
));

})




// Run the Experiment
jsPsych.run(timeline);