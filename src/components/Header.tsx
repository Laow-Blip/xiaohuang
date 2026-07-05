import { Bell, Search, User, Menu } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, login, logout, showLoginModal, setShowLoginModal } = useStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (email && name) {
      login(email, name);
      setShowLoginModal(false);
      setEmail('');
      setName('');
    }
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative hidden md:block">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索复习资料..."
              className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maogai-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-maogai-500 rounded-full"></span>
          </button>

          {user.isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span className="text-gray-700 font-medium">{user.name}</span>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">退出</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-maogai-600 text-white rounded-lg hover:bg-maogai-700 transition-all"
            >
              <User className="w-4 h-4" />
              <span className="text-sm">登录</span>
            </button>
          )}
        </div>
      </header>

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">用户登录</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maogai-500"
                  placeholder="请输入邮箱"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maogai-500"
                  placeholder="请输入昵称"
                />
              </div>
              <button
                onClick={handleLogin}
                className="w-full py-3 bg-maogai-600 text-white rounded-lg hover:bg-maogai-700 transition-all font-medium"
              >
                登录
              </button>
              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full py-3 text-gray-500 hover:text-gray-700 transition-all"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
