import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import AdminNav from "./AdminNav";
import Foot from "./foot";
import "./AdminHome.css";

function AdminHome() {
    const location = useLocation();
    const id = location.pathname.split("/").pop();
    const [votersCount, setVotersCount] = useState(0);
    const [votedCount, setVotedCount] = useState(0);
    const [electionsCount, setElectionsCount] = useState(0);
    const [adminUsername, setAdminUsername] = useState("Rikhil"); 

    useEffect(() => {
        axios.get("/admin-api/count")
            .then(response => {
                setVotersCount(response.data.voterCount);
            })
            .catch(error => {
                console.error("Error fetching voter count:", error);
            });

        axios.get("/admin-api/votedcount")
            .then(response => {
                setVotedCount(response.data.votedCount);
            })
            .catch(error => {
                console.error("Error fetching voted count:", error);
            });

        axios.get("/elections-api/electionsCount")
            .then(response => {
                setElectionsCount(response.data.electionCount);
            })
            .catch(error => {
                console.error("Error fetching elections count:", error);
            });
    }, []);

    return (
        <>
            <AdminNav />
            <div><br></br><br></br><br></br><br></br></div>
            <div className="adminHomeContainer">
                <div className="container">
                    <h1 className="text-center mb-4">Welcome, {adminUsername}!</h1>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">Voter Count and Status</h5>
                                    <p className="card-text">Total Number of Voters: {votersCount}</p>
                                    <p className="card-text">Voters who have Voted: {votedCount}</p>
                                    <p className="card-text">Voters who have Not Voted: {votersCount - votedCount}</p>
                                </div>
                                <div className="card-footer text-center">
                                    <Link to={`/Admin/VoterList/${id}`} className="btn btn-warning">View Voter List</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">Add Elections</h5>
                                    <p className="card-text">Total Number of Elections: {electionsCount}</p>
                                </div>
                                <div className="card-footer text-center">
                                    <Link to={`/Admin/AddElection/${id}`} className="btn btn-warning me-2">Add Election</Link>
                                    <Link to={`/Admin/deleteElection/${id}`} className="btn btn-warning">Delete Election</Link>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="card h-100">
                                <div className="card-body">
                                    <h5 className="card-title">See and Post Results</h5>
                                    <p className="card-text">Total Number of Results(ongoing): {electionsCount}</p>
                                </div>
                                <div className="card-footer text-center">
                                    <Link to={`/Admin/Results/${id}`} className="btn btn-warning me-2">View Results</Link>
                                    <Link to={`/Admin/PostResult/${id}`} className="btn btn-warning">Post Result</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Foot />
        </>
    );
}

export default AdminHome;
