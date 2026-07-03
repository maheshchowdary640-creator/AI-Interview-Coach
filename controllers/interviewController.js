const pdfParse = require('pdf-parse');
const PDFDocument = require('pdfkit');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Interview = require('../models/Interview');
const User = require('../models/User');

// Initialize Gemini API (safely checked at execution time)
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('your_gemini_api_key_here')) {
    return null;
  }
  return new GoogleGenerativeAI(apiKey);
};

// ----------------------------------------------------
// Fallback Mock Data for Offline/Key-free mode
// ----------------------------------------------------
const MOCK_QUESTIONS = {
  'HR Interview': {
    Easy: [
      "Tell me about yourself and your background.",
      "Why are you interested in this position and our company?",
      "What are your greatest professional strengths?",
      "Can you describe your ideal work environment?",
      "How do you handle stress or tight deadlines?",
      "What do you know about our target audience and industry?",
      "Tell me about a time you worked on a team project.",
      "Where do you see yourself in five years?",
      "What motivates you to perform well in your role?",
      "How do you prioritize multiple tasks on a busy day?"
    ],
    Medium: [
      "Tell me about a time you had a conflict with a coworker. How did you resolve it?",
      "Describe a situation where you had to quickly adapt to a major change at work.",
      "Tell me about a time you failed or made a mistake. What did you learn?",
      "Why should we hire you over other candidates with similar qualifications?",
      "How do you deal with constructive criticism from a manager?",
      "Describe a time you went above and beyond for a project or customer.",
      "How do you resolve disagreements in team settings about project directions?",
      "Tell me about a time you had to make a decision without all the information you needed.",
      "What is the most challenging feedback you have ever received, and how did you act on it?",
      "How do you align your personal career goals with the company's objectives?"
    ],
    Hard: [
      "Describe a time you led a failing team project and turned it around. What was your strategy?",
      "How would you handle a situation where your direct supervisor asks you to do something unethical?",
      "Give an example of a strategic decision you made that had a negative outcome. What went wrong?",
      "How do you foster diversity and inclusion in your team, and how do you handle cultural barriers?",
      "Explain a time when you had to manage stakeholders with conflicting expectations. How did you negotiate?",
      "How do you maintain team morale and engagement during periods of layoffs or corporate restructuring?",
      "Describe your leadership style when managing remote, cross-functional engineering teams.",
      "How do you handle a direct report who is consistently underperforming, despite coaching?",
      "What is your approach to managing risk when introducing a new technology stack to a legacy system?",
      "Tell me about a time you had to pitch a risky idea to executive leadership. How did you secure buy-in?"
    ]
  },
  'Technical Interview': {
    Easy: [
      "What is the difference between let, const, and var in JavaScript?",
      "Explain the concept of responsive web design.",
      "What are the main HTTP methods and when do you use them?",
      "What is the purpose of a database primary key?",
      "Explain what React state is and how it differs from props.",
      "What is version control, and why is Git important?",
      "How do you handle errors in asynchronous JavaScript code?",
      "What are CSS flexbox and grid, and how do they differ?",
      "What is the difference between SQL and NoSQL databases?",
      "Explain the purpose of API documentation like Swagger or Postman."
    ],
    Medium: [
      "Explain the event loop and asynchronous execution model in JavaScript/Node.js.",
      "What is database indexing? How does it improve query performance, and what are the trade-offs?",
      "Describe the virtual DOM in React and explain how the reconciliation process works.",
      "How do you optimize a slow-loading web application? Mention front-end and back-end strategies.",
      "What is RESTful API design? What are the key principles of designing scalable REST APIs?",
      "Explain JavaScript closures and provide a practical use-case.",
      "How does MongoDB structure document-based data compared to relational tables?",
      "What are WebSockets, and when would you use them over standard HTTP polling?",
      "Explain the difference between authentication and authorization. How do you implement JWT?",
      "Describe a scenario where you had to refactor a complex piece of code. What was your approach?"
    ],
    Hard: [
      "Design a highly scalable, real-time chat application. What databases, protocols, and servers would you choose?",
      "Explain microservices architecture. How do services communicate, and how do you handle distributed transactions?",
      "How do you secure a web application against OWASP Top 10 vulnerabilities (SQLi, XSS, CSRF)? Details please.",
      "Explain React's concurrent rendering features and how Server Components (RSC) work under the hood.",
      "How do you design a database schema to support millions of concurrent read/write operations for an e-commerce site?",
      "Explain garbage collection in Node.js and how you would diagnose a memory leak in a production server.",
      "Describe how you would implement a custom rate-limiting middleware from scratch using Redis.",
      "What is CORS? Detail the preflight request mechanism and how to securely configure CORS headers.",
      "Explain the differences between Monolithic, Microservices, and Serverless architectures including deployment implications.",
      "How do you design an audit log system that is tamper-proof and highly performant?"
    ]
  },
  'Project-Based Interview': {
    Easy: [
      "Select one project from your resume and explain what it does in simple terms.",
      "What was your role in the last project you completed?",
      "What technologies did you choose for your projects, and why?",
      "How did you test your projects to ensure they worked correctly?",
      "What was the most interesting feature you built in your projects?",
      "How did you track your project progress and manage code changes?",
      "Did you work with others on your projects? If so, how did you divide the tasks?",
      "What was the main challenge you faced when building your project?",
      "How did you deploy your project so others could access it?",
      "If you had more time, what is one feature you would add to your project?"
    ],
    Medium: [
      "Walk me through the architecture of a major project listed on your resume.",
      "Why did you choose your specific database (e.g., MongoDB, SQL) for your latest project?",
      "Describe a technical challenge you faced during a project and how you solved it.",
      "How did you handle state management in your front-end application projects?",
      "Describe how you secured user data in your project (e.g., passwords, API keys).",
      "What trade-offs did you make when deciding between performance and development speed in your project?",
      "How did you handle API error states and loading animations in your user interfaces?",
      "How did you structure your components or backend files to ensure code maintainability?",
      "Explain how you integrated third-party APIs (e.g., Stripe, Gemini, Firebase) into your project.",
      "What did you learn from the deployment phase of your project? Were there environment configuration issues?"
    ],
    Hard: [
      "In your main project, how did you optimize database queries or API response times? Give exact metrics if possible.",
      "If your project's traffic scaled 100x overnight, where would the bottlenecks occur and how would you resolve them?",
      "Explain the authentication flow in your project. How do you handle token refresh, storage, and session expiration?",
      "Describe how you structured your automated testing pipeline (Unit, Integration, E2E) for your project.",
      "What was the most complex system integration in your projects, and how did you resolve data synchronization issues?",
      "Why did you choose your rendering method (Client-Side, Server-Side, Static) for your project, and what were the SEO/performance trade-offs?",
      "Describe how you handled database migrations or schema updates without disrupting application availability.",
      "How did you design error boundary strategies to handle unexpected failures in production?",
      "Analyze a design pattern (e.g. MVC, Singleton, Pub/Sub) you utilized in your project and explain its benefits.",
      "If you were to rewrite your entire project today from scratch, what architectural choices would you change and why?"
    ]
  },
  'Internship Interview': {
    Easy: [
      "What programming languages are you most comfortable with, and why?",
      "Tell me about an academic project or assignment you are proud of.",
      "What made you choose your field of study (Computer Science, Business, etc.)?",
      "How do you learn a new technology or tool when you have no prior experience?",
      "What do you hope to gain from this internship?",
      "How do you manage your schoolwork alongside extracurricular activities?",
      "Tell me about a time you had to learn something quickly.",
      "What is your understanding of Git and GitHub?",
      "What is your favorite coding topic or course, and why?",
      "How do you approach debugging a program that isn't working?"
    ],
    Medium: [
      "Explain a object-oriented programming concept or data structure you learned recently.",
      "Describe a team project you did at school. What went well and what challenges did you face?",
      "How do you handle a situation where you don't know the answer to a technical question?",
      "What is the difference between a stack and a queue? When would you use each?",
      "Describe a personal coding project you built. What inspired you and what did you learn?",
      "How do you ensure your code is readable and clean?",
      "Explain the concept of API endpoints to someone who is non-technical.",
      "What is your approach to searching for help online (e.g., StackOverflow, Docs) when stuck?",
      "Tell me about a time you took the initiative to learn something outside your syllabus.",
      "How do you handle criticism or code reviews from senior peers or instructors?"
    ],
    Hard: [
      "Explain the differences between various sorting algorithms (QuickSort, MergeSort) and their time/space complexities.",
      "How would you optimize a recursive function that is causing a stack overflow?",
      "Describe how you would design an algorithm to find the shortest path in a network grid.",
      "Explain memory allocation (stack vs heap) and pointers/references in systems languages.",
      "How would you approach designing a simple URL shortener service?",
      "Explain what dynamic programming is and give an example of a problem it solves.",
      "Describe the difference between process and thread. How do they share memory?",
      "Explain how a hash map handles collisions internally.",
      "How would you structure a test suite for a university grading portal?",
      "If you found a bug in a production system during your internship, what steps would you take to address it?"
    ]
  }
};

// ----------------------------------------------------
// PDF TEXT EXTRACTION
// ----------------------------------------------------
exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a PDF resume.' });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Invalid file type. Only PDF files are supported.' });
    }

    const data = await pdfParse(req.file.buffer);
    const resumeText = data.text;

    // Check if the extracted text is empty or too short (e.g., scanned PDF)
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        error: 'Could not extract sufficient text from the PDF. Please make sure the PDF is not a scanned image and contains searchable text.'
      });
    }

    res.status(200).json({
      message: 'Resume parsed successfully',
      text: resumeText.trim().substring(0, 15000) // limit length slightly
    });
  } catch (error) {
    console.error('Error parsing PDF:', error);
    res.status(500).json({ error: 'Error parsing PDF resume: ' + error.message });
  }
};

// ----------------------------------------------------
// GENERATE INTERVIEW QUESTIONS
// ----------------------------------------------------
exports.generateQuestions = async (req, res) => {
  try {
    const { userId, resumeText, jobDescription, interviewType, difficulty } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const types = ['HR Interview', 'Technical Interview', 'Project-Based Interview', 'Internship Interview'];
    const diffs = ['Easy', 'Medium', 'Hard'];

    const finalType = types.includes(interviewType) ? interviewType : 'HR Interview';
    const finalDiff = diffs.includes(difficulty) ? difficulty : 'Medium';

    const gemini = getGeminiClient();
    let questions = [];

    if (gemini) {
      try {
        console.log('Generating questions using Gemini...');
        const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });
        
        const prompt = `
          You are an expert AI Interview Coach. Your task is to analyze the candidate's resume and the job description, and generate exactly 10 personalized, relevant interview questions.
          
          Resume Text:
          ${resumeText || 'No resume uploaded.'}
          
          Job Description:
          ${jobDescription || 'No job description provided.'}
          
          Interview Type: ${finalType}
          Difficulty Level: ${finalDiff}
          
          Rules for question generation:
          1. Generate EXACTLY 10 questions.
          2. Tailor them specifically to the skills, projects, and work history in the Resume, aligned with the requirements of the Job Description.
          3. Focus on the selected Interview Type (${finalType}):
             - HR Interview: Focus on behavioral, situational, culture-fit, strengths, weaknesses, and teamwork.
             - Technical Interview: Focus on technical concepts, coding, engineering design, specific tools, database queries, and debugging related to the resume and JD.
             - Project-Based Interview: Focus heavily on projects mentioned in the resume, design choices, challenges, solutions, and technologies used.
             - Internship Interview: Focus on foundational concepts, academic projects, quick learning abilities, adaptability, and enthusiasm.
          4. Align with the difficulty level (${finalDiff}):
             - Easy: Foundational, direct, conversational questions.
             - Medium: Professional, situational, analyzing choices, mild technical depth.
             - Hard: Deep architectural questions, edge cases, complex scenarios, high behavioral scrutiny.
          5. Return the output in a strict JSON format matching the schema below:
          {
            "questions": [
              { "id": 1, "question": "Question text here..." },
              ...
            ]
          }
          Do not include any explanation, markdown formatting outside of the valid JSON structure.
        `;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        const jsonText = result.response.text();
        const parsed = JSON.parse(jsonText);
        
        if (parsed.questions && Array.isArray(parsed.questions)) {
          questions = parsed.questions.slice(0, 10).map((q, index) => ({
            id: index + 1,
            question: q.question
          }));
        }
      } catch (geminiError) {
        console.error('Gemini question generation error, falling back to mock:', geminiError);
      }
    }

    // Fallback if Gemini is unavailable, disabled, or failed
    if (questions.length === 0) {
      console.log('Using local mock questions fallback');
      const list = MOCK_QUESTIONS[finalType]?.[finalDiff] || MOCK_QUESTIONS['HR Interview']['Medium'];
      questions = list.map((q, index) => ({
        id: index + 1,
        question: q
      }));
    }

    // Save Interview session to MongoDB
    const interview = new Interview({
      userId,
      resumeText,
      jobDescription,
      interviewType: finalType,
      difficulty: finalDiff,
      questions,
      answers: [],
      feedback: [],
      scores: { overall: 0, communication: 0, technical: 0, confidence: 0 }
    });

    await interview.save();
    res.status(200).json(interview);
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Error generating questions: ' + error.message });
  }
};

// ----------------------------------------------------
// EVALUATE ANSWERS
// ----------------------------------------------------
exports.evaluateAnswers = async (req, res) => {
  try {
    const { interviewId, answers } = req.body;

    if (!interviewId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: 'Interview ID and answers array are required' });
    }

    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const gemini = getGeminiClient();
    let evaluationResult = null;

    if (gemini) {
      try {
        console.log('Evaluating answers using Gemini...');
        const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const prompt = `
          You are an expert AI Interview Coach. Your task is to evaluate the candidate's answers to the 10 interview questions they received.
          
          Resume Text:
          ${interview.resumeText || 'No resume uploaded.'}
          
          Job Description:
          ${interview.jobDescription || 'No job description provided.'}
          
          Interview Type: ${interview.interviewType}
          Difficulty Level: ${interview.difficulty}
          
          Here are the questions and the candidate's answers:
          ${interview.questions.map((q) => {
            const ansObj = answers.find(a => Number(a.questionId) === Number(q.id));
            const ansText = ansObj ? ansObj.answer : '[Candidate did not answer this question]';
            return `\nQuestion ${q.id}: ${q.question}\nCandidate Answer: ${ansText}\n`;
          }).join('\n')}
          
          Evaluate each answer individually and compute the scorecard.
          - For each question's feedback, provide:
            - questionId: The question ID (number from 1 to 10).
            - score: A score from 1 to 10.
            - strengths: A concise explanation of what the candidate did well.
            - mistakes: Gaps, omissions, incorrect facts, or aspects of improvement.
            - improvedAnswer: A detailed, professionally polished sample answer incorporating candidate skills or industry standards.
            - prepTip: An actionable study tip or method.
          - Compute overall scorecard metrics:
            - overall: Overall score from 1 to 100.
            - communication: Score from 1 to 10 (structure, vocabulary, clarity).
            - technical: Score from 1 to 10 (technical correctness, frameworks, depth).
            - confidence: Score from 1 to 10 (tone, clarity, professionalism).
          - Summarize:
            - weakAreas: Array of 2 to 4 major areas needing immediate study.
            - strongAreas: Array of 2 to 4 major areas of strength.
            - improvementRoadmap: Array of 3 to 5 roadmap milestone actions.
            
          Return the output in a strict JSON format matching the schema below:
          {
            "scores": {
              "overall": 80,
              "communication": 8,
              "technical": 7,
              "confidence": 8
            },
            "feedback": [
              {
                "questionId": 1,
                "score": 8,
                "strengths": "...",
                "mistakes": "...",
                "improvedAnswer": "...",
                "prepTip": "..."
              }
            ],
            "weakAreas": ["...", "..."],
            "strongAreas": ["...", "..."],
            "improvementRoadmap": ["...", "..."]
          }
          Do not include any explanation or markdown formatting outside of the valid JSON structure.
        `;

        const result = await model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json",
          }
        });

        const jsonText = result.response.text();
        evaluationResult = JSON.parse(jsonText);
      } catch (geminiError) {
        console.error('Gemini answer evaluation error, falling back to mock:', geminiError);
      }
    }

    // Fallback if Gemini is offline, disabled, or errored
    if (!evaluationResult) {
      console.log('Using local evaluation mockup fallback');
      
      const feedback = interview.questions.map((q) => {
        const userAns = answers.find(a => Number(a.questionId) === Number(q.id))?.answer || '';
        const len = userAns.trim().length;
        
        let score = 4;
        let strengths = "Gave a responsive answer to the prompt.";
        let mistakes = "The answer is very short and lacks detail or specific project examples from the resume.";
        let improvedAnswer = `For '${q.question}', a strong answer should structure the response using the STAR method (Situation, Task, Action, Result). For example: 'In my previous project, we faced a similar situation where... I took the action to... resulting in a 20% efficiency increase.'`;
        let prepTip = "Practice the STAR technique and use numbers to quantify your achievements.";

        if (len > 150) {
          score = 8;
          strengths = "Solid explanation, demonstrating clear practical experience and good command of concepts.";
          mistakes = "Could expand more on concrete results and numbers achieved in your projects.";
          improvedAnswer = `Excellent base! To make it stand out: '${userAns.trim()} Furthermore, this helped reduce system latency by 15% and improved overall team delivery speed.'`;
          prepTip = "Quantify achievements whenever possible to back up technical details.";
        } else if (len > 60) {
          score = 6;
          strengths = "Directly addresses the question, introducing the main points.";
          mistakes = "Lacks detailed examples or context on the architectural trade-offs made.";
          prepTip = "Read up on technical case studies and standard developer guides for this topic.";
        } else if (len === 0) {
          score = 1;
          strengths = "None. Question was skipped.";
          mistakes = "No response was recorded for this question.";
          improvedAnswer = "An ideal response would introduce a relevant experience from your resume showing your skills in action.";
          prepTip = "Prepare bullet points for major projects so you never leave questions completely blank.";
        }

        return {
          questionId: q.id,
          score,
          strengths,
          mistakes,
          improvedAnswer,
          prepTip
        };
      });

      const avgScore = Math.round(feedback.reduce((sum, item) => sum + item.score, 0) / feedback.length);
      const overall = avgScore * 10;
      
      evaluationResult = {
        scores: {
          overall,
          communication: Math.min(10, Math.max(3, Math.round(avgScore))),
          technical: Math.min(10, Math.max(3, Math.round(avgScore - 1))),
          confidence: Math.min(10, Math.max(4, Math.round(avgScore + 1)))
        },
        feedback,
        weakAreas: [
          "Elaborating with specific project details (STAR method)",
          "Articulating complex system architecture decisions",
          "Quantifying project metrics and impact metrics"
        ],
        strongAreas: [
          "Understanding core role expectations",
          "Demonstrating relevant core technologies from resume",
          "Direct conversational communication tone"
        ],
        improvementRoadmap: [
          "Week 1: Refactor project descriptions on your resume using the X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]).",
          "Week 2: Solve 10 mock behavioral questions focusing exclusively on conflict resolution and adapting to change.",
          "Week 3: Deep dive into the core technical stack requested in the job description to explain trade-offs clearly."
        ]
      };
    }

    // Save feedback and scores to database
    interview.answers = answers;
    interview.feedback = evaluationResult.feedback;
    interview.scores = evaluationResult.scores;
    interview.weakAreas = evaluationResult.weakAreas;
    interview.strongAreas = evaluationResult.strongAreas;
    interview.improvementRoadmap = evaluationResult.improvementRoadmap;

    await interview.save();
    res.status(200).json(interview);
  } catch (error) {
    console.error('Error evaluating answers:', error);
    res.status(500).json({ error: 'Error evaluating answers: ' + error.message });
  }
};

// ----------------------------------------------------
// DOWNLOAD PDF REPORT
// ----------------------------------------------------
exports.generateReport = async (req, res) => {
  try {
    const { interviewId } = req.body;

    if (!interviewId) {
      return res.status(400).json({ error: 'Interview ID is required' });
    }

    const interview = await Interview.findById(interviewId).populate('userId');
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    const candidateName = interview.userId?.name || 'Candidate';
    const candidateEmail = interview.userId?.email || 'N/A';

    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Set response headers to prompt download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Interview_Report_${interviewId}.pdf`);

    // Pipe PDF directly to response
    doc.pipe(res);

    // Color Palette
    const primaryColor = '#4f46e5'; // Indigo
    const darkColor = '#1f2937';    // Slate Gray
    const lightGray = '#f3f4f6';   // Background tint
    const accentGreen = '#10b981'; // Green
    const accentRed = '#ef4444';   // Red

    // ---------------- Header ----------------
    doc.rect(0, 0, 612, 12).fill(primaryColor); // Top bar

    doc.fillColor(primaryColor).fontSize(26).font('Helvetica-Bold').text('AI INTERVIEW COACH', 50, 45);
    doc.fillColor(darkColor).fontSize(14).font('Helvetica').text('Session Evaluation & Feedback Report', 50, 75);
    
    // Horizontal rule
    doc.moveTo(50, 95).lineTo(545, 95).strokeColor('#e5e7eb').lineWidth(1).stroke();

    // ---------------- Candidate & Interview Info ----------------
    doc.fontSize(10).fillColor('#4b5563');
    doc.font('Helvetica-Bold').text('Candidate Name:', 50, 110).font('Helvetica').text(candidateName, 150, 110);
    doc.font('Helvetica-Bold').text('Candidate Email:', 50, 125).font('Helvetica').text(candidateEmail, 150, 125);
    doc.font('Helvetica-Bold').text('Date Evaluated:', 50, 140).font('Helvetica').text(new Date(interview.createdAt).toLocaleString(), 150, 140);

    doc.font('Helvetica-Bold').text('Interview Type:', 320, 110).font('Helvetica').text(interview.interviewType, 420, 110);
    doc.font('Helvetica-Bold').text('Difficulty:', 320, 125).font('Helvetica').text(interview.difficulty, 420, 125);
    doc.font('Helvetica-Bold').text('Session Status:', 320, 140).font('Helvetica').text('Completed', 420, 140);

    // Horizontal rule
    doc.moveTo(50, 160).lineTo(545, 160).strokeColor('#e5e7eb').lineWidth(1).stroke();

    // ---------------- Scores Grid ----------------
    doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text('Performance Scores', 50, 175);
    
    // Draw background block for score
    doc.rect(50, 195, 110, 80).fill(lightGray);
    doc.rect(173, 195, 110, 80).fill(lightGray);
    doc.rect(296, 195, 110, 80).fill(lightGray);
    doc.rect(419, 195, 110, 80).fill(lightGray);

    // Text for scores
    doc.fillColor(primaryColor).fontSize(24).font('Helvetica-Bold');
    doc.text(`${interview.scores.overall}%`, 50, 210, { width: 110, align: 'center' });
    doc.fontSize(18).fillColor(darkColor);
    doc.text(`${interview.scores.communication}/10`, 173, 214, { width: 110, align: 'center' });
    doc.text(`${interview.scores.technical}/10`, 296, 214, { width: 110, align: 'center' });
    doc.text(`${interview.scores.confidence}/10`, 419, 214, { width: 110, align: 'center' });

    // Labels
    doc.fontSize(9).fillColor('#6b7280').font('Helvetica-Bold');
    doc.text('OVERALL SCORE', 50, 245, { width: 110, align: 'center' });
    doc.text('COMMUNICATION', 173, 245, { width: 110, align: 'center' });
    doc.text('TECHNICAL DEPTH', 296, 245, { width: 110, align: 'center' });
    doc.text('CONFIDENCE', 419, 245, { width: 110, align: 'center' });

    // ---------------- Key Strengths & Weaknesses ----------------
    doc.moveTo(50, 290).lineTo(545, 290).strokeColor('#e5e7eb').lineWidth(1).stroke();

    doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('Strengths & Weak Areas', 50, 305);
    
    // Strengths
    doc.fillColor(accentGreen).fontSize(11).font('Helvetica-Bold').text('Key Strengths:', 50, 325);
    doc.fillColor(darkColor).font('Helvetica').fontSize(10);
    let sy = 340;
    if (interview.strongAreas && interview.strongAreas.length > 0) {
      interview.strongAreas.forEach((area) => {
        doc.text(`• ${area}`, 60, sy, { width: 220 });
        sy += 25;
      });
    } else {
      doc.text('• Demonstrated understanding of core requirements.', 60, sy);
    }

    // Weaknesses
    doc.fillColor(accentRed).fontSize(11).font('Helvetica-Bold').text('Weak Areas:', 310, 325);
    doc.fillColor(darkColor).font('Helvetica').fontSize(10);
    let wy = 340;
    if (interview.weakAreas && interview.weakAreas.length > 0) {
      interview.weakAreas.forEach((area) => {
        doc.text(`• ${area}`, 320, wy, { width: 220 });
        wy += 25;
      });
    } else {
      doc.text('• Missing concrete examples or metrics in some answers.', 320, wy);
    }

    // ---------------- Roadmap ----------------
    const roadmapY = Math.max(sy, wy) + 15;
    doc.moveTo(50, roadmapY).lineTo(545, roadmapY).strokeColor('#e5e7eb').lineWidth(1).stroke();

    doc.fillColor(primaryColor).fontSize(14).font('Helvetica-Bold').text('Personalized Improvement Roadmap', 50, roadmapY + 15);
    doc.fillColor(darkColor).font('Helvetica').fontSize(10);
    let ry = roadmapY + 35;
    if (interview.improvementRoadmap && interview.improvementRoadmap.length > 0) {
      interview.improvementRoadmap.forEach((step, idx) => {
        doc.font('Helvetica-Bold').text(`Phase ${idx + 1}: `, 50, ry).font('Helvetica').text(step, 100, ry, { width: 445 });
        ry += 30;
      });
    } else {
      doc.text('1. Practice structured STAR formatting for answers.', 50, ry);
    }

    // ---------------- Page 2: Detailed QA Feedback ----------------
    doc.addPage();
    doc.rect(0, 0, 612, 12).fill(primaryColor);

    doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text('Detailed Question-by-Question Feedback', 50, 45);
    doc.moveTo(50, 65).lineTo(545, 65).strokeColor('#e5e7eb').lineWidth(1).stroke();

    let curY = 80;

    interview.questions.forEach((q, idx) => {
      // Check if we need a new page
      if (curY > 680) {
        doc.addPage();
        doc.rect(0, 0, 612, 12).fill(primaryColor);
        curY = 45;
        doc.fillColor(primaryColor).fontSize(16).font('Helvetica-Bold').text('Detailed Feedback (Continued)', 50, curY);
        doc.moveTo(50, curY + 20).lineTo(545, curY + 20).strokeColor('#e5e7eb').lineWidth(1).stroke();
        curY += 35;
      }

      const ansObj = interview.answers.find(a => Number(a.questionId) === Number(q.id));
      const ansText = ansObj?.answer || '[Not Answered]';
      const feedObj = interview.feedback.find(f => Number(f.questionId) === Number(q.id));
      
      const qScore = feedObj?.score || 0;
      const qStrengths = feedObj?.strengths || 'N/A';
      const qMistakes = feedObj?.mistakes || 'N/A';
      const qImproved = feedObj?.improvedAnswer || 'N/A';
      const qTip = feedObj?.prepTip || 'N/A';

      // Q Number and Question Text
      doc.fillColor(primaryColor).fontSize(10).font('Helvetica-Bold').text(`Q${q.id}. ${q.question}`, 50, curY, { width: 420 });
      doc.fillColor(darkColor).text(`Score: ${qScore}/10`, 480, curY, { width: 65, align: 'right' });
      curY += 20;

      // Candidate's Answer
      doc.fillColor('#4b5563').font('Helvetica-Oblique').text(`Your Answer: "${ansText}"`, 60, curY, { width: 480 });
      // Estimate lines to shift curY
      const textLen = ansText.length;
      curY += Math.max(15, Math.ceil(textLen / 90) * 12) + 5;

      // Feedback Details
      doc.font('Helvetica-Bold').fillColor(accentGreen).text('Strengths: ', 60, curY, { continued: true }).font('Helvetica').fillColor(darkColor).text(qStrengths);
      curY += Math.max(15, Math.ceil(qStrengths.length / 85) * 12) + 2;

      doc.font('Helvetica-Bold').fillColor(accentRed).text('Gaps/Mistakes: ', 60, curY, { continued: true }).font('Helvetica').fillColor(darkColor).text(qMistakes);
      curY += Math.max(15, Math.ceil(qMistakes.length / 85) * 12) + 2;

      doc.font('Helvetica-Bold').fillColor(primaryColor).text('Recommended Answer: ', 60, curY, { continued: true }).font('Helvetica').fillColor(darkColor).text(qImproved);
      curY += Math.max(15, Math.ceil(qImproved.length / 85) * 12) + 2;

      doc.font('Helvetica-Bold').fillColor('#f59e0b').text('Prep Tip: ', 60, curY, { continued: true }).font('Helvetica').fillColor(darkColor).text(qTip);
      curY += Math.max(15, Math.ceil(qTip.length / 85) * 12) + 15;

      // Divider between questions
      doc.moveTo(50, curY - 5).lineTo(545, curY - 5).strokeColor('#f3f4f6').lineWidth(1).stroke();
    });

    // End and send the document
    doc.end();
  } catch (error) {
    console.error('Error generating PDF report:', error);
    res.status(500).json({ error: 'Error generating PDF report: ' + error.message });
  }
};

// ----------------------------------------------------
// FETCH PREVIOUS INTERVIEWS FOR A USER
// ----------------------------------------------------
exports.getUserInterviews = async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const interviews = await Interview.find({ userId })
      .select('interviewType difficulty scores createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json(interviews);
  } catch (error) {
    console.error('Error fetching user interviews:', error);
    res.status(500).json({ error: 'Error fetching interviews: ' + error.message });
  }
};

// ----------------------------------------------------
// FETCH SINGLE INTERVIEW SESSION
// ----------------------------------------------------
exports.getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    const interview = await Interview.findById(id).populate('userId');
    if (!interview) {
      return res.status(404).json({ error: 'Interview session not found' });
    }

    res.status(200).json(interview);
  } catch (error) {
    console.error('Error fetching interview by ID:', error);
    res.status(500).json({ error: 'Error fetching interview session: ' + error.message });
  }
};

// ----------------------------------------------------
// USER REGISTRATION / ONBOARDING
// ----------------------------------------------------
exports.getOrCreateUser = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }
    let user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      user = new User({ name, email: email.toLowerCase().trim() });
      await user.save();
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    res.status(500).json({ error: 'Error creating or retrieving user: ' + error.message });
  }
};

