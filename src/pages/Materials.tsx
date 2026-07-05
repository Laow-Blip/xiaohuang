import { BookOpen, ChevronRight, Bookmark, CheckCircle, Clock } from 'lucide-react';
import { chapters } from '../data/mockData';
import { useStore } from '../store/useStore';

export function Materials() {
  const { selectedChapter, setSelectedChapter, selectedMaterial, setSelectedMaterial, progress, updateProgress, favorites, toggleFavorite } = useStore();

  const chapter = chapters.find(c => c.id === selectedChapter);
  const material = chapter?.materials.find(m => m.id === selectedMaterial);

  const handleMaterialSelect = (materialId: string) => {
    setSelectedMaterial(materialId);
    if (selectedChapter) {
      const chapterMaterials = chapters.find(c => c.id === selectedChapter)?.materials || [];
      const currentIndex = chapterMaterials.findIndex(m => m.id === materialId);
      const progressPercent = Math.round(((currentIndex + 1) / chapterMaterials.length) * 100);
      updateProgress(selectedChapter, progressPercent);
    }
  };

  const renderContent = (content: string) => {
    const parts = content.split(/(#{1,6}\s.+)/g);
    return parts.map((part, index) => {
      if (part.match(/^#{6}\s/)) {
        return <h6 key={index} className="text-sm font-bold text-gray-800 mt-4 mb-2">{part.replace(/^#{6}\s/, '')}</h6>;
      }
      if (part.match(/^#{5}\s/)) {
        return <h5 key={index} className="text-base font-bold text-gray-800 mt-5 mb-2">{part.replace(/^#{5}\s/, '')}</h5>;
      }
      if (part.match(/^#{4}\s/)) {
        return <h4 key={index} className="text-lg font-bold text-gray-800 mt-6 mb-3">{part.replace(/^#{4}\s/, '')}</h4>;
      }
      if (part.match(/^#{3}\s/)) {
        return <h3 key={index} className="text-xl font-bold text-gray-900 mt-7 mb-4">{part.replace(/^#{3}\s/, '')}</h3>;
      }
      if (part.match(/^#{2}\s/)) {
        return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-5">{part.replace(/^#{2}\s/, '')}</h2>;
      }
      if (part.match(/^#\s/)) {
        return <h1 key={index} className="text-3xl font-bold text-gray-900 mt-0 mb-6">{part.replace(/^#\s/, '')}</h1>;
      }
      if (part.trim()) {
        return (
          <div key={index} className="prose prose-sm max-w-none">
            {part.split('\n').map((line, lineIndex) => {
              if (line.match(/^\*\*\*.+/)) {
                return <p key={lineIndex} className="my-4 text-gray-600">{line.replace(/^\*\*\*/, '').replace(/\*\*\*/, '')}</p>;
              }
              if (line.match(/^-\s/)) {
                return (
                  <li key={lineIndex} className="ml-4 text-gray-700 mb-1">
                    <span className="text-maogai-500 mr-2">•</span>
                    {line.replace(/^-\s/, '')}
                  </li>
                );
              }
              if (line.match(/^\d+\.\s/)) {
                return (
                  <li key={lineIndex} className="ml-4 text-gray-700 mb-1">
                    <span className="text-maogai-600 font-medium mr-1">{line.match(/^\d+/)?.[0]}.</span>
                    {line.replace(/^\d+\.\s/, '')}
                  </li>
                );
              }
              if (line.trim()) {
                return <p key={lineIndex} className="text-gray-700 mb-4 leading-relaxed">{line}</p>;
              }
              return null;
            })}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      <div className="w-80 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">章节目录</h2>
        </div>
        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {chapters.map((ch) => {
            const chapterProgress = progress.find(p => p.chapterId === ch.id);
            const isSelected = selectedChapter === ch.id;
            return (
              <div key={ch.id}>
                <button
                  onClick={() => {
                    setSelectedChapter(ch.id);
                    setSelectedMaterial(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-all ${
                    isSelected ? 'bg-maogai-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className={`w-5 h-5 ${isSelected ? 'text-maogai-600' : 'text-gray-400'}`} />
                    <div className="text-left">
                      <div className={`text-sm font-medium ${isSelected ? 'text-maogai-700' : 'text-gray-700'}`}>
                        {ch.subtitle}
                      </div>
                      <div className={`text-xs ${isSelected ? 'text-maogai-500' : 'text-gray-500'}`}>
                        {ch.title}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {chapterProgress?.completed && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                {isSelected && (
                  <div className="bg-gray-50">
                    {ch.materials.map((mat) => {
                      const isMaterialSelected = selectedMaterial === mat.id;
                      const isFavorite = favorites.includes(mat.id);
                      return (
                        <button
                          key={mat.id}
                          onClick={() => handleMaterialSelect(mat.id)}
                          className={`w-full flex items-center justify-between px-6 py-2 hover:bg-white transition-all ${
                            isMaterialSelected ? 'bg-white border-l-2 border-maogai-500' : ''
                          }`}
                        >
                          <span className={`text-sm ${isMaterialSelected ? 'text-maogai-700 font-medium' : 'text-gray-600'}`}>
                            {mat.title}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(mat.id);
                            }}
                            className={`p-1 rounded ${isFavorite ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-400'}`}
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {material ? (
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{material.title}</h1>
                <p className="text-sm text-gray-500">{chapter?.title}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => toggleFavorite(material.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    favorites.includes(material.id)
                      ? 'bg-yellow-50 text-yellow-600'
                      : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span className="text-sm">收藏</span>
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8">
              {renderContent(material.content)}
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <BookOpen className="w-16 h-16 mb-4" />
            <h3 className="text-lg font-medium text-gray-500">选择一个章节开始学习</h3>
            <p className="text-sm mt-2">点击左侧目录中的章节查看复习资料</p>
          </div>
        )}
      </div>
    </div>
  );
}
