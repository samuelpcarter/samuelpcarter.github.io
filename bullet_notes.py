import argparse
import datetime
import os

import speech_recognition as sr

try:
    import openai
except ImportError:  # openai package not available
    openai = None


def transcribe_microphone():
    recognizer = sr.Recognizer()
    microphone = sr.Microphone()

    print("Listening... Press Ctrl+C to stop.")
    notes = []
    try:
        with microphone as source:
            recognizer.adjust_for_ambient_noise(source)
            while True:
                audio = recognizer.listen(source)
                try:
                    text = recognizer.recognize_google(audio)
                    notes.append(text)
                    print(f"Heard: {text}")
                except sr.UnknownValueError:
                    print("Could not understand audio")
    except KeyboardInterrupt:
        print("\nTranscription stopped.")
    return notes


def transcribe_file(path: str):
    recognizer = sr.Recognizer()
    notes = []
    with sr.AudioFile(path) as source:
        recognizer.adjust_for_ambient_noise(source)
        audio = recognizer.record(source)
        try:
            text = recognizer.recognize_google(audio)
            notes.append(text)
        except sr.UnknownValueError:
            print("Could not understand audio in file")
    return notes


def summarize_with_openai(text: str) -> str | None:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key or not openai:
        return None
    client = openai.Client(api_key=api_key)
    try:
        response = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "Summarize the following notes into concise "
                        "bullet points."
                    ),
                },
                {"role": "user", "content": text},
            ],
            model="gpt-3.5-turbo",
            max_tokens=150,
        )
        return response.choices[0].message.content.strip()
    except Exception as exc:  # network or API errors
        print(f"OpenAI API failed: {exc}")
        return None


def format_bullet_points(notes):
    text = " ".join(notes)
    summary = summarize_with_openai(text)
    if summary:
        return summary

    bullets = []
    for note in notes:
        sentences = [s.strip() for s in note.split('.') if s.strip()]
        bullets.extend(sentences)
    return '\n'.join(f"- {sentence}" for sentence in bullets)


def save_to_file(content: str, path: str):
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Notes saved to {path}")


def main():
    parser = argparse.ArgumentParser(
        description="Capture speech and generate bullet-point notes."
    )
    parser.add_argument(
        "--input-file",
        help="Transcribe from an audio file instead of the microphone",
    )
    parser.add_argument("--output", help="Write bullet points to this file")
    args = parser.parse_args()

    if args.input_file:
        notes = transcribe_file(args.input_file)
    else:
        notes = transcribe_microphone()

    if notes:
        bullet_points = format_bullet_points(notes)
        print("\nBullet Point Notes:\n")
        print(bullet_points)
        if args.output:
            save_to_file(bullet_points, args.output)
        else:
            timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
            save_to_file(bullet_points, f"notes_{timestamp}.txt")
    else:
        print("No notes captured.")


if __name__ == "__main__":
    main()
