import React, { useState, useRef } from 'react';
import { Volume2, BookOpen, Trophy, Menu, X, Moon, Sun, ChevronRight, Plus, ExternalLink, Trash2, Target, TrendingUp, Calendar, Download, Upload, FileText, Star } from 'lucide-react';

const EnglishMasteryPWA = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('library');
  const [selectedSpeech, setSelectedSpeech] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [selectedCalendarDay, setSelectedCalendarDay] = useState(null);
  const fileInputRef = useRef(null);

  const [newSpeech, setNewSpeech] = useState({
    title: '',
    speaker: '',
    youtubeUrl: '',
    text: ''
  });

  const [speeches, setSpeeches] = useState([
    {
      id: 1,
      title: "I Have a Dream",
      speaker: "Martin Luther King Jr.",
      youtubeUrl: "https://www.youtube.com/watch?v=vP4iY1TtS3s",
      listens: 7,
      text: "I have a dream that one day this nation will rise up and live out the true meaning of its creed: 'We hold these truths to be self-evident, that all men are created equal.' I have a dream that one day on the red hills of Georgia, the sons of former slaves and the sons of former slave owners will be able to sit down together at the table of brotherhood.",
      knownWords: new Set(['dream', 'nation', 'meaning', 'equal', 'creed', 'truths', 'evident']),
      importantWords: new Set(['creed', 'evident', 'brotherhood']),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      studyDays: [
        new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      ]
    }
  ]);

  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have', 'had',
    'what', 'when', 'where', 'who', 'which', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'or', 'own', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
  ]);

  const getUniqueWords = (text) => {
    const words = text
      .toLowerCase()
      .replace(/[.,;:!?'"()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    return [...new Set(words)].sort();
  };

  const handleAddSpeech = () => {
    if (!newSpeech.title || !newSpeech.text) {
      alert('Please fill in the title and text');
      return;
    }

    const speech = {
      id: Date.now(),
      title: newSpeech.title,
      speaker: newSpeech.speaker || 'Unknown Speaker',
      youtubeUrl: newSpeech.youtubeUrl,
      text: newSpeech.text,
      listens: 0,
      knownWords: new Set(),
      importantWords: new Set(),
      createdAt: new Date().toISOString(),
      studyDays: []
    };

    setSpeeches([...speeches, speech]);
    setNewSpeech({ title: '', speaker: '', youtubeUrl: '', text: '' });
    setShowAddModal(false);
  };

  const deleteSpeech = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this speech?')) {
      setSpeeches(speeches.filter(s => s.id !== id));
      if (selectedSpeech && selectedSpeech.id === id) {
        setSelectedSpeech(null);
        setCurrentView('library');
      }
    }
  };

  const incrementListen = () => {
    const today = new Date().toISOString().split('T')[0];
    const studyDays = selectedSpeech.studyDays || [];
    
    if (!studyDays.includes(today)) {
      studyDays.push(today);
    }

    const updatedSpeeches = speeches.map(speech => 
      speech.id === selectedSpeech.id 
        ? { ...speech, listens: speech.listens + 1, studyDays }
        : speech
    );
    setSpeeches(updatedSpeeches);
    setSelectedSpeech({
      ...selectedSpeech,
      listens: selectedSpeech.listens + 1,
      studyDays
    });
  };

  const toggleWord = (word) => {
    const newKnownWords = new Set(selectedSpeech.knownWords);
    if (newKnownWords.has(word)) {
      newKnownWords.delete(word);
    } else {
      newKnownWords.add(word);
    }
    
    const updatedSpeeches = speeches.map(speech => 
      speech.id === selectedSpeech.id 
        ? { ...speech, knownWords: newKnownWords }
        : speech
    );
    setSpeeches(updatedSpeeches);
    setSelectedSpeech({ ...selectedSpeech, knownWords: newKnownWords });
  };

  const toggleImportantWord = (word, e) => {
    e.stopPropagation();
    const newImportantWords = new Set(selectedSpeech.importantWords || new Set());
    if (newImportantWords.has(word)) {
      newImportantWords.delete(word);
    } else {
      newImportantWords.add(word);
    }
    
    const updatedSpeeches = speeches.map(speech => 
      speech.id === selectedSpeech.id 
        ? { ...speech, importantWords: newImportantWords }
        : speech
    );
    setSpeeches(updatedSpeeches);
    setSelectedSpeech({ ...selectedSpeech, importantWords: newImportantWords });
  };

  const getAllImportantWords = () => {
    const wordsMap = {};
    speeches.forEach(speech => {
      (speech.importantWords || new Set()).forEach(word => {
        if (!wordsMap[word]) {
          wordsMap[word] = [];
        }
        wordsMap[word].push({
          speechTitle: speech.title,
          speechId: speech.id,
          isKnown: speech.knownWords.has(word)
        });
      });
    });
    return wordsMap;
  };

  const removeImportantWord = (word) => {
    const updatedSpeeches = speeches.map(speech => {
      const newImportantWords = new Set(speech.importantWords || new Set());
      newImportantWords.delete(word);
      return { ...speech, importantWords: newImportantWords };
    });
    setSpeeches(updatedSpeeches);
  };

  const getDaysStudied = (speech) => {
    const days = Math.floor((new Date() - new Date(speech.createdAt)) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getProgress = (speech) => {
    const uniqueWords = getUniqueWords(speech.text);
    const listenProgress = Math.min((speech.listens / 10) * 100, 100);
    const daysProgress = Math.min((getDaysStudied(speech) / 7) * 100, 100);
    const wordsProgress = uniqueWords.length > 0 ? (speech.knownWords.size / uniqueWords.length) * 100 : 0;
    return Math.round((listenProgress + daysProgress + wordsProgress) / 3);
  };

  const isComplete = (speech) => {
    return speech.listens >= 10 && getDaysStudied(speech) >= 7;
  };

  const getAllStudyDays = () => {
    const allDays = {};
    speeches.forEach(speech => {
      (speech.studyDays || []).forEach(day => {
        if (!allDays[day]) {
          allDays[day] = [];
        }
        allDays[day].push(speech.title);
      });
    });
    return allDays;
  };

  const getMonthDays = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(calendarDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCalendarDate(newDate);
  };

  const exportBackup = () => {
    const data = {
      speeches: speeches.map(s => ({
        ...s,
        knownWords: Array.from(s.knownWords),
        importantWords: Array.from(s.importantWords || new Set())
      })),
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `english-mastery-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        const importedSpeeches = data.speeches.map(s => ({
          ...s,
          knownWords: new Set(s.knownWords),
          importantWords: new Set(s.importantWords || [])
        }));
        setSpeeches(importedSpeeches);
        alert('Backup restored successfully!');
      } catch (error) {
        alert('Error importing backup. Please check the file.');
      }
    };
    reader.readAsText(file);
  };

  const exportCSVReport = (startDate, endDate) => {
    let filteredSpeeches = speeches;
    
    if (startDate && endDate) {
      filteredSpeeches = speeches.filter(speech => {
        const studyDaysInRange = (speech.studyDays || []).filter(day => {
          return day >= startDate && day <= endDate;
        });
        return studyDaysInRange.length > 0 || (speech.createdAt >= startDate && speech.createdAt <= endDate);
      });
    }

    const csvRows = [
      ['Speech Title', 'Speaker', 'Total Listens', 'Days Studied', 'Study Days Count', 'Words Known', 'Total Unique Words', 'Important Words', 'Progress %', 'Status', 'Created Date', 'Study Days']
    ];

    filteredSpeeches.forEach(speech => {
      const uniqueWords = getUniqueWords(speech.text);
      const progress = getProgress(speech);
      const status = isComplete(speech) ? 'Complete' : 'In Progress';
      
      csvRows.push([
        speech.title,
        speech.speaker,
        speech.listens,
        getDaysStudied(speech),
        (speech.studyDays || []).length,
        speech.knownWords.size,
        uniqueWords.length,
        (speech.importantWords || new Set()).size,
        progress,
        status,
        new Date(speech.createdAt).toLocaleDateString(),
        (speech.studyDays || []).join('; ')
      ]);
    });

    const csvContent = csvRows.map(row => 
      row.map(cell => `"${cell}"`).join(',')
    ).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const dateRange = startDate && endDate ? `${startDate}-to-${endDate}` : 'full';
    a.download = `english-mastery-report-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setShowReportModal(false);
  };

  const CalendarView = ({ speech }) => {
    const studyDays = speech.studyDays || [];
    const startDate = new Date(speech.createdAt);
    const today = new Date();
    const days = [];

    for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    return (
      <div>
        <h4 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Study Calendar
        </h4>
        <div className="flex flex-wrap gap-2">
          {days.map((day, idx) => {
            const dateStr = day.toISOString().split('T')[0];
            const isStudied = studyDays.includes(dateStr);
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            
            return (
              <div
                key={idx}
                className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all ${
                  isStudied
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-red-500 text-white opacity-60'
                } ${isToday ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                title={`${day.toLocaleDateString()} - ${isStudied ? 'Studied' : 'Not Studied'}`}
              >
                <span className="text-[10px]">{day.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="font-bold">{day.getDate()}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Studied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 opacity-60 rounded"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Not Studied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded ring-2 ring-blue-500"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Today</span>
          </div>
        </div>
      </div>
    );
  };

  const CircularProgress = ({ value, size = 100 }) => {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={darkMode ? "#374151" : "#e5e7eb"}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={value === 100 ? "#10b981" : "#3b82f6"}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
    );
  };

  const SpeechCard = ({ speech }) => {
    const uniqueWords = getUniqueWords(speech.text);
    const progress = getProgress(speech);
    const complete = isComplete(speech);

    return (
      <div
        onClick={() => {
          setSelectedSpeech(speech);
          setCurrentView('study');
        }}
        className={`p-6 rounded-2xl cursor-pointer transition-all hover:scale-[1.02] relative overflow-hidden ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg hover:shadow-xl`}
      >
        {complete && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
            ✓ Complete
          </div>
        )}

        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <CircularProgress value={progress} size={80} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {progress}%
              </span>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {speech.title}
            </h3>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-3`}>
              {speech.speaker}
            </p>
            
            <div className="flex items-center gap-4 flex-wrap text-sm">
              <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Volume2 size={16} />
                <span className="font-medium">{speech.listens}/10</span>
              </div>
              <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Target size={16} />
                <span className="font-medium">{getDaysStudied(speech)}/7 days</span>
              </div>
              <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <BookOpen size={16} />
                <span className="font-medium">{speech.knownWords.size}/{uniqueWords.length}</span>
              </div>
              <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Calendar size={16} />
                <span className="font-medium">{(speech.studyDays || []).length} days</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => deleteSpeech(speech.id, e)}
          className={`absolute bottom-4 right-4 p-2 rounded-lg transition-all ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <Trash2 size={18} className="text-red-500" />
        </button>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} transition-colors`}>
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Add New Speech
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Speech Title *
                </label>
                <input
                  type="text"
                  value={newSpeech.title}
                  onChange={(e) => setNewSpeech({...newSpeech, title: e.target.value})}
                  className={`w-full px-4 py-4 rounded-xl border-2 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                  placeholder="e.g., I Have a Dream"
                />
              </div>

              <div>
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Speaker Name
                </label>
                <input
                  type="text"
                  value={newSpeech.speaker}
                  onChange={(e) => setNewSpeech({...newSpeech, speaker: e.target.value})}
                  className={`w-full px-4 py-4 rounded-xl border-2 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                  placeholder="e.g., Martin Luther King Jr."
                />
              </div>

              <div>
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={newSpeech.youtubeUrl}
                  onChange={(e) => setNewSpeech({...newSpeech, youtubeUrl: e.target.value})}
                  className={`w-full px-4 py-4 rounded-xl border-2 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all`}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Speech Text *
                </label>
                <textarea
                  value={newSpeech.text}
                  onChange={(e) => setNewSpeech({...newSpeech, text: e.target.value})}
                  rows={10}
                  className={`w-full px-4 py-4 rounded-xl border-2 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none`}
                  placeholder="Paste the full text of the speech here..."
                />
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getUniqueWords(newSpeech.text).length} unique words to learn
                </p>
              </div>

              <button
                onClick={handleAddSpeech}
                className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold text-lg hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                Add Speech
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-lg w-full shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Export Progress Report
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 outline-none`}
                />
              </div>

              <div>
                <label className={`block mb-2 font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 outline-none`}
                />
              </div>

              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Leave dates empty to export full report
              </p>

              <button
                onClick={() => exportCSVReport(reportStartDate, reportEndDate)}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Export CSV Report
              </button>
            </div>
          </div>
        </div>
      )}

      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-8 max-w-lg w-full shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Backup & Restore
              </h2>
              <button
                onClick={() => setShowBackupModal(false)}
                className={`p-2 rounded-full transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  exportBackup();
                  setShowBackupModal(false);
                }}
                className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3"
              >
                <Download size={20} />
                Export Backup
              </button>
              
              <div className={`relative ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
                <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Save all your speeches, progress, and study data to a file
                </p>
              </div>

              <div className={`border-t-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'} my-4`}></div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={(e) => {
                  importBackup(e);
                  setShowBackupModal(false);
                }}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-3"
              >
                <Upload size={20} />
                Restore from Backup
              </button>

              <div className={`relative ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-4 text-center`}>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Load your data from a previously saved backup file
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className={`sticky top-0 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg backdrop-blur-sm bg-opacity-90`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Trophy className="text-white" size={28} />
              </div>
              <h1 className={`text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                English Mastery
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBackupModal(true)}
              className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
              title="Backup & Restore"
            >
              <Download size={20} />
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
              title="Export Report"
            >
              <FileText size={20} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} hover:scale-110 transition-all`}
            >
              {darkMode ? <Sun size={24} className="text-yellow-400" /> : <Moon size={24} className="text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        <aside className={`${showMenu ? 'block' : 'hidden'} lg:block w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-6 min-h-screen`}>
          <nav className="space-y-3">
            <button
              onClick={() => setCurrentView('library')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-medium ${
                currentView === 'library'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen size={22} />
              <span>Library</span>
            </button>
            <button
              onClick={() => setCurrentView('mywords')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-medium ${
                currentView === 'mywords'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Star size={22} />
              <span>My Words</span>
              {Object.keys(getAllImportantWords()).length > 0 && (
                <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {Object.keys(getAllImportantWords()).length}
                </span>
              )}
            </button>
            <button
              onClick={() => setCurrentView('progress')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-medium ${
                currentView === 'progress'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <TrendingUp size={22} />
              <span>Progress</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-medium ${
                currentView === 'calendar'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar size={22} />
              <span>Calendar</span>
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {currentView === 'library' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Speeches
                  </h2>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Master English by repetition and understanding
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 font-medium"
                >
                  <Plus size={22} />
                  Add Speech
                </button>
              </div>
              
              {speeches.length === 0 ? (
                <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-32 h-32 mx-auto mb-6 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                    <BookOpen size={64} className="opacity-50" />
                  </div>
                  <p className="text-2xl font-bold mb-4">No speeches yet</p>
                  <p className="mb-6">Add your first speech to start mastering English</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    Add Your First Speech
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {speeches.map(speech => (
                    <SpeechCard key={speech.id} speech={speech} />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'mywords' && (
            <div>
              <h2 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                My Important Words
              </h2>
              <p className={`mb-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Words you marked with a star ⭐ for review
              </p>

              {Object.keys(getAllImportantWords()).length === 0 ? (
                <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-32 h-32 mx-auto mb-6 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                    <Star size={64} className="opacity-50" />
                  </div>
                  <p className="text-2xl font-bold mb-4">No important words yet</p>
                  <p className="mb-6">Click the star icon on any word while studying to add it here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(getAllImportantWords()).sort().map(([word, sources]) => (
                    <div
                      key={word}
                      className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {word}
                        </h3>
                        <button
                          onClick={() => removeImportantWord(word)}
                          className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                          title="Remove from My Words"
                        >
                          <X size={20} className="text-red-500" />
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {sources.map((source, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              darkMode ? 'bg-gray-900' : 'bg-gray-50'
                            }`}
                          >
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {source.speechTitle}
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-bold ${
                                source.isKnown
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                              }`}
                            >
                              {source.isKnown ? 'Known' : 'Learning'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'progress' && (
            <div>
              <h2 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Progress
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <Volume2 className="text-blue-500 mb-3" size={32} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Total Listens</p>
                  <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {speeches.reduce((sum, s) => sum + s.listens, 0)}
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <BookOpen className="text-green-500 mb-3" size={32} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Words Mastered</p>
                  <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {speeches.reduce((sum, s) => sum + s.knownWords.size, 0)}
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <Star className="text-yellow-500 mb-3" size={32} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Important Words</p>
                  <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Object.keys(getAllImportantWords()).length}
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <Trophy className="text-purple-500 mb-3" size={32} />
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Completed</p>
                  <p className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {speeches.filter(s => isComplete(s)).length}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {speeches.map(speech => {
                  const uniqueWords = getUniqueWords(speech.text);
                  const progress = getProgress(speech);
                  return (
                    <div key={speech.id} className={`p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {speech.title}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {speech.speaker}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {progress}%
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {speech.listens}/10
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Listens</p>
                        </div>
                        <div>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {getDaysStudied(speech)}/7
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days</p>
                        </div>
                        <div>
                          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {speech.knownWords.size}/{uniqueWords.length}
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Words</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {currentView === 'calendar' && (
            <div>
              <h2 className={`text-4xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Study Calendar
              </h2>

              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl mb-6`}>
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
                  >
                    <ChevronRight size={24} className="transform rotate-180" />
                  </button>
                  
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  
                  <button
                    onClick={() => navigateMonth(1)}
                    className={`p-3 rounded-xl ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-all`}
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className={`text-center font-bold py-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {getMonthDays(calendarDate).map((day, idx) => {
                    if (!day) {
                      return <div key={idx} className="aspect-square"></div>;
                    }

                    const dateStr = day.toISOString().split('T')[0];
                    const studyDays = getAllStudyDays();
                    const isStudied = studyDays[dateStr];
                    const isToday = dateStr === new Date().toISOString().split('T')[0];
                    const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));
                    const isFuture = day > new Date();

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedCalendarDay(isStudied ? { date: dateStr, speeches: isStudied } : null)}
                        className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm font-medium transition-all relative ${
                          isFuture
                            ? darkMode ? 'bg-gray-900 text-gray-600' : 'bg-gray-50 text-gray-400'
                            : isStudied
                            ? 'bg-green-500 text-white hover:bg-green-600 cursor-pointer shadow-lg'
                            : isPast
                            ? 'bg-red-500 text-white opacity-60'
                            : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        } ${isToday ? 'ring-4 ring-blue-500' : ''}`}
                        disabled={isFuture}
                      >
                        <span className="text-lg font-bold">{day.getDate()}</span>
                        {isStudied && (
                          <span className="text-[10px] mt-1">
                            {isStudied.length} 📚
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-6 mt-6 text-sm justify-center flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-500 rounded-lg"></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Studied</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-500 opacity-60 rounded-lg"></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Missed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-500 rounded-lg ring-4 ring-blue-500"></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Today</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-lg ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Future</span>
                  </div>
                </div>
              </div>

              {selectedCalendarDay && (
                <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedCalendarDay.date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <button
                      onClick={() => setSelectedCalendarDay(null)}
                      className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <p className={`text-lg mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    You studied these speeches:
                  </p>
                  <div className="space-y-2">
                    {selectedCalendarDay.speeches.map((speechTitle, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-green-50'} flex items-center gap-3`}
                      >
                        <BookOpen className="text-green-500" size={24} />
                        <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {speechTitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl mt-6`}>
                <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Monthly Statistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-green-50'}`}>
                    <p className="text-4xl font-bold text-green-500 mb-2">
                      {Object.keys(getAllStudyDays()).filter(day => {
                        const d = new Date(day);
                        return d.getMonth() === calendarDate.getMonth() && d.getFullYear() === calendarDate.getFullYear();
                      }).length}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Studied</p>
                  </div>
                  <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-red-50'}`}>
                    <p className="text-4xl font-bold text-red-500 mb-2">
                      {(() => {
                        const monthDays = getMonthDays(calendarDate).filter(d => d !== null);
                        const studiedDays = Object.keys(getAllStudyDays()).filter(day => {
                          const d = new Date(day);
                          return d.getMonth() === calendarDate.getMonth() && d.getFullYear() === calendarDate.getFullYear();
                        }).length;
                        const today = new Date();
                        const isCurrentMonth = calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear();
                        const daysInMonth = isCurrentMonth ? today.getDate() : monthDays.length;
                        return Math.max(0, daysInMonth - studiedDays);
                      })()}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Missed</p>
                  </div>
                  <div className={`p-6 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
                    <p className="text-4xl font-bold text-blue-500 mb-2">
                      {(() => {
                        const studiedDays = Object.keys(getAllStudyDays()).filter(day => {
                          const d = new Date(day);
                          return d.getMonth() === calendarDate.getMonth() && d.getFullYear() === calendarDate.getFullYear();
                        }).length;
                        const today = new Date();
                        const isCurrentMonth = calendarDate.getMonth() === today.getMonth() && calendarDate.getFullYear() === today.getFullYear();
                        const daysInMonth = isCurrentMonth ? today.getDate() : getMonthDays(calendarDate).filter(d => d !== null).length;
                        return daysInMonth > 0 ? Math.round((studiedDays / daysInMonth) * 100) : 0;
                      })()}%
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Consistency</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'study' && selectedSpeech && (
            <div>
              <button
                onClick={() => setCurrentView('library')}
                className={`mb-6 flex items-center gap-2 font-medium ${darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-all`}
              >
                <ChevronRight size={20} className="transform rotate-180" />
                Back to Library
              </button>

              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl mb-6`}>
                <div className="flex items-start justify-between mb-8">
                  <div>
                    <h2 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedSpeech.title}
                    </h2>
                    <p className={`text-xl ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedSpeech.speaker}
                    </p>
                  </div>
                  <div className="relative">
                    <CircularProgress value={getProgress(selectedSpeech)} size={100} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {getProgress(selectedSpeech)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
                    <p className={`text-3xl font-bold mb-1 ${selectedSpeech.listens >= 10 ? 'text-green-500' : 'text-blue-500'}`}>
                      {selectedSpeech.listens}/10
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Times Listened</p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-purple-50'}`}>
                    <p className={`text-3xl font-bold mb-1 ${getDaysStudied(selectedSpeech) >= 7 ? 'text-green-500' : 'text-purple-500'}`}>
                      {getDaysStudied(selectedSpeech)}/7
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days Studied</p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-green-50'}`}>
                    <p className={`text-3xl font-bold mb-1 text-green-500`}>
                      {selectedSpeech.knownWords.size}/{getUniqueWords(selectedSpeech.text).length}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Words Known</p>
                  </div>
                </div>

                {selectedSpeech.youtubeUrl && (
                  <a
                    href={selectedSpeech.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full mb-4 px-6 py-5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold text-lg shadow-lg hover:shadow-xl"
                  >
                    <ExternalLink size={24} />
                    Watch on YouTube
                  </a>
                )}

                <button
                  onClick={incrementListen}
                  className="w-full px-6 py-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:shadow-xl transition-all font-bold text-lg flex items-center justify-center gap-3 mb-8"
                >
                  <Volume2 size={24} />
                  I Listened ({selectedSpeech.listens})
                </button>

                <CalendarView speech={selectedSpeech} />
              </div>

              <div className={`p-8 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
                <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Vocabulary ({selectedSpeech.knownWords.size}/{getUniqueWords(selectedSpeech.text).length})
                </h3>
                
                <div className={`p-4 rounded-xl mb-6 ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                    <strong>How to use:</strong>
                  </p>
                  <ul className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>🔴 <strong>Red</strong> = I don't know this word yet</li>
                    <li>🟢 <strong>Green</strong> = I know this word! (Click once)</li>
                    <li>🔴 <strong>Back to Red</strong> = Oops, clicked by mistake (Click again)</li>
                    <li>⭐ <strong>Star icon</strong> = Save to "My Words" for review</li>
                  </ul>
                </div>

                <div className="flex flex-wrap gap-3">
                  {getUniqueWords(selectedSpeech.text).map((word, idx) => {
                    const isKnown = selectedSpeech.knownWords.has(word);
                    const isImportant = (selectedSpeech.importantWords || new Set()).has(word);
                    return (
                      <div key={idx} className="relative group">
                        <button
                          onClick={() => toggleWord(word)}
                          className={`px-5 py-3 rounded-xl font-medium transition-all text-lg ${
                            isKnown
                              ? 'bg-green-500 text-white shadow-lg'
                              : 'bg-red-500 text-white hover:scale-105'
                          } ${isImportant ? 'ring-4 ring-yellow-400' : ''}`}
                        >
                          {word}
                        </button>
                        <button
                          onClick={(e) => toggleImportantWord(word, e)}
                          className={`absolute -top-2 -right-2 p-1.5 rounded-full transition-all shadow-lg ${
                            isImportant
                              ? 'bg-yellow-400 text-white scale-110'
                              : 'bg-gray-300 text-gray-600 opacity-0 group-hover:opacity-100'
                          }`}
                          title={isImportant ? 'Remove from My Words' : 'Add to My Words'}
                        >
                          <Star size={14} fill={isImportant ? 'white' : 'none'} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EnglishMasteryPWA;