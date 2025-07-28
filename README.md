# Dictation Notes Tool

This tool records speech from a microphone or audio file and outputs concise bullet-point notes. It can optionally use the OpenAI API to summarize the captured text.

## Requirements
- Python 3.12+
- `SpeechRecognition` package
- (Optional) `openai` package for AI summarization
- A working microphone if recording live

Install the dependencies:

```bash
pip install SpeechRecognition openai
```

## Usage
To start recording from the microphone and save notes to a timestamped file:

```bash
python3 bullet_notes.py
```

You can also transcribe an existing audio file and specify the output file:

```bash
python3 bullet_notes.py --input-file recording.wav --output notes.txt
```

If the environment variable `OPENAI_API_KEY` is set, the script will send the transcript to the OpenAI API to create cleaner bullet points. Without the key, it will simply split sentences into bullet points.

## Website
This repository also hosts a simple website focused on my Bitcoin journey. Open `index.html` in a browser to see a short resume and a link to `notes.html`, where personal notes are saved locally in your browser.
