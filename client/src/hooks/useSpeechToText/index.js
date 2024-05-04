import { useEffect, useRef, useState } from 'react';

let recognition = null;
if ('webkitSpeechRecognition' in window) {
    recognition = new window.webkitSpeechRecognition();
}

export default function useSpeechToText(options) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);

    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) {
            console.log('Web speech api is not support');
            return;
        }

        recognitionRef.current = new window.webkitSpeechRecognition();
        const recognition = recognitionRef.current;
        recognition.interimResults = options.interimResults || true;
        // if (isListening) {
        //     recognition.stop(); // Dừng nhận dạng để cập nhật ngôn ngữ
        // }
        recognition.lang = options.lang || 'en-US'; // Cập nhật ngôn ngữ
        // if (isListening) {
        //     recognition.start(); // Tiếp tục nhận dạng với ngôn ngữ mới
        // }
        recognition.continuous = options.continuous || false;

        if ('webkitSpeechGrammarList' in window) {
            const grammar = '#JSGF V1.0; grammar punctuation; public <punc> = . | , | ? | ! | ;| : ;';
            const speechRecognitionList = new window.webkitSpeechGrammarList();
            speechRecognitionList.addFromString(grammar, 1);
            recognition.grammars = speechRecognitionList;
        }

        recognition.onresult = (event) => {
            let text = '';
            for (let i = 0; i < event.results.length; i++) {
                text += event.results[i][0].transcript;
            }
            setTranscript(text);
        };

        recognition.onerror = (event) => {
            console.log('Speech recognition error: ', event.error);
        };

        recognition.onend = () => {
            setIsListening(false);
            setTranscript('');
        };

        return () => {
            recognition.stop();
        };
    }, [options.lang]);

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    return {
        isListening,
        transcript,
        startListening,
        stopListening,
        hasRecognitionSupport: !!recognition,
    };
}
