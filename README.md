

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
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
This React Native project simplifies receipt storage and spending tracking for users. It uses machine learning to detect and process receipts from images, combining a custom-trained YOLOv8 model, BART, and a custom RCNN.

The machine learning models are deployed on a Google Kubernetes Engine (GKE) cluster on Google Cloud Platform, set up to receive images from the app and return a processed response for display.

![pic1](./images/Screenshot(191).png)
![pic2](./images/Screenshot(192).png)
![pic3](./images/Screenshot(195).png)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

![Unreal Engine](https://img.shields.io/badge/unrealengine-%23313131.svg?style=for-the-badge&logo=unrealengine&logoColor=white)
![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)
![C#](https://img.shields.io/badge/c%23-%23239120.svg?style=for-the-badge&logo=c-sharp&logoColor=white)
 ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
 ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

Run the executeable on your local machine! The executable and related dependencies are on a google drive because they are too big for github.
Extract and run FlightTracker.exe!

https://drive.google.com/drive/folders/1m73Ae3LnU7konZcTfJIdXvsenJ6avuYU?usp=sharing

### Prerequisites

You will need to install these python dependencies
* pip
  ```sh
  pip install FlightRadarAPI
  ```
  ```sh
  pip install pandas
  ```
  ```sh
  pip install sqlalchemy
  ```
  ```sh
  pip install sqlite3
  ```
  
<p align="right">(<a href="#readme-top">back to top</a>)</p>


<!-- USAGE EXAMPLES -->
## Usage
Press F to interact with the Menu. WASD, C and SPACEBAR to move the camera.
There are two ways to interact with the program. You can enter in the long/lat coords, or choose from a database that is updated on application launch using an Airlines ICAO code.

![gif1](./images/Animation.gif)
![gif2](./images/Animation2.gif)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact
Feel free to contact us at:

@Kevin Chen - kevinz.chen@mail.utoronto.ca\
@Gary Guo - garyz.guo@mail.utoronto.ca

<p align="right">(<a href="#readme-top">back to top</a>)</p>



