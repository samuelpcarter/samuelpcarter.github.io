# Dictation Notes Tool

This project provides a simple Python script to capture speech from the microphone and convert it into bullet-point notes. It is designed as a starting point for building a digital assistant that helps workers record observations during walkarounds.

## Requirements
- Python 3.12+
- `SpeechRecognition` package
- A working microphone

Install the dependencies:

```bash
pip install SpeechRecognition
```

## Usage
Run the script and speak into your microphone. Press `Ctrl+C` to stop recording when finished. The script will output bullet points based on the recognized speech.

```bash
python3 bullet_notes.py
```

This is a minimal prototype and can be extended with more advanced summarization or integration with other tools.
