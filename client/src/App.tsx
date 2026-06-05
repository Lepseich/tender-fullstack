import { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom';
import './App.css'
import { mockUsers, mockTenders, mockBids } from './data/mockData';
import type { IUser, ITender, IBid } from './types';
import TenderList from './pages/TenderList'
import Login from './pages/Login'
import Registration from './pages/Registration'
import ProtectedRoute from './components/ProtectedRoute'
import CreateTender from './pages/CreateTender';
import MyBids from './pages/MyBids';
import TenderDetail from './pages/TenderDetail';
import MyTenders from './pages/MyTenders';
import Profile from './pages/Profile';
import Admin from './pages/Admin';




function App() {
  const [currentUser, setCurrentUser] = useState<IUser | null>(() => {
    const saved = localStorage.getItem('curr-users');
    return saved !== null ? JSON.parse(saved) : null;
  });
  const [users, setUsers] = useState<IUser[]>(() => {
    const saved = localStorage.getItem('tender-users');
    return saved !== null ? JSON.parse(saved) : mockUsers;
  });
  const [tenders, setTenders] = useState(() => {
    const saved = localStorage.getItem('tender-posts');
    return saved !== null ? JSON.parse(saved) : mockTenders;
  });
  const [bids, setBids] = useState(() => {
    const saved = localStorage.getItem('bids-posts');
    return saved !== null ? JSON.parse(saved) : mockBids;
  });
  const loadTenders = () => {

  }
  const addTender = async (tenderData: any) => {
    try {
      const response = await fetch('http://localhost:5001/tenders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tender-token')}` },
        body: JSON.stringify(tenderData),
      })
      if (response.ok) {
        const savedTender = await response.json();
        setTenders([...tenders, savedTender]);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Помилка відповіді сервера');
      return false;
    }
  }

  const handleRegister = async (newUser: IUser) => {
    try {
      const response = await fetch('http://localhost:5001/register', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })
      if (response.ok) {
        const savedUser = await response.json();
        setCurrentUser(savedUser);
        setUsers([...users, savedUser]);
      }
    } catch (err) {
      console.log('Неверный логин или пароль')
    }
  }
  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      if (response.ok) {
        const data = await response.json()
        setCurrentUser(data.user);
        localStorage.setItem('tender-token', data.token);
      }
    } catch (err) {
      console.error('Неверный логин или пароль')
    }
  }
  const handleAcceptBid = async (bidId: string, tenderId: string) => {
    try {
      const acceptBidFetch = await fetch(`http://localhost:5001/bids/${bidId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tender-token')}` },
        body: JSON.stringify({ status: 'accepted' })
      })
      const acceptTenderFetch = await fetch(`http://localhost:5001/tenders/${tenderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tender-token')}` },
        body: JSON.stringify({ status: 'closed' })
      })
      setTenders(tenders.map((t: ITender) => {
        if (t._id === tenderId) {
          return { ...t, status: 'closed' }
        } else { return t }
      }))
    } catch (err) {
      console.error('Error: cannot accept bid');
    }
  };

  const handleAddBid = async (newBid: IBid) => {
    try {
      const response = await fetch('http://localhost:5001/bids', {
        method: "POST",
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('tender-token')}` },
        body: JSON.stringify(newBid)
      })
      if (response.ok) {
        const savedBid = await response.json()
        setBids([...bids, savedBid]);
      }
    } catch (err) {
      console.log("Error with Bids");
    }
  }
  const changeBidStatus = (bidId: string, newStatus: 'accepted' | 'rejected') => {
    setBids(bids.map((t: IBid) => t._id === bidId ? { ...t, status: newStatus } : t));


    if (newStatus === 'accepted') {
      const currentBid = bids.find((b: IBid) => b._id === bidId);
      if (currentBid) {
        closeTender(currentBid.tenderId);
      }
    }
  };
  const handleRejectBid = async (bidId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/bids/${bidId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setBids(bids.filter((m: IBid) => m._id !== bidId))
      }
    } catch (err) {
      console.log("Error with Bids");
    }
  }
  const closeTender = (tenderId: string) => {
    setTenders(tenders.map((t: ITender) => {
      if (t._id === tenderId) {
        return { ...t, status: 'closed' };
      } else {
        return t
      }

    }));
  }
  const autoCloseTender = async (tenderId: string) => {
    try {
      const response = await fetch(`http://localhost:5001/tenders/${tenderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'closed' })
      });

      if (response.ok) {

        setTenders((prev: ITender[]) => prev.map(t => t._id === tenderId ? { ...t, status: 'closed' } : t));
      }
    } catch (err) {
      console.error("Auto-close failed:", err);
    }
  };
  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('tender-token')}` },
      })
      if (response.ok) {
        setUsers(users.filter(u => u._id !== id))
      }
    } catch (err) {
      console.log("Error with Users");
    }
  }
  const deleteTender = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5001/tenders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('tender-token')}` },
      })
      if (response.ok) {
        setTenders(tenders.filter((t: ITender) => t._id !== id));
      }
    } catch (err) {
      console.log("Error with Users");
    }
  }

  useEffect(() => {
    localStorage.setItem('tender-users', JSON.stringify(users))
  }, [users]);
  useEffect(() => {
    localStorage.setItem('tender-posts', JSON.stringify(tenders))
  }, [tenders]);
  useEffect(() => {
    localStorage.setItem('bids-posts', JSON.stringify(bids))
  }, [bids]);
  useEffect(() => {
    localStorage.setItem('curr-users', JSON.stringify(currentUser))
  }, [currentUser]);
  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('http://localhost:5001/users');
      const data = await res.json();
      setUsers(data);
    };
    fetchUsers();
  }, [currentUser]);
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await fetch('http://localhost:5001/bids');
        const data = await response.json();

        setBids(data);
      } catch (error) {
        console.error("Сервер не отвечает, использую локальные данные", error);
      }
    };
    fetchBids();
  }, []);
  useEffect(() => {
    const fetchTenders = async () => {
      try {
        const response = await fetch('http://localhost:5001/tenders');
        const data = await response.json();

        setTenders(data);
      } catch (error) {
        console.error("Сервер не отвечает, использую локальные данные", error);
      }
    };

    fetchTenders();
  }, []);
  return (
    <>

      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* 1. ЛОГОТИП (Слева) */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12">
              <span className="text-white font-black text-xs">T</span>
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tighter italic">
              Tender<span className="text-indigo-600">.inUA</span>
            </span>
          </NavLink>

          {/* 2. МЕНЮ (Центр) */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
              }
            >
              Тендери
            </NavLink>

            {currentUser?.role === 'company' && (
              <>
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
                  }
                >
                  Створити
                </NavLink>
                <NavLink
                  to="/my-tenders"
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
                  }
                >
                  Мої тендери
                </NavLink>
              </>
            )}

            {currentUser?.role === 'user' && (
              <NavLink
                to="/my-bids"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`
                }
              >
                Мої заявки
              </NavLink>
            )}

            {currentUser?.role === 'admin' && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-xl text-sm font-bold transition-all ${isActive ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:text-rose-900 hover:bg-rose-50/50'}`
                }
              >
                Адмін Панель
              </NavLink>
            )}
          </div>

          {/* 3. ПРОФИЛЬ И ВХОД (Справа) */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <NavLink to="/prof" className="group flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-black text-slate-500 border border-slate-200 group-hover:border-indigo-300 group-hover:text-indigo-600 transition-all uppercase">
                    {currentUser.name[0]}
                  </div>
                  <span className="hidden lg:block text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                    {currentUser.name}
                  </span>
                </NavLink>

                <button
                  onClick={() => setCurrentUser(null)}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                  title="Вийти"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink to="/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 px-4 py-2">
                  Вхід
                </NavLink>
                <NavLink to="/registration" className="bg-slate-900 text-white px-5 py-2 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-md shadow-slate-200">
                  Реєстрація
                </NavLink>
              </div>
            )}
          </div>

        </div>
      </nav>

      <Routes>
        <Route path="/" element={<TenderList tenders={tenders} autoCloseTender={autoCloseTender} />} />
        <Route path="/registration" element={<Registration onReg={handleRegister} />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/admin" element={
          <ProtectedRoute user={currentUser} requiredRole="admin">
            <Admin currentUser={currentUser!} tenders={tenders} users={users} onDeleteUser={deleteUser} onDeleteTender={deleteTender} />
          </ProtectedRoute>
        } />

        <Route path="/create" element={
          <ProtectedRoute user={currentUser} requiredRole="company">
            <CreateTender onAddTender={addTender} currentUserId={currentUser?._id || ''} />
          </ProtectedRoute>
        } />
        <Route path="/my-bids" element={
          <ProtectedRoute user={currentUser} requiredRole="user">
            <MyBids tenders={tenders} currentUser={currentUser!} allBids={bids}></MyBids>
          </ProtectedRoute>
        } />
        <Route path='/tender/:tenderId' element={
          <ProtectedRoute user={currentUser}>
            <TenderDetail handleAcceptBid={handleAcceptBid} onAddBid={handleAddBid} tenders={tenders} currentUser={currentUser} allBids={bids} onChangeBidStatus={changeBidStatus} onRejectBid={handleRejectBid}></TenderDetail>
          </ProtectedRoute>
        } />
        <Route path='/my-tenders' element={
          <ProtectedRoute user={currentUser} requiredRole="company">
            <MyTenders tenders={tenders} currentUser={currentUser!}></MyTenders>
          </ProtectedRoute>
        } />
        <Route path='/prof' element={
          <ProtectedRoute user={currentUser}>
            <Profile currentUser={currentUser!} tenders={tenders} allBids={bids}></Profile>
          </ProtectedRoute>
        } />


      </Routes>
    </>
  );
}

export default App
