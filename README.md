<!-- PROJECT LOGO
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
-->

<h3 align="center">Receipt Scanner Mobile App</h3>

  <p align="center">
    A mobile app that lets users quickly store receipts with a photo and track spending for better budgeting.
   <br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#installation">Installation</a>
      <ul>
        <li><a href="#getting-started">Getting Started</a></li>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li>
      <a href="#feature-details">Feature Details</a>
      <ul>
        <li><a href="#machine-learning">Machine Learning</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This React Native project simplifies receipt storage and spending tracking for users. It uses machine learning to detect and process receipts from images, combining a custom-trained YOLOv8 model, BART, and a custom RCNN.

The machine learning models are deployed on a Google Kubernetes Engine (GKE) cluster on Google Cloud Platform, set up to receive images from the app and return a processed response for display.

![pic1](<./images/Screenshot(191).png>)
![pic2](<./images/Screenshot(192).png>)
![pic3](<./images/Screenshot(195).png>)

### Built With

![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Expo](https://img.shields.io/badge/expo-1C1E24?style=for-the-badge&logo=expo&logoColor=#D04A37)
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)

![Gunicorn](https://img.shields.io/badge/gunicorn-%298729.svg?style=for-the-badge&logo=gunicorn&logoColor=white)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![Kubernetes](https://img.shields.io/badge/kubernetes-%23326ce5.svg?style=for-the-badge&logo=kubernetes&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white)

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)
![OpenCV](https://img.shields.io/badge/opencv-%23white.svg?style=for-the-badge&logo=opencv&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- INSTALLATION -->

## Installation

To run this project, you can either clone the repository and continue following the instructions,

OR

Download the .apk below to use immediately on your phone:  
https://drive.google.com/drive/folders/1m73Ae3LnU7konZcTfJIdXvsenJ6avuYU?usp=sharing

### Prerequisites

If you are cloning this repository, please follow the instructions below to set up the Expo development environment and a mobile emulator if you do not already have them set up:  
[Expo documentation](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local&platform=android&device=simulated)

### Getting Started

Clone the repository and run:

```sh
npm install --legacy-peer-deps
```
Please make sure you have installed an emulator and virtual device as specified in the prerequisites.
After starting a device on your emulator, run the following command for your respective device type:

iOS
```sh
npx expo run:ios
```

Android
```sh
npx expo run:android
```

Now, Expo should begin building a development build on your emulator.  

For more details, follow:  
[Expo documentation](https://docs.expo.dev/get-started/set-up-your-environment/?mode=development-build&buildEnv=local&platform=android&device=simulated)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

## Usage

Press F to interact with the Menu. WASD, C and SPACEBAR to move the camera.
There are two ways to interact with the program. You can enter in the long/lat coords, or choose from a database that is updated on application launch using an Airlines ICAO code.

![gif1](./images/Animation.gif)
![gif2](./images/Animation2.gif)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- Feature Details -->

## Feature Details

This seciton includes further detail on interesting features that were worked on in this project.

### Machine Learning

#### YOLOv8

YOLOv8, a robust open-source AI framework for computer vision tasks with a large community, was leveraged to extract bounding boxes for items, totals, and subtotals from processed receipt images. The captured bounding boxes were then passed to subsequent models for further analysis.

The model was trained from scratch using a dataset of over 400 receipts, which were preprocessed into grayscale images and perspective corrected. Through data augmentation techniques, the dataset was expanded to nearly 1,200 images.

#### RCNN

A custom RCNN model is designed and trained to perform ocr on the bounding boxes passed by the YOLOv8 model. 

The model consists of 9 layers of ResBlocks followed by 2 layers of bidirectional LSTM. The model is trained on a dataset of about 42000 image preprocessed into greyscale images. The dataset contains 1-3 words, prices, or other special characters that appear on receipts. Training process utilizes CTC loss, a decaying learning rate, as well as character error rate and word error rate as metrics. 

Inference model reached a characeter accuracy of 96% and a word accuracy of 88%.

#### BART

We utilize a pre-trained BART model developed by Facebook, fine-tuned specifically for our task. This model is used for sentence reconstruction, grammar correction, and the identification of key values, ensuring accurate processing and correction of text data before the results are sent in the POST response for display to the user.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Feel free to contact us at:

@Kevin Chen - kevinz.chen@mail.utoronto.ca\
@Gary Guo - garyz.guo@mail.utoronto.ca

<p align="right">(<a href="#readme-top">back to top</a>)</p>
