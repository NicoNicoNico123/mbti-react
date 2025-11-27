import React from 'react';

interface Option {
    text: string;
    value: string;
}

interface Question {
    id: number;
    text: string;
    dimension: string;
    optionA: Option;
    optionB: Option;
}

interface QuestionCardProps {
    question: Question;
    onAnswer: (value: string) => void;
    currentQuestionIndex: number;
    totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    onAnswer,
    currentQuestionIndex,
    totalQuestions
}) => {
    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg">
            <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
                    <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                    ></div>
                </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-8 min-h-[80px] flex items-center">
                {question.text}
            </h3>

            <div className="space-y-4">
                <button
                    onClick={() => onAnswer(question.optionA.value)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-200 group"
                >
                    <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full mr-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                            A
                        </span>
                        <span className="text-gray-700 group-hover:text-indigo-900">{question.optionA.text}</span>
                    </div>
                </button>

                <button
                    onClick={() => onAnswer(question.optionB.value)}
                    className="w-full text-left p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition duration-200 group"
                >
                    <div className="flex items-center">
                        <span className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 rounded-full mr-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                            B
                        </span>
                        <span className="text-gray-700 group-hover:text-indigo-900">{question.optionB.text}</span>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default QuestionCard;
