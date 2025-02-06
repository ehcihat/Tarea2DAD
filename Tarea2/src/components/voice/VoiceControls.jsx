import 'regenerator-runtime/runtime';
import { useState } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Scene from '../model/Model3d';

const VoiceControls = () => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [playAnimation, setPlayAnimation] = useState(null);


    const commands = [
        {
            command: 'izquierda',
            callback: () => {

                setPlayAnimation('/Right Strafe.fbx');
            },
        },
        {
            command: 'derecha',
            callback: () => {

                setPlayAnimation('/Left Strafe.fbx');
            },
        },
        {
            command: 'arriba',
            callback: () => {

                setPlayAnimation('/Jump.fbx');
            },
        },
        {
            command: 'abajo',
            callback: () => {

                setPlayAnimation('/Kneeling Down.fbx');
            },
        },
        {
            command: 'reset',
            callback: () => {

                setPlayAnimation('/Standing Idle.fbx');
            },
        },
    ];

    const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition({ commands });

    if (!browserSupportsSpeechRecognition) {
        return <p>Tu navegador no soporta reconocimiento de voz.</p>;
    }


    const startListeningContinuous = () => {
        SpeechRecognition.startListening({ continuous: true, language: 'es-ES' });
    };

    return (
        <div className="app-container">
            <h2>Control de Voz</h2>
            <p>Di: 'izquierda', 'derecha', 'arriba', 'abajo' o 'reset'</p>
            <button onClick={startListeningContinuous}>Iniciar</button>
            <button onClick={SpeechRecognition.stopListening}>Detener</button>
            <button onClick={resetTranscript}>Limpiar</button>
            <p><strong>Escuchando:</strong> {listening ? 'Sí' : 'No'}</p>
            <p><strong>Comando detectado:</strong> {transcript}</p>

            <Scene position={position} playAnimation={playAnimation} />
        </div>
    );
};

export default VoiceControls;
