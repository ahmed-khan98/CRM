import React, { useState, useEffect } from 'react';

const BreakOverlay = ({ startTime, onBreakOut }) => {
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const start = new Date(startTime).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);
      setDuration(`${mins}m ${secs}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(0,0,0,0.95)', color: 'white', zIndex: 9999,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
    }}>
      <h1>🚫 System Idle (On Break)</h1>
      <p>Aapne 5 minute se koi activity nahi ki.</p>
      <h2 style={{ fontSize: '3rem', color: '#764ba2' }}>{duration}</h2>
      <button 
        onClick={onBreakOut}
        style={{ padding: '10px 20px', cursor: 'pointer', borderRadius: '5px' }}
      >
        I am Back! (Resume Work)
      </button>
    </div>
  );
};

export default BreakOverlay;
