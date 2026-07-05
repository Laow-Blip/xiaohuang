import { 
  Home, 
  BookOpen, 
  PenTool, 
  FileText, 
  User, 
  ChevronRight,
  GraduationCap,
  Zap,
  X
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { chapters } from '../data/mockData';
import { useStore } from '../store/useStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { selectedChapter, setSelectedChapter } = useStore();
  
  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/materials', icon: BookOpen, label: '复习资料' },
    { path: '/practice', icon: PenTool, label: '刷题中心' },
    { path: '/exam', icon: FileText, label: '模拟考试' },
    { path: '/wrong-book', icon: Zap, label: '错题本' },
    { path: '/profile', icon: User, label: '个人中心' },
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside className={`fixed lg:static w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen z-50 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-maogai-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">毛概复习系统</h1>
              <p className="text-xs text-gray-500">高效备考 轻松过关</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === '/practice' && location.pathname.startsWith('/practice/'));
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={onClose}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-maogai-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {location.pathname === '/materials' && (
            <div className="mt-6">
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                章节列表
              </h3>
              <ul className="mt-2 space-y-1">
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <button
                      onClick={() => setSelectedChapter(chapter.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
                        selectedChapter === chapter.id
                          ? 'bg-maogai-100 text-maogai-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="text-sm truncate">{chapter.title}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {location.pathname === '/practice' && (
            <div className="mt-6">
              <h3 className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                章节练习
              </h3>
              <ul className="mt-2 space-y-1">
                {chapters.map((chapter) => (
                  <li key={chapter.id}>
                    <Link
                      to={`/practice/chapter/${chapter.id}`}
                      onClick={onClose}
                      className="w-full flex items-center justify-between px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all"
                    >
                      <span className="text-sm truncate">{chapter.title}</span>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                        {chapter.questionCount}题
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}
