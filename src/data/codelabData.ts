import { SandboxScenario, QuizQuestion } from '../types';

export const CHAPTERS = [
  {
    id: 1,
    title: "1. The Anatomy of a Single Agent",
    subtitle: "Understand prompts, instructions, and tool orchestration loops.",
    iconName: "User",
    duration: "10 mins"
  },
  {
    id: 2,
    title: "2. Multi-Agent Architectures",
    subtitle: "Deep-dive into Sequential, Router, and Peer-to-Peer patterns.",
    iconName: "GitMerge",
    duration: "12 mins"
  },
  {
    id: 3,
    title: "3. Multi-Agent Orchestration Arena",
    subtitle: "Interactive playground to execute and visualize coordination scenarios.",
    iconName: "Play",
    duration: "15 mins"
  },
  {
    id: 4,
    title: "4. ADK Boilerplate Explorer",
    subtitle: "Translate visual patterns into enterprise ready ADK code block syntax.",
    iconName: "Code",
    duration: "8 mins"
  },
  {
    id: 5,
    title: "5. Quiz & Architect Certification",
    subtitle: "Test your agent coordination skills and claim your credential certificate.",
    iconName: "Award",
    duration: "5 mins"
  }
];

export const SCENARIOS: SandboxScenario[] = [
  {
    id: 'sequential_trip',
    title: "🏕️ Trip Planner with Weather & Activity Experts",
    description: "A classic sequential chain pipeline. A travel coordinator designs an itinerary, a weather specialist validates temperature safety, and an activities planner adds local highlights.",
    architecture: 'sequential',
    initialPrompt: "Plan a exciting 3-day outdoor adventure in Seattle starting June 12th.",
    agents: [
      {
        id: 'travel_coord',
        name: "Seattle Coordinator",
        role: "Primary Planner",
        avatar: "🗺️",
        systemInstruction: "You represent primary travel planning. Analyze time intervals and write high-level Seattle itineraries. Hand off weather concerns to the Scout.",
        tools: [],
        status: 'idle',
        color: 'border-blue-500 bg-blue-50/50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
      },
      {
        id: 'weather_scout',
        name: "Weather Scout",
        role: "Safe Navigator",
        avatar: "🌤️",
        systemInstruction: "You are the safe weather auditor. Invoke the weather tool for Seattle in June, inspect safety bounds, check rainfall risks, and attach alerts.",
        tools: ["get_weather_forecast"],
        status: 'idle',
        color: 'border-amber-500 bg-amber-50/50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400'
      },
      {
        id: 'activity_scout',
        name: "Activity Curators",
        role: "Experience Optimizer",
        avatar: "🎡",
        systemInstruction: "Choose unique local experiences based on itinerary and weather forecasts. Query activities database and assemble the finalized package.",
        tools: ["search_activities_db"],
        status: 'idle',
        color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400'
      }
    ],
    steps: [
      {
        sender: 'system',
        receiver: 'travel_coord',
        type: 'system',
        content: "Pipeline initialized. Handing off user prompt to the Seattle Coordinator Agent."
      },
      {
        sender: 'travel_coord',
        receiver: 'travel_coord',
        type: 'agent_thought',
        content: "Analyzing request: 3-day adventure in Seattle on June 12th. I need to outline 3 main segments focusing on outdoors (Discovery Park, Mount Rainier, and Alki Beach) then hand off to public Weather Scout to run safety checks."
      },
      {
        sender: 'travel_coord',
        receiver: 'weather_scout',
        type: 'agent_msg',
        content: "Draft Itinerary Created:\nDay 1: Hike loop at Discovery Park.\nDay 2: Full day excursion to Mount Rainier Paradise Trail.\nDay 3: Kayaking near Alki Beach.\n\nWeather Scout, please check June 12-14 forecast and flag any rain/wind limits that jeopardize these activities."
      },
      {
        sender: 'weather_scout',
        receiver: 'weather_scout',
        type: 'agent_thought',
        content: "Wait, Mount Rainier hiking and Alki kayaking require stable high temperatures and low wind. I need to call get_weather_forecast for Seattle (June 12)."
      },
      {
        sender: 'weather_scout',
        receiver: 'system',
        type: 'tool_call',
        content: "Invoking weather database for coordinate: [Seattle, WA]",
        toolName: 'get_weather_forecast',
        toolArgs: '{"location": "Seattle, WA", "dates": "June 12-14"}'
      },
      {
        sender: 'system',
        receiver: 'weather_scout',
        type: 'tool_response',
        content: '{"forecast": [{"date": "June 12", "temp_max": 72, "conditions": "Sunny", "wind_mph": 8}, {"date": "June 13", "temp_max": 65, "conditions": "Partly Cloudy", "wind_mph": 12}, {"date": "June 14", "temp_max": 59, "conditions": "Afternoon Showers", "wind_mph": 18}]}'
      },
      {
        sender: 'weather_scout',
        receiver: 'weather_scout',
        type: 'agent_thought',
        content: "Ah, June 14 (Day 3) has afternoon showers and 18mph winds. Kayaking is unsafe in those conditions. I must warn the Activity Curator to swap outdoor water sports on Day 3 with indoor activities."
      },
      {
        sender: 'weather_scout',
        receiver: 'activity_scout',
        type: 'agent_msg',
        content: "Weather Advisory Attached:\n- Day 1 & 2 look stable and perfect (72°F & 65°F).\n- Day 3 Afternoon (June 14th) warns of showers and wind (18mph). Standard marine alerts active. Kayaking should be swapped out.\n\nActivity Curators, adjust Day 3 to incorporate an alternate indoor experience and search local highlight events."
      },
      {
        sender: 'activity_scout',
        receiver: 'activity_scout',
        type: 'agent_thought',
        content: "The prompt asks for 'exciting adventure'. Since Day 3 afternoon is rainy/windy, I need to suggest a top indoor alternative. Let's call search_activities_db with filters for 'indoor' and 'adventure' in Seattle."
      },
      {
        sender: 'activity_scout',
        receiver: 'system',
        type: 'tool_call',
        content: "Filtering activities on tag: [Indoor Adventure / High Quality]",
        toolName: 'search_activities_db',
        toolArgs: '{"category": "Indoor/Museum", "city": "Seattle", "ratings_above": 4.5}'
      },
      {
        sender: 'system',
        receiver: 'activity_scout',
        type: 'tool_response',
        content: '{"results": [{"name": "Museum of Flight (Full Flight Simulators)", "rating": 4.8}, {"name": "Seattle Bouldering Project (Indoor climbing)", "rating": 4.7}]}'
      },
      {
        sender: 'activity_scout',
        receiver: 'activity_scout',
        type: 'agent_thought',
        content: "Perfect! I will replace kayaking with the Museum of Flight Aerospace Simulators and indoor bouldering. Compiling final interactive itinerary."
      },
      {
        sender: 'activity_scout',
        receiver: 'user',
        type: 'agent_msg',
        content: "### 🏕️ Your Optimized 3-Day Seattle Itinerary (ADK Coordinated Result):\n\n*   **Day 1 (June 12 - Sunny 72°F):** Magnificent trail walks in Discovery Park cliff loops, ending with a beach campfire.\n*   **Day 2 (June 13 - Stable 65°F):** Full-day mountain sweep at Mount Rainier. Hike Skyline trail. *Weather Alert: Bring mild fleece as winds reach 12mph in alpine meadows.*\n*   **Day 3 (June 14 - Showers Post 2PM):** Morning explore at Seattle Waterfront, and then shield from afternoon rains during a simulated fighter jet mission at **Museum of Flight** followed by action climbing at **Seattle Bouldering Project**.\n\n*Orchestration Stats: 3 agent steps completed successfully. Weather safety constraints satisfied.*"
      }
    ]
  },
  {
    id: 'routed_support',
    title: "⚡ Router-Based Support Desk Triage",
    description: "Hub-and-Spoke pattern. A Master Triage Router Agent reads feedback from clients, uses a selector to spin up dedicated sub-agents (Technical Specialist vs. Billing Expert), and reviews output for compliance.",
    architecture: 'router',
    initialPrompt: "I was billed double ($149 twice) for my agent subscription, and I keep getting a 'Database Connection Exceeded' error on my developer keys.",
    agents: [
      {
        id: 'triage_router',
        name: "Support Desk Router",
        role: "Triage & Supervisor",
        avatar: "🧭",
        systemInstruction: "You are the Gatekeeper Supervisor Agent. Parse user requests, assess billing urgency vs technical errors, trigger specialist sub-agents, and merge answers.",
        tools: ["route_to_department"],
        status: 'idle',
        color: 'border-indigo-500 bg-indigo-50/50 text-indigo-700 dark:bg-indigo-950/20 dark:text-indigo-400'
      },
      {
        id: 'billing_agent',
        name: "Billing Specialist",
        role: "Fintech Expert",
        avatar: "💳",
        systemInstruction: "You are the Billing Specialist Agent. Verify balances, handle subscription records, lookup invoices, and initiate refunds using secure client APIs.",
        tools: ["refund_invoice", "check_user_transactions"],
        status: 'idle',
        color: 'border-pink-500 bg-pink-50/50 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400'
      },
      {
        id: 'tech_agent',
        name: "Tech Specialist",
        role: "DevOps Engineer",
        avatar: "🛠️",
        systemInstruction: "You are the Technical Support DevOps Agent. Audit cluster metrics, look up developer API key quotas, and formulate exact quick-fixes for SQL / Database limits.",
        tools: ["get_system_logs"],
        status: 'idle',
        color: 'border-cyan-500 bg-cyan-50/50 text-cyan-700 dark:bg-cyan-950/20 dark:text-cyan-400'
      }
    ],
    steps: [
      {
        sender: 'system',
        receiver: 'triage_router',
        type: 'system',
        content: "Incoming multi-category inquiry received. Supervisor Triage activates."
      },
      {
        sender: 'triage_router',
        receiver: 'triage_router',
        type: 'agent_thought',
        content: "This contains two distinct problems: 1) Double billing ($149x2) - Billing Specialist needed. 2) 'Conn Exceeded' error - Tech Specialist needed. I will route tasks to both specialized departments in parallel."
      },
      {
        sender: 'triage_router',
        receiver: 'system',
        type: 'tool_call',
        content: "Executing routing triggers for simultaneous specialist assignment",
        toolName: 'route_to_department',
        toolArgs: '{"departments": ["billing", "devops"]}'
      },
      {
        sender: 'system',
        receiver: 'triage_router',
        type: 'tool_response',
        content: '{"routing_status": "Success", "dispatched_agents": ["billing_agent", "tech_agent"]}'
      },
      {
        sender: 'triage_router',
        receiver: 'billing_agent',
        type: 'agent_msg',
        content: "Dispatching Billing Task:\nUser reports duplicate billing of $149 under subscription keys. Verify transact databases and refund duplicate invoice immediately."
      },
      {
        sender: 'billing_agent',
        receiver: 'billing_agent',
        type: 'agent_thought',
        content: "I need to check recent transactions for user subscription keys to find the duplicate $149 item."
      },
      {
        sender: 'billing_agent',
        receiver: 'system',
        type: 'tool_call',
        content: "Retrieving user subscription invoices for last 24 hours",
        toolName: 'check_user_transactions',
        toolArgs: '{"user_id": "usr_91x", "subscription_price_point": 149}'
      },
      {
        sender: 'system',
        receiver: 'billing_agent',
        type: 'tool_response',
        content: '{"transactions": [{"id": "txn_A100", "price": 149, "status": "completed"}, {"id": "txn_A101", "price": 149, "status": "completed"}], "user_email": "dev@firm.com"}'
      },
      {
        sender: 'billing_agent',
        receiver: 'billing_agent',
        type: 'agent_thought',
        content: "Confirmed duplicate charges txn_A101. Triggering full automated refund of $149."
      },
      {
        sender: 'billing_agent',
        receiver: 'system',
        type: 'tool_call',
        content: "Calling refund API endpoint",
        toolName: 'refund_invoice',
        toolArgs: '{"transaction_id": "txn_A101", "reason": "Accidental duplicate checkout checkout"}'
      },
      {
        sender: 'system',
        receiver: 'billing_agent',
        type: 'tool_response',
        content: '{"refund_status": "PROCESSED", "amount_returned": 149.00}'
      },
      {
        sender: 'billing_agent',
        receiver: 'triage_router',
        type: 'agent_msg',
        content: "Billing resolved. Found duplicate txn_A101 and authorized a full $149 credit refund to source card. Process time: 1-3 business days. Handing back control."
      },
      {
        sender: 'triage_router',
        receiver: 'tech_agent',
        type: 'agent_msg',
        content: "Dispatching Tech Task:\nUser reporting 'Database Connection Exceeded' on interactive api keys. Check system performance status."
      },
      {
        sender: 'tech_agent',
        receiver: 'tech_agent',
        type: 'agent_thought',
        content: "Let's inspect the active connections status and database server pool usage metrics."
      },
      {
        sender: 'tech_agent',
        receiver: 'system',
        type: 'tool_call',
        content: "Querying infrastructure logs for code: [ConnExceededError]",
        toolName: 'get_system_logs',
        toolArgs: '{"error_class": "DatabaseConnectionLimit", "timeframe": "1hr"}'
      },
      {
        sender: 'system',
        receiver: 'tech_agent',
        type: 'tool_response',
        content: '{"pool_limit": 50, "active_sessions_for_account": 50, "error_cause": "Abandoned WebSocket sessions from older agent models in preview mode context"}'
      },
      {
        sender: 'tech_agent',
        receiver: 'tech_agent',
        type: 'agent_thought',
        content: "Ah, the student has abandoned zombie connections locking the pool. I will formulate SQL cleanup instructions to force-kill idle connections and advise setting connection timeout in the ADK config."
      },
      {
        sender: 'tech_agent',
        receiver: 'triage_router',
        type: 'agent_msg',
        content: "Tech Audit Complete. Account pool hit connection cap (50/50) because zombie sessions are lingering. Fix: 1) Run SQL `SELECT pg_terminate_backend(pid);` in console. 2) Set `idle_timeout` to 30s in ADK client constructor. Handing back control."
      },
      {
        sender: 'triage_router',
        receiver: 'triage_router',
        type: 'agent_thought',
        content: "Now I've received solutions from both specialists. I will summarize into an exquisite single client-facing email ticket response."
      },
      {
        sender: 'triage_router',
        receiver: 'user',
        type: 'agent_msg',
        content: "### 🧭 Core Ticket Resolution Summary:\n\nHello, we have diagnosed and resolved both elements of your inquiry coordinate structure:\n\n1.  **Duplicate Billing Refund Issued (Processed):** We audited your transactions table and confirmed two concurrent subscriptions on your card. Invoice **txn_A101** has been refunded in full ($149.00). Keep an eye on your bank statement in 1-3 business days.\n2.  **Database Connection Limit Fix (Action Required):** Our systems show you hit 50 concurrent active nodes. Old development preview simulations did not clean up their WebSockets. We recommend running our quick-release SQL code or adding `idle_timeout: 30000` to your ADK listener options to prevent lingering sockets.\n\n*Orchestrated Framework: Support Desk Triage router -> delegated specialists in parallel. Result resolved.*"
      }
    ]
  },
  {
    id: 'p2p_dev',
    title: "🤖 Peer-to-Peer Software Engineer & QA Analyst Review Loop",
    description: "An interactive, self-correcting collaborative loop. A Software Engineer Agent writes code to solve a prompt, a QA Specialist runs integration tests and provides targeted feedback in several iterations until tests pass green.",
    architecture: 'p2p',
    initialPrompt: "Write a thread-safe TypeScript cache pool manager that auto-evicts keys after 1000ms.",
    agents: [
      {
        id: 'soft_eng',
        name: "Dev Agent",
        role: "Software Craftsman",
        avatar: "💻",
        systemInstruction: "You are the primary software developer. Write clean, modular, and performant TypeScript patterns. Accept QA bugs, analyze failure reports, and rewrite classes in response.",
        tools: [],
        status: 'idle',
        color: 'border-purple-500 bg-purple-50/50 text-purple-700 dark:bg-purple-950/20 dark:text-purple-400'
      },
      {
        id: 'qa_engineer',
        name: "QA Agent",
        role: "Quality Assurance Expert",
        avatar: "🔍",
        systemInstruction: "You represent strict QA. Audit typescript code, mock test simulations, check for memory leaks (like un-cleared timers), and document bug tickets clearly.",
        tools: ["test_eviction_engine"],
        status: 'idle',
        color: 'border-orange-500 bg-orange-50/50 text-orange-700 dark:bg-orange-950/20 dark:text-orange-450'
      }
    ],
    steps: [
      {
        sender: 'system',
        receiver: 'soft_eng',
        type: 'system',
        content: "Collaborative arena active. Developer Agent draft generation initiated."
      },
      {
        sender: 'soft_eng',
        receiver: 'soft_eng',
        type: 'agent_thought',
        content: "I need to design a map-based cache database. I will use a simple constructor utilizing standard Node setTimeout callbacks for eviction."
      },
      {
        sender: 'soft_eng',
        receiver: 'qa_engineer',
        type: 'agent_msg',
        content: "### CacheManager v1:\n```ts\nexport class CacheManager {\n  private store = new Map<string, any>();\n  \n  set(key: string, val: any) {\n    this.store.set(key, val);\n    setTimeout(() => this.store.delete(key), 1000);\n  }\n  \n  get(key: string) {\n    return this.store.get(key);\n  }\n}\n```\nQA Agent, please analyze and run automated unit tests on this module."
      },
      {
        sender: 'qa_engineer',
        receiver: 'qa_engineer',
        type: 'agent_thought',
        content: "Let's review the code. The user requests a 'thread-safe auto-evict cache'. First issue: Using loose `setTimeout` without clearing previous timers can lead to severe memory leakage if a key is updated frequently before eviction occurs! Let's run the static analyzer tool to flag timer overhead."
      },
      {
        sender: 'qa_engineer',
        receiver: 'system',
        type: 'tool_call',
        content: "Simulating 10,000 rapid scale writes with timer override profiles",
        toolName: 'test_eviction_engine',
        toolArgs: '{"overlapping_writes": 10000, "code_snippet": "setTimeout(() => this.store.delete(key))"}'
      },
      {
        sender: 'system',
        receiver: 'qa_engineer',
        type: 'tool_response',
        content: '{"passed": false, "failures": ["MEMORY_LEAK_WARNING: 10,000 active, orphan timer callbacks detected on rapid key overwriting.", "TIMER_RACE_CONDITION: Overwriting key triggers premature deletion from early timer expiration."]}'
      },
      {
        sender: 'qa_engineer',
        receiver: 'soft_eng',
        type: 'agent_msg',
        content: "### QA Audit Failure: Memory & Race Triggers\n\nNice start, Dev! However, your implementation fails scale security guidelines:\n\n1.  **Memory Leak:** Overwriting an active key appends multiple active `setTimeout` callbacks. The older timeouts will trigger and destroy freshly overwritten values prematurely!\n2.  **Fix Requirement:** Store the timer handle (NodeJS.Timeout) inside a secondary map. On any `.set()` invoke, call `clearTimeout(oldTimer)` block if it exists."
      },
      {
        sender: 'soft_eng',
        receiver: 'soft_eng',
        type: 'agent_thought',
        content: "Ah! Excellent catch. If a user sets 'key1' at t=0, then overwrites 'key1' at t=900ms, the first timer executes at t=1000ms and deletes the *new* value. I need to maintain a companion `timeouts = new Map<string, NodeJS.Timeout>()` and clear it on each set."
      },
      {
        sender: 'soft_eng',
        receiver: 'qa_engineer',
        type: 'agent_msg',
        content: "### CacheManager v2 (Resolved Overwrites):\n```ts\nexport class CacheManager {\n  private store = new Map<string, any>();\n  private timers = new Map<string, any>();\n\n  set(key: string, val: any) {\n    // Resolve memory leak: clear existing timers prior to resetting\n    if (this.timers.has(key)) {\n      clearTimeout(this.timers.get(key));\n    }\n    \n    this.store.set(key, val);\n    \n    const handle = setTimeout(() => {\n      this.store.delete(key);\n      this.timers.delete(key);\n    }, 1000);\n    this.timers.set(key, handle);\n  }\n\n  get(key: string) {\n    return this.store.get(key);\n  }\n}\n```\nQA Agent, re-run tests on the leak profiles with this v2 version."
      },
      {
        sender: 'qa_engineer',
        receiver: 'qa_engineer',
        type: 'agent_thought',
        content: "Let's re-run tests. This passes the memory leak check! Also clears timers securely upon overwrite. Let's do a fast final evaluation."
      },
      {
        sender: 'qa_engineer',
        receiver: 'system',
        type: 'tool_call',
        content: "Simulating 10,000 rapid scale overwrites on v2 cache map",
        toolName: 'test_eviction_engine',
        toolArgs: '{"overlapping_writes": 10000, "verification_target": "timers_map_cleanup"}'
      },
      {
        sender: 'system',
        receiver: 'qa_engineer',
        type: 'tool_response',
        content: '{"passed": true, "leak_count": 0, "race_conditions": 0, "summary": "Eviction timings are consistent"}'
      },
      {
        sender: 'qa_engineer',
        receiver: 'user',
        type: 'agent_msg',
        content: "### 🎉 P2P Collaboration Success! Audit approved.\n\nThe Code & QA Agents coordinated a 2-stage cycle successfully to patch critical concurrency issues:\n\n*   **Software Dev Agent** designed a solid key-store structure and incorporated the feedback.\n*   **QA Agent** flagged race conditions, prevented memory leaks via automated stress tests, and verified safety.\n*   **Final Output Code is verified green** for enterprise ADK production environments."
      }
    ]
  }
];

export const CODE_EXPLORER_TABS = [
  {
    id: 'single_agent',
    title: "1. Defining an Agent",
    description: "In the Google ADK, agents are defined with robust system instructions, models, and tools.",
    code: (name: string, instruction: string, temp: number) => `import { Agent, GoogleGenAI } from '@google/genai';

// Initialize the core Google GenAI client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define your specialized Agent following ADK guidelines
export const customAgent = new Agent({
  client: ai,
  model: 'gemini-3.5-flash',
  name: '${name || 'TravelCoordinator'}',
  systemInstruction: \`${instruction || 'You are an expert travel coordinator.'}\`,
  config: {
    temperature: ${temp || 0.7},
    maxOutputTokens: 2048,
  }
});`
  },
  {
    id: 'registering_tools',
    title: "2. Assigning Declarative Tools",
    description: "Agents query custom services securely by mapping standard JSON function schema declarations.",
    code: () => `import { FunctionDeclaration, Type } from '@google/genai';

// 1. Declare tool schemas mapping parameters and requirements
export const fetchWeatherSchema: FunctionDeclaration = {
  name: 'get_weather_forecast',
  description: 'Retrieve Seattle rain, wind, and sunshine metrics',
  parameters: {
    type: Type.OBJECT,
    properties: {
      location: {
        type: Type.STRING,
        description: 'Target US town (e.g. Seattle, WA)'
      },
      days: {
        type: Type.INTEGER,
        description: 'Duration window'
      }
    },
    required: ['location']
  }
};

// 2. Attach tools schema directly inside your ADK Agent initialization config
// The agent will decide WHEN to trigger the call during the coordination loop.
`
  },
  {
    id: 'sequential_pipeline',
    title: "3. Building Sequential Chains",
    description: "Chain agents sequentially using message pipelines where outputs of previous agents feed subsequent specialists.",
    code: () => `import { AgentPipeline } from '@google/genai';
import { coordinatorAgent, weatherScoutAgent, activityCurator } from './agents';

// Define the sequential orchestration route
const travelPipeline = new AgentPipeline({
  name: 'SeattleTravelPlanningChain',
  steps: [
    {
      agent: coordinatorAgent,
      instruction: "Draft initial 3-day Seattle high-level trail routing and beach layouts."
    },
    {
      agent: weatherScoutAgent,
      instruction: "Inspect weather metrics for the proposed dates; adjust segments with warnings."
    },
    {
      agent: activityCurator,
      instruction: "Apply rainy alternatives and construct the polished, beautiful result package."
    }
  ]
});

// Run the multi-agent task
const finalPlan = await travelPipeline.run({
  prompt: "Synthesize outdoor hiking and kayaking adventure on June 12th."
});
console.log(finalPlan.text);`
  },
  {
    id: 'router_dispatch',
    title: "4. Building Router Hubs",
    description: "Build Supervisor hubs that dynamically route requests to domain-expert sub-agents.",
    code: () => `import { TaskSupervisor, Type } from '@google/genai';
import { billingSpecialist, technicalSpecialist, fallbackAgent } from './specialists';

// Establish a supervisor router model to triage inquiries
const supervisorRouter = new TaskSupervisor({
  name: 'DeskSupervisor',
  model: 'gemini-3.5-flash',
  specialists: [
    {
      agent: billingSpecialist,
      triggerDescription: 'Trigger if query mentions invoices, subscription fees, secondary billing, or refunds.'
    },
    {
      agent: technicalSpecialist,
      triggerDescription: 'Trigger if user hits Error limits, DB connection timeouts, or API authentication blocks.'
    }
  ]
});

// Run multi-agent routing
const resolution = await supervisorRouter.resolve({
  prompt: "I keep logging Database connection limits while double checkout billed me $149."
});`
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When should you implement a Sequential Pipeline (Chain) multi-agent system rather than a single large prompt?",
    options: [
      "When the task consists of distinct modular phases where output from one step must be verified, audited, or enriched by another specialized persona before the next step.",
      "Only when you want to bypass the Gemini API tokens limits.",
      "When you need to perform client-side and server-side operations in parallel.",
      "None of the above, single prompts are always superior and cheaper to model."
    ],
    correctAnswer: 0,
    explanation: "Sequential Pipelines excel at structured workflows where domain-isolated specialists build on, refine, or audit previous outputs (e.g. Writer -> Editor -> SEO Analyst)."
  },
  {
    id: 2,
    question: "How do Agents interact with functional code or remote APIs in the Google ADK?",
    options: [
      "The model downloads Python scripts from the cloud and runs them inside the canvas iframe.",
      "The developer provides declarative FunctionDeclarations (JSON schemas) as tools. The model returns a specialized FunctionCall request, which the client-side/server-side executing framework catches, runs locally, and returns as a ToolResponse.",
      "The client-side UI forces the user to manually execute the API call and copy-paste results.",
      "The model accesses and manipulates the backend Node database directly without API keys."
    ],
    correctAnswer: 1,
    explanation: "Agents use Function Calling. They return structured JSON arguments asking the host framework to execute the specified API, and then resume once receiving the host framework's tool response."
  },
  {
    id: 3,
    question: "What is the key benefit of a Router (Hub-and-Spoke) multi-agent architecture?",
    options: [
      "It requires zero tokens because only the router handles queries.",
      "It speeds up execution and narrows the instruction context by routing queries purely to the single team specialist suited for the user's specific problem (e.g., Billing Agent or Tech Agent).",
      "It merges client-side browser cookies automatically across domains.",
      "It eliminates the need for system instructions."
    ],
    correctAnswer: 1,
    explanation: "Routing limits system noise and token usage. It avoids flooding a specialist agent with unrelated context, boosting both reasoning performance and speed."
  },
  {
    id: 4,
    question: "What defines Peer-to-Peer (Collaborative Team) orchestration?",
    options: [
      "Agents operate independently on separate local files without sharing message history.",
      "A linear, non-looping pipeline that terminates instantly on the first error.",
      "An interactive loop where agents (e.g., Engineer & QA, or Writer & Advisor) exchange messages back and forth to refine, critique, test, and self-correct outputs until custom criteria are met.",
      "Deploying local torrent nodes directly inside web browsers."
    ],
    correctAnswer: 2,
    explanation: "P2P collaborative teams utilize conversational critique loops. One agent drafts code or creative content, and a peer tests, audits, or critiques it, driving self-correction iteratively before completion."
  }
];
