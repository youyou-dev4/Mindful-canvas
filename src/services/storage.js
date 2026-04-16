import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  NOTES: 'mindful_notes',
  CATEGORIES: 'mindful_categories',
};

// Données initiales 
const DEFAULT_CATEGORIES = [
  { id: 'personal', name: 'Personnel', icon: '👤', color: '#4A6FA5' },
  { id: 'work',     name: 'Travail',   icon: '💼', color: '#2C3E50' },
  { id: 'ideas',    name: 'Idées',     icon: '💡', color: '#F39C12' },
  { id: 'travel',   name: 'Voyage',    icon: '✈️', color: '#27AE60' },
];

const DEFAULT_NOTES = [
  {
    id: '1',
    title: 'Vision pour le studio créatif 2024',
    content: 'Explorer de nouveaux territoires visuels en intégrant l\'asymétrie intentionnelle et des palettes...',
    categoryId: 'personal',
    isPinned: true,
    createdAt: '2023-10-12T10:00:00.000Z',
    updatedAt: '2023-10-12T10:00:00.000Z',
  },
  {
    id: '2',
    title: 'Liste de lecture design',
    content: '"The Elements of Typographic Style" - Robert Bringhurst. Une bible pour comprendre le rythme visuel.',
    categoryId: 'ideas',
    isPinned: false,
    createdAt: '2023-10-23T10:00:00.000Z',
    updatedAt: '2023-10-23T10:00:00.000Z',
  },
  {
    id: '3',
    title: 'Réunion de projet',
    content: 'Points clés : budget finalisé pour le Q4, recrutement du nouveau designer UI senior en cours.',
    categoryId: 'work',
    isPinned: false,
    createdAt: '2023-10-21T10:00:00.000Z',
    updatedAt: '2023-10-21T10:00:00.000Z',
  },
  {
    id: '4',
    title: 'Objectifs de vie',
    content: 'Apprendre la poterie d\'ici la fin de l\'année. Méditer au moins 10 minutes par jour.',
    categoryId: 'personal',
    isPinned: false,
    createdAt: '2023-10-17T10:00:00.000Z',
    updatedAt: '2023-10-17T10:00:00.000Z',
  },
];

// Seed (premier lancement)
export const seedIfEmpty = async () => {
  try {
    console.log('Seed start');

    const existing = await AsyncStorage.getItem(KEYS.NOTES);
    console.log('Existing:', existing);

    if (!existing) {
      console.log('Seeding data...');

      await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(DEFAULT_NOTES));
      await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    }

    console.log('Seed done');
  } catch (e) {
    console.error('Seed error:', e);
    throw e;
  }
};
//  Notes 
export const getNotes = async () => {
  const data = await AsyncStorage.getItem(KEYS.NOTES);
  return data ? JSON.parse(data) : [];
};

export const getNoteById = async (id) => {
  const notes = await getNotes();
  return notes.find((n) => n.id === id) ?? null;
};

export const createNote = async (noteData) => {
  const notes = await getNotes();
  const newNote = {
    ...noteData,
    id: Date.now().toString(),
    isPinned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify([newNote, ...notes]));
  return newNote;
};

export const updateNote = async (id, updates) => {
  const notes = await getNotes();
  const updated = notes.map((n) =>
    n.id === id ? { ...n, ...updates, updatedAt: new Date().toISOString() } : n
  );
  await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(updated));
  return updated.find((n) => n.id === id);
};

export const deleteNote = async (id) => {
  const notes = await getNotes();
  const filtered = notes.filter((n) => n.id !== id);
  await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(filtered));
};

// Categories 
export const getCategories = async () => {
  const data = await AsyncStorage.getItem(KEYS.CATEGORIES);
  return data ? JSON.parse(data) : [];
};

export const createCategory = async (categoryData) => {
  const categories = await getCategories();
  const newCategory = { ...categoryData, id: Date.now().toString() };
  await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify([...categories, newCategory]));
  return newCategory;
};