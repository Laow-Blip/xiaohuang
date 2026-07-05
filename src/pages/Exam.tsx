import { useState, useEffect } from 'react';
import { FileText, Clock, AlertCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { useStore } from '../store/useStore';
import { questions } from '../data/mockData';

export function Exam() {
  const { addWrongQuestion } = useStore();
  
  const [isStarted, setIsStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(60 * 60);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  
  const examQuestions = questions.filter(q => q.type === 'single' || q.type === 'multiple').slice(0, 30);
  
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isStarted && !isFinished && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, isFinished, timeRemaining]);

  const handleStart = () => {
    setIsStarted(true);
    setTimeRemaining(60 * 60);
    setSelectedAnswers({});
  };

  const handleOptionClick = (questionId: string, option: string) => {
    const question = examQuestions.find(q => q.id === questionId);
    if (!question || isFinished) return;
    
    if (question.type === 'single') {
      setSelectedAnswers(prev => ({ ...prev, [questionId]: option }));
    } else {
      const current = selectedAnswers[questionId] || '';
      if (current.includes(option)) {
        setSelectedAnswers(prev => ({ 
          ...prev, 
          [questionId]: current.replace(option, '') 
        }));
      } else {
        setSelectedAnswers(prev => ({ 
          ...prev, 
          [questionId]: [...current.split('').sort(), option].join('') 
        }));
      }
    }
  };

  const handleSubmit = () => {
    setIsFinished(true);
    Object.entries(selectedAnswers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (question && answer !== question.answer) {
        addWrongQuestion(questionId);
      }
    });
  };

  const handleReset = () => {
    setIsStarted(false);
    setIsFinished(false);
    setTimeRemaining(60 * 60);
    setSelectedAnswers({});
  };

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

  const correctCount = Object.entries(selectedAnswers).filter(([id, ans]) => 
    questions.find(q => q.id === id)?.answer === ans
  ).length;
  const score = Math.round((correctCount / examQuestions.length) * 100);

  return (
    <div className="space-y-6">
      {!isStarted && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-maogai-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText className="w-10 h-10 text-maogai-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">模拟考试</h1>
            <p className="text-gray-500 mb-8">
              本次考试共 {examQuestions.length} 道题目，包括单选题和多选题，考试时间60分钟。
              请认真答题，考试结束后可以查看答题解析。
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-maogai-600">{examQuestions.length}</div>
                <div className="text-sm text-gray-500">题目数量</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">60分钟</div>
                <div className="text-sm text-gray-500">考试时间</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">100分</div>
                <div className="text-sm text-gray-500">总分</div>
              </div>
            </div>
            
            <button
              onClick={handleStart}
              className="px-8 py-4 bg-maogai-600 text-white rounded-xl font-semibold hover:bg-maogai-700 transition-all text-lg"
            >
              开始考试
            </button>
          </div>
        </div>
      )}

      {(isStarted || isFinished) && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className={`p-4 border-b ${timeRemaining <= 600 ? 'bg-red-50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-gray-900">模拟考试</h1>
                <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
                  第 {examQuestions.length} 题
                </span>
              </div>
              <div className={`flex items-center gap-2 ${timeRemaining <= 600 ? 'text-red-600' : 'text-gray-600'}`}>
                <Clock className="w-5 h-5" />
                <span className="text-xl font-mono font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            {isFinished ? (
              <div className="text-center max-w-2xl mx-auto">
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                  score >= 60 ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {score >= 60 ? (
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-600" />
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">考试结束</h2>
                <div className="text-6xl font-bold text-maogai-600 mb-2">{score}</div>
                <div className="text-gray-500 mb-8">得分</div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="text-xl font-bold text-gray-900">{examQuestions.length}</div>
                    <div className="text-sm text-gray-500">总题数</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-xl font-bold text-green-600">{correctCount}</div>
                    <div className="text-sm text-green-600">正确</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-xl font-bold text-red-600">{examQuestions.length - correctCount}</div>
                    <div className="text-sm text-red-600">错误</div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 px-6 py-3 bg-maogai-600 text-white rounded-xl font-semibold hover:bg-maogai-700 transition-all mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  重新考试
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {examQuestions.map((question, index) => {
                  const isSelected = selectedAnswers[question.id];
                  const options = question.options;
                  
                  return (
                    <div key={question.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start gap-4 mb-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          question.type === 'single' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                              {question.type === 'single' ? '单选题' : '多选题'}
                            </span>
                          </div>
                          <p className="text-gray-800">{question.content}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {options.map((option, optIndex) => {
                          const label = getOptionLabel(optIndex);
                          const selected = isSelected?.includes(label);
                          
                          return (
                            <button
                              key={label}
                              onClick={() => handleOptionClick(question.id, label)}
                              className={`flex items-center gap-3 p-3 rounded-lg border-2 text-left transition-all ${
                                selected 
                                  ? 'border-maogai-500 bg-maogai-50' 
                                  : 'border-gray-200 hover:border-maogai-300 hover:bg-maogai-50'
                              }`}
                            >
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                                selected 
                                  ? 'bg-maogai-500 text-white' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {label}
                              </span>
                              <span className="text-gray-700">{option}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                <button
                  onClick={handleSubmit}
                  className="w-full py-4 bg-maogai-600 text-white rounded-xl font-semibold hover:bg-maogai-700 transition-all text-lg"
                >
                  提交试卷
                </button>
                
                <div className="flex items-center gap-2 p-4 bg-yellow-50 rounded-lg text-yellow-700">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-sm">
                    已答 {Object.keys(selectedAnswers).length}/{examQuestions.length} 题，确认提交后无法修改
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
