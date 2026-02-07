'use client'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from "moment-timezone";

const BreakOverlay = ({ startTime, onBreakOut }) => {
  const [duration, setDuration] = useState('0m 0s');
  const breakTime = useSelector((state) => state.filter.lastBreakInTime);

useEffect(() => {
  const timer = setInterval(() => {
    if (!startTime) return;

    // 1. UTC string ko parse karein aur Karachi mein convert karein
    const start = moment.utc(startTime).tz("Asia/Karachi");
    
    // 2. Abhi ka waqt bhi Karachi mein lein
    const now = moment().tz("Asia/Karachi");

    // 3. Difference calculate karein (Ab seconds mein accurate diff aayega)
    const diffInSeconds = now.diff(start, 'seconds');

    // Agar diff negative hai (clock sync issue), toh 0 dikhao
    if (diffInSeconds < 0 || isNaN(diffInSeconds)) {
      setDuration('0m 0s');
    } else {
      const mins = Math.floor(diffInSeconds / 60);
      const secs = diffInSeconds % 60;
      setDuration(`${mins}m ${secs}s`);
    }
  }, 1000);

  return () => clearInterval(timer);
}, [startTime]);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      backgroundColor: 'rgba(10, 10, 10, 0.98)', color: 'white', zIndex: 10000,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      backdropFilter: 'blur(10px)'
    }}>
      <div style={{ textAlign: 'center', padding: '40px', borderRadius: '30px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h1 style={{ marginBottom: '10px', fontSize: '1.5rem', fontWeight: '800', letterSpacing: '1px' }}>
          🚫 SYSTEM IDLE (ON BREAK)
        </h1>
        
        {/* Yahan humne Timezone aur Format dono set kar diye hain */}
        <p style={{ color: '#a0aec0', fontSize: '14px', marginBottom: '30px' }}>
          Break started at: <span style={{ color: '#a855f7', fontWeight: 'bold' }}>
            {breakTime ? moment(breakTime).tz("Asia/Karachi").format("hh:mm:ss A") : "--:--"}
          </span>
        </p>

        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '12px', color: '#718096', textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '5px' }}>
            Duration
          </p>
          <h2 style={{ fontSize: '4rem', fontWeight: '900', color: '#a855f7', margin: 0, lineHeight: '1' }}>
            {duration}
          </h2>
        </div>

        <button 
          onClick={() => onBreakOut()}
          style={{ 
            padding: '15px 40px', 
            cursor: 'pointer', 
            borderRadius: '15px', 
            border: 'none', 
            background: 'linear-gradient(135deg, #a855f7 0%, #7e22ce 100%)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          I am Back! (Resume Work)
        </button>
      </div>
    </div>
  );
};

export default BreakOverlay;