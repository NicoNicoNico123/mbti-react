import React from 'react';

interface DataCollectionCardProps {
    title: string;
    description?: string;
    inputType: 'slider' | 'text' | 'select' | 'textarea';
    value: any;
    onChange: (value: any) => void;
    onNext: () => void;
    options?: { label: string; value: string }[];
    min?: number;
    max?: number;
    placeholder?: string;
}

const DataCollectionCard: React.FC<DataCollectionCardProps> = ({
    title,
    description,
    inputType,
    value,
    onChange,
    onNext,
    options,
    min,
    max,
    placeholder
}) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value) onNext();
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
            {description && <p className="text-gray-600 mb-6">{description}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {inputType === 'slider' && (
                    <div>
                        <div className="text-center text-4xl font-bold text-indigo-600 mb-4">{value}</div>
                        <input
                            type="range"
                            min={min}
                            max={max}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>{min}</span>
                            <span>{max}+</span>
                        </div>
                    </div>
                )}

                {inputType === 'text' && (
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-lg"
                        autoFocus
                        required
                    />
                )}

                {inputType === 'textarea' && (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition text-lg"
                        autoFocus
                    />
                )}

                {inputType === 'select' && (
                    <div className="space-y-3">
                        {options?.map((opt) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    onChange(opt.value);
                                    // Small delay to show selection before moving next
                                    setTimeout(onNext, 200);
                                }}
                                className={`w-full text-left p-4 border-2 rounded-lg transition duration-200 font-medium ${value === opt.value
                                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                                        : 'border-gray-200 hover:border-indigo-400 hover:bg-gray-50'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                )}

                {inputType !== 'select' && (
                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition duration-200 font-bold text-lg shadow-md"
                    >
                        Next
                    </button>
                )}
            </form>
        </div>
    );
};

export default DataCollectionCard;
