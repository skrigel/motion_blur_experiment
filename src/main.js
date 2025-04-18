import { initJsPsych } from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import fullscreenPlugin from '@jspsych/plugin-fullscreen';
import imageButtonResponse from '@jspsych/plugin-image-button-response';
import surveyMultiChoice from '@jspsych/plugin-survey-multi-choice';
import { getProlificID } from './utils';
import Papa from 'papaparse';

// const exPath = "https://www.w3schools.com/images/img_girl.jpg"

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


const imageOptions = ['Bicycle', 'Car', 'Person', 'Scooter', 'Dog']




const timeline=[];

const jsPsych = initJsPsych();


// Welcome screen
timeline.push({
  type: htmlKeyboardResponse,
  stimulus: '<p>Welcome! Press any key to read instructions.</p>',
});

const instructions = {
  type: htmlKeyboardResponse,
  stimulus: `
    <p>In this experiment, an image will appear in the center 
    of the screen.</p><p> There will be a blurred object highlighted in a geometric box, and 
    you will be asked two questions about the object.</p>
    <p>1. <strong>What is the object?</strong> - pick the best choice amongst the provided options</p>
    <p>2. <strong>In what direction is the object moving?</strong> - pick the best choice amongst the provided options</p>
  
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
const createQuestionSlide = (imagePath, questionText, options, trueDir, trueIdentity, trialType, trialId, prolificID) => {
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
        trueLabel: trialType=== 'object_identification' ? trueIdentity : trueDir,
        trialType: trialType || "No trial type provided", // Ensure trialType is included
        trialId: trialId,
        prolificId: prolificID || "Unknown"
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
const prolificID = getProlificID();
let csvData = [];

fetch(`${API_URL}/data`)
  .then(res => res.json())
  .then(data => {

    csvData = data.map((row)=> [`/${row['File Name']}`, imageOptions, row['Object Identity'], row['Motion Direction']])
    console.log('CSV data:', csvData);
    // You can now use csvData in your code

    console.log('Parsed image paths:', csvData.map(d => d[0]));

    csvData.forEach(([imagePath, objectOptions, trueIdentity, trueDirection], idx) => {
      timeline.push(createQuestionSlide(
        imagePath, objectQuestionText, objectOptions, trueDirection, trueIdentity,
        'object_identification', idx, prolificID
      ));

      timeline.push(createQuestionSlide(
        imagePath,  motionQuestionText,
        ['Up', 'Down', 'Left', 'Right', 'Into screen', 'Out of screen'],
        trueDirection, trueIdentity, 'motion_direction', idx, prolificID
      ));
    });
  });


// Run the Experiment
jsPsych.run(timeline);