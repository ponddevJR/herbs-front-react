import {BrowserRouter as Router , Route , Routes} from 'react-router-dom';
import App from './App';
import Register from './components/page/auth/register';
import Login from './components/page/auth/login';
import Profile from './components/page/user/profile';
import ChangePassword from './components/page/auth/changepassword';
import Dashboard from './components/page/admin/dashboard';
import HerbDetail from './components/page/user/herb-detail';
import NewsDetail from './components/page/user/news-detail';
import ResearchDetail from './components/page/user/research-detail';
import CommunityPage from './components/page/user/community/page';
import AllHerbPage from './components/page/user/allherbs/page';

const MyRoute = () => {
    return(
        <Router>
            <Routes>
                <Route path='/' exac element={<App/>}/>
                <Route path='/register' exac element={<Register/>}/>
                <Route path='/login' exac element={<Login/>}/>
                <Route path='/profile' exac element={<Profile/>}/>
                <Route path='/editpassword' exac element={<ChangePassword/>}/>
                <Route path='/admin/dashboard' exac element={<Dashboard/>}/>
                <Route path='/herbdetail/:id' exac element={<HerbDetail/>}/>
                <Route path='/newsdetail/:id' exac element={<NewsDetail/>}/>
                <Route path='/researchdetail/:id' exac element={<ResearchDetail/>}/>
                <Route path='/communities' exac element={<CommunityPage/>}/>
                <Route path='/allherbs' exac element={<AllHerbPage/>}/>
            </Routes>
        </Router>
    )
}
export default MyRoute;