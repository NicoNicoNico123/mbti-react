import React from 'react';

interface WelcomeScreenProps {
    onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">MBTI Personality Quiz</h1>
                <p className="text-lg text-gray-600 mb-8">
                    Discover your true self with questions personalized just for you.
                </p>

                <button
                    onClick={onStart}
                    className="w-full bg-indigo-600 text-white py-4 px-6 rounded-xl hover:bg-indigo-700 transition duration-200 font-bold text-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

export default WelcomeScreen;
