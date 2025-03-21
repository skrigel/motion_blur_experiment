# Object and Motion Estimation in the Presence of Blur (Human Experiment)

## Overview

This repository contains an experiment built using **jsPsych**, a JavaScript library for running psychology experiments in web browsers. 

The experiment is designed to evaluate human performance in identifying the subject of locally motion blurred images. In order to analyze performance, we will divide our larger task into two more easily quantifiable subtasks:
- Object Identification: Identify the object in the blurred image.
- Motion Direction Estimation: Estimate the direction of motion (from a set of given labels: left, right, up, down, into the screen, out of the screen, stationary)

## Files

- **index.html**: Main file that loads and runs the experiment.
- **src/main.js**: Contains the experiment logic and trial setup.
- **box_generator.py**: Scripts to generate copies of experimental images with colored bounding boxes
- **src/assets**: Folder containing the images or other stimuli used in the experiment.

## Data Collection

The experiment collects participant responses and saves the data in a JSON format. The data can be sent to a server or downloaded as needed.

## License

This project is licensed under the MIT License.
