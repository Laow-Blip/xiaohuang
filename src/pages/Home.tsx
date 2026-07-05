import { 
  BookOpen, 
  PenTool, 
  FileText, 
  Zap, 
  TrendingUp,
  Clock,
  Target,
  ChevronRight,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { chapters, dailyQuestions } from '../data/mockData';
import { useStore } from '../store/useStore';

export function Home() {
  const { user, progress, wrongQuestions } = useStore();
  
  const totalChapters = chapters.length;
  const completedChapters = progress.filter(p => p.completed).length;
  const overallProgress = Math.round((completedChapters / totalChapters) * 100);
  
  const today = new Date().toLocaleDateString('zh-CN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-maogai-600 to-maogai-700 rounded-2xl p-8 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-maogai-200 text-sm mb-2">{today}</p>
            <h1 className="text-3xl font-bold mb-4">
              {user.isLoggedIn ? `你好，${user.name}！` : '欢迎来到毛概复习系统'}
            </h1>
            <p className="text-maogai-100 mb-6 max-w-xl">
              系统提供最新的毛泽东思想和中国特色社会主义理论体系概论复习资料，
              帮助您高效备考，轻松过关。
            </p>
            <div className="flex gap-4">
              <Link
                to="/materials"
                className="flex items-center gap-2 px-6 py-3 bg-white text-maogai-600 rounded-lg font-semibold hover:bg-maogai-50 transition-all"
              >
                <BookOpen className="w-5 h-5" />
                开始学习
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/practice"
                className="flex items-center gap-2 px-6 py-3 bg-maogai-500 text-white rounded-lg font-semibold hover:bg-maogai-600 transition-all border border-maogai-400"
              >
                <PenTool className="w-5 h-5" />
                每日一练
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold">{overallProgress}%</div>
                <div className="text-sm text-maogai-200">学习进度</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs text-gray-400">复习资料</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{chapters.length}</div>
          <div className="text-sm text-gray-500">章节目录</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs text-gray-400">题库总量</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">200+</div>
          <div className="text-sm text-gray-500">精选题目</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-xs text-gray-400">已完成</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{completedChapters}/{totalChapters}</div>
          <div className="text-sm text-gray-500">章节完成</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-xs text-gray-400">错题本</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{wrongQuestions.length}</div>
          <div className="text-sm text-gray-500">待复习错题</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">学习进度</h2>
            <Link to="/materials" className="text-maogai-600 text-sm hover:text-maogai-700 flex items-center gap-1">
              查看全部 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {chapters.slice(0, 4).map((chapter) => {
              const chapterProgress = progress.find(p => p.chapterId === chapter.id);
              const progressPercent = chapterProgress?.progress || 0;
              return (
                <div key={chapter.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{chapter.title}</span>
                    <span className="text-sm text-gray-500">{progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-maogai-500 rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">每日一练</h2>
            <Link to="/practice" className="text-maogai-600 text-sm hover:text-maogai-700 flex items-center gap-1">
              开始练习 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="w-5 h-5 text-maogai-500" />
              <span className="text-sm text-gray-500">今日推荐 {dailyQuestions.length} 题</span>
            </div>
            {dailyQuestions.slice(0, 2).map((question, index) => (
              <div key={question.id} className="mb-4 last:mb-0 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    question.type === 'single' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {index + 1}
                  </span>
                  <p className="text-sm text-gray-700 flex-1">{question.content}</p>
                </div>
                <div className="mt-2 ml-8 text-xs text-gray-400">
                  {question.type === 'single' ? '单选题' : '多选题'} · 难度{'★'.repeat(question.difficulty)}
                </div>
              </div>
            ))}
            <Link
              to="/practice"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-maogai-50 text-maogai-600 rounded-lg hover:bg-maogai-100 transition-all font-medium"
            >
              <PenTool className="w-4 h-4" />
              开始答题
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">快速导航</h2>
        </div>
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {[
            { path: '/materials', icon: BookOpen, label: '复习资料', color: 'blue' },
            { path: '/practice', icon: PenTool, label: '章节练习', color: 'green' },
            { path: '/exam', icon: FileText, label: '模拟考试', color: 'purple' },
            { path: '/wrong-book', icon: Zap, label: '错题本', color: 'red' },
          ].map((item) => {
            const Icon = item.icon;
            const colorMap = {
              blue: 'bg-blue-50 text-blue-600',
              green: 'bg-green-50 text-green-600',
              purple: 'bg-purple-50 text-purple-600',
              red: 'bg-red-50 text-red-600',
            };
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl ${colorMap[item.color as keyof typeof colorMap]} hover:scale-105 transition-transform`}
              >
                <Icon className="w-8 h-8" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">准备好开始复习了吗？</h3>
            <p className="text-gray-500">系统包含最新考试大纲内容，助您轻松备考</p>
          </div>
          <div className="flex gap-4">
            <Link
              to="/materials"
              className="px-6 py-3 bg-maogai-600 text-white rounded-lg font-semibold hover:bg-maogai-700 transition-all"
            >
              开始学习
            </Link>
            <Link
              to="/exam"
              className="px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              模拟考试
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
