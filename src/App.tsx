import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "@/pages/Home";
import { Materials } from "@/pages/Materials";
import { Practice } from "@/pages/Practice";
import { Exam } from "@/pages/Exam";
import { WrongBook } from "@/pages/WrongBook";
import { Profile } from "@/pages/Profile";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col">
          <Header onMenuClick={toggleSidebar} />
          <main className="flex-1 p-6 overflow-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/practice/chapter/:chapterId" element={<Practice />} />
              <Route path="/exam" element={<Exam />} />
              <Route path="/wrong-book" element={<WrongBook />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}
