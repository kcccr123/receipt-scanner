<!-- PROJECT LOGO
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
-->

<h3 align="center">Receipt Scanner Mobile App</h3>

  <p align="center">
    A mobile app that lets users quickly store receipts with a photo and tracks spending for better budgeting.
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
      <a href="#receipt-processing-ml-pipelines">Key Features</a>
      <ul>
        <li><a href="#in-house-pipeline">In-House Pipeline</a></li>
      </ul>
      <ul>
        <li><a href="#gpt-4o-pipeline">GPT-4o</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

This React Native project simplifies receipt storage and spending tracking for users. It uses machine learning to detect and process receipts from images, combining a custom-trained YOLOv8 model, BART, and a custom RCNN.

The machine learning models are deployed on a Google Kubernetes Engine (GKE) cluster within Google Cloud Platform (GCP). The server is configured to receive images from the app, process the data, and return inference results to be displayed.

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

<!-- INSTALLATION -->

## Installation

To run this project, you can either clone the repository and run inside an android emulator,

OR

Download the latest version of the .apk from either the GitHub releases or the following Google Drive to use on your phone immediately:  
[Download The App Here](https://drive.google.com/drive/folders/1gMsgvBpB-5DIYCYthU_EozF8zWHmHyqh)

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

<!-- RECEIPT PROCESSING ML PIPELINES -->

## Receipt Processing ML Pipelines

The app employs two distinct technology pipelines for receipt inference: one developed and trained in-house and another powered by OpenAI’s GPT-4.

You can find the backend + machine learning utilities in this repo: [reciept-scanner-backend](https://github.com/kcccr123/receipt-scanner-backend)

### In-House Pipeline

The in-house pipeline processes image requests through a sequence of three models: YOLOv8 for object detection, RCNN for reading text, and BART for correction and restructuring.

![in-house-pipeline](https://github.com/user-attachments/assets/88e1a5da-e973-4b6a-8906-f9590a354210)

#### YOLOv8

YOLOv8, a robust open-source AI framework for computer vision, was leveraged to extract bounding boxes for items, totals, and subtotals from processed receipt images. The bounding boxes are then passed to subsequent models for further analysis.

The model was trained from scratch using a dataset of over 400 receipts, preprocessed into grayscale and perspective-corrected images. Data augmentation techniques expanded the dataset to nearly 1,200 images.

#### RCNN

A custom RCNN model is designed and trained to perform optical character recognition (OCR) on the bounding boxes passed by the YOLOv8 model.

###### Model Architecture

The model integrates convolutional layers for spatial feature extraction and LSTM layers for sequence modeling. Its architecture includes:

- 9 Convolutional Residual Blocks to progressively extract and refine features from the input image.

- 2 Bidirectional LSTM Layers to better capture the dependencies in both forward and backward directions.

- Final fully connected layers to map the LSTM outputs to a set of character probabilities.

###### Dataset

- Trained on a dataset of approximately 42,000 images containing 1-3 words, prices, or special characters found on receipts.

###### Data Preprocessing & Augmentation
  
- Since color does not matter, the images are preprocessed into greyscale images by OpenCV then resized to 224\*36 while maintaining aspect ratio.

- Data Augmentation methods such as sharpening, eroding and dilating are applied at random to enhance model generalization.

###### Training

- Training process utilizes CTC loss, a decaying learning rate, as well as character error rate and word error rate as metrics.

###### Result

- Inference model reached a characeter accuracy of 96% and a word accuracy of 88% during testing.

#### BART

We utilize a pre-trained BART model developed by Meta, fine-tuned specifically for our task. This model is used for sentence reconstruction, grammar correction, and the identification of key values, ensuring accurate processing and correction of text data before the results are packaged in a JSON object and sent in the POST response back to the client.

### GPT-4o Pipeline

The GPT-4o pipeline is simpler, relying solely on GPT-4o to make inferences. When the app sends a request to the server, the server calls the OpenAI API and uses GPT-4o to extract items from the provided image and identify key attributes. Once the API returns a JSON object, the server processes it and sends the response back to the app for display and usage.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Feel free to contact us at:

@Kevin Chen - kevinz.chen@mail.utoronto.ca\
@Gary Guo - garyz.guo@mail.utoronto.ca

<p align="right">(<a href="#readme-top">back to top</a>)</p>
