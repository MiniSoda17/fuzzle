'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import type { User, Sesh, Meetup } from '../types';
import { supabase } from '@/lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import MeetupFlow from '@/components/MeetupFlow';
import ProfileSidebar from '@/components/ProfileSidebar';
import EditProfileSidebar from '@/components/EditProfileSidebar';
import IncomingRequestModal from '@/components/IncomingRequestModal';
import CreateSeshModal from '@/components/CreateSeshModal';
import JoinSeshModal from '@/components/JoinSeshModal';
import ActiveSeshModal from '@/components/ActiveSeshModal';
import { UserIcon, PlusIcon, BellIcon, SparklesIcon } from '@heroicons/react/24/solid';
import MeetupConfirmedModal from '@/components/MeetupConfirmedModal';
import NotificationList from '@/components/NotificationList';

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
  const viewStateRef = useRef(viewState);

  useEffect(() => {
    viewStateRef.current = viewState;
  }, [viewState]);

  const [incomingRequest, setIncomingRequest] = useState<Meetup | null>(null);
  const [activeMeetup, setActiveMeetup] = useState<Meetup | null>(null);

  // Sesh State
  const [seshes, setSeshes] = useState<Sesh[]>([]);
  const [isCreatingSesh, setIsCreatingSesh] = useState(false);
  const [selectedSesh, setSelectedSesh] = useState<Sesh | null>(null);
  const [activeSesh, setActiveSesh] = useState<Sesh | null>(null); // Track the session user is IN
  const [showActiveSeshModal, setShowActiveSeshModal] = useState(false);
  const [acceptedMeetup, setAcceptedMeetup] = useState<{ otherUser: User, activity: string, location?: string, time?: string } | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  // 1. Initial Data Fetch & Realtime Subscription
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('users').select('*');
      if (data) setUsers(data as User[]);
    };

    const fetchSeshes = async () => {
      const { data } = await supabase.from('seshes').select('*').eq('status', 'active');
      if (data) setSeshes(data as Sesh[]);
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
    fetchSeshes();
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

    const seshSubscription = supabase
      .channel('public:seshes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'seshes' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setSeshes(prev => [...prev, payload.new as Sesh]);
        } else if (payload.eventType === 'UPDATE') {
          setSeshes(prev => prev.map(s => s.id === payload.new.id ? payload.new as Sesh : s)
            .filter(s => s.status === 'active')); // Remove if not active
        } else if (payload.eventType === 'DELETE') {
          setSeshes(prev => prev.filter(s => s.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(userSubscription);
      supabase.removeChannel(seshSubscription);
    };
  }, []);

  // New Effect: Check for Active Session when currentUser is loaded
  useEffect(() => {
    if (!currentUser) return;

    const checkActiveSession = async () => {
      // 1. Check if I am a participant
      const { data: participations } = await supabase
        .from('sesh_participants')
        .select('sesh_id')
        .eq('user_id', currentUser.id);

      if (participations && participations.length > 0) {
        // Get the first active one
        const seshId = participations[0].sesh_id;
        const { data: sesh } = await supabase
          .from('seshes')
          .select('*')
          .eq('id', seshId)
          .eq('status', 'active')
          .single();

        if (sesh) {
          setActiveSesh(sesh as Sesh);
          return;
        }
      }

      // 2. Check if I am a creator of an active sesh
      const { data: createdSesh } = await supabase
        .from('seshes')
        .select('*')
        .eq('creator_id', currentUser.id)
        .eq('status', 'active')
        .single();

      if (createdSesh) {
        setActiveSesh(createdSesh as Sesh);
      }
    };

    checkActiveSession();

    // Check for active meetup
    const checkActiveMeetup = async () => {
      const { data } = await supabase
        .from('meetups')
        .select('*')
        .or(`sender_id.eq.${currentUser.id},receiver_id.eq.${currentUser.id}`)
        .eq('status', 'accepted')
        .single();

      if (data) {
        setActiveMeetup(data as Meetup);
      }
    };
    checkActiveMeetup();
  }, [currentUser]);

  // Check for Payment Success and Verify
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isSuccess = params.get('payment_success') === 'true';
      const sessionId = params.get('session_id');

      if (isSuccess && users.length > 0) {
        // Verify Payment with API
        if (sessionId) {
          const verify = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.access_token) {
              await fetch(`/api/verify-payment?session_id=${sessionId}`, {
                headers: { Authorization: `Bearer ${session.access_token}` }
              });
              // Reload user to get premium status
              if (currentUser) {
                const { data } = await supabase.from('users').select('*').eq('id', currentUser.id).single();
                if (data) setCurrentUser(data as User);
              }
            }
          };
          verify();
        }

        // Find active meetup and show modal

        const check = async () => {
          const { data } = await supabase
            .from('meetups')
            .select('*')
            .or(`sender_id.eq.${currentUser?.id},receiver_id.eq.${currentUser?.id}`)
            .eq('status', 'accepted')
            .limit(1)
            .single();

          if (data && currentUser) {
            const otherId = data.sender_id === currentUser.id ? data.receiver_id : data.sender_id;
            const otherUser = users.find(u => u.id === otherId);
            if (otherUser) {
              setAcceptedMeetup({ otherUser, activity: data.activity, location: data.location_name, time: data.meetup_time });
            }
          }
        };
        if (currentUser) check();
      }
    }
  }, [currentUser, users]);



  // 2. Meetup Notifications (Incoming & Outgoing Confirmation)
  useEffect(() => {
    if (!currentUser) return;

    const meetupSubscription = supabase
      .channel('public:meetups')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'meetups', filter: `receiver_id=eq.${currentUser.id}` }, (payload) => {
        if (payload.new.status === 'pending') {
          setIncomingRequest(payload.new as any);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'meetups' }, async (payload) => {
        const m = payload.new as Meetup;
        const isParticipant = m.sender_id === currentUser.id || m.receiver_id === currentUser.id;

        if (!isParticipant) return;

        if (m.status === 'accepted') {
          setActiveMeetup(m);

          // If I am the sender, show the confirmed modal (only if not already in flow)
          if (m.sender_id === currentUser.id) {
            if (viewStateRef.current === 'meetup-offer') return;

            const { data } = await supabase.from('users').select('*').eq('id', m.receiver_id).single();
            if (data) {
              setAcceptedMeetup({
                otherUser: data as User,
                activity: m.activity,
                location: m.location_name,
                time: m.meetup_time
              });
            }
          }
        } else if (m.status === 'completed' || m.status === 'no_show') {
          setActiveMeetup(null);
          setAcceptedMeetup(null); // Clear modal if open
        }
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
      console.log('Requesting geolocation...');
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Got Real Location:', latitude, longitude);

          // Update Local & DB
          setCurrentUser(prev => prev ? ({ ...prev, lat: latitude, lng: longitude }) : null);
          await supabase.from('users').update({ lat: latitude, lng: longitude }).eq('id', currentUser.id);
        },
        (error) => {
          console.error('Error getting location:', error.message);
          alert('Please enable location access to use Colleko!');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
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

  // Track if we've centered the map initially
  const [initialCenter, setInitialCenter] = useState<[number, number] | undefined>(undefined);

  // Set initial center once we have a user location
  useEffect(() => {
    if (currentUser && !initialCenter) {
      setInitialCenter([currentUser.lat, currentUser.lng]);
    }
  }, [currentUser, initialCenter]);

  // Pass initialCenter to map instead of constantly updating one
  const mapCenter = initialCenter;


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

  const handleLeaveSesh = () => {
    setActiveSesh(null);
    setShowActiveSeshModal(false);
  };

  const handleSeshClick = (sesh: Sesh) => {
    if (activeSesh && activeSesh.id === sesh.id) {
      // If clicking the session we are already in, show the Active UI
      setShowActiveSeshModal(true);
    } else {
      // Otherwise show the Join UI
      setSelectedSesh(sesh);
    }
  };

  return (
    <main style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {/* Map Layer */}
      <MapComponent
        users={users}
        seshes={seshes}
        onUserClick={handleUserClick}
        onSeshClick={handleSeshClick}
        center={mapCenter}
      />

      {currentUser && (
        <>
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
            {currentUser.avatar_url ? (
              <img
                src={currentUser.avatar_url}
                alt="Profile"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <UserIcon style={{ width: '28px', height: '28px', color: 'var(--primary-color)' }} />
            )}
          </motion.button>

          {/* Notification Bell (Top Right) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowNotifications(true)}
            className="glass-panel"
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
              padding: 0,
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
          >
            <BellIcon style={{ width: '24px', height: '24px', color: 'var(--text-color)' }} />
          </motion.button>

          <AnimatePresence>
            {showNotifications && (
              <NotificationList
                currentUser={currentUser}
                onClose={() => setShowNotifications(false)}
              />
            )}
          </AnimatePresence>
        </>
      )}

      {/* Active Session Indicator Pill */}
      <AnimatePresence>
        {activeSesh && !showActiveSeshModal && viewState === 'map' && (
          <motion.div
            initial={{ y: -100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: -100, x: "-50%", opacity: 0 }}
            onClick={() => setShowActiveSeshModal(true)}
            className="glass-panel"
            style={{
              position: 'absolute',
              top: '20px', // Aligned with top buttons
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1000,
              padding: '8px 16px',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              border: '1px solid rgba(124, 58, 237, 0.5)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>Active: {activeSesh.title}</span>
            <SparklesIcon style={{ width: '16px', height: '16px', color: 'var(--primary-color)' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incoming Request Modal */}
      <AnimatePresence>
        {incomingRequest && (
          <IncomingRequestModal
            request={incomingRequest}
            onClose={() => setIncomingRequest(null)}
          />
        )}
      </AnimatePresence>

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
              currentUser={currentUser}
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
      {/* Sesh Creation FAB */}
      {currentUser && !isCreatingSesh && !selectedSesh && !selectedUser && viewState === 'map' && !activeSesh && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsCreatingSesh(true)}
          className="fab-button btn-primary"
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)', // This will be overridden by motion, handle carefully
            marginLeft: '-28px', // Half width centering hack if transform conflicts
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.6)',
            padding: 0
          }}
        >
          <PlusIcon style={{ width: '32px', height: '32px', color: 'white' }} />
        </motion.button>
      )}

      {/* Create Sesh Modal */}
      <AnimatePresence>
        {isCreatingSesh && currentUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingSesh(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'black',
                zIndex: 1001
              }}
            />
            <CreateSeshModal
              currentUser={currentUser}
              onClose={() => setIsCreatingSesh(false)}
              onCreated={() => {
                setIsCreatingSesh(false);
                // Refresh active session immediately after creation
                const checkNewSesh = async () => {
                  const { data: createdSesh } = await supabase.from('seshes').select('*').eq('creator_id', currentUser.id).eq('status', 'active').order('created_at', { ascending: false }).limit(1).single();
                  if (createdSesh) setActiveSesh(createdSesh as Sesh);
                };
                checkNewSesh();
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Join Sesh Modal */}
      <AnimatePresence>
        {selectedSesh && currentUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSesh(null)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'black',
                zIndex: 1002
              }}
            />
            <JoinSeshModal
              sesh={selectedSesh}
              currentUser={currentUser}
              onClose={() => setSelectedSesh(null)}
              onJoined={() => {
                setSelectedSesh(null);
                setActiveSesh(selectedSesh); // Set active immediately on join
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* Active Sesh Modal */}
      <AnimatePresence>
        {activeSesh && showActiveSeshModal && currentUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActiveSeshModal(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'black',
                zIndex: 1002
              }}
            />
            <ActiveSeshModal
              sesh={activeSesh}
              currentUser={currentUser}
              onClose={() => setShowActiveSeshModal(false)}
              onLeave={handleLeaveSesh}
            />
          </>
        )}
      </AnimatePresence>

      {/* Accepted/Confirmed Modal (Global) */}
      <AnimatePresence>
        {acceptedMeetup && (
          <MeetupConfirmedModal
            otherUser={acceptedMeetup.otherUser}
            activity={acceptedMeetup.activity}
            location={acceptedMeetup.location}
            time={acceptedMeetup.time}
            onClose={() => setAcceptedMeetup(null)}
          />
        )}
      </AnimatePresence>

      {/* Active Meetup Controls */}
      <AnimatePresence>
        {activeMeetup && currentUser && (
          <motion.div
            initial={{ y: 100, x: "-50%", opacity: 0 }}
            animate={{ y: 0, x: "-50%", opacity: 1 }}
            exit={{ y: 100, x: "-50%", opacity: 0 }}
            className="glass-panel"
            style={{
              position: 'absolute',
              bottom: '32px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '350px',
              padding: '20px',
              zIndex: 900,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              border: '1px solid var(--secondary-color)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: '#aaa', marginBottom: '4px' }}>Active Meetup</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                {activeMeetup.activity === 'study' ? '📚' : '✨'} Meeting {users.find(u => u.id === (activeMeetup.sender_id === currentUser.id ? activeMeetup.receiver_id : activeMeetup.sender_id))?.name || 'Friend'}
              </h3>
              {activeMeetup.location_name && (
                <p style={{ fontSize: '0.9rem', color: 'var(--secondary-color)', marginTop: '4px' }}>
                  📍 {activeMeetup.location_name}
                </p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={async () => {
                  await supabase.from('meetups').update({ status: 'no_show' }).eq('id', activeMeetup.id);
                  setActiveMeetup(null);
                }}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)', fontWeight: 600
                }}
              >
                No Show
              </button>
              <button
                onClick={async () => {
                  await supabase.from('meetups').update({ status: 'completed' }).eq('id', activeMeetup.id);
                  setActiveMeetup(null);
                }}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  background: 'var(--secondary-color)', color: 'white',
                  border: 'none', fontWeight: 600
                }}
              >
                Arrived!
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
