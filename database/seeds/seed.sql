-- seed.sql
-- Seed data for OpenBuilder

-- ============================================================
-- ADMIN USER (password: admin123)
-- ============================================================
INSERT INTO users (id, email, password_hash, name, role, subscription_tier, email_verified)
VALUES
    (
        'a0000000-0000-0000-0000-000000000001',
        'admin@openbuilder.ai',
        crypt('admin123', gen_salt('bf')),
        'Admin',
        'admin',
        'enterprise',
        TRUE
    );

-- ============================================================
-- SAMPLE CONVERSATIONS
-- ============================================================
INSERT INTO conversations (id, user_id, title, model)
VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Getting Started with OpenBuilder',
        'gpt-4o'
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'Python Code Review',
        'claude-3-opus'
    ),
    (
        'b0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'Architecture Discussion',
        'gpt-4o'
    );

-- ============================================================
-- SAMPLE MESSAGES
-- ============================================================
INSERT INTO messages (conversation_id, role, content, tokens)
VALUES
    (
        'b0000000-0000-0000-0000-000000000001',
        'user',
        'How do I deploy my first workflow?',
        8
    ),
    (
        'b0000000-0000-0000-0000-000000000001',
        'assistant',
        'To deploy your first workflow, navigate to the Workflows section and click "Create New". You can drag nodes onto the canvas and connect them to build your automation pipeline.',
        32
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'user',
        'Can you review this Python function for performance issues?',
        12
    ),
    (
        'b0000000-0000-0000-0000-000000000002',
        'assistant',
        'Sure! I see a few opportunities: 1) Use list comprehensions instead of for loops, 2) Consider using functools.lru_cache for repeated computations, 3) The nested loops could be optimized with itertools.',
        36
    );

-- ============================================================
-- SAMPLE MARKETPLACE ITEMS
-- ============================================================
INSERT INTO marketplace_items (id, author_id, name, description, type, config, rating, downloads, price)
VALUES
    (
        'c0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'AI Chat Assistant',
        'A powerful chat assistant template with multi-model support, memory management, and streaming responses. Perfect for customer support or personal assistant use cases.',
        'template',
        '{"models": ["gpt-4o", "claude-3-opus", "gemini-pro"], "features": ["streaming", "memory", "file_upload", "web_search"]}',
        4.8,
        1250,
        29.99
    ),
    (
        'c0000000-0000-0000-0000-000000000002',
        'a0000000-0000-0000-0000-000000000001',
        'Code Generator',
        'Generate production-ready code from natural language descriptions. Supports multiple languages and frameworks with best practices built in.',
        'tool',
        '{"languages": ["python", "typescript", "rust", "go"], "frameworks": ["react", "fastapi", "nextjs"], "features": ["linting", "tests", "docs"]}',
        4.6,
        980,
        19.99
    ),
    (
        'c0000000-0000-0000-0000-000000000003',
        'a0000000-0000-0000-0000-000000000001',
        'Image Creator',
        'AI-powered image generation with style transfer, inpainting, and batch processing. Integrates with DALL-E, Stable Diffusion, and Midjourney.',
        'tool',
        '{"providers": ["dall-e-3", "stable-diffusion-xl", "midjourney"], "styles": ["realistic", "anime", "oil-painting", "sketch"], "sizes": ["1024x1024", "1792x1024", "1024x1792"]}',
        4.7,
        750,
        24.99
    ),
    (
        'c0000000-0000-0000-0000-000000000004',
        'a0000000-0000-0000-0000-000000000001',
        'Document Analyzer',
        'Analyze PDFs, Word docs, and spreadsheets with AI. Extract insights, summarize content, and answer questions about your documents.',
        'integration',
        '{"formats": ["pdf", "docx", "xlsx", "txt", "md"], "features": ["ocr", "summarization", "qa", "entity_extraction"], "max_file_size_mb": 100}',
        4.5,
        520,
        14.99
    ),
    (
        'c0000000-0000-0000-0000-000000000005',
        'a0000000-0000-0000-0000-000000000001',
        'Workflow Builder',
        'Visual workflow builder with drag-and-drop interface. Connect AI models, APIs, and data sources into automated pipelines.',
        'workflow',
        '{"node_types": ["llm", "api", "database", "transform", "webhook", "schedule"], "triggers": ["manual", "scheduled", "webhook", "event"], "max_nodes_per_workflow": 50}',
        4.9,
        2100,
        49.99
    );

-- ============================================================
-- SAMPLE WORKFLOW TEMPLATE
-- ============================================================
INSERT INTO workflows (id, user_id, name, description, nodes, edges, status)
VALUES
    (
        'd0000000-0000-0000-0000-000000000001',
        'a0000000-0000-0000-0000-000000000001',
        'Customer Support Auto-Responder',
        'Automatically respond to customer inquiries using AI. Classifies intent, generates responses, and escalates to humans when needed.',
        '[
            {"id": "trigger", "type": "webhook", "label": "Incoming Request", "config": {"method": "POST", "path": "/webhook/support"}},
            {"id": "classify", "type": "llm", "label": "Classify Intent", "config": {"model": "gpt-4o", "prompt": "Classify the following customer inquiry into: billing, technical, general, or urgent."}},
            {"id": "generate", "type": "llm", "label": "Generate Response", "config": {"model": "gpt-4o", "temperature": 0.7}},
            {"id": "escalate", "type": "api", "label": "Escalate to Human", "config": {"url": "https://api.example.com/tickets", "method": "POST"}},
            {"id": "respond", "type": "webhook", "label": "Send Response", "config": {"method": "POST"}}
        ]',
        '[
            {"id": "e1", "source": "trigger", "target": "classify"},
            {"id": "e2", "source": "classify", "target": "generate", "label": "billing, general"},
            {"id": "e3", "source": "classify", "target": "escalate", "label": "urgent"},
            {"id": "e4", "source": "generate", "target": "respond"}
        ]',
        'active'
    );
