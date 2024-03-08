import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Header from './components/Header';
import Footer from './components/FooterComponent';
import PrivateRoute from './components/PrivateRoute';
import { Toaster } from 'react-hot-toast';
import Search from './pages/Search';
import PageNotFound from './pages/PageNotFound';
import UserProfile from './pages/UserProfile';
import ReadBlog from './pages/ReadBlog';
import Editor from './pages/Editor';

export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route element={<PrivateRoute />}>
                    <Route path="/dash-board" element={<Dashboard />} />
                </Route>
                <Route path="/about" element={<About />} />
                <Route path="/search/:query" element={<Search />} />
                <Route path="/user/:username" element={<UserProfile />} />
                <Route path="/blog/:slug" element={<ReadBlog />} />
                <Route path="/editor/:slug" element={<Editor />} />
                <Route path="*" element={<PageNotFound />} />
            </Routes>
            <Footer />
            <Toaster position="top-center" />
        </BrowserRouter>
    );
}
