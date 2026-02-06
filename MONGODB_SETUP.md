# Healthcare Trial - Complete Setup Guide

## System Architecture

This healthcare assessment system consists of:
- **Frontend**: React 19 + TypeScript + Tailwind CSS (Vite)
- **Backend**: FastAPI (Python) with RandomForest ML model
- **Database**: MongoDB (for patient records)
- **Model**: Scikit-learn RandomForest trained on 96K disease-symptom records

---

## MongoDB Setup Instructions

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for a free account
   - Verify your email

2. **Create Cluster**
   - Click "Create" on the dashboard
   - Select the free tier (M0)
   - Choose your preferred region (closest to your location)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Add built-in role: "Atlas Admin"

4. **Get Connection String**
   - Go to "Database" in the left sidebar
   - Click "Connect" next to your cluster
   - Select "Drivers"
   - Copy the connection string
   - Replace `<username>`, `<password>` with your credentials

5. **Configure Environment**
   - Create `.env` file in `disease_chatbot/` folder:
     ```
     MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/healthcare?retryWrites=true&w=majority
     ```

### Option 2: Local MongoDB

1. **Install MongoDB Community Edition**
   - Windows: Download from https://www.mongodb.com/try/download/community
   - Mac: `brew install mongodb-community`
   - Linux: Follow official docs for your distribution

2. **Start MongoDB Service**
   - Windows: MongoDB Compass will start the service automatically
   - Mac: `brew services start mongodb-community`
   - Linux: `sudo systemctl start mongod`

3. **Configure Environment**
   - Create `.env` file in `disease_chatbot/`:
     ```
     MONGO_URI=mongodb://localhost:27017/healthcare
     ```

---

## Backend Setup

### 1. Install Dependencies

```bash
cd disease_chatbot
pip install -r requirements.txt
```

### 2. Set Environment Variables

```bash
# Windows (PowerShell)
$env:MONGO_URI="your_connection_string_here"

# macOS/Linux (Bash)
export MONGO_URI="your_connection_string_here"
```

### 3. Start API Server

```bash
python api_server.py
```

Output should show:
```
✓ Model and metadata loaded successfully
✓ MongoDB connected successfully
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### API Endpoints

#### Patient Management
- `POST /patients/register` - Register new patient
  ```json
  {
    "patient_info": {
      "firstName": "John",
      "lastName": "Doe",
      "dateOfBirth": "1990-01-15",
      "gender": "Male",
      "bloodType": "O+",
      "email": "john@example.com",
      "phone": "+919876543210",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "country": "USA"
    },
    "allergies": [
      { "name": "Penicillin", "severity": "Severe", "reaction": "Anaphylaxis" }
    ],
    "medications": [
      { "name": "Aspirin", "dosage": "100mg", "frequency": "Once daily", "reason": "Heart health" }
    ],
    "medical_history": [
      { "condition": "Hypertension", "status": "Ongoing", "diagnosisDate": "2015-06-20" }
    ],
    "emergency_contact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "phone": "+919876543211",
      "email": "jane@example.com"
    },
    "family_history": [
      { "relation": "Mother", "condition": "Diabetes" }
    ]
  }
  ```

- `GET /patients/{patient_id}` - Retrieve patient by ID
- `PUT /patients/{patient_id}` - Update patient information
- `GET /patients/search/by-email?email=user@example.com` - Search by email

#### Health & Symptoms
- `GET /health` - API health check
- `GET /symptoms` - Get all available symptoms

#### Prediction
- `POST /predict` - Get disease prediction with optional patient info
  ```json
  {
    "symptoms": ["fever", "cough"],
    "days": 3,
    "region": "Pan-India",
    "patient_id": "optional_patient_id"
  }
  ```

---

## Frontend Setup

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Environment Configuration

Create `.env` file in `frontend/`:
```
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
```

Output:
```
  ➜  local:   http://localhost:3002/
```

---

## Complete Workflow

### 1. Register a Patient

1. Open http://localhost:3002
2. Click "Start Assessment"
3. Click "+ Register New Patient"
4. Fill in all three steps:
   - Step 1: Personal Information (name, DOB, contact, address)
   - Step 2: Medical Information (allergies, medications, medical history)
   - Step 3: Emergency Contact
5. Click "Register Patient"
6. You'll receive a **Patient ID** - save this!

### 2. Perform Assessment with Patient

1. Click "Start Assessment"
2. Click "Access Existing Profile"
3. Search by email OR enter Patient ID
4. Select symptoms from the list
5. Enter duration (days) and region
6. Click "Analyze"

### 3. Download PDF Report

1. View your results
2. The PDF will include:
   - Patient Information (name, age, gender, blood type, contact)
   - Allergies and warnings
   - Current medications
   - Medical history
   - Top 5 diagnosed conditions with confidence scores
   - Recommended specialists
   - AI explanation and key symptom indicators
3. Click "Download as PDF" button

---

## Database Schema

### Patients Collection

```typescript
{
  "_id": ObjectId,
  "patient_info": {
    "firstName": string,
    "lastName": string,
    "dateOfBirth": string,
    "gender": string,
    "bloodType": string,
    "email": string,
    "phone": string,
    "address": string,
    "city": string,
    "state": string,
    "zipCode": string,
    "country": string
  },
  "allergies": [
    {
      "name": string,
      "severity": "Mild" | "Moderate" | "Severe",
      "reaction": string
    }
  ],
  "medications": [
    {
      "name": string,
      "dosage": string,
      "frequency": string,
      "reason": string,
      "startDate": string
    }
  ],
  "medical_history": [
    {
      "condition": string,
      "diagnosisDate": string,
      "status": "Ongoing" | "Resolved",
      "notes": string
    }
  ],
  "emergency_contact": {
    "name": string,
    "relationship": string,
    "phone": string,
    "email": string
  },
  "family_history": [
    {
      "relation": string,
      "condition": string,
      "notes": string
    }
  ],
  "created_at": ISODate,
  "updated_at": ISODate
}
```

---

## Troubleshooting

### MongoDB Connection Error

**Error**: `✗ Failed to connect to MongoDB`

**Solutions**:
1. Check MONGO_URI in `.env` file
2. Verify MongoDB is running
3. Check username/password are correct
4. Ensure whitelist IP (Atlas) or MongoDB is accessible

### Model Files Not Found

**Error**: `Model file not found: disease_model.pkl`

**Solution**: Run the model trainer to generate model files:
```bash
cd disease_chatbot
python model_trainer.py
```

### API Port Already in Use

**Error**: `Address already in use`

**Solution**: Change port in `api_server.py`:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)  # Use 8001 instead
```

### Frontend Can't Connect to API

**Error**: `Cannot connect to the analysis server`

**Solutions**:
1. Verify API running on port 8000
2. Check VITE_API_BASE_URL is correct
3. Ensure CORS is enabled on backend (already configured)

---

## File Structure

```
Healthcare-Trial/
├── disease_chatbot/
│   ├── api_server.py          # FastAPI backend
│   ├── database.py            # MongoDB models & operations
│   ├── requirements.txt        # Python dependencies
│   ├── disease_model.pkl      # Trained RandomForest model
│   └── model_metadata.pkl     # Model metadata
├── frontend/
│   ├── components/
│   │   ├── PatientRegistration.tsx    # Registration form
│   │   ├── PatientSelection.tsx       # Patient login
│   │   ├── ResultsWithSpecialists.tsx # Results with PDF
│   │   └── ...
│   ├── services/
│   │   └── prediction.ts      # API client
│   ├── App.tsx                # Main app
│   ├── types.ts               # TypeScript types
│   └── package.json
└── README.md
```

---

## Performance Metrics

- **Model Accuracy**: 82.66%
- **Model Precision**: 88.75%
- **Training Data**: 96,088 records (100 diseases, 230 symptoms)
- **Inference Time**: <100ms per prediction
- **PDF Generation**: <2 seconds

---

## Security Notes

1. **Patient Data**: All credentials stored securely in MongoDB
2. **API**: CORS enabled for localhost:3002 (production: restrict origins)
3. **Password**: Never commit `.env` with real credentials
4. **HTTPS**: Use HTTPS in production
5. **Email**: Implement email verification for production

---

## Next Steps

1. ✅ Set up MongoDB (Atlas or Local)
2. ✅ Install backend dependencies: `pip install -r requirements.txt`
3. ✅ Start API server: `python api_server.py`
4. ✅ Install frontend dependencies: `npm install`
5. ✅ Start dev server: `npm run dev`
6. ✅ Register first patient and test workflow!

---

## Support & Issues

- Check troubleshooting section above
- Review application logs for detailed error messages
- Ensure both API and Frontend are running on correct ports
- Test API directly with tools like Postman or curl

---

**Happy Assessing! 🏥**
