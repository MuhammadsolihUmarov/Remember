export const playRussianAudio = (text) => {
    // In a production app, we would play an MP3 or use a cloud TTS API.
    // For MVP, we use the browser's built-in Web Speech API.
    if (!window.speechSynthesis) return;

    // Stop any currently playing audio
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ru-RU';
    utterance.rate = 0.9; // Slightly slower for language learners
    
    // Try to find a nice Russian voice
    const voices = window.speechSynthesis.getVoices();
    const ruVoice = voices.find(v => v.lang === 'ru-RU' && v.name.includes('Google')) || 
                    voices.find(v => v.lang.startsWith('ru'));
                    
    if (ruVoice) {
        utterance.voice = ruVoice;
    }

    window.speechSynthesis.speak(utterance);
};
