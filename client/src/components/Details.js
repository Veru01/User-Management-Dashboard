import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useHistory } from 'react-router-dom';
import Navbar from './Navbaar';

const Details = () => {
    const [user, setUser] = useState({});
    const { id } = useParams();
    const history = useHistory();

    const getdata = async () => {
        try {
            const res = await fetch(`/induser/${id}`);
            const data = await res.json();
            if (data && data[0]) setUser(data[0]);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    useEffect(() => { getdata(); }, []);

    const deleteuser = async () => {
        try {
            await fetch(`/deleteuser/${id}`, { method: "DELETE" });
            history.push("/home");
        } catch (err) {
            console.error("Error:", err);
        }
    };

    const fields = [
        { label: 'Email', value: user.email },
        { label: 'Age', value: user.age },
        { label: 'Gender', value: user.gender },
        { label: 'Mobile', value: `+91 ${user.mobile || ''}` },
        { label: 'State', value: user.state },
        { label: 'District', value: user.district },
        { label: 'Address', value: user.add },
        { label: 'Registered', value: user.date },
    ];

    return (
        <>
            <Navbar />
            <div className="detail-page">
                <div style={{ marginBottom: 16 }}>
                    <NavLink to="/home" className="btn-pro btn-outline-pro" style={{ fontSize: 13, padding: '8px 16px' }}>
                        &#8592; Back
                    </NavLink>
                </div>
                <div className="detail-card">
                    <div className="detail-header">
                        <div className="detail-avatar">
                            {user.name ? user.name[0].toUpperCase() : '?'}
                        </div>
                        <div className="detail-header-info">
                            <h2>{user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                    </div>
                    <div className="detail-body">
                        <div className="detail-grid">
                            {fields.map((f, i) => (
                                <div className="detail-item" key={i}>
                                    <div className="detail-label">{f.label}</div>
                                    <div className="detail-value">{f.value || '-'}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="detail-actions">
                        <NavLink to={`/edit/${user.id}`} className="btn-pro btn-primary-pro">
                            &#9998; Edit
                        </NavLink>
                        <button className="btn-pro btn-danger-pro" onClick={deleteuser}>
                            &#128465; Delete
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Details;
