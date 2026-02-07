# KruuGRASP 2026 - Disease Diagnosis & XAI System

A modern disease diagnosis system with explainable AI (XAI) that provides patients with accurate diagnoses, differential alternatives, and clarifying questions for better health assessment.

## Features

### 🏥 Core Diagnosis
- **Intelligent Disease Recognition**: TF-IDF + symptom overlap analysis (60%/40% weighted)
- **16 Diseases**: Comprehensive medical knowledge base covering common and complex conditions
- **Confidence-Based Assessment**: Triggers clarifying questions when diagnosis confidence is below 50%

### 🤔 Explainable AI (XAI)
- **Differential Diagnosis**: Shows similar diseases with score comparisons and distinguishing symptoms
- **Symptom Breakdown**: Plain-language explanation of which symptoms matched
- **Clinical Guidance**: Expert recommendations for each diagnosis
- **Confidence Scores**: Clear visibility into diagnosis reliability

### 🎯 User Experience
- **Clarifying Questions**: (4 types) Symptom confirmation, severity assessment, timeline, differential guidance
- **Patient Assessment History**: Track previous assessments per patient
- **PDF Reports**: Generate and download diagnosis reports
- **Specialist Recommendations**: Suggested medical specialists based on diagnosis

## Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Styling
- **Vite v6.2.0** - Build tool & dev server
- **html2pdf.js** - PDF generation

### Backend
- **Python 3.8+** - Core language
- **Flask 2.3.2** - REST API server
- **Scikit-learn 1.3.0** - TF-IDF vectorization
- **Transformers 4.33.0** - ML models
- **PyTorch 2.0+** - Deep learning

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.8+
- pip (Python package manager)

### Installation

#### Backend Setup
```bash
cd Medical-XAI/backend
pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000`

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:3001`

## Project Structure

```
KruuGRASP2026/
├── README.md                          # This file
├── Medical-XAI/
│   ├── backend/
│   │   ├── app.py                     # Flask REST API server
│   │   ├── model.py                   # Disease diagnosis model
│   │   ├── xai_formatter.py           # Explainability functions
│   │   └── requirements.txt           # Python dependencies
│   └── data/
│       └── medical_knowledge_base.json # Disease & symptom data
├── frontend/
│   ├── src/
│   │   ├── App.tsx                    # Root React component
│   │   ├── types.ts                   # TypeScript types
│   │   ├── components/
│   │   │   ├── AssessmentForm.tsx     # Patient symptom input
│   │   │   ├── AssessmentHistory.tsx  # Past assessments
│   │   │   ├── ResultsWithSpecialists.tsx  # Diagnosis results
│   │   │   ├── DifferentialDiagnosisSection.tsx  # Alternative diseases
│   │   │   ├── ClarifyingQuestionsSection.tsx    # Follow-up questions
│   │   │   ├── PatientRegistration.tsx # Patient signup
│   │   │   ├── PatientSelection.tsx   # Select existing patient
│   │   │   ├── SymptomSelector.tsx    # Symptom picker
│   │   │   ├── Header.tsx             # Navigation header
│   │   │   ├── SuccessView.tsx        # Success screen
│   │   │   └── XAIExplanation.tsx     # AI explanation modal
│   │   ├── services/
│   │   │   ├── gemini.ts              # Gemini AI integration
│   │   │   └── prediction.ts          # API service & types
│   │   ├── index.tsx                  # React entry point
│   │   └── metadata.json              # Disease definitions
│   ├── index.html                     # HTML template
│   ├── package.json                   # Node dependencies
│   ├── tsconfig.json                  # TypeScript config
│   ├── vite.config.ts                 # Vite build config
│   └── README.md                      # Frontend-specific docs
```

## How It Works

### Diagnosis Flow
1. **Patient Registration** → Creates/selects patient profile
2. **Symptom Input** → Patient selects symptoms from curated list
3. **Disease Matching** → Backend analyzes symptoms using TF-IDF + overlap algorithm
4. **Confidence Check** → If score < 50%, triggers clarifying questions
5. **Results Display** → Shows diagnosis with confidence, differential options, and specialists
6. **PDF Export** → User can download diagnosis report

### XAI Explanation Components

**1. Differential Diagnosis**
- Shows top 2-3 alternative diseases within 5% of primary diagnosis
- Lists distinguishing symptoms to help rule out alternatives
- Includes clinical guidance for each option

**2. Clarifying Questions** (4 Types)
- **Symptom Confirmation**: "Do you definitely have X symptom?"
- **Severity Scale**: "On a scale of 1-10, how severe is X?"
- **Timeline**: "When did symptoms start?"
- **Differential Questions**: "Do you have symptoms specific to disease Y?"

**3. Confidence Metrics**
- TF-IDF Similarity Score (60% weight)
- Symptom Overlap Percentage (40% weight)
- Combined Confidence Score (0-100%)

## API Endpoints

### POST `/diagnose`
Analyzes symptoms and returns diagnosis with XAI features.

**Request:**
```json
{
  "symptoms": ["fever", "cough", "headache"],
  "patient_id": "pat_123"
}
```

**Response:**
```json
{
  "primary_disease": "Common Cold",
  "confidence_score": 87.5,
  "matching_symptoms": ["fever", "cough"],
  "explanation": "TF-IDF score: 75%, Symptom overlap: 100%",
  "differential_diagnosis": [
    {
      "disease": "Flu",
      "score": 82.1,
      "distinguishing_symptoms": ["body aches", "fatigue"],
      "guidance": "Flu symptoms typically include..."
    }
  ],
  "confidence_check": {
    "meets_threshold": true,
    "clarifying_questions": [ /* ... */ ]
  },
  "specialists": ["General Practitioner", "Internal Medicine"]
}
```

### GET `/health`
Health check endpoint.

## Configuration

### Scoring Weights
- TF-IDF Component: **60%**
- Symptom Overlap: **40%**
- Confidence Threshold: **50%** (below this triggers clarifying questions)
- Differential Range: **5%** (shows alternatives within 5% of primary score)

### Knowledge Base
Disease definitions are in [Medical-XAI/data/medical_knowledge_base.json](Medical-XAI/data/medical_knowledge_base.json). Each entry includes:
- Symptom profiles
- ICD-10 codes
- Recommended specialists
- Clinical descriptions

## Development

### Frontend Development
```bash
cd frontend
npm run dev           # Start dev server with HMR
npm run build         # Production build
npm run preview       # Preview production build
```

### Backend Development
```bash
cd Medical-XAI/backend
python app.py         # Development server (debug mode)
```

## Troubleshooting

**White Screen Error on Re-analyze**
- Check backend is running on port 5000
- Verify API endpoint: `http://localhost:5000/diagnose`
- Check browser console for error messages

**TypeScript Errors**
- Run `npm run build` to verify compilation
- Check all imports in `services/prediction.ts`

**Disease Not Found**
- Verify symptoms in knowledge base
- Check `medical_knowledge_base.json` is loaded
- Ensure symptom names match database exactly

## Performance Optimizations

- **Frontend**: Vite minification + tree-shaking for production builds
- **Backend**: TF-IDF vectorizer caching for faster inference
- **Database**: JSON-based knowledge base for instant access (no I/O delays)

## License

This project is part of KruuGRASP 2026 initiative.

## Support

For issues or questions, check the Medical-XAI backend logs or browser console for detailed error messages.

---

**Last Updated**: 2026  
**Status**: Production-Ready
