import React, { useState } from 'react';
import { DatabaseService } from '../services/DatabaseService';
import { AIService } from '../services/AIService';
import { ScoringEngine } from '../services/ScoringEngine';
import { Camera, Upload, MapPin, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReportIssue = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  
  const [reportData, setReportData] = useState({
    imageURL: '',
    latitude: null,
    longitude: null,
    type: '',
    severity: '',
    aiConfidence: 0
  });

  const [duplicateWarning, setDuplicateWarning] = useState(null);

  const simulateCameraCapture = () => {
    // Hackathon stub for capturing image
    // Using an unsplash placeholder for demo
    setImagePreview("https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800");
    setStep(2);
  };

  const processImageAndLocation = async () => {
    setLoading(true);
    
    // 1. Get Location (Simulated if Geolocation fails)
    let lat = 37.7749; // default generic
    let lng = -122.4194;
    
    try {
      if (navigator.geolocation) {
         // for simplicity in demo, we could await geolocation
         // Mocking here to ensure speed
      }
    } catch(e) {}

    // 2. AI Classification
    const aiResult = await AIService.classifyImage(imagePreview);
    
    // 3. Check Duplicates
    const allIssues = await DatabaseService.getAllIssues();
    const dupCheck = await AIService.checkDuplicates(lat, lng, allIssues);

    setReportData({
      ...reportData,
      imageURL: imagePreview,
      latitude: lat,
      longitude: lng,
      type: aiResult.type,
      severity: aiResult.severity,
      aiConfidence: aiResult.confidence
    });

    setLoading(false);
    
    if (dupCheck.isDuplicate) {
      setDuplicateWarning(dupCheck);
      setStep(3); // Review step w/ Warning
    } else {
      setStep(3); // Normal Review step
    }
  };

  const submitReport = async () => {
    setLoading(true);
    
    const priorityScore = ScoringEngine.calculatePriorityScore(reportData.type, reportData.severity, 0, 0);
    const slaDeadline = ScoringEngine.calculateSLA(reportData.type, new Date());

    const finalIssue = {
      imageURL: reportData.imageURL,
      latitude: reportData.latitude,
      longitude: reportData.longitude,
      type: reportData.type,
      severity: reportData.severity,
      confidence: reportData.aiConfidence,
      priorityScore,
      slaDeadline,
    };

    const id = await DatabaseService.addIssue(finalIssue);
    setLoading(false);
    
    setStep(4); // Success step
  };

  return (
    <div className="p-4 max-w-md mx-auto min-h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Report Issue</h1>
      
      {step === 1 && (
        <div className="flex-1 flex flex-col justify-center items-center space-y-6">
          <div className="bg-blue-50 w-full h-64 rounded-2xl flex flex-col justify-center items-center border-2 border-dashed border-blue-200 text-blue-500 cursor-pointer hover:bg-blue-100 transition"
               onClick={simulateCameraCapture}>
            <Camera size={48} className="mb-2" />
            <p className="font-medium">Tap to take a photo</p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex-1 flex flex-col">
          <img src={imagePreview} className="w-full h-64 object-cover rounded-xl shadow-md mb-6" alt="Preview" />
          <button 
            disabled={loading}
            onClick={processImageAndLocation}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 disabled:opacity-50 transition transform active:scale-95 flex justify-center items-center"
          >
            {loading ? <div className="animate-spin w-6 h-6 border-b-2 border-white rounded-full"></div> : "Analyze & Locate"}
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="flex-1 space-y-4">
          <img src={imagePreview} className="w-full h-48 object-cover rounded-xl shadow-md" alt="Preview" />
          
          {duplicateWarning && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r flex items-start space-x-3">
              <AlertCircle className="text-yellow-500 shrink-0" />
              <div>
                <h3 className="font-bold text-yellow-800">Duplicate Issue Detected</h3>
                <p className="text-sm text-yellow-700">This issue looks similar to an existing report. Consider upvoting it instead to bump its priority.</p>
                <button className="mt-2 text-sm font-bold text-yellow-800 underline">View existing issue</button>
              </div>
            </div>
          )}

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Analysis Result</h3>
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
              <span className="font-medium capitalize">{reportData.type.replace('_', ' ')}</span>
              <span className={`text-sm px-2 py-1 rounded-full font-bold ${
                reportData.severity === 'high' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
              }`}>{reportData.severity} severity</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">Confidence: {Math.round(reportData.aiConfidence * 100)}%</p>
          </div>

          <button 
            disabled={loading}
            onClick={submitReport}
            className="w-full py-4 bg-green-600 text-white font-bold rounded-xl shadow-lg hover:bg-green-700 disabled:opacity-50 transition transform active:scale-95 flex justify-center items-center mt-6"
          >
            {loading ? <div className="animate-spin w-6 h-6 border-b-2 border-white rounded-full"></div> : (duplicateWarning ? "Submit Anyway" : "Confirm & Submit")}
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4">
          <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center animate-bounce">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Issue Reported!</h2>
          <p className="text-gray-500">Local authorities have been notified and it is now public on the map.</p>
          <button 
            onClick={() => navigate('/feed')}
            className="px-6 py-3 mt-4 bg-gray-100 text-gray-800 font-bold rounded-full hover:bg-gray-200"
          >
            Go to Feed
          </button>
        </div>
      )}

    </div>
  );
};
