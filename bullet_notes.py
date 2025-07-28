import speech_recognition as sr


def transcribe_speech():
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


def format_bullet_points(notes):
    bullets = []
    for note in notes:
        sentences = [s.strip() for s in note.split('.') if s.strip()]
        bullets.extend(sentences)
    return '\n'.join(f"- {sentence}" for sentence in bullets)


def main():
    notes = transcribe_speech()
    if notes:
        bullet_points = format_bullet_points(notes)
        print("\nBullet Point Notes:\n")
        print(bullet_points)
    else:
        print("No notes captured.")


if __name__ == "__main__":
    main()
