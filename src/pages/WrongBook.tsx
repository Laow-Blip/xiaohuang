import { useState } from 'react';
import { Zap, Trash2, RotateCcw, CheckCircle, XCircle, Lightbulb, ChevronRight } from 'lucide-react';
import { questions } from '../data/mockData';
import { useStore } from '../store/useStore';

export function WrongBook() {
  const { wrongQuestions, removeWrongQuestion, addWrongQuestion } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [practiceMode, setPracticeMode] = useState(false);
  
  const wrongQuestionDetails = wrongQuestions.map(wq => {
    const question = questions.find(q => q.id === wq.questionId);
    return question ? { ...wq, question } : null;
  }).filter(Boolean) as Array<{ id: string; questionId: string; wrongCount: number; lastWrong: string; question: typeof questions[0] }>;

  const currentQuestion = practiceMode && wrongQuestionDetails[currentIndex]?.question;

  const handleOptionClick = (option: string) => {
    if (!currentQuestion || showResults) return;
    
    if (currentQuestion.type === 'single') {
      setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
    } else {
      const current = selectedAnswers[currentQuestion.id] || '';
      if (current.includes(option)) {
        setSelectedAnswers(prev => ({ 
          ...prev, 
          [currentQuestion.id]: current.replace(option, '') 
        }));
      } else {
        setSelectedAnswers(prev => ({ 
          ...prev, 
          [currentQuestion.id]: [...current.split('').sort(), option].join('') 
        }));
      }
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
    if (currentQuestion) {
      const answer = selectedAnswers[currentQuestion.id];
      if (answer !== currentQuestion.answer) {
        addWrongQuestion(currentQuestion.id);
      } else {
        removeWrongQuestion(currentQuestion.id);
      }
    }
  };

  const handleNext = () => {
    setShowResults(false);
    setSelectedAnswers(prev => ({ ...prev, [currentQuestion?.id || '']: '' }));
    if (currentIndex < wrongQuestionDetails.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setPracticeMode(false);
      setCurrentIndex(0);
    }
  };

  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);

  const isCorrect = () => {
    if (!currentQuestion || !selectedAnswers[currentQuestion.id]) return null;
    return selectedAnswers[currentQuestion.id] === currentQuestion.answer;
  };

  return (
    <div className="space-y-6">
      {!practiceMode && (
        <>
          <div className="bg-gradient-to-r from-maogai-600 to-maogai-700 rounded-xl p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">错题本</h1>
                <p className="text-maogai-100">共 {wrongQuestionDetails.length} 道错题待复习</p>
              </div>
              {wrongQuestionDetails.length > 0 && (
                <button
                  onClick={() => setPracticeMode(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-white text-maogai-600 rounded-lg font-semibold hover:bg-maogai-50 transition-all"
                >
                  <RotateCcw className="w-5 h-5" />
                  开始复习
                </button>
              )}
            </div>
          </div>

          {wrongQuestionDetails.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
              <Zap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">暂无错题</h3>
              <p className="text-gray-400">做题时答错的题目会自动收集到这里</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wrongQuestionDetails.map((item) => {
                const { question } = item;
                return (
                  <div key={question.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        question.type === 'single' 
                          ? 'bg-blue-100 text-blue-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {question.type === 'single' ? '单选题' : '多选题'}
                      </span>
                      <button
                        onClick={() => removeWrongQuestion(question.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 mb-4 line-clamp-3">{question.content}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">
                        错误 {item.wrongCount} 次
                      </span>
                      <span className="text-gray-400">
                        难度 {'★'.repeat(question.difficulty)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {practiceMode && wrongQuestionDetails.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-lg font-semibold text-gray-900">错题复习</h1>
                <span className="text-sm text-gray-500">
                  {currentIndex + 1}/{wrongQuestionDetails.length}
                </span>
              </div>
              <button
                onClick={() => {
                  setPracticeMode(false);
                  setCurrentIndex(0);
                  setShowResults(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                退出复习
              </button>
            </div>
          </div>

          {currentQuestion && (
            <div className="p-8">
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    currentQuestion.type === 'single' 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-green-100 text-green-600'
                  }`}>
                    {currentIndex + 1}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-gray-200 rounded">
                        {currentQuestion.type === 'single' ? '单选题' : '多选题'}
                      </span>
                      <span className="text-xs text-gray-400">
                        难度 {'★'.repeat(currentQuestion.difficulty)}
                      </span>
                    </div>
                    <p className="text-gray-800 text-lg">{currentQuestion.content}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const label = getOptionLabel(index);
                  const isSelected = selectedAnswers[currentQuestion.id]?.includes(label);
                  const correct = currentQuestion.answer.includes(label);
                  let optionClass = 'border-gray-200 hover:border-maogai-300 hover:bg-maogai-50';
                  
                  if (showResults) {
                    if (correct) {
                      optionClass = 'border-green-500 bg-green-50';
                    } else if (isSelected && !correct) {
                      optionClass = 'border-red-500 bg-red-50';
                    }
                  } else if (isSelected) {
                    optionClass = 'border-maogai-500 bg-maogai-50';
                  }

                  return (
                    <button
                      key={label}
                      onClick={() => handleOptionClick(label)}
                      disabled={showResults}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${optionClass}`}
                    >
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        isSelected 
                          ? 'bg-maogai-500 text-white' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {label}
                      </span>
                      <span className="flex-1 text-gray-700">{option}</span>
                      {showResults && correct && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {showResults && isSelected && !correct && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </button>
                  );
                })}
              </div>

              {showResults && (
                <div className={`p-4 rounded-xl mb-6 ${isCorrect() ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {isCorrect() ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className={`font-medium ${isCorrect() ? 'text-green-700' : 'text-red-700'}`}>
                      {isCorrect() ? '回答正确！已从错题本移除' : '回答错误'}
                    </span>
                  </div>
                  {isCorrect() === false && (
                    <div className="text-sm text-gray-600">
                      <p className="mb-2"><span className="font-medium">正确答案：</span>{currentQuestion.answer}</p>
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5" />
                        <span><span className="font-medium">解析：</span>{currentQuestion.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setPracticeMode(false);
                    setCurrentIndex(0);
                    setShowResults(false);
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
                >
                  退出复习
                </button>

                {!showResults ? (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-maogai-600 text-white rounded-lg hover:bg-maogai-700 transition-all font-medium"
                  >
                    提交答案
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2 bg-maogai-600 text-white rounded-lg hover:bg-maogai-700 transition-all font-medium"
                  >
                    {currentIndex < wrongQuestionDetails.length - 1 ? '下一题' : '完成复习'}
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
