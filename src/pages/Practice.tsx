import { useState } from 'react';
import { PenTool, ChevronLeft, ChevronRight, CheckCircle, XCircle, Lightbulb, RotateCcw, BookOpen, ArrowRight, Play } from 'lucide-react';
import { useParams, Link } from 'react-router-dom';
import { questions, chapters } from '../data/mockData';
import { useStore } from '../store/useStore';

export function Practice() {
  const { chapterId } = useParams<{ chapterId: string }>();

  if (!chapterId) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
          <h1 className="text-2xl font-bold mb-2">刷题中心</h1>
          <p className="text-blue-100">选择一个章节开始练习，巩固知识点</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {chapters.map((chapter) => {
            const chapterQuestions = questions.filter(q => q.chapterId === chapter.id && (q.type === 'single' || q.type === 'multiple'));
            return (
              <Link
                to={`/practice/chapter/${chapter.id}`}
                key={chapter.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <BookOpen className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">{chapter.subtitle}</div>
                      <div className="text-lg font-semibold text-gray-900">{chapter.title}</div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                    {chapterQuestions.length}题
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">点击开始练习</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">综合练习</h3>
              <p className="text-sm text-gray-500">随机抽取各章节题目进行综合练习</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              包含 {questions.filter(q => q.type === 'single' || q.type === 'multiple').length} 道题目
            </div>
            <Link
              to="/practice/chapter/0"
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-all"
            >
              <Play className="w-5 h-5" />
              开始综合练习
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { addWrongQuestion, user } = useStore();
  
  const filteredQuestions = chapterId === '0'
    ? questions.filter(q => q.type === 'single' || q.type === 'multiple')
    : questions.filter(q => q.chapterId === parseInt(chapterId) && (q.type === 'single' || q.type === 'multiple'));
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  
  const currentQuestion = filteredQuestions[currentIndex];
  const answeredCount = answeredQuestions.size;
  const totalCount = filteredQuestions.length;
  const progressPercent = Math.round((answeredCount / totalCount) * 100);
  
  const chapter = chapterId !== '0' ? chapters.find(c => c.id === parseInt(chapterId)) : null;

  const handleOptionClick = (option: string) => {
    if (showResults) return;
    
    if (currentQuestion.type === 'single') {
      setSelectedAnswers(prev => ({ ...prev, [currentQuestion.id]: option }));
      setAnsweredQuestions(prev => new Set([...prev, currentQuestion.id]));
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
    Object.entries(selectedAnswers).forEach(([questionId, answer]) => {
      const question = questions.find(q => q.id === questionId);
      if (question && answer !== question.answer) {
        addWrongQuestion(questionId);
      }
    });
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setAnsweredQuestions(new Set());
  };

  const isCorrect = () => {
    if (!selectedAnswers[currentQuestion.id]) return null;
    return selectedAnswers[currentQuestion.id] === currentQuestion.answer;
  };

  const getOptionLabel = (index: number) => {
    return String.fromCharCode(65 + index);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-900">
              {chapter ? `${chapter.subtitle} ${chapter.title}` : '综合练习'}
            </h1>
            <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm">
              {chapterId === '0' ? '综合练习' : '章节练习'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              已答 {answeredCount}/{totalCount}
            </span>
            <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-maogai-500 rounded-full transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {currentQuestion && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
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

            <div className="space-y-3">
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
              <div className={`p-4 rounded-xl ${isCorrect() ? 'bg-green-50' : 'bg-red-50'}`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect() ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${isCorrect() ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect() ? '回答正确！' : '回答错误'}
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
                onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-5 h-5" />
                上一题
              </button>

              <div className="flex items-center gap-2">
                {filteredQuestions.map((q, index) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                      index === currentIndex 
                        ? 'bg-maogai-500 text-white' 
                        : answeredQuestions.has(q.id)
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentIndex === totalCount - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-maogai-600 text-white rounded-lg hover:bg-maogai-700 transition-all"
                >
                  提交答案
                </button>
              ) : (
                <button
                  onClick={() => setCurrentIndex(prev => Math.min(totalCount - 1, prev + 1))}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-all"
                >
                  下一题
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        )}

        {showResults && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">答题结果</h2>
              <button
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                重新练习
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
                <div className="text-sm text-gray-500">总题数</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-green-600">
                  {Object.entries(selectedAnswers).filter(([id, ans]) => 
                    questions.find(q => q.id === id)?.answer === ans
                  ).length}
                </div>
                <div className="text-sm text-gray-500">正确</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-red-600">
                  {totalCount - answeredCount + Object.entries(selectedAnswers).filter(([id, ans]) => 
                    questions.find(q => q.id === id)?.answer !== ans
                  ).length}
                </div>
                <div className="text-sm text-gray-500">错误</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl font-bold text-maogai-600">
                  {Math.round((Object.entries(selectedAnswers).filter(([id, ans]) => 
                    questions.find(q => q.id === id)?.answer === ans
                  ).length / totalCount) * 100)}%
                </div>
                <div className="text-sm text-gray-500">正确率</div>
              </div>
            </div>
            {!user.isLoggedIn && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg text-yellow-700 text-sm">
                登录后可以保存答题记录和错题本，方便后续复习
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
