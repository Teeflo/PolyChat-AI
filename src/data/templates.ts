import type { ConversationTemplate, TemplateCategoryInfo, QuickAction } from '../types/index';

// Template categories information
export const TEMPLATE_CATEGORIES: TemplateCategoryInfo[] = [
  {
    id: 'programming',
    name: 'Programming',
    description: 'Code review, debugging, and development assistance',
    icon: '💻',
    color: '#3B82F6'
  },
  {
    id: 'writing',
    name: 'Writing',
    description: 'Content creation, editing, and writing assistance',
    icon: '✍️',
    color: '#10B981'
  },
  {
    id: 'analysis',
    name: 'Analysis',
    description: 'Data analysis, research, and insights',
    icon: '📊',
    color: '#F59E0B'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Brainstorming, ideation, and creative projects',
    icon: '🎨',
    color: '#8B5CF6'
  },
  {
    id: 'learning',
    name: 'Learning',
    description: 'Educational content and learning assistance',
    icon: '📚',
    color: '#EF4444'
  },
  {
    id: 'business',
    name: 'Business',
    description: 'Business strategy, planning, and professional tasks',
    icon: '💼',
    color: '#06B6D4'
  },
  {
    id: 'personal',
    name: 'Personal',
    description: 'Personal development and life assistance',
    icon: '🌟',
    color: '#EC4899'
  }
];

// Pre-built conversation templates
export const PRE_BUILT_TEMPLATES: ConversationTemplate[] = [
  // Programming Templates
  {
    id: 'code-review',
    name: 'Code Review',
    category: 'programming',
    description: 'Get a comprehensive code review with best practices and suggestions',
    systemPrompt: 'You are an expert software developer and code reviewer. Analyze the provided code for best practices, potential bugs, performance issues, and optimization opportunities. Provide specific, actionable feedback with examples.',
    userMessage: 'Please review this code for best practices, potential bugs, and optimization opportunities:\n\n[Paste your code here]',
    tags: ['code', 'review', 'best-practices', 'debugging'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3', 'codellama'],
    icon: '🔍',
    color: '#3B82F6'
  },
  {
    id: 'debug-helper',
    name: 'Debug Helper',
    category: 'programming',
    description: 'Get help debugging errors and issues in your code',
    systemPrompt: 'You are a debugging expert. Help identify and solve programming errors. Ask clarifying questions when needed and provide step-by-step solutions.',
    userMessage: 'I\'m getting this error:\n\n[Paste error message here]\n\nHere\'s my code:\n\n[Paste relevant code here]',
    tags: ['debug', 'error', 'troubleshooting'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3', 'codellama'],
    icon: '🐛',
    color: '#EF4444'
  },
  {
    id: 'code-optimization',
    name: 'Code Optimization',
    category: 'programming',
    description: 'Optimize your code for performance and efficiency',
    systemPrompt: 'You are a performance optimization expert. Analyze code for efficiency improvements, memory usage, and algorithmic optimizations. Provide specific recommendations with explanations.',
    userMessage: 'Please help me optimize this code for better performance:\n\n[Paste your code here]',
    tags: ['optimization', 'performance', 'efficiency'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '⚡',
    color: '#F59E0B'
  },
  {
    id: 'documentation',
    name: 'Add Documentation',
    category: 'programming',
    description: 'Add comprehensive comments and documentation to your code',
    systemPrompt: 'You are a technical writer and software developer. Add clear, comprehensive documentation including comments, README sections, and usage examples. Follow industry best practices for code documentation.',
    userMessage: 'Please add comprehensive comments and documentation to this code:\n\n[Paste your code here]',
    tags: ['documentation', 'comments', 'readme'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '📝',
    color: '#10B981'
  },

  // Writing Templates
  {
    id: 'content-creation',
    name: 'Content Creation',
    category: 'writing',
    description: 'Create engaging content for blogs, articles, or social media',
    systemPrompt: 'You are a professional content creator and writer. Help create engaging, well-structured content that captures attention and provides value to readers. Adapt the tone and style as requested.',
    userMessage: 'Help me create engaging content about [topic]. The content should be [tone/style] and target [audience].',
    tags: ['content', 'writing', 'blog', 'social-media'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3', 'gemini-pro'],
    icon: '✍️',
    color: '#10B981'
  },
  {
    id: 'grammar-check',
    name: 'Grammar & Style Review',
    category: 'writing',
    description: 'Review and improve grammar, style, and clarity of your text',
    systemPrompt: 'You are an expert editor and writing coach. Review text for grammar, style, clarity, and flow. Provide specific suggestions for improvement while maintaining the original voice and intent.',
    userMessage: 'Please review and improve the grammar and style of this text:\n\n[Paste your text here]',
    tags: ['grammar', 'style', 'editing', 'clarity'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '📖',
    color: '#8B5CF6'
  },
  {
    id: 'email-writing',
    name: 'Email Writing',
    category: 'writing',
    description: 'Write professional emails for various purposes',
    systemPrompt: 'You are a professional communication expert. Help write clear, professional emails that are appropriate for the context and audience. Consider tone, formality, and purpose.',
    userMessage: 'Help me write a [formal/informal] email to [recipient] about [topic]. The tone should be [professional/friendly/urgent/etc.].',
    tags: ['email', 'communication', 'professional'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '📧',
    color: '#06B6D4'
  },

  // Analysis Templates
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'analysis',
    description: 'Analyze data and provide insights',
    systemPrompt: 'You are a data analyst and business intelligence expert. Analyze provided data to identify patterns, trends, and insights. Provide clear explanations and actionable recommendations.',
    userMessage: 'Please analyze this data and provide insights:\n\n[Paste your data here]',
    tags: ['data', 'analysis', 'insights', 'trends'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '📊',
    color: '#F59E0B'
  },
  {
    id: 'market-research',
    name: 'Market Research',
    category: 'analysis',
    description: 'Conduct market research and competitive analysis',
    systemPrompt: 'You are a market research expert and business strategist. Help analyze markets, competitors, and business opportunities. Provide strategic insights and recommendations.',
    userMessage: 'Help me research the market for [product/service] in [industry/market]. I need insights about competitors, opportunities, and challenges.',
    tags: ['market-research', 'competitive-analysis', 'strategy'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '🔍',
    color: '#8B5CF6'
  },

  // Creative Templates
  {
    id: 'brainstorming',
    name: 'Brainstorming',
    category: 'creative',
    description: 'Generate creative ideas and solutions',
    systemPrompt: 'You are a creative thinking expert and innovation consultant. Help generate diverse, innovative ideas and solutions. Encourage out-of-the-box thinking while maintaining practicality.',
    userMessage: 'Help me brainstorm ideas for [project/topic]. I\'m looking for [type of ideas] that are [constraints/requirements].',
    tags: ['brainstorming', 'ideas', 'innovation', 'creative'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3', 'gemini-pro'],
    icon: '💡',
    color: '#8B5CF6'
  },
  {
    id: 'story-writing',
    name: 'Story Writing',
    category: 'creative',
    description: 'Create stories, narratives, or creative writing',
    systemPrompt: 'You are a creative writer and storyteller. Help create engaging narratives, stories, and creative content. Adapt to different genres and styles as requested.',
    userMessage: 'Help me write a [genre] story about [topic]. The story should be [length] and include [elements].',
    tags: ['story', 'creative-writing', 'narrative'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3', 'gemini-pro'],
    icon: '📚',
    color: '#EC4899'
  },

  // Learning Templates
  {
    id: 'concept-explanation',
    name: 'Concept Explanation',
    category: 'learning',
    description: 'Get clear explanations of complex concepts',
    systemPrompt: 'You are an expert educator and explainer. Break down complex concepts into simple, understandable explanations. Use analogies, examples, and step-by-step approaches.',
    userMessage: 'Please explain [concept] in simple terms. I\'m a [beginner/intermediate/advanced] level and need it explained for [specific context/use case].',
    tags: ['learning', 'explanation', 'education'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3', 'gemini-pro'],
    icon: '🎓',
    color: '#EF4444'
  },
  {
    id: 'study-plan',
    name: 'Study Plan',
    category: 'learning',
    description: 'Create personalized study plans and learning paths',
    systemPrompt: 'You are an educational consultant and learning strategist. Help create effective study plans, learning paths, and educational strategies tailored to individual needs and goals.',
    userMessage: 'Help me create a study plan for [subject/topic]. I have [time available] and my goal is [specific goal]. My current level is [beginner/intermediate/advanced].',
    tags: ['study-plan', 'learning-path', 'education'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '📅',
    color: '#10B981'
  },

  // Business Templates
  {
    id: 'business-strategy',
    name: 'Business Strategy',
    category: 'business',
    description: 'Develop business strategies and plans',
    systemPrompt: 'You are a business strategist and management consultant. Help develop business strategies, plans, and recommendations based on sound business principles and market understanding.',
    userMessage: 'Help me develop a business strategy for [business/idea]. My goals are [specific goals] and I\'m facing [challenges/opportunities].',
    tags: ['business', 'strategy', 'planning'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '💼',
    color: '#06B6D4'
  },
  {
    id: 'presentation-prep',
    name: 'Presentation Preparation',
    category: 'business',
    description: 'Prepare presentations and pitches',
    systemPrompt: 'You are a presentation expert and communication consultant. Help create compelling presentations, pitches, and communication materials that effectively convey messages and engage audiences.',
    userMessage: 'Help me prepare a presentation about [topic] for [audience]. The presentation should be [duration] and focus on [key points].',
    tags: ['presentation', 'pitch', 'communication'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '📊',
    color: '#F59E0B'
  },

  // Personal Templates
  {
    id: 'goal-setting',
    name: 'Goal Setting',
    category: 'personal',
    description: 'Set and plan personal or professional goals',
    systemPrompt: 'You are a life coach and goal-setting expert. Help individuals set meaningful, achievable goals and create actionable plans to reach them. Focus on SMART goals and accountability.',
    userMessage: 'Help me set and plan goals for [area of life]. I want to [specific desire] and I have [timeframe] to achieve it.',
    tags: ['goals', 'planning', 'personal-development'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '🎯',
    color: '#EC4899'
  },
  {
    id: 'decision-making',
    name: 'Decision Making',
    category: 'personal',
    description: 'Get help with important decisions',
    systemPrompt: 'You are a decision-making consultant and critical thinking expert. Help analyze options, weigh pros and cons, and make informed decisions based on available information and personal values.',
    userMessage: 'I need help making a decision about [situation]. My options are [options] and I\'m considering [factors].',
    tags: ['decision-making', 'analysis', 'choices'],
    isCustom: false,
    modelSpecific: ['gpt-4', 'claude-3'],
    icon: '🤔',
    color: '#8B5CF6'
  }
];

// Quick Actions
export const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'explain-code',
    name: 'Explain Code',
    icon: '💡',
    action: 'explain',
    description: 'Get a clear explanation of the selected code',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3', 'codellama'],
    systemPrompt: 'You are a programming educator. Explain the selected code in simple terms, covering what it does, how it works, and why it\'s written this way.',
    userMessageTemplate: 'Please explain this code:\n\n{selectedText}'
  },
  {
    id: 'optimize-code',
    name: 'Optimize Code',
    icon: '⚡',
    action: 'optimize',
    description: 'Optimize the selected code for better performance',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3'],
    systemPrompt: 'You are a performance optimization expert. Analyze the code and suggest improvements for efficiency, readability, and best practices.',
    userMessageTemplate: 'Please optimize this code:\n\n{selectedText}'
  },
  {
    id: 'debug-code',
    name: 'Debug Code',
    icon: '🐛',
    action: 'debug',
    description: 'Help debug issues in the selected code',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3', 'codellama'],
    systemPrompt: 'You are a debugging expert. Analyze the code for potential issues, bugs, and problems. Provide specific solutions and explanations.',
    userMessageTemplate: 'Please help me debug this code:\n\n{selectedText}'
  },
  {
    id: 'add-comments',
    name: 'Add Comments',
    icon: '📝',
    action: 'comment',
    description: 'Add comprehensive comments to the selected code',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3'],
    systemPrompt: 'You are a technical writer. Add clear, helpful comments to the code explaining what it does, why it works this way, and any important considerations.',
    userMessageTemplate: 'Please add comprehensive comments to this code:\n\n{selectedText}'
  },
  {
    id: 'translate-text',
    name: 'Translate',
    icon: '🌐',
    action: 'translate',
    description: 'Translate the selected text to another language',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3', 'gemini-pro'],
    systemPrompt: 'You are a professional translator. Translate the text accurately while preserving the original meaning, tone, and context.',
    userMessageTemplate: 'Please translate this text to [target language]:\n\n{selectedText}'
  },
  {
    id: 'summarize-text',
    name: 'Summarize',
    icon: '📋',
    action: 'summarize',
    description: 'Create a concise summary of the selected text',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3'],
    systemPrompt: 'You are a summarization expert. Create clear, concise summaries that capture the key points and main ideas of the text.',
    userMessageTemplate: 'Please summarize this text:\n\n{selectedText}'
  },
  {
    id: 'improve-writing',
    name: 'Improve Writing',
    icon: '✍️',
    action: 'improve',
    description: 'Improve the clarity and style of the selected text',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3'],
    systemPrompt: 'You are a writing coach and editor. Improve the text for clarity, style, grammar, and flow while maintaining the original voice and intent.',
    userMessageTemplate: 'Please improve this text:\n\n{selectedText}'
  },
  {
    id: 'simplify-text',
    name: 'Simplify',
    icon: '🔍',
    action: 'simplify',
    description: 'Simplify complex text for better understanding',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3'],
    systemPrompt: 'You are a communication expert. Simplify complex text to make it more accessible and easier to understand while preserving the essential information.',
    userMessageTemplate: 'Please simplify this text:\n\n{selectedText}'
  },
  {
    id: 'expand-ideas',
    name: 'Expand Ideas',
    icon: '📈',
    action: 'expand',
    description: 'Expand on the selected ideas or concepts',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3'],
    systemPrompt: 'You are a creative thinker and idea developer. Expand on the provided ideas, adding depth, examples, and related concepts.',
    userMessageTemplate: 'Please expand on these ideas:\n\n{selectedText}'
  },
  {
    id: 'review-content',
    name: 'Review',
    icon: '✅',
    action: 'review',
    description: 'Review and provide feedback on the selected content',
    requiresSelection: true,
    modelSpecific: ['gpt-4', 'claude-3'],
    systemPrompt: 'You are a content reviewer and quality assurance expert. Provide constructive feedback on the content, identifying strengths and areas for improvement.',
    userMessageTemplate: 'Please review this content:\n\n{selectedText}'
  }
];

