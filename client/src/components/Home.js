import React, { useState, useEffect, useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { adddata, deldata, updatedata } from './context/ContextProvider';
import Navbar from './Navbaar';

const Home = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordPerPage, setRecordPerPage] = useState(5);
    const [userData, setUserData] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [gender, setGender] = useState("All");
    const [sortOption, setSortOption] = useState("");
    const [openAction, setOpenAction] = useState(null);
    const [alertMsg, setAlertMsg] = useState(null);
    const [activeFilter, setActiveFilter] = useState("all");
    const actionRef = useRef(null);

    const { udata } = useContext(adddata);
    const { updata } = useContext(updatedata);
    const { dltdata, setDLTdata } = useContext(deldata);

    useEffect(() => { getdata(); }, []);

    useEffect(() => {
        if (udata) setAlertMsg({ type: 'success', text: `${udata.name} added successfully!` });
    }, [udata]);

    useEffect(() => {
        if (updata) setAlertMsg({ type: 'success', text: 'User updated successfully!' });
    }, [updata]);

    useEffect(() => {
        if (dltdata) setAlertMsg({ type: 'danger', text: 'User deleted successfully!' });
    }, [dltdata]);

    useEffect(() => {
        if (alertMsg) {
            const t = setTimeout(() => setAlertMsg(null), 4000);
            return () => clearTimeout(t);
        }
    }, [alertMsg]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (actionRef.current && !actionRef.current.contains(e.target)) setOpenAction(null);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getdata = async () => {
        try {
            const res = await fetch("/getusers");
            const data = await res.json();
            setUserData(data);
            setFilteredUsers(data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const deleteuser = async (id) => {
        try {
            const res = await fetch(`/deleteuser/${id}`, { method: "DELETE" });
            const deletedData = await res.json();
            setDLTdata(deletedData);
            setOpenAction(null);
            getdata();
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
        setFilteredUsers(userData.filter(u => u.name.toLowerCase().includes(term)));
        setCurrentPage(1);
    };

    const todayStr = new Date().toISOString().split('T')[0];

    const handleStatFilter = (filter) => {
        setActiveFilter(filter);
        if (filter === "all") setGender("All");
        else if (filter === "male") setGender("Male");
        else if (filter === "female") setGender("Female");
        else if (filter === "today") setGender("All");
        setCurrentPage(1);
    };

    const filterByGender = (user) => gender === "All" || user.gender === gender;
    const filterByStatCard = (user) => {
        if (activeFilter === "today") return user.date && user.date.split('T')[0] === todayStr;
        return true;
    };
    const sortByAge = (a, b) => {
        if (sortOption === "asc") return a.age - b.age;
        if (sortOption === "desc") return b.age - a.age;
        return 0;
    };

    const exportCSV = () => {
        if (!window.confirm('Export data to CSV?')) return;
        fetch('/export-csv')
            .then(r => r.text())
            .then(csv => {
                const headers = 'Id,Name,Date,Email,Age,Gender,Mobile,State,District,Address\n';
                const blob = new Blob([headers + csv], { type: 'text/csv' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = 'users.csv';
                link.click();
                window.URL.revokeObjectURL(link.href);
                setAlertMsg({ type: 'success', text: 'CSV exported successfully!' });
            })
            .catch(() => setAlertMsg({ type: 'danger', text: 'Export failed' }));
    };

    const processed = filteredUsers.filter(filterByGender).filter(filterByStatCard).sort(sortByAge);
    const totalPages = Math.ceil(processed.length / recordPerPage);
    const startIdx = (currentPage - 1) * recordPerPage;
    const pageData = processed.slice(startIdx, startIdx + recordPerPage);

    const maleCount = userData.filter(u => u.gender === 'Male').length;
    const femaleCount = userData.filter(u => u.gender === 'Female').length;
    const todayCount = userData.filter(u => u.date && u.date.split('T')[0] === todayStr).length;

    return (
        <>
            <Navbar />
            <div className="dashboard">
                {alertMsg && (
                    <div className={`pro-alert pro-alert-${alertMsg.type}`}>
                        <span>{alertMsg.text}</span>
                        <button className="close-btn" onClick={() => setAlertMsg(null)}>&times;</button>
                    </div>
                )}

                <div className="dash-header">
                    <h1>Dashboard</h1>
                    <NavLink to="/register" className="btn-pro btn-primary-pro">+ Add User</NavLink>
                </div>

                <div className="stat-cards">
                    <div className={`stat-card ${activeFilter === 'all' ? 'stat-card-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleStatFilter('all')}>
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }}>&#128101;</div>
                        <div className="stat-info">
                            <h3>{userData.length}</h3>
                            <p>Total Users</p>
                        </div>
                    </div>
                    <div className={`stat-card ${activeFilter === 'male' ? 'stat-card-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleStatFilter('male')}>
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #4facfe, #00f2fe)' }}>&#9794;</div>
                        <div className="stat-info">
                            <h3>{maleCount}</h3>
                            <p>Male Users</p>
                        </div>
                    </div>
                    <div className={`stat-card ${activeFilter === 'female' ? 'stat-card-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleStatFilter('female')}>
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f093fb, #f5576c)' }}>&#9792;</div>
                        <div className="stat-info">
                            <h3>{femaleCount}</h3>
                            <p>Female Users</p>
                        </div>
                    </div>
                    <div className={`stat-card ${activeFilter === 'today' ? 'stat-card-active' : ''}`} style={{ cursor: 'pointer' }} onClick={() => handleStatFilter('today')}>
                        <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f7971e, #ffd200)' }}>&#128197;</div>
                        <div className="stat-info">
                            <h3>{todayCount}</h3>
                            <p>Today Users</p>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                    <button className="btn-pro btn-success-pro" onClick={exportCSV} style={{ fontSize: 13, padding: '8px 18px' }}>
                        &#128196; Export CSV
                    </button>
                </div>

                <div className="toolbar">
                    <div className="toolbar-group">
                        <label>Gender</label>
                        <select value={gender} onChange={e => { setGender(e.target.value); setActiveFilter(e.target.value === 'All' ? 'all' : e.target.value.toLowerCase()); setCurrentPage(1); }}>
                            <option value="All">All</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="toolbar-group">
                        <label>Sort by Age</label>
                        <select value={sortOption} onChange={e => setSortOption(e.target.value)}>
                            <option value="">Default</option>
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                        </select>
                    </div>
                    <div className="toolbar-group">
                        <label>Per Page</label>
                        <select value={recordPerPage} onChange={e => { setRecordPerPage(parseInt(e.target.value)); setCurrentPage(1); }}>
                            {[5, 10, 15, 20, 25].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                    </div>
                    <div className="toolbar-spacer" />
                    <div className="toolbar-group">
                        <label>Search</label>
                        <input type="text" placeholder="Search by name..." value={searchTerm} onChange={handleSearch} />
                    </div>
                </div>

                <div className="data-table-card">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Mobile</th>
                                <th>State</th>
                                <th>District</th>
                                <th>Date</th>
                                <th style={{ textAlign: 'center' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageData.length === 0 ? (
                                <tr>
                                    <td colSpan="10" style={{ textAlign: 'center', padding: 40, color: '#aaa' }}>
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                pageData.map((user, i) => (
                                    <tr key={user.id}>
                                        <td style={{ fontWeight: 600, color: 'rgba(255,255,255,0.4)' }}>{startIdx + i + 1}</td>
                                        <td style={{ fontWeight: 600, color: '#fff' }}>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.age}</td>
                                        <td>
                                            <span style={{
                                                padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                                                background: user.gender === 'Male' ? 'rgba(33,150,243,0.15)' : 'rgba(233,30,99,0.15)',
                                                color: user.gender === 'Male' ? '#64b5f6' : '#f48fb1',
                                            }}>
                                                {user.gender}
                                            </span>
                                        </td>
                                        <td>{user.mobile}</td>
                                        <td>{user.state}</td>
                                        <td>{user.district}</td>
                                        <td style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{user.date}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className="action-menu" ref={openAction === user.id ? actionRef : null}>
                                                <button className="action-trigger" onClick={() => setOpenAction(openAction === user.id ? null : user.id)}>
                                                    &#8942;
                                                </button>
                                                {openAction === user.id && (
                                                    <div className="action-dropdown">
                                                        <NavLink to={`/view/${user.id}`} className="action-view" onClick={() => setOpenAction(null)}>
                                                            &#128065; View
                                                        </NavLink>
                                                        <NavLink to={`/edit/${user.id}`} className="action-edit" onClick={() => setOpenAction(null)}>
                                                            &#9998; Edit
                                                        </NavLink>
                                                        <button className="action-delete" onClick={() => deleteuser(user.id)}>
                                                            &#128465; Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {totalPages > 1 && (
                        <div className="pro-pagination">
                            <button className="page-btn page-nav" onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                                &#8249;
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button key={i} className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`} onClick={() => setCurrentPage(i + 1)}>
                                    {i + 1}
                                </button>
                            ))}
                            <button className="page-btn page-nav" onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>
                                &#8250;
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Home;
