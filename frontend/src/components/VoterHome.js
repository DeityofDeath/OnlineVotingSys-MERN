import React from "react";
import VoterNav from "./VoterNav";
import Foot from "./foot";

function VoterHome() {
  return (
    <div className="bg1">
      <VoterNav />
      <div className="ctnt">
        <h1>Welcome to Voter Home</h1>
        <p>This is the voter home page. You can see your details here.</p>
      </div>
      <Foot />
    </div>
  );
}

export default VoterHome;
