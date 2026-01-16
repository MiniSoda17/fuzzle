import { useState } from 'react';
import MapComponent from './components/MapComponent';
import type { User } from './types';
import { MOCK_USERS } from './types';
import { AnimatePresence, motion } from 'framer-motion';
import MeetupFlow from './components/MeetupFlow';

function App() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewState, setViewState] = useState<'map' | 'meetup-offer' | 'timer' | 'confirmed'>('map');

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    // Don't change viewState if we are in the middle of an offer flow? 
    // Actually, if we click another user, maybe reset?
    // For now, only allow clicking if map view
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleSendOffer = () => {
    setViewState('meetup-offer');
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Map Layer */}
      <MapComponent users={MOCK_USERS} onUserClick={(user) => {
        if (viewState === 'map') handleUserClick(user);
      }} />

      {/* Profile/Interaction Overlay */}
      <AnimatePresence>
        {selectedUser && viewState === 'map' && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="glass-panel"
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              padding: '24px',
              zIndex: 1000,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              maxWidth: '500px',
              margin: '0 auto' // Center on desktop
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ddd, #999)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}
              >
                👤
              </div>
              <div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedUser.name}</h2>
                <p style={{ color: '#aaa' }}>{selectedUser.major}</p>
                <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>"{selectedUser.bio}"</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button
                onClick={handleCloseModal}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '50px',
                  background: 'rgba(255,255,255,0.1)',
                  color: 'white',
                  fontWeight: 600
                }}
              >
                Close
              </button>
              <button
                className="btn-primary"
                style={{ flex: 2 }}
                onClick={handleSendOffer}
              >
                Send Meetup Offer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Meetup Flow Overlay */}
      <AnimatePresence>
        {(viewState === 'meetup-offer' || viewState === 'timer' || viewState === 'confirmed') && selectedUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              padding: '32px',
              zIndex: 1001,
              width: '90%',
              maxWidth: '420px',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <MeetupFlow
              targetUser={selectedUser}
              onClose={() => setViewState('map')}
              onConfirm={() => {
                setViewState('confirmed'); // Internal state of MeetupFlow handles the UI, but we track it here too if needed
                setTimeout(() => {
                  setViewState('map');
                  setSelectedUser(null);
                }, 2000);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default App;
