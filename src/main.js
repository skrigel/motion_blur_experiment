import { initJsPsych } from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import fullscreenPlugin from '@jspsych/plugin-fullscreen';
import imageButtonResponse from '@jspsych/plugin-image-button-response';
import surveyMultiChoice from '@jspsych/plugin-survey-multi-choice';

// Import your images
import imagePath from './assets/new_03_blur.png';  // Ensure the correct path to your image

const jsPsych = initJsPsych();

// Define the main timeline array
const timeline = [];

// Welcome screen
timeline.push({
  type: htmlKeyboardResponse,
  stimulus: '<p>Welcome! Press any key to start the experiment.</p>',
});


// // Fullscreen Mode
// timeline.push({
//   type: fullscreenPlugin,
//   fullscreen_mode: true,
// });

const createQuestionSlide = (questionText, options, trialType) => {
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
    data: { trial_type: trialType },
  };
};

// Define Question Texts
const objectQuestionText = 'What is this object?';
const motionQuestionText = 'What direction is this object moving in?';

// Add Object Identification Question
timeline.push(createQuestionSlide(
  objectQuestionText, 
  ['Bicycle', 'Car', 'Person', 'Scooter', 'Dog'], 
  'object_identification'
));

// Add Motion Direction Question
timeline.push(createQuestionSlide(
  motionQuestionText, 
  ['Up', 'Down', 'Left', 'Right', 'Into screen', 'Out of screen'], 
  'motion_direction'
));

// Run the Experiment
jsPsych.run(timeline);