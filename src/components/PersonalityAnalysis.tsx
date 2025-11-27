import React, { useState, useEffect } from 'react';
import { getPersonalityAnalysis } from '../services/openaiService';

interface PersonalityAnalysisProps {
  personalityType: string;
  scores: any;
  userContext: any;
}

interface AnalysisData {
  summary: string;
  strengths: string[];
  challenges: string[];
  careerSuggestions: string[];
  relationships: string;
  growthTips: string[];
}

const PersonalityAnalysis: React.FC<PersonalityAnalysisProps> = ({
  personalityType,
  scores,
  userContext
}) => {
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'career' | 'relationships' | 'growth'>('overview');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true);
        setError(null);
        const analysisData = await getPersonalityAnalysis(personalityType, scores, userContext);
        setAnalysis(analysisData);
      } catch (err) {
        setError('Failed to generate personality analysis. Please try again.');
        console.error('Analysis error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [personalityType, scores, userContext]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-4 border-b-4 border-indigo-600 mr-3"></div>
          <span className="text-gray-600">Analyzing your personality...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🎯' },
    { id: 'career', label: 'Career', icon: '💼' },
    { id: 'relationships', label: 'Relationships', icon: '👥' },
    { id: 'growth', label: 'Growth', icon: '🌱' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Your Personality Analysis</h3>
        <p className="text-gray-600">AI-powered insights based on your {personalityType} personality type</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
              activeTab === tab.id
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="mr-2">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Summary</h4>
              <p className="text-gray-600 leading-relaxed">{analysis.summary}</p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Strengths</h4>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-gray-600">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Areas for Growth</h4>
              <ul className="space-y-2">
                {analysis.challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-orange-500 mr-2">•</span>
                    <span className="text-gray-600">{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'career' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Career Suggestions</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.careerSuggestions.map((career, index) => (
                <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                  <div className="flex items-center">
                    <span className="text-indigo-600 mr-2">💼</span>
                    <span className="font-medium text-gray-800">{career}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Relationship Style</h4>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-gray-700 leading-relaxed">{analysis.relationships}</p>
            </div>
          </div>
        )}

        {activeTab === 'growth' && (
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">Personal Growth Tips</h4>
            <div className="space-y-3">
              {analysis.growthTips.map((tip, index) => (
                <div key={index} className="flex items-start bg-green-50 p-4 rounded-lg border border-green-200">
                  <span className="text-green-600 mr-3 mt-1">🌱</span>
                  <span className="text-gray-700">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalityAnalysis;