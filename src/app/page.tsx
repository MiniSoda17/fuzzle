'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import type { User } from '../types';
import { supabase } from '@/lib/supabase';
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
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [viewState, setViewState] = useState<'map' | 'meetup-offer' | 'timer' | 'confirmed'>('map');

  // 1. Initial Data Fetch & Realtime Subscription
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('*');
      if (data) setUsers(data as User[]);
    };

    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Fetch full profile
        const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        if (data) setCurrentUser(data as User);
      }
    };

    fetchUsers();
    getSession();

    // Subscribe to User Changes (Location Updates)
    const userSubscription = supabase
      .channel('public:users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setUsers(prev => [...prev, payload.new as User]);
        } else if (payload.eventType === 'UPDATE') {
          setUsers(prev => prev.map(u => u.id === payload.new.id ? payload.new as User : u));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(userSubscription);
    };
  }, []);

  // 2. Meetup Notifications
  useEffect(() => {
    if (!currentUser) return;

    const meetupSubscription = supabase
      .channel('public:meetups')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'meetups', filter: `receiver_id=eq.${currentUser.id}` }, (payload) => {
        alert(`New Meetup Request from ${payload.new.sender_id}! (Integration: Display Modal Here)`);
        // In real app: setViewState('meetup-received') or similar
      })
      .subscribe();

    return () => {
      supabase.removeChannel(meetupSubscription);
    };
  }, [currentUser]);

  // 3. Real Geolocation & Mock Jitter
  useEffect(() => {
    if (!currentUser) return;

    // A. Get Real Location ONCE on mount/load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Got Real Location:', latitude, longitude);

          // Update Local & DB
          setCurrentUser(prev => prev ? ({ ...prev, lat: latitude, lng: longitude }) : null);
          await supabase.from('users').update({ lat: latitude, lng: longitude }).eq('id', currentUser.id);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }

    // B. Keep the Mock Jitter (for "aliveness") but base it on the current/updated location
    const interval = setInterval(async () => {
      setCurrentUser(prev => {
        if (!prev) return null;
        // Jitter around CURRENT location
        const newLat = prev.lat + (Math.random() * 0.0001 - 0.00005);
        const newLng = prev.lng + (Math.random() * 0.0001 - 0.00005);

        // Sync to DB (debounced or just every 5s is fine for MVP)
        supabase.from('users').update({ lat: newLat, lng: newLng }).eq('id', prev.id).then();

        return { ...prev, lat: newLat, lng: newLng };
      });

    }, 5000);

    return () => clearInterval(interval);
  }, [currentUser?.id]); // Only re-run if user ID changes (initially)

  // Memoize center to prevent map jumps
  const mapCenter: [number, number] | undefined = currentUser ? [currentUser.lat, currentUser.lng] : undefined;


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

  const handleSaveProfile = async (updatedUser: User) => {
    console.log('Saving profile:', updatedUser);
    setCurrentUser(updatedUser);
    await supabase.from('users').update(updatedUser).eq('id', updatedUser.id);
  };

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Map Layer */}
      <MapComponent users={users} onUserClick={handleUserClick} center={mapCenter} />

      {/* Profile Button (Top Left) */}
      {currentUser && (
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
      )}

      {/* Edit Profile Sidebar */}
      <AnimatePresence>
        {isEditingProfile && currentUser && (
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
            initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
            animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
            exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-50%" }}
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
