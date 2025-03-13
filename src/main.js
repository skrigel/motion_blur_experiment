import { initJsPsych } from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import fullscreenPlugin from '@jspsych/plugin-fullscreen';
import nyan1 from './assets/nyan1.jpeg';
import nyan2 from './assets/nyan2.jpg';

// Initialize jsPsych
import imageKeyboardResponse from '@jspsych/plugin-image-keyboard-response';

const jsPsych = initJsPsych();

// Define the main timeline array
const timeline = [];

// Preload assets (make sure your assets are in the correct directory)
// Welcome screen
timeline.push({
  type: htmlKeyboardResponse,
  stimulus: '<p>Welcome! Press any key to start the experiment.</p>',
});

// Switch to fullscreen
timeline.push({
  type: fullscreenPlugin,  // Plugin name should be lowercase ('fullscreenPlugin')
  fullscreen_mode: true,
});

  
timeline.push({
    type: imageKeyboardResponse,
    stimulus: nyan1,  // Path to your image (adjust based on where your images are stored)
    choices: ['a', 'b', 'c'],  // Choices for user to press
    prompt: '<p>Press A, B, or C to continue.</p>',
    data: { trial_type: 'image_keyboard_response' },  // Optional trial metadata
  });

  
// Run the experiment
jsPsych.run(timeline);