import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TimetablePage } from './pages/TimetablePage';
import { CourseGeneratorPage } from './pages/CourseGeneratorPage';
import { TimelinePage } from './pages/TimelinePage';
import { ProfilePage } from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/timetable" element={<TimetablePage />} />
          <Route path="/course" element={<CourseGeneratorPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
