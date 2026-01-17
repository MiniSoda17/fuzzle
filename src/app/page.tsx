'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { User } from '../types';
import { MOCK_USERS, CURRENT_USER } from '../types';
import { AnimatePresence, motion } from 'framer-motion';
import MeetupFlow from '@/components/MeetupFlow';
import ProfileSidebar from '@/components/ProfileSidebar';
import EditProfileSidebar from '@/components/EditProfileSidebar';
import { UserIcon } from '@heroicons/react/24/solid';

// Dynamically import MapComponent to disable SSR
const MapComponent = dynamic(() => import('@/components/MapComponent'), {
  loading: () => <div style={{ width: '100%', height: '100%', background: 'var(--bg-color)' }}></div>,
  ssr: false
});

export default function Home() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User>(CURRENT_USER);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [viewState, setViewState] = useState<'map' | 'meetup-offer' | 'timer' | 'confirmed'>('map');

  const handleUserClick = (user: User) => {
    // If editing profile, close it first
    if (isEditingProfile) setIsEditingProfile(false);

    setSelectedUser(user);
    if (viewState !== 'map') {
      setViewState('map');
    }
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
  };

  const handleSendOffer = () => {
    setViewState('meetup-offer');
  };

  const handleSaveProfile = (updatedUser: User) => {
    console.log('Saving profile:', updatedUser);
    setCurrentUser(updatedUser);
    // In real app, API call here
  };

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Map Layer */}
      <MapComponent users={MOCK_USERS} onUserClick={handleUserClick} />

      {/* Profile Button (Top Left) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setSelectedUser(null);
          setIsEditingProfile(true);
        }}
        className="glass-panel"
        style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: 0,
          overflow: 'hidden',
          border: '2px solid var(--primary-color)',
          cursor: 'pointer'
        }}
      >
        <img
          src={currentUser.avatarUrl}
          alt="Profile"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </motion.button>

      {/* Edit Profile Sidebar */}
      <AnimatePresence>
        {isEditingProfile && (
          <EditProfileSidebar
            user={currentUser}
            onClose={() => setIsEditingProfile(false)}
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>

      {/* Profile/Interaction Overlay */}
      <AnimatePresence>
        {selectedUser && viewState === 'map' && (
          <ProfileSidebar
            user={selectedUser}
            onClose={handleCloseModal}
            onOffer={handleSendOffer}
          />
        )}
      </AnimatePresence>

      {/* Meetup Flow Overlay */}
      <AnimatePresence>
        {(viewState === 'meetup-offer' || viewState === 'timer' || viewState === 'confirmed') && selectedUser && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="glass-panel meetup-modal"
            style={{
              position: 'absolute',
              zIndex: 1001,
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
    </main>
  );
}
