import { initJsPsych } from 'jspsych';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

const jsPsych = initJsPsych();

const timeline = [];

// Basic trial with just the keyboard response
timeline.push({
  type: htmlKeyboardResponse,
  stimulus: '<p>Press any key to begin the experiment.</p>',
});

jsPsych.run(timeline);