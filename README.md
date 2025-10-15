# 🎙️ Meeting Summarizer

AI-powered meeting transcription and summarization application built with the MERN stack. Upload audio recordings of meetings and get instant transcriptions with intelligent summaries including key decisions, action items, and next steps.

![Meeting Summarizer](https://img.shields.io/badge/MERN-Stack-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## ✨ Features

- 🎤 **Audio Transcription** - Accurate speech-to-text using AssemblyAI
- 🤖 **AI-Powered Summaries** - Intelligent meeting analysis with Groq API
- 📊 **Structured Output** - Get organized summaries with:
  - Meeting overview
  - Key decisions made
  - Action items with responsibilities
  - Discussion topics covered
  - Next steps and follow-ups
- 💾 **Meeting History** - Store and retrieve past meetings
- 🎨 **Beautiful UI** - Modern, responsive React interface
- 📱 **Drag & Drop** - Easy file upload with drag-and-drop support
- 🔍 **Full Transcripts** - View complete meeting transcriptions

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool and dev server
- **CSS3** - Modern styling with gradients

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database for storing meetings
- **Mongoose** - MongoDB ODM

### AI Services
- **AssemblyAI** - Speech-to-text transcription
- **Groq API** - Fast LLM inference for summarization (Llama 3)

### Additional Libraries
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** - [Download](https://www.mongodb.com/try/download/community) or use MongoDB Atlas
- **npm** or **yarn** - Package manager

## 🚀 Quick Start

### 1. Clone the Repository

```
git clone https://github.com/pavanr2003/meeting-summarizer.git
cd meeting-summarizer

```

### 2. Backend Setup

```
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/meeting-summarizer
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
GROQ_API_KEY=your_groq_api_key_here
UPLOAD_DIR=uploads
MAX_FILE_SIZE=104857600
NODE_ENV=development

```

### 3. Frontend Setup

```
cd ../frontend
npm install
```

### 4. Get API Keys

#### AssemblyAI API Key (FREE)
1. Go to [AssemblyAI](https://www.assemblyai.com/)
2. Sign up for a free account
3. Navigate to Dashboard → API Keys
4. Copy your API key
5. Free tier includes **5 hours** of transcription per month

#### Groq API Key (FREE)
1. Go to [Groq Console](https://console.groq.com/)
2. Sign up (completely free, no credit card required)
3. Create an API key
4. Copy your API key
5. **Unlimited free usage** with fast inference

### 5. Start MongoDB

**Option A: Local MongoDB**


**Option B: MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

### 6. Run the Application

**Terminal 1 - Backend:**

```
cd backend
npm run dev
```

**Open:** http://localhost:5173

## 📁 Project Structure

```
meeting-summarizer/
├── backend/
│ ├── config/
│ │ └── db.js # MongoDB connection
│ ├── controllers/
│ │ └── transcriptionController.js
│ ├── middleware/
│ │ ├── errorHandler.js
│ │ └── upload.js # Multer configuration
│ ├── models/
│ │ └── Meeting.js # MongoDB schema
│ ├── routes/
│ │ └── transcription.js
│ ├── services/
│ │ ├── assemblyAIService.js # Transcription service
│ │ └── groqService.js # Summarization service
│ ├── .env # Environment variables (not in repo)
│ ├── package.json
│ └── server.js # Entry point
│
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── FileUpload.jsx # Drag & drop upload
│ │ │ ├── MeetingResults.jsx # Display summary
│ │ │ └── MeetingHistory.jsx # Past meetings
│ │ ├── services/
│ │ │ └── api.js # API client
│ │ ├── App.jsx # Main component
│ │ ├── App.css # Styles
│ │ └── main.jsx # Entry point
│ ├── index.html
│ ├── package.json
│ └── vite.config.js
│
├── .gitignore
└── README.md

```


## 🎯 Usage

1. **Upload Audio File**
   - Click "Choose File" or drag and drop an audio file
   - Supported formats: MP3, WAV, M4A, OGG, AAC, FLAC
   - Maximum file size: 100MB

2. **Process Meeting**
   - Click "Process Meeting" button
   - Wait for transcription and summarization (30-60 seconds)

3. **View Results**
   - See structured summary with key insights
   - Read full transcript
   - Meeting automatically saved to history

4. **Access History**
   - View all past meetings
   - Click to view details
   - Delete meetings you no longer need

## 🔧 API Endpoints

### POST `/api/transcription/upload`
Upload and process audio file
- **Body:** `multipart/form-data` with `audio` field
- **Response:** Meeting object with transcription and summary

### GET `/api/transcription/meetings`
Get all meetings
- **Response:** Array of meeting objects (without full transcripts)

### GET `/api/transcription/meetings/:id`
Get specific meeting by ID
- **Response:** Complete meeting object

### DELETE `/api/transcription/meetings/:id`
Delete a meeting
- **Response:** Success message

## ⚙️ Configuration

### Environment Variables

**Backend (.env):**

```
PORT=5000 # Server port
MONGODB_URI=mongodb://... # Database connection
ASSEMBLYAI_API_KEY=... # Transcription API key
GROQ_API_KEY=... # Summarization API key
UPLOAD_DIR=uploads # Upload directory
MAX_FILE_SIZE=104857600 # Max file size (100MB)
NODE_ENV=development # Environment

```

### Frontend API URL

Update `frontend/src/services/api.js` to point to your backend:

```
const API_URL = 'http://localhost:5000/api/transcription';
```

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB is running
- Verify `.env` file exists in backend folder
- Ensure all API keys are valid
- Run `npm install` in backend folder

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration in `backend/server.js`
- Ensure API_URL in `frontend/src/services/api.js` is correct

### Upload fails
- Check file size (max 100MB)
- Verify file format is supported
- Check backend logs for errors
- Ensure `uploads/` directory exists

### Transcription fails
- Verify AssemblyAI API key is valid
- Check if you've exceeded free tier limits
- Ensure audio file is clear and in supported format

### Summary generation fails
- Verify Groq API key is valid
- Check internet connection
- Review backend logs for detailed errors

## 🎨 Customization

### Change Summary Format
Edit `backend/services/groqService.js` to customize the summary structure:

```
const prompt = Your custom prompt here...;
```

### Modify UI Colors
Edit `frontend/src/App.css` gradient colors:

```
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```


### Add New Features
- Add speaker identification in transcription
- Implement sentiment analysis
- Add meeting scheduling
- Create PDF export functionality

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Pavan R**

- GitHub: [@pavanr2003](https://github.com/pavanr2003)

## 🙏 Acknowledgments

- [AssemblyAI](https://www.assemblyai.com/) - Speech-to-text API
- [Groq](https://groq.com/) - Fast LLM inference
- [MongoDB](https://www.mongodb.com/) - Database
- [React](https://react.dev/) - Frontend framework

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📮 Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ by Pavan 
