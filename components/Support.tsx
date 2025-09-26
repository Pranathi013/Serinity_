import React, { useState, useEffect } from 'react';
import { Achievement, ParentalControlsSettings } from '../types';

// --- Achievements Modal ---
const AchievementsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [newAchievement, setNewAchievement] = useState('');

    useEffect(() => {
        try {
            const saved = localStorage.getItem('userAchievements');
            if (saved) {
                setAchievements(JSON.parse(saved));
            }
        } catch (e) {
            console.error("Failed to load achievements:", e);
        }
    }, []);

    const saveAchievements = (updatedAchievements: Achievement[]) => {
        setAchievements(updatedAchievements);
        localStorage.setItem('userAchievements', JSON.stringify(updatedAchievements));
    };

    const handleAdd = () => {
        if (newAchievement.trim()) {
            const newEntry: Achievement = {
                id: Date.now().toString(),
                text: newAchievement.trim(),
                date: new Date().toISOString().split('T')[0],
            };
            saveAchievements([newEntry, ...achievements]);
            setNewAchievement('');
        }
    };

    const handleDelete = (id: string) => {
        saveAchievements(achievements.filter(a => a.id !== id));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all flex flex-col h-[80vh]" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-gray-darkest">My Achievements</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-brand-gray-light">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto">
                    {achievements.length === 0 ? (
                        <p className="text-center text-brand-gray mt-8">You haven't added any achievements yet. Add one below!</p>
                    ) : (
                        <ul className="space-y-3">
                            {achievements.map(ach => (
                                <li key={ach.id} className="bg-brand-gray-lightest p-3 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-brand-gray-darkest">{ach.text}</p>
                                        <p className="text-xs text-brand-gray">Added on: {ach.date}</p>
                                    </div>
                                    <button onClick={() => handleDelete(ach.id)} className="p-1 text-red-500 hover:bg-red-100 rounded-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="p-4 border-t bg-white">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newAchievement}
                            onChange={(e) => setNewAchievement(e.target.value)}
                            placeholder="Add a new achievement..."
                            className="flex-1 px-3 py-2 border border-brand-gray-light rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                        />
                        <button onClick={handleAdd} className="px-4 py-2 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark">Add</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Badge Collections Modal ---
interface Badge {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
    unlocked: boolean;
}

const BadgeIconUnlocked = () => <svg className="h-10 w-10 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,15.3L15.1,16.8L12,14.2L8.9,16.8L7.8,15.3L10.9,12.8L7.8,10.3L8.9,8.8L12,11.3L15.1,8.8L16.2,10.3L13.1,12.8L16.2,15.3Z" /></svg>;
const GameBadgeIcon = () => <svg className="h-10 w-10 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.5 2 12.05C2 17.05 5.66 21.23 10.44 21.93V14.9H7.9V12.05H10.44V9.82C10.44 7.3 11.93 5.9 14.22 5.9C15.31 5.9 16.45 6.1 16.45 6.1V8.62H15.19C13.95 8.62 13.56 9.38 13.56 10.18V12.05H16.34L15.89 14.9H13.56V21.93C18.34 21.23 22 17.05 22 12.05C22 6.5 17.5 2 12 2Z"/></svg>;

const BadgeCollectionsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [badges, setBadges] = useState<Badge[]>([]);

    useEffect(() => {
        let is7DayStreakUnlocked = false;
        let isMindfulExplorerUnlocked = false;

        try {
            const savedStreak = localStorage.getItem('streakData');
            if (savedStreak) {
                const { currentStreak } = JSON.parse(savedStreak);
                if (currentStreak >= 7) {
                    is7DayStreakUnlocked = true;
                }
            }

            const savedGameStats = localStorage.getItem('gameStats');
            if (savedGameStats) {
                const { playedToday } = JSON.parse(savedGameStats);
                if (playedToday && playedToday.length >= 3) {
                    isMindfulExplorerUnlocked = true;
                }
            }
        } catch (e) {
            console.error("Failed to check badge status:", e);
        }

        const allBadges: Badge[] = [
            { id: 'streak-7', name: '7-Day Streak', description: 'Complete a mood check-in for 7 consecutive days.', icon: <BadgeIconUnlocked />, unlocked: is7DayStreakUnlocked },
            { id: 'game-explorer', name: 'Mindful Explorer', description: 'Complete the daily challenge in Mindful Games.', icon: <GameBadgeIcon />, unlocked: isMindfulExplorerUnlocked },
        ];
        setBadges(allBadges);
    }, []);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-gray-darkest">Badge Collections</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-brand-gray-light"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>
                <main className="p-6 max-h-[60vh] overflow-y-auto">
                    {badges.length === 0 ? (
                        <p className="text-center text-brand-gray">No badges available yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {badges.map(badge => (
                                <div key={badge.id} className={`p-4 rounded-lg text-center transition-opacity ${badge.unlocked ? 'bg-white shadow-sm border' : 'bg-brand-gray-lightest opacity-60'}`}>
                                    <div className="flex justify-center items-center h-16">{badge.icon}</div>
                                    <h3 className="font-bold mt-2 text-brand-gray-darkest">{badge.name}</h3>
                                    <p className="text-xs text-brand-gray">{badge.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};


// --- SOS Settings Modal ---
interface EmergencyContact {
  name: string;
  phone: string;
}

const SosSettingsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [contacts, setContacts] = useState<EmergencyContact[]>([
        { name: '', phone: '' }, { name: '', phone: '' }, { name: '', phone: '' }
    ]);
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        try {
            const savedContacts = localStorage.getItem('emergencyContacts');
            if (savedContacts) {
                const parsed = JSON.parse(savedContacts);
                 if (Array.isArray(parsed) && parsed.length === 3 && parsed.every(c => typeof c === 'object' && 'name' in c && 'phone' in c)) {
                    setContacts(parsed);
                }
            }
        } catch (error) {
            console.error("Failed to load contacts:", error);
        }
    }, []);

    const handleContactChange = (index: number, field: 'name' | 'phone', value: string) => {
        const newContacts = [...contacts];
        newContacts[index] = { ...newContacts[index], [field]: value };
        setContacts(newContacts);
    };

    const handleSave = () => {
        try {
            localStorage.setItem('emergencyContacts', JSON.stringify(contacts));
            setSaveStatus('Contacts saved successfully!');
            setTimeout(() => {
                setSaveStatus('');
                onClose();
            }, 1500);
        } catch (error) {
            setSaveStatus('Failed to save contacts.');
            console.error("Failed to save contacts:", error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-brand-gray-darkest">Emergency SOS Contacts</h2>
                        <p className="text-sm text-brand-gray">Add up to 3 trusted contacts. These will be shown if your mood score is critically low.</p>
                    </div>
                     <button onClick={onClose} className="p-1 rounded-full hover:bg-brand-gray-light flex-shrink-0 ml-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    {[0, 1, 2].map(index => (
                        <div key={index} className="p-3 bg-brand-gray-lightest rounded-lg">
                            <label htmlFor={`contact-name-${index}`} className="block text-sm font-medium text-brand-gray-dark mb-1">
                                Contact #{index + 1} Name
                            </label>
                            <input
                                id={`contact-name-${index}`}
                                type="text"
                                value={contacts[index].name}
                                onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                                placeholder="e.g., Jane Doe"
                                className="w-full px-3 py-2 border border-brand-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue mb-2"
                            />
                            <label htmlFor={`contact-phone-${index}`} className="block text-sm font-medium text-brand-gray-dark mb-1">
                                Phone Number
                            </label>
                             <input
                                id={`contact-phone-${index}`}
                                type="tel"
                                value={contacts[index].phone}
                                onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full px-3 py-2 border border-brand-gray-light rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue"
                            />
                        </div>
                    ))}
                </div>
                <div className="p-4 bg-white rounded-b-2xl border-t">
                    <p className="text-center text-sm text-green-600 h-5 mb-2">{saveStatus}</p>
                    <button onClick={handleSave} className="w-full py-3 px-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors">
                        Save Contacts
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Parental Controls Modal ---
const ParentalControlsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [settings, setSettings] = useState<ParentalControlsSettings>({
        enabled: false,
        parentName: '',
        parentContact: '',
        shareMood: true,
        shareStreaks: true,
    });
    const [saveStatus, setSaveStatus] = useState('');

    useEffect(() => {
        const saved = localStorage.getItem('parentalControls');
        if (saved) {
            setSettings(JSON.parse(saved));
        }
    }, []);

    const handleSettingsChange = (field: keyof ParentalControlsSettings, value: string | boolean) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        localStorage.setItem('parentalControls', JSON.stringify(settings));
        setSaveStatus('Settings saved successfully!');
        setTimeout(() => {
            setSaveStatus('');
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg transform transition-all flex flex-col h-[90vh]" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-brand-gray-darkest">Parental Controls</h2>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-brand-gray-light"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-brand-gray" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                </header>
                
                <main className="flex-1 overflow-y-auto p-6 space-y-6">
                    <div className="bg-brand-gray-lightest p-4 rounded-lg flex items-center justify-between">
                        <label htmlFor="enable-controls" className="font-semibold text-brand-gray-darkest">Enable Parental Controls</label>
                        <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input type="checkbox" name="toggle" id="enable-controls" checked={settings.enabled} onChange={(e) => handleSettingsChange('enabled', e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                            <label htmlFor="enable-controls" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                        </div>
                    </div>

                    {settings.enabled && (
                        <div className="space-y-6 animate-fade-in">
                            <div>
                                <h3 className="font-semibold text-brand-gray-darkest mb-2">Parent/Guardian Information</h3>
                                <div className="space-y-3">
                                    <input type="text" placeholder="Parent/Guardian Name" value={settings.parentName} onChange={(e) => handleSettingsChange('parentName', e.target.value)} className="w-full p-2 border rounded-md"/>
                                    <input type="text" placeholder="Parent/Guardian Email or Phone" value={settings.parentContact} onChange={(e) => handleSettingsChange('parentContact', e.target.value)} className="w-full p-2 border rounded-md"/>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-semibold text-brand-gray-darkest mb-2">Sharing Settings</h3>
                                <div className="space-y-3">
                                    <div className="bg-brand-gray-lightest p-3 rounded-lg flex items-center justify-between">
                                        <label htmlFor="share-mood" className="text-sm text-brand-gray-dark">Share general mood trends</label>
                                        <input type="checkbox" id="share-mood" checked={settings.shareMood} onChange={e => handleSettingsChange('shareMood', e.target.checked)} className="toggle-checkbox" />
                                    </div>
                                    <div className="bg-brand-gray-lightest p-3 rounded-lg flex items-center justify-between">
                                        <label htmlFor="share-streaks" className="text-sm text-brand-gray-dark">Share activity streaks & badges</label>
                                        <input type="checkbox" id="share-streaks" checked={settings.shareStreaks} onChange={e => handleSettingsChange('shareStreaks', e.target.checked)} className="toggle-checkbox" />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="bg-green-50 p-3 rounded-lg">
                                    <h4 className="font-bold text-green-800 mb-1">✅ What parents CAN see:</h4>
                                    <ul className="list-disc list-inside text-green-700 space-y-1">
                                        <li>Summarized mood trends (e.g., happy, stressed)</li>
                                        <li>App engagement streaks & badges</li>
                                        <li>Emergency crisis alerts (for safety)</li>
                                    </ul>
                                </div>
                                <div className="bg-red-50 p-3 rounded-lg">
                                    <h4 className="font-bold text-red-800 mb-1">🚫 What parents CANNOT see:</h4>
                                    <ul className="list-disc list-inside text-red-700 space-y-1">
                                        <li>Your chat history</li>
                                        <li>Personal journal entries</li>
                                        <li>Specific mood check-in details</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </main>

                <footer className="p-4 bg-white rounded-b-2xl border-t">
                    <p className="text-center text-sm text-green-600 h-5 mb-2">{saveStatus}</p>
                    <button onClick={handleSave} className="w-full py-3 px-4 bg-brand-blue text-white font-semibold rounded-lg hover:bg-brand-blue-dark transition-colors">
                        Save Settings
                    </button>
                </footer>
                 <style>{`
                    .toggle-checkbox:checked { right: 0; border-color: #0EA5E9; }
                    .toggle-checkbox:checked + .toggle-label { background-color: #0EA5E9; }
                    @keyframes fade-in { 0% { opacity: 0; transform: translateY(-10px); } 100% { opacity: 1; transform: translateY(0); } }
                    .animate-fade-in { animation: fade-in 0.3s ease-out; }
                `}</style>
            </div>
        </div>
    );
};


// --- Main Profile Screen Component ---
const ProfileScreen: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [isAchievementsModalOpen, setIsAchievementsModalOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isParentalControlsOpen, setIsParentalControlsOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);

  const resources = [
    { icon: <EmergencyIcon />, title: "Emergency SOS Contacts", description: "Manage your emergency contacts", action: () => setIsSosModalOpen(true) },
    { icon: <ParentalControlIcon/>, title: "Parental Control", description: "Manage sharing settings", action: () => setIsParentalControlsOpen(true) },
    { icon: <TherapistIcon/>, title: "Find Therapists", description: "Nearby professionals", action: () => alert('This is a demo feature.') },
    { icon: <TrophyIcon/>, title: "My Achievements", description: "View & manage your wins", action: () => setIsAchievementsModalOpen(true) },
    { icon: <BadgeCollectionIcon/>, title: "Badge Collections", description: "View your earned badges", action: () => setIsBadgesModalOpen(true) },
  ];

  return (
    <div className="p-5 space-y-6 min-h-full bg-brand-sky-blue">
      <div className="flex items-center space-x-4 px-2">
        <img
          className="h-16 w-16 rounded-full object-cover ring-2 ring-white"
          src="https://picsum.photos/100"
          alt="User"
        />
        <div>
          <h2 className="text-2xl font-bold text-brand-gray-darkest">Demo User</h2>
          <p className="text-sm text-brand-gray">user@example.com</p>
        </div>
      </div>

      {/* Resources */}
      <div className="space-y-3">
        {resources.map((res) => {
           const isEmergency = res.title === "Emergency SOS Contacts";
           return (
             <div 
                key={res.title} 
                onClick={res.action} 
                className={`p-3 rounded-lg shadow-sm flex items-center space-x-4 cursor-pointer transition-colors ${
                  isEmergency 
                  ? 'bg-red-50 hover:bg-red-100' 
                  : 'bg-white hover:bg-brand-gray-lightest'
                }`}
             >
                <div className={`p-2 rounded-lg ${isEmergency ? 'bg-red-100 text-red-600' : 'bg-brand-gray-light text-brand-gray-dark'}`}>
                  {res.icon}
                </div>
                <div>
                    <p className={`font-semibold ${isEmergency ? 'text-red-800' : 'text-brand-gray-darkest'}`}>
                      {res.title}
                    </p>
                    <p className={`text-xs ${isEmergency ? 'text-red-700' : 'text-brand-gray'}`}>
                      {res.description}
                    </p>
                </div>
            </div>
          );
        })}
      </div>
      
      {/* Logout Button */}
      <button
        onClick={onLogout}
        className="w-full flex items-center justify-center py-3 px-4 text-sm font-medium text-red-600 bg-white rounded-lg shadow-sm hover:bg-red-50"
      >
        <LogoutIcon />
        <span className="ml-2">Logout</span>
      </button>
      
      {isAchievementsModalOpen && <AchievementsModal onClose={() => setIsAchievementsModalOpen(false)} />}
      {isBadgesModalOpen && <BadgeCollectionsModal onClose={() => setIsBadgesModalOpen(false)} />}
      {isSosModalOpen && <SosSettingsModal onClose={() => setIsSosModalOpen(false)} />}
      {isParentalControlsOpen && <ParentalControlsModal onClose={() => setIsParentalControlsOpen(false)} />}
    </div>
  );
};

// Icons
const TherapistIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>;
const ParentalControlIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const EmergencyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const TrophyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.252a.25.25 0 00.435.178l.433-.433a.75.75 0 111.06 1.06l-.433.433a.25.25 0 00.178.435h.252a.75.75 0 010 1.5h-.252a.25.25 0 00-.178.435l.433.433a.75.75 0 11-1.06-1.06l-.433-.433a.25.25 0 00-.435.178v.252a.75.75 0 01-1.5 0v-.252a.25.25 0 00-.435-.178l-.433.433a.75.75 0 11-1.06-1.06l.433-.433a.25.25 0 00-.178-.435h-.252a.75.75 0 010-1.5h.252a.25.25 0 00.178-.435l-.433-.433a.75.75 0 011.06-1.06l.433.433a.25.25 0 00.435-.178V2.75A.75.75 0 0110 2zM12.25 10a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" /></svg>;
const BadgeCollectionIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM5.75 8.25a.75.75 0 000 1.5h8.5a.75.75 0 000-1.5h-8.5zM6 4.75a.75.75 0 01.75-.75h6.5a.75.75 0 010 1.5h-6.5A.75.75 0 016 4.75zm.75 9a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" /></svg>;

export default ProfileScreen;]