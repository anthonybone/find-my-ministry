import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Home } from './pages/Home';
import { MapView } from './pages/MapView';
import { ListView } from './pages/ListView';
import { ParishList } from './pages/ParishList';
import { SingleParishView } from './pages/SingleParishView';
import { MeetingTimesSearch } from './pages/MeetingTimesSearch';
import { MinistryDetail } from './pages/MinistryDetail';
import { ParishDetail } from './pages/ParishDetail';
import { SearchResults } from './pages/SearchResults';

function App() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/map" element={<MapView />} />
                    <Route path="/list" element={<ListView />} />
                    <Route path="/parishes" element={<ParishList />} />
                    <Route path="/parish-view/:id" element={<SingleParishView />} />
                    <Route path="/meeting-times" element={<MeetingTimesSearch />} />
                    <Route path="/ministry/:id" element={<MinistryDetail />} />
                    <Route path="/parish/:id" element={<ParishDetail />} />
                    <Route path="/search" element={<SearchResults />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;