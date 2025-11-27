import OpenAI from 'openai';

// Initialize OpenAI client
// Note: In a production environment, you should use a backend proxy to hide the API key.
// For this prototype, we'll expect the key to be in REACT_APP_OPENAI_API_KEY
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
    baseURL: process.env.REACT_APP_OPENAI_BASE_URL, // Optional: for custom endpoints
    dangerouslyAllowBrowser: true // Required for client-side usage
});

export interface UserContext {
    age: number;
    occupation: string;
    gender: string;
    interests: string;
}

export interface Question {
    id: number;
    text: string;
    dimension: 'E-I' | 'S-N' | 'T-F' | 'J-P';
    optionA: { text: string; value: string };
    optionB: { text: string; value: string };
}

const SYSTEM_PROMPT = `
You are an expert MBTI personality psychologist. Your task is to rewrite standard MBTI questions to be highly personalized based on the user's background.
Keep the core psychological dimension of the question exactly the same, but change the scenario to fit the user's life.
The user will provide their Age, Occupation, Gender, and Interests.
Output JSON format only.
`;

export const generateQuestions = async (userContext: UserContext, baseQuestions: any[]): Promise<Question[]> => {
    // Only process the questions passed in baseQuestions (which should be a batch)

    const prompt = `
    User Scenario:
    - Age: ${userContext.age}
    - Occupation: ${userContext.occupation}
    - Gender: ${userContext.gender}
    - Interests: ${userContext.interests}

    Task:
    Rewrite the following MBTI questions to be highly relevant to the user's specific scenario (occupation, interests, age).
    The core psychological meaning (Dimension) MUST remain exactly the same.
    The options (A/B) must remain binary and distinct.

    Questions to rewrite:
    ${JSON.stringify(baseQuestions)}

    Return a JSON object with a key "questions" containing an array of objects.
    Each object must have: id (same as input), text (rewritten question), dimension, optionA (text, value), optionB (text, value).
  `;

    try {
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            model: process.env.REACT_APP_OPENAI_MODEL || "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) return [];

        const result = JSON.parse(content);
        return result.questions || [];
    } catch (error) {
        console.error("Error generating questions:", error);
        // Fallback to base questions if API fails
        return baseQuestions.map(q => ({
            id: q.id,
            text: q.text,
            dimension: q.dimension,
            optionA: { text: q.options[0].text, value: q.options[0].value },
            optionB: { text: q.options[1].text, value: q.options[1].value }
        }));
    }
};

// Generate a single question
export const generateSingleQuestion = async (userContext: UserContext, baseQuestion: any): Promise<Question> => {
    console.log('🔍 generateSingleQuestion called with:', {
        userContext,
        baseQuestionId: baseQuestion.id,
        hasApiKey: !!process.env.REACT_APP_OPENAI_API_KEY
    });

    const prompt = `
    User Scenario:
    - Age: ${userContext.age}
    - Occupation: ${userContext.occupation}
    - Gender: ${userContext.gender}
    - Interests: ${userContext.interests}

    Task:
    Rewrite the following MBTI question to be highly relevant to the user's specific scenario (occupation, interests, age).
    The core psychological meaning (Dimension) MUST remain exactly the same.
    The options (A/B) must remain binary and distinct.

    Question to rewrite:
    ${JSON.stringify(baseQuestion)}

    Return a JSON object with: id (same as input), text (rewritten question), dimension, optionA (text, value), optionB (text, value).
  `;

    // Check if API key is available
    if (!process.env.REACT_APP_OPENAI_API_KEY || process.env.REACT_APP_OPENAI_API_KEY === 'your_openai_api_key_here') {
        console.warn('⚠️ OpenAI API key not found or not configured. Using fallback questions.');
        return {
            id: baseQuestion.id,
            text: baseQuestion.text,
            dimension: baseQuestion.dimension,
            optionA: { text: baseQuestion.options[0].text, value: baseQuestion.options[0].value },
            optionB: { text: baseQuestion.options[1].text, value: baseQuestion.options[1].value }
        };
    }

    try {
        console.log('🚀 Making OpenAI API call...');
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: prompt }
            ],
            model: process.env.REACT_APP_OPENAI_MODEL || "gpt-3.5-turbo",
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;
        if (!content) throw new Error("No content returned");

        console.log('✅ OpenAI API response received');
        const result = JSON.parse(content);
        return result;
    } catch (error) {
        console.error("❌ Error generating question:", error);
        // Fallback to base question
        console.log('🔄 Using fallback question due to API error');
        return {
            id: baseQuestion.id,
            text: baseQuestion.text,
            dimension: baseQuestion.dimension,
            optionA: { text: baseQuestion.options[0].text, value: baseQuestion.options[0].value },
            optionB: { text: baseQuestion.options[1].text, value: baseQuestion.options[1].value }
        };
    }
};

// Interface for personality analysis data
export interface PersonalityAnalysisData {
  summary: string;
  strengths: string[];
  challenges: string[];
  careerSuggestions: string[];
  relationships: string;
  growthTips: string[];
}

// Get detailed personality analysis
export const getPersonalityAnalysis = async (
  personalityType: string,
  scores: any,
  userContext: UserContext
): Promise<PersonalityAnalysisData> => {
  const analysisPrompt = `
    User Information:
    - Personality Type: ${personalityType}
    - Age: ${userContext.age}
    - Occupation: ${userContext.occupation}
    - Gender: ${userContext.gender}
    - Interests: ${userContext.interests}
    - Scores: ${JSON.stringify(scores)}

    Task:
    Provide a comprehensive personality analysis for this ${personalityType} individual.
    Make it highly personalized based on their specific context (age, occupation, interests).
    Be encouraging, insightful, and practical.

    Return a JSON object with:
    - summary: A personalized 2-3 sentence overview of their personality type
    - strengths: Array of 4-6 specific strengths relevant to their situation
    - challenges: Array of 3-4 potential challenges or areas for growth
    - careerSuggestions: Array of 6-8 career paths that would suit their personality and background
    - relationships: A personalized paragraph about their relationship style and communication preferences
    - growthTips: Array of 4-5 actionable personal growth tips specific to their personality and context

    Make the content encouraging, practical, and tailored to their specific life situation.
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert MBTI psychologist and career counselor. Provide insightful, personalized personality analysis based on MBTI types and individual context."
        },
        { role: "user", content: analysisPrompt }
      ],
      model: process.env.REACT_APP_OPENAI_MODEL || "gpt-3.5-turbo",
      response_format: { type: "json_object" },
      temperature: 0.7
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned");

    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error("Error generating personality analysis:", error);

    // Fallback analysis
    return {
      summary: `As a ${personalityType}, you have a unique personality with distinctive traits and preferences that shape how you interact with the world.`,
      strengths: ["Authentic self-expression", "Strong values alignment", "Adaptability", "Creative problem-solving"],
      challenges: ["Balancing idealism with practicality", "Managing stress in high-pressure situations", "Difficulty with routine tasks"],
      careerSuggestions: ["Creative Director", "Counselor", "Writer", "Teacher", "Entrepreneur", "Designer"],
      relationships: "You value deep, meaningful connections and tend to be warm, empathetic, and supportive in your relationships. You appreciate authenticity and emotional honesty.",
      growthTips: ["Practice mindfulness to stay present", "Develop structured routines for important tasks", "Find healthy outlets for emotional expression", "Set boundaries to prevent burnout"]
    };
  }
};

// Chat function for personality Q&A
export const askPersonalityQuestion = async (
  question: string,
  personalityType: string,
  scores: any,
  userContext: UserContext,
  conversationHistory: any[] = []
): Promise<string> => {
  const contextPrompt = `
    User Context:
    - Personality Type: ${personalityType}
    - Age: ${userContext.age}
    - Occupation: ${userContext.occupation}
    - Gender: ${userContext.gender}
    - Interests: ${userContext.interests}
    - Scores: ${JSON.stringify(scores)}

    Recent Conversation:
    ${conversationHistory.slice(-5).map(msg => `${msg.type}: ${msg.message}`).join('\n')}

    User's Question: "${question}"

    Task:
    Answer the user's question about their ${personalityType} personality type. Consider their specific context (age, occupation, interests) and provide personalized, practical advice. Be encouraging, insightful, and authentic. Keep responses conversational but informative (around 2-4 sentences).

    Guidelines:
    - Be supportive and encouraging
    - Provide specific, actionable advice when relevant
    - Consider their age, occupation, and life stage
    - Reference their MBTI traits appropriately
    - Keep it conversational and engaging
    - Avoid being overly clinical or academic
  `;

  try {
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a friendly, knowledgeable MBTI personality guide. Answer questions about personality types in a warm, encouraging, and personalized way. Be authentic and practical in your advice."
        },
        { role: "user", content: contextPrompt }
      ],
      model: process.env.REACT_APP_OPENAI_MODEL || "gpt-3.5-turbo",
      temperature: 0.8,
      max_tokens: 300
    });

    const content = completion.choices[0].message.content;
    if (!content) throw new Error("No content returned");

    return content.trim();
  } catch (error) {
    console.error("Error answering personality question:", error);

    // Fallback responses
    const fallbackResponses = [
      `That's a great question about your ${personalityType} personality! Based on your type, you tend to approach situations with creativity and authenticity. Would you like me to elaborate on any specific aspect?`,
      `As a ${personalityType}, you have unique strengths that can help with this. Your natural empathy and insight often guide you well in these situations.`,
      `That's an interesting aspect of being a ${personalityType}! You likely approach this with your characteristic idealism and personal values. How does this resonate with your experience?`
    ];

    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
};
