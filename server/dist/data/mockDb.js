"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.votingSteps = exports.mockCandidates = exports.constituencies = void 0;
exports.constituencies = [
    "New Delhi",
    "Mumbai South",
    "Bangalore Central",
    "Chennai Central",
    "Hyderabad"
];
exports.mockCandidates = {
    "New Delhi": [
        { id: 101, name: "Arvind Gupta", party: "Independent", symbol: "🏢", edu: "IIT Graduate", assets: "₹2.5 Cr", criminal: "None" },
        { id: 102, name: "Meera Singh", party: "Independent", symbol: "🌾", edu: "LLM", assets: "₹1.2 Cr", criminal: "None" }
    ],
    "Mumbai South": [
        { id: 201, name: "Rahul Deshmukh", party: "Independent", symbol: "🛳️", edu: "MBA Finance", assets: "₹15 Cr", criminal: "None" },
        { id: 202, name: "Priya Patil", party: "Independent", symbol: "🚲", edu: "Social Worker", assets: "₹50 Lakh", criminal: "None" }
    ],
    "Bangalore Central": [
        { id: 301, name: "Srinivas Rao", party: "Independent", symbol: "💻", edu: "Software Architect", assets: "₹8 Cr", criminal: "None" },
        { id: 302, name: "Lakshmi Narayana", party: "Independent", symbol: "🌳", edu: "Environmentalist", assets: "₹3 Cr", criminal: "None" }
    ],
    "Chennai Central": [
        { id: 401, name: "Karthik Raja", party: "Independent", symbol: "🎬", edu: "MA Literature", assets: "₹5 Cr", criminal: "None" },
        { id: 402, name: "Selvi Mani", party: "Independent", symbol: "🪁", edu: "Advocate", assets: "₹2 Cr", criminal: "None" }
    ],
    "Hyderabad": [
        { id: 501, name: "Mohammed Ali", party: "Independent", symbol: "🕌", edu: "Doctor (MBBS)", assets: "₹12 Cr", criminal: "None" },
        { id: 502, name: "Suresh Goud", party: "Independent", symbol: "📱", edu: "Entrepreneur", assets: "₹10 Cr", criminal: "None" }
    ]
};
exports.votingSteps = {
    en: [
        { step: 1, title: "Identity Check", desc: "Show ID to 1st Officer" },
        { step: 2, title: "Inking", desc: "Marking by 2nd Officer" },
        { step: 3, title: "The Vote", desc: "Cast vote on EVM" },
        { step: 4, title: "VVPAT", desc: "Verify choices on slip" }
    ],
    hi: [
        { step: 1, title: "पहचान जांच", desc: "पहले अधिकारी को आईडी दिखाएं" },
        { step: 2, title: "स्याही लगाना", desc: "दूसरे अधिकारी द्वारा निशान लगाना" },
        { step: 3, title: "मतदान", desc: "ईवीएम पर वोट डालें" },
        { step: 4, title: "वीवीपैट", desc: "पर्ची पर अपनी पसंद की पुष्टि करें" }
    ]
};
