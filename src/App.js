import React, { useState, useRef, useEffect } from 'react';
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

  const [easyWords, setEasyWords] = useState(new Set());

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (showMenu || showAddModal || showReportModal || showBackupModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showMenu, showAddModal, showReportModal, showBackupModal]);

  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from',
    'has', 'he', 'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the',
    'to', 'was', 'will', 'with', 'this', 'but', 'they', 'have', 'had',
    'what', 'when', 'where', 'who', 'which', 'why', 'how', 'all', 'each',
    'every', 'both', 'few', 'more', 'most', 'other', 'some', 'such',
    'or', 'own', 'so', 'than', 'too', 'very', 'can', 'just', 'should', 'now'
  ]);

  const stemWord = (word) => {
    word = word.toLowerCase();
    const suffixes = [
      { pattern: /ies$/, replacement: 'y' },
      { pattern: /ied$/, replacement: 'y' },
      { pattern: /ying$/, replacement: 'y' },
      { pattern: /sses$/, replacement: 'ss' },
      { pattern: /xes$/, replacement: 'x' },
      { pattern: /zes$/, replacement: 'z' },
      { pattern: /ches$/, replacement: 'ch' },
      { pattern: /shes$/, replacement: 'sh' },
      { pattern: /men$/, replacement: 'man' },
      { pattern: /ves$/, replacement: 'f' },
      { pattern: /ing$/, replacement: '' },
      { pattern: /ed$/, replacement: '' },
      { pattern: /s$/, replacement: '' },
    ];
    
    for (const { pattern, replacement } of suffixes) {
      if (pattern.test(word)) {
        return word.replace(pattern, replacement);
      }
    }
    return word;
  };

  const getUniqueWords = (text) => {
    const words = text
      .toLowerCase()
      .replace(/[.,;:!?'"()]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 2 && !stopWords.has(word));
    
    const stemmedMap = {};
    words.forEach(word => {
      const stem = stemWord(word);
      if (!stemmedMap[stem]) {
        stemmedMap[stem] = word;
      }
    });
    
    return Object.values(stemmedMap).sort();
  };

  const toggleEasyWord = (word) => {
    const stem = stemWord(word);
    const newEasyWords = new Set(easyWords);
    
    if (newEasyWords.has(stem)) {
      newEasyWords.delete(stem);
    } else {
      newEasyWords.add(stem);
    }
    
    setEasyWords(newEasyWords);
  };

  const isEasyWord = (word) => {
    return easyWords.has(stemWord(word));
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
    const stem = stemWord(word);
    const newKnownWords = new Set(selectedSpeech.knownWords);
    
    let stemFound = false;
    newKnownWords.forEach(knownWord => {
      if (stemWord(knownWord) === stem) {
        newKnownWords.delete(knownWord);
        stemFound = true;
      }
    });
    
    if (!stemFound) {
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
      easyWords: Array.from(easyWords),
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
        setEasyWords(new Set(data.easyWords || []));
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
        <h4 className={`text-base font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
                className={`w-11 h-11 rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all ${
                  isStudied
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-red-500 text-white opacity-60'
                } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
              >
                <span className="text-[9px]">{day.toLocaleDateString('en-US', { month: 'short' })}</span>
                <span className="font-bold text-sm">{day.getDate()}</span>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3 mt-3 text-xs flex-wrap">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Studied</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-red-500 opacity-60 rounded"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Missed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-blue-500 rounded ring-2 ring-blue-500"></div>
            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Today</span>
          </div>
        </div>
      </div>
    );
  };

  const CircularProgress = ({ value, size = 70 }) => {
    const strokeWidth = 6;
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
          setShowMenu(false);
        }}
        className={`p-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] relative ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}
      >
        {complete && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            Complete
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <div className="relative flex-shrink-0">
            <CircularProgress value={progress} size={60} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {progress}%
              </span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
              {speech.title}
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 line-clamp-1`}>
              {speech.speaker}
            </p>
            
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Volume2 size={13} />
                <span>{speech.listens}/10</span>
              </div>
              <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <Target size={13} />
                <span>{getDaysStudied(speech)}/7d</span>
              </div>
              <div className={`flex items-center gap-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <BookOpen size={13} />
                <span>{speech.knownWords.size}/{uniqueWords.length}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={(e) => deleteSpeech(speech.id, e)}
          className={`absolute bottom-3 right-3 p-2 rounded-lg transition-all active:scale-90 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} transition-colors`}>
      {/* Modals */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Add New Speech
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className={`p-2.5 rounded-full transition-all active:scale-90 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block mb-1.5 font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Speech Title *
                </label>
                <input
                  type="text"
                  value={newSpeech.title}
                  onChange={(e) => setNewSpeech({...newSpeech, title: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 outline-none`}
                  placeholder="e.g., I Have a Dream"
                />
              </div>

              <div>
                <label className={`block mb-1.5 font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Speaker Name
                </label>
                <input
                  type="text"
                  value={newSpeech.speaker}
                  onChange={(e) => setNewSpeech({...newSpeech, speaker: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 outline-none`}
                  placeholder="e.g., Martin Luther King Jr."
                />
              </div>

              <div>
                <label className={`block mb-1.5 font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  YouTube URL
                </label>
                <input
                  type="url"
                  value={newSpeech.youtubeUrl}
                  onChange={(e) => setNewSpeech({...newSpeech, youtubeUrl: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 outline-none`}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div>
                <label className={`block mb-1.5 font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Speech Text *
                </label>
                <textarea
                  value={newSpeech.text}
                  onChange={(e) => setNewSpeech({...newSpeech, text: e.target.value})}
                  rows={7}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 outline-none resize-none`}
                  placeholder="Paste the full text of the speech here..."
                />
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {getUniqueWords(newSpeech.text).length} unique words to learn
                </p>
              </div>

              <button
                onClick={handleAddSpeech}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold active:scale-[0.98] transition-all text-base"
              >
                Add Speech
              </button>
            </div>
          </div>
        </div>
      )}

      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-5 max-w-lg w-full shadow-2xl`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Export Report
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                className={`p-2.5 rounded-full transition-all active:scale-90 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block mb-1.5 font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Start Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportStartDate}
                  onChange={(e) => setReportStartDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 outline-none`}
                />
              </div>

              <div>
                <label className={`block mb-1.5 font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  value={reportEndDate}
                  onChange={(e) => setReportEndDate(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-base ${
                    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-200'
                  } focus:border-blue-500 outline-none`}
                />
              </div>

              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Leave dates empty to export full report
              </p>

              <button
                onClick={() => exportCSVReport(reportStartDate, reportEndDate)}
                className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold active:scale-[0.98] transition-all text-base"
              >
                Export CSV Report
              </button>
            </div>
          </div>
        </div>
      )}

      {showBackupModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-3xl p-5 max-w-lg w-full shadow-2xl`}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Backup & Restore
              </h2>
              <button
                onClick={() => setShowBackupModal(false)}
                className={`p-2.5 rounded-full transition-all active:scale-90 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
              >
                <X size={22} />
              </button>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => {
                  exportBackup();
                  setShowBackupModal(false);
                }}
                className="w-full px-5 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
              >
                <Download size={20} />
                Export Backup
              </button>
              
              <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-3 text-center`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Save all your speeches and progress
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
                className="w-full px-5 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-base"
              >
                <Upload size={20} />
                Restore from Backup
              </button>

              <div className={`${darkMode ? 'bg-gray-900' : 'bg-gray-50'} rounded-xl p-3 text-center`}>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Load data from backup file
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header - Fixed */}
      <header className={`fixed top-0 left-0 right-0 z-40 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2.5 rounded-xl active:scale-90 transition-all"
            >
              {showMenu ? <X size={22} /> : <Menu size={22} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Trophy className="text-white" size={20} />
              </div>
              <h1 className={`text-base font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>
                English Mastery
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBackupModal(true)}
              className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-700 active:bg-gray-600' : 'bg-gray-100 active:bg-gray-200'} transition-all active:scale-90`}
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => setShowReportModal(true)}
              className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-700 active:bg-gray-600' : 'bg-gray-100 active:bg-gray-200'} transition-all active:scale-90`}
            >
              <FileText size={18} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-all active:scale-90`}
            >
              {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-700" />}
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {showMenu && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setShowMenu(false)}
          style={{ top: '57px' }}
        />
      )}

      <div className="flex pt-[57px]">
        {/* Sidebar */}
        <aside className={`
          fixed top-[57px] left-0 h-[calc(100vh-57px)]
          w-64 ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4
          transform transition-transform duration-300 ease-in-out z-40
          ${showMenu ? 'translate-x-0' : '-translate-x-full'}
          shadow-xl overflow-y-auto
        `}>
          <nav className="space-y-2">
            <button
              onClick={() => {
                setCurrentView('library');
                setShowMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm active:scale-95 ${
                currentView === 'library'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 active:bg-gray-700' : 'text-gray-700 active:bg-gray-50'
              }`}
            >
              <BookOpen size={20} />
              <span>Library</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('mywords');
                setShowMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm active:scale-95 ${
                currentView === 'mywords'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 active:bg-gray-700' : 'text-gray-700 active:bg-gray-50'
              }`}
            >
              <Star size={20} />
              <span>My Words</span>
              {Object.keys(getAllImportantWords()).length > 0 && (
                <span className="ml-auto bg-yellow-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {Object.keys(getAllImportantWords()).length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setCurrentView('progress');
                setShowMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm active:scale-95 ${
                currentView === 'progress'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 active:bg-gray-700' : 'text-gray-700 active:bg-gray-50'
              }`}
            >
              <TrendingUp size={20} />
              <span>Progress</span>
            </button>
            <button
              onClick={() => {
                setCurrentView('calendar');
                setShowMenu(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium text-sm active:scale-95 ${
                currentView === 'calendar'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                  : darkMode ? 'text-gray-300 active:bg-gray-700' : 'text-gray-700 active:bg-gray-50'
              }`}
            >
              <Calendar size={20} />
              <span>Calendar</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 w-full min-h-[calc(100vh-57px)]">
          {currentView === 'library' && (
            <div>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    Your Speeches
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Master English by repetition
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl active:scale-95 transition-all font-medium text-sm shadow-lg"
                >
                  <Plus size={20} />
                  <span className="hidden xs:inline">Add</span>
                </button>
              </div>
              
              {speeches.length === 0 ? (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-24 h-24 mx-auto mb-5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                    <BookOpen size={40} className="opacity-50" />
                  </div>
                  <p className="text-xl font-bold mb-3">No speeches yet</p>
                  <p className="mb-5 text-sm px-4">Add your first speech to start</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl active:scale-95 transition-all shadow-lg"
                  >
                    Add Your First Speech
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {speeches.map(speech => (
                    <SpeechCard key={speech.id} speech={speech} />
                  ))}
                </div>
              )}
            </div>
          )}

          {currentView === 'mywords' && (
            <div>
              <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                My Important Words
              </h2>
              <p className={`mb-5 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Words marked with a star
              </p>

              {Object.keys(getAllImportantWords()).length === 0 ? (
                <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className={`w-24 h-24 mx-auto mb-5 rounded-full ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} flex items-center justify-center`}>
                    <Star size={40} className="opacity-50" />
                  </div>
                  <p className="text-xl font-bold mb-3">No important words yet</p>
                  <p className="text-sm px-4">Star words while studying to add them here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(getAllImportantWords()).sort().map(([word, sources]) => (
                    <div
                      key={word}
                      className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {word}
                        </h3>
                        <button
                          onClick={() => removeImportantWord(word)}
                          className={`p-2 rounded-lg transition-all active:scale-90 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <X size={18} className="text-red-500" />
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
                            <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} line-clamp-1 flex-1 mr-2`}>
                              {source.speechTitle}
                            </span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-bold flex-shrink-0 ${
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
              <h2 className={`text-2xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Your Progress
              </h2>
              
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <Volume2 className="text-blue-500 mb-2" size={22} />
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Listens</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {speeches.reduce((sum, s) => sum + s.listens, 0)}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <BookOpen className="text-green-500 mb-2" size={22} />
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Words</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {speeches.reduce((sum, s) => sum + s.knownWords.size, 0)}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <Star className="text-yellow-500 mb-2" size={22} />
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Important</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {Object.keys(getAllImportantWords()).length}
                  </p>
                </div>
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                  <Trophy className="text-purple-500 mb-2" size={22} />
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-1`}>Complete</p>
                  <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {speeches.filter(s => isComplete(s)).length}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {speeches.map(speech => {
                  const uniqueWords = getUniqueWords(speech.text);
                  const progress = getProgress(speech);
                  return (
                    <div key={speech.id} className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1 min-w-0 mr-3">
                          <h3 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-1`}>
                            {speech.title}
                          </h3>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-1`}>
                            {speech.speaker}
                          </p>
                        </div>
                        <p className={`text-2xl font-bold flex-shrink-0 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {progress}%
                        </p>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {speech.listens}/10
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Listens</p>
                        </div>
                        <div>
                          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {getDaysStudied(speech)}/7
                          </p>
                          <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days</p>
                        </div>
                        <div>
                          <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
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
              <h2 className={`text-2xl font-bold mb-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Study Calendar
              </h2>

              <div className={`p-4 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl mb-5`}>
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => navigateMonth(-1)}
                    className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-700 active:bg-gray-600' : 'bg-gray-100 active:bg-gray-200'} transition-all active:scale-90`}
                  >
                    <ChevronRight size={20} className="transform rotate-180" />
                  </button>
                  
                  <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {calendarDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  
                  <button
                    onClick={() => navigateMonth(1)}
                    className={`p-2.5 rounded-xl ${darkMode ? 'bg-gray-700 active:bg-gray-600' : 'bg-gray-100 active:bg-gray-200'} transition-all active:scale-90`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-3">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} className={`text-center font-bold py-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
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
                        disabled={isFuture}
                        className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-medium transition-all active:scale-90 ${
                          isFuture
                            ? darkMode ? 'bg-gray-900 text-gray-600' : 'bg-gray-50 text-gray-400'
                            : isStudied
                            ? 'bg-green-500 text-white active:bg-green-600 shadow-lg'
                            : isPast
                            ? 'bg-red-500 text-white opacity-60'
                            : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
                      >
                        <span className="font-bold">{day.getDate()}</span>
                        {isStudied && (
                          <span className="text-[9px]">{isStudied.length}</span>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-3 mt-4 text-xs flex-wrap justify-center">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-green-500 rounded-lg"></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Studied</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-red-500 opacity-60 rounded-lg"></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Missed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 bg-blue-500 rounded-lg ring-2 ring-blue-500"></div>
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Today</span>
                  </div>
                </div>
              </div>

              {selectedCalendarDay && (
                <div className={`p-4 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl mb-5`}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {new Date(selectedCalendarDay.date).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <button
                      onClick={() => setSelectedCalendarDay(null)}
                      className={`p-2 rounded-xl active:scale-90 transition-all ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Speeches studied:
                  </p>
                  <div className="space-y-2">
                    {selectedCalendarDay.speeches.map((speechTitle, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-green-50'} flex items-center gap-2`}
                      >
                        <BookOpen className="text-green-500 flex-shrink-0" size={18} />
                        <span className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-1`}>
                          {speechTitle}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`p-4 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
                <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Monthly Stats
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-green-50'}`}>
                    <p className="text-2xl font-bold text-green-500 mb-1">
                      {Object.keys(getAllStudyDays()).filter(day => {
                        const d = new Date(day);
                        return d.getMonth() === calendarDate.getMonth() && d.getFullYear() === calendarDate.getFullYear();
                      }).length}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Studied</p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-red-50'}`}>
                    <p className="text-2xl font-bold text-red-500 mb-1">
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
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Missed</p>
                  </div>
                  <div className={`p-4 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
                    <p className="text-2xl font-bold text-blue-500 mb-1">
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
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rate</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'study' && selectedSpeech && (
            <div>
              <button
                onClick={() => setCurrentView('library')}
                className={`mb-4 flex items-center gap-2 font-medium text-sm active:scale-95 transition-all ${darkMode ? 'text-gray-400 active:text-white' : 'text-gray-600 active:text-gray-900'}`}
              >
                <ChevronRight size={18} className="transform rotate-180" />
                Back to Library
              </button>

              <div className={`p-4 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl mb-5`}>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex-1 min-w-0 mr-3">
                    <h2 className={`text-xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                      {selectedSpeech.title}
                    </h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} line-clamp-1`}>
                      {selectedSpeech.speaker}
                    </p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <CircularProgress value={getProgress(selectedSpeech)} size={70} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {getProgress(selectedSpeech)}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-5">
                  <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
                    <p className={`text-xl font-bold mb-1 ${selectedSpeech.listens >= 10 ? 'text-green-500' : 'text-blue-500'}`}>
                      {selectedSpeech.listens}/10
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Listened</p>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-purple-50'}`}>
                    <p className={`text-xl font-bold mb-1 ${getDaysStudied(selectedSpeech) >= 7 ? 'text-green-500' : 'text-purple-500'}`}>
                      {getDaysStudied(selectedSpeech)}/7
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Days</p>
                  </div>
                  <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-gray-900' : 'bg-green-50'}`}>
                    <p className={`text-xl font-bold mb-1 text-green-500`}>
                      {selectedSpeech.knownWords.size}/{getUniqueWords(selectedSpeech.text).length}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Words</p>
                  </div>
                </div>

                {selectedSpeech.youtubeUrl && (
                  <a
                    href={selectedSpeech.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full mb-4 px-4 py-3.5 bg-red-500 text-white rounded-xl active:bg-red-600 transition-all font-bold text-base shadow-lg active:scale-[0.98]"
                  >
                    <ExternalLink size={20} />
                    Watch on YouTube
                  </a>
                )}

                <button
                  onClick={incrementListen}
                  className="w-full px-4 py-3.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl active:shadow-xl transition-all font-bold text-base flex items-center justify-center gap-2 mb-5 active:scale-[0.98] shadow-lg"
                >
                  <Volume2 size={20} />
                  I Listened ({selectedSpeech.listens})
                </button>

                <CalendarView speech={selectedSpeech} />
              </div>

              <div className={`p-4 rounded-3xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-2xl`}>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Vocabulary
                </h3>
                
                <div className={`p-3 rounded-xl mb-4 ${darkMode ? 'bg-gray-900' : 'bg-blue-50'}`}>
                  <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1.5`}>
                    <strong>How to use:</strong>
                  </p>
                  <ul className={`text-xs space-y-0.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li><strong>Red</strong> - Click to mark as known</li>
                    <li><strong>Green</strong> - Click to mark as unknown</li>
                    <li><strong>Star</strong> - Save to My Words</li>
                    <li><strong>Check</strong> - Mark as easy (hide)</li>
                  </ul>
                </div>

                {(() => {
                  const allWords = getUniqueWords(selectedSpeech.text);
                  const filteredWords = allWords.filter(word => !isEasyWord(word));
                  const unknownWords = filteredWords.filter(word => {
                    const stem = stemWord(word);
                    return !Array.from(selectedSpeech.knownWords).some(kw => stemWord(kw) === stem);
                  });
                  const knownWords = filteredWords.filter(word => {
                    const stem = stemWord(word);
                    return Array.from(selectedSpeech.knownWords).some(kw => stemWord(kw) === stem);
                  });

                  return (
                    <>
                      {unknownWords.length > 0 && (
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              To Learn
                            </h4>
                            <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
                              {unknownWords.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {unknownWords.map((word, idx) => {
                              const isImportant = (selectedSpeech.importantWords || new Set()).has(word);
                              return (
                                <div key={idx} className="relative group">
                                  <button
                                    onClick={() => toggleWord(word)}
                                    className={`px-3 py-2.5 rounded-xl font-medium transition-all text-sm whitespace-nowrap bg-red-500 text-white active:scale-95 min-h-[44px] ${
                                      isImportant ? 'ring-2 ring-yellow-400' : ''
                                    }`}
                                  >
                                    {word}
                                  </button>
                                  <div className="absolute -top-1 -right-1 flex gap-0.5">
                                    <button
                                      onClick={(e) => toggleImportantWord(word, e)}
                                      className={`p-1.5 rounded-full transition-all shadow-lg active:scale-90 ${
                                        isImportant
                                          ? 'bg-yellow-400 text-white'
                                          : 'bg-gray-300 text-gray-600 opacity-0 group-hover:opacity-100'
                                      }`}
                                    >
                                      <Star size={12} fill={isImportant ? 'white' : 'none'} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleEasyWord(word);
                                      }}
                                      className="p-1.5 rounded-full bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg text-[10px] font-bold active:scale-90"
                                    >
                                      ✓
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {knownWords.length > 0 && (
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              You Know
                            </h4>
                            <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                              {knownWords.length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {knownWords.map((word, idx) => {
                              const isImportant = (selectedSpeech.importantWords || new Set()).has(word);
                              return (
                                <div key={idx} className="relative group">
                                  <button
                                    onClick={() => toggleWord(word)}
                                    className={`px-3 py-2.5 rounded-xl font-medium transition-all text-sm whitespace-nowrap bg-green-500 text-white shadow-lg active:scale-95 min-h-[44px] ${
                                      isImportant ? 'ring-2 ring-yellow-400' : ''
                                    }`}
                                  >
                                    {word}
                                  </button>
                                  <div className="absolute -top-1 -right-1 flex gap-0.5">
                                    <button
                                      onClick={(e) => toggleImportantWord(word, e)}
                                      className={`p-1.5 rounded-full transition-all shadow-lg active:scale-90 ${
                                        isImportant
                                          ? 'bg-yellow-400 text-white'
                                          : 'bg-gray-300 text-gray-600 opacity-0 group-hover:opacity-100'
                                      }`}
                                    >
                                      <Star size={12} fill={isImportant ? 'white' : 'none'} />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleEasyWord(word);
                                      }}
                                      className="p-1.5 rounded-full bg-blue-500 text-white opacity-0 group-hover:opacity-100 transition-all shadow-lg text-[10px] font-bold active:scale-90"
                                    >
                                      ✓
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {allWords.some(word => isEasyWord(word)) && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`text-base font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              Easy (Hidden)
                            </h4>
                            <span className={`px-2.5 py-1 rounded-full font-bold text-xs ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                              {allWords.filter(word => isEasyWord(word)).length}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {allWords.filter(word => isEasyWord(word)).map((word, idx) => (
                              <div key={idx} className="relative group">
                                <button
                                  onClick={() => toggleEasyWord(word)}
                                  className="px-3 py-2.5 rounded-xl font-medium transition-all text-sm whitespace-nowrap bg-blue-500 text-white opacity-60 active:opacity-100 active:scale-95 min-h-[44px]"
                                >
                                  {word}
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleEasyWord(word);
                                  }}
                                  className="absolute -top-1 -right-1 p-1.5 rounded-full bg-red-500 text-white transition-all shadow-lg opacity-0 group-hover:opacity-100 text-[10px] font-bold active:scale-90"
                                >
                                  ✕
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className={`p-3 rounded-xl ${darkMode ? 'bg-gray-900' : 'bg-purple-50'}`}>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          <strong>Progress:</strong> {knownWords.length} known / {filteredWords.length} total
                          {allWords.filter(word => isEasyWord(word)).length > 0 && 
                            ` (${allWords.filter(word => isEasyWord(word)).length} easy hidden)`
                          }
                        </p>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default EnglishMasteryPWA;