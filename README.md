# AI Resume Screening System

## Project Overview
This repository contains a comprehensive system for screening resumes using artificial intelligence techniques to aid in recruitment processes.

## Features
- Automatic extraction of key information from resumes.
- Intelligent ranking of candidates based on resume content.
- Support for multiple file formats (PDF, DOCX, etc.).

## Tech Stack
- Python
- Flask
- TensorFlow
- Scikit-learn

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/kumkumyadav19/AI-Resume-Screening-System.git
   ```
2. Navigate to the project directory:
   ```bash
   cd AI-Resume-Screening-System
   ```
3. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Usage
1. Start the application:
   ```bash
   python app.py
   ```
2. Access the application at `http://127.0.0.1:5000`.

## Project Structure
```
AI-Resume-Screening-System/
│
├── app.py
├── requirements.txt
├── models/
├── templates/
└── static/
```

## Pipeline Overview
The system leverages a machine learning pipeline for processing resumes which includes:
- Data collection
- Feature extraction
- Model training
- Candidate ranking

## Key Components
- **Data Processing:** Handles extraction and normalization of resume content.
- **Model Training:** Utilizes various machine learning algorithms to build ranking models.
- **Web Interface:** Provides an intuitive user interface for users to upload resumes and obtain results.

## Configuration
Configuration settings can be adjusted in `config.py`. Ensure parameters such as database URI and model paths are set correctly.

## Contributing Guidelines
- Fork the repository.
- Create a new branch for each feature or bugfix.
- Ensure your code is well-documented and includes tests.
- Submit a pull request detailing your changes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Support Information
For support, please open an issue in the GitHub repository or contact the maintainer directly.

## Roadmap
- V1.0: Initial release with basic features.
- V1.1: Enhanced model performance and additional file format support.

## Acknowledgments
Thanks to all contributors and libraries that made this project possible.