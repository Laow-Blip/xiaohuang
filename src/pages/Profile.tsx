import { User, BookOpen, PenTool, Clock, Target, TrendingUp, Settings, LogOut, ChevronRight, Award } from 'lucide-react';
import { useStore } from '../store/useStore';
import { chapters, questions } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Profile() {
  const { user, logout, progress, wrongQuestions, favorites, setShowLoginModal } = useStore();

  const totalChapters = chapters.length;
  const completedChapters = progress.filter(p => p.completed).length;
  const totalQuestions = questions.filter(q => q.type === 'single' || q.type === 'multiple').length;
  const studiedHours = Math.round(progress.length * 0.5);

  const chapterProgressData = chapters.map(chapter => {
    const chapterProgress = progress.find(p => p.chapterId === chapter.id);
    return {
      name: chapter.subtitle || `第${chapter.id}章`,
      progress: chapterProgress?.progress || 0,
      fullMark: 100,
    };
  });

  if (!user.isLoggedIn) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">请先登录</h2>
        <p className="text-gray-500 mb-6">登录后可以查看学习统计、收藏管理等功能</p>
        <button
          onClick={() => setShowLoginModal(true)}
          className="px-6 py-3 bg-maogai-600 text-white rounded-lg font-semibold hover:bg-maogai-700 transition-all"
        >
          前往登录
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-maogai-600 to-maogai-700 rounded-xl p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <User className="w-10 h-10" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{user.name}</h1>
            <p className="text-maogai-100 mb-4">{user.email}</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">初级学习者</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-white text-maogai-600 rounded-lg font-medium hover:bg-maogai-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              退出
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{completedChapters}/{totalChapters}</div>
          <div className="text-sm text-gray-500">已完成章节</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
          <div className="text-sm text-gray-500">题库总量</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{studiedHours}h</div>
          <div className="text-sm text-gray-500">学习时长</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{wrongQuestions.length}</div>
          <div className="text-sm text-gray-500">错题数量</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">学习进度</h2>
          </div>
          <div className="p-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chapterProgressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => [`${value}%`, '进度']}
                    contentStyle={{ borderRadius: '8px', border: 'none' }}
                  />
                  <Bar 
                    dataKey="progress" 
                    fill="#DC2626" 
                    radius={[4, 4, 0, 0]}
                    barSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900">学习统计</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">复习资料阅读</div>
                  <div className="text-xs text-gray-500">累计阅读材料</div>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {progress.reduce((acc, p) => acc + (p.progress > 0 ? 1 : 0), 0)}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <PenTool className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">题目练习</div>
                  <div className="text-xs text-gray-500">累计练习题目</div>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">
                {progress.length * 10}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Target className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">模拟考试</div>
                  <div className="text-xs text-gray-500">参加考试次数</div>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">2</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">正确率</div>
                  <div className="text-xs text-gray-500">综合正确率</div>
                </div>
              </div>
              <div className="text-xl font-bold text-gray-900">75%</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">收藏的资料</h2>
          {favorites.length > 0 && (
            <button className="text-maogai-600 text-sm hover:text-maogai-700">
              查看全部
            </button>
          )}
        </div>
        <div className="p-6">
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3" />
              <p>暂无收藏的资料</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favorites.slice(0, 6).map((id, index) => {
                const chapter = chapters.find(c => c.materials.some(m => m.id === id));
                const material = chapter?.materials.find(m => m.id === id);
                return material ? (
                  <div key={id} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-500">{chapter?.subtitle}</span>
                      <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded">收藏</span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-700">{material.title}</h3>
                  </div>
                ) : null;
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">学习记录</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {progress.slice(0, 5).map((item) => {
            const chapter = chapters.find(c => c.id === item.chapterId);
            return (
              <div key={item.chapterId} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-maogai-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-maogai-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">{chapter?.title}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(item.lastStudied).toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-maogai-500 rounded-full"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">{item.progress}%</span>
                </div>
              </div>
            );
          })}
          {progress.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <Clock className="w-12 h-12 mx-auto mb-3" />
              <p>暂无学习记录</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
