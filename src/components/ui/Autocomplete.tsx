'use client';

import React, { useState, useRef, useEffect } from 'react';
import { COURSES, Course } from '../../data/courses';
import { motion, AnimatePresence } from 'framer-motion';

interface AutocompleteProps {
    label: string;
    university: string;
    onSelect: (course: Course) => void;
    placeholder?: string;
}

export default function Autocomplete({ label, university, onSelect, placeholder }: AutocompleteProps) {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Filter courses by selected university matches
    const filteredCourses = COURSES.filter(c =>
        c.university === university &&
        (c.code.toLowerCase().includes(query.toLowerCase()) || c.name.toLowerCase().includes(query.toLowerCase()))
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="autocomplete-container" ref={containerRef} style={{ position: 'relative', marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-color)', opacity: 0.8 }}>
                {label}
            </label>
            <input
                type="text"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                placeholder={placeholder || "Search courses..."}
                style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-color)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: 'var(--text-color)',
                    fontSize: '1rem',
                    outline: 'none',
                }}
            />

            <AnimatePresence>
                {isOpen && query.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            right: 0,
                            background: 'var(--surface-color)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '0 0 var(--radius-sm) var(--radius-sm)',
                            zIndex: 10,
                            maxHeight: '200px',
                            overflowY: 'auto',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                        }}
                    >
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map(course => (
                                <div
                                    key={course.code}
                                    onClick={() => {
                                        onSelect(course);
                                        setQuery('');
                                        setIsOpen(false);
                                    }}
                                    style={{
                                        padding: '12px 16px',
                                        cursor: 'pointer',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                    className="hover-item"
                                >
                                    <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>{course.code}</span>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-color)', opacity: 0.8 }}>{course.name}</span>
                                </div>
                            ))
                        ) : (
                            <div style={{ padding: '12px 16px', color: 'var(--text-color)', opacity: 0.5 }}>
                                No matching courses found.
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
            <style jsx>{`
        .hover-item:hover {
            background: rgba(255,255,255,0.05);
        }
      `}</style>
        </div>
    );
}
