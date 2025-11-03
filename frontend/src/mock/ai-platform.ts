export const ai_tools = [
  {
    id: '1',
    name: 'ChatGPT',
    description:
      'Conversational AI assistant for text generation and problem-solving',
    category: 'Text Generation',
    rating: 4.8,
    image: '/placeholder.svg?height=200&width=200',
    url: 'https://chat.openai.com',
    tags: ['chatbot', 'writing', 'coding'],
  },
  {
    id: '2',
    name: 'Midjourney',
    description:
      'AI art generator that creates stunning images from text descriptions',
    category: 'Image Generation',
    rating: 4.7,
    image: '/placeholder.svg?height=200&width=200',
    url: 'https://midjourney.com',
    tags: ['art', 'design', 'creative'],
  },
  {
    id: '3',
    name: 'Perplexity AI',
    description: 'AI-powered search engine that provides comprehensive answers',
    category: 'Research',
    rating: 4.6,
    image: '/placeholder.svg?height=200&width=200',
    url: 'https://perplexity.ai',
    tags: ['research', 'search', 'information'],
  },
  {
    id: '4',
    name: 'Jasper',
    description:
      'AI content platform for marketing teams to create high-quality content',
    category: 'Content Creation',
    rating: 4.5,
    image: '/placeholder.svg?height=200&width=200',
    url: 'https://jasper.ai',
    tags: ['marketing', 'writing', 'business'],
  },
  {
    id: '5',
    name: 'Runway',
    description:
      'Creative suite with AI tools for video editing and generation',
    category: 'Video Generation',
    rating: 4.7,
    image: '/placeholder.svg?height=200&width=200',
    url: 'https://runwayml.com',
    tags: ['video', 'editing', 'creative'],
  },
  {
    id: '6',
    name: 'Hugging Face',
    description:
      'Platform for machine learning with thousands of pre-trained models',
    category: 'Development',
    rating: 4.9,
    image: '/placeholder.svg?height=200&width=200',
    url: 'https://huggingface.co',
    tags: ['development', 'models', 'open-source'],
  },
];

export const ai_prompts = [
  {
    id: '1',
    title: 'Creative Story Generator',
    content:
      'Write a short story about a character who discovers they have the ability to [power] in a world where [setting]. Include a twist at the end.',
    category: 'Creative Writing',
    likes: 245,
    comments: 32,
    author: {
      name: 'Alex Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['story', 'creative', 'fiction'],
  },
  {
    id: '2',
    title: 'Product Description Template',
    content:
      'Create a compelling product description for a [product] that highlights its [feature 1], [feature 2], and [feature 3]. Target audience is [demographic].',
    category: 'Marketing',
    likes: 189,
    comments: 24,
    author: {
      name: 'Sarah Miller',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['marketing', 'product', 'business'],
  },
  {
    id: '3',
    title: 'Code Explainer',
    content:
      "Explain the following code as if you're teaching a beginner programmer. Break down each part and explain its purpose: [paste code here]",
    category: 'Programming',
    likes: 312,
    comments: 47,
    author: {
      name: 'David Chen',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['coding', 'education', 'programming'],
  },
  {
    id: '4',
    title: 'Email Response Generator',
    content:
      'Write a professional email response to the following message: [message]. The tone should be [tone] and I want to [objective].',
    category: 'Business',
    likes: 178,
    comments: 19,
    author: {
      name: 'Emily Wong',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['email', 'business', 'communication'],
  },
  {
    id: '5',
    title: 'Recipe Creator',
    content:
      'Create a recipe for a [dish type] using the following ingredients: [ingredient 1], [ingredient 2], [ingredient 3]. The recipe should be suitable for [dietary restriction] diets.',
    category: 'Food',
    likes: 203,
    comments: 31,
    author: {
      name: 'Michael Brown',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['food', 'cooking', 'recipe'],
  },
  {
    id: '6',
    title: 'Learning Concept Explainer',
    content:
      'Explain the concept of [concept] in simple terms. Then, explain it at an intermediate level. Finally, explain it at an advanced level.',
    category: 'Education',
    likes: 267,
    comments: 38,
    author: {
      name: 'Jessica Lee',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['education', 'learning', 'explanation'],
  },
];

export const ai_blogs = [
  {
    id: '1',
    title: 'The Future of AI in Content Creation',
    excerpt:
      'Explore how artificial intelligence is revolutionizing content creation across industries and what it means for creators.',
    category: 'AI Trends',
    date: 'March 15, 2023',
    readTime: '5 min read',
    slug: 'future-of-ai-content-creation',
    image: '/placeholder.svg?height=400&width=600',
    author: {
      name: 'Alex Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['story', 'creative', 'fiction'],
  },
  {
    id: '2',
    title: 'Mastering Prompt Engineering: Tips and Techniques',
    excerpt:
      'Learn the art of crafting effective prompts to get the best results from large language models like GPT-4.',
    category: 'Tutorials',
    date: 'March 10, 2023',
    readTime: '8 min read',
    slug: 'mastering-prompt-engineering',
    image: '/placeholder.svg?height=400&width=600',
    author: {
      name: 'Sarah Miller',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['story', 'creative', 'fiction'],
  },
  {
    id: '3',
    title: 'Ethical Considerations in AI Development',
    excerpt:
      'A deep dive into the ethical challenges facing AI development and how developers can address them responsibly.',
    category: 'Ethics',
    date: 'March 5, 2023',
    readTime: '10 min read',
    slug: 'ethical-considerations-ai-development',
    image: '/placeholder.svg?height=400&width=600',
    author: {
      name: 'David Chen',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    tags: ['story', 'creative', 'fiction'],
  },
];
