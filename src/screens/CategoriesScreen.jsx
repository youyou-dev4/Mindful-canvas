import React, { useState } from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Alert,Modal,TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useCategories, useCreateCategory } from '../hooks/useCategories';
import { useNotes } from '../hooks/useNotes';

// ─── Couleurs disponibles pour une nouvelle catégorie ─────────────
const COLORS = ['#4A6FA5', '#2C3E50', '#F39C12', '#27AE60', '#E74C3C', '#9B59B6', '#1ABC9C', '#E67E22'];
const ICONS  = ['👤', '💼', '💡', '✈️', '🎨', '📚', '🏋️', '🎵'];

// ─── Modal création catégorie ─────────────────────────────────────
const CreateCategoryModal = ({ visible, onClose, onSubmit }) => {
  const [name,  setName]  = useState('');
  const [color, setColor] = useState(COLORS[0]);
  const [icon,  setIcon]  = useState(ICONS[0]);

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert('Nom requis', 'Donne un nom à ta catégorie.');
      return;
    }
    onSubmit({ name, color, icon });
    setName('');
    setColor(COLORS[0]);
    setIcon(ICONS[0]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>Nouvelle Catégorie</Text>

          <TextInput
            style={styles.modalInput}
            placeholder="Nom de la catégorie"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
          />

          {/* Choix couleur */}
          <Text style={styles.modalLabel}>Couleur</Text>
          <View style={styles.colorRow}>
            {COLORS.map((c) => (
              <TouchableOpacity
                key={c}
                style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
                onPress={() => setColor(c)}
              />
            ))}
          </View>

          {/* Choix icône */}
          <Text style={styles.modalLabel}>Icône</Text>
          <View style={styles.iconRow}>
            {ICONS.map((i) => (
              <TouchableOpacity
                key={i}
                style={[styles.iconBtn, icon === i && styles.iconBtnSelected]}
                onPress={() => setIcon(i)}
              >
                <Text style={styles.iconBtnText}>{i}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.modalCancel} onPress={onClose}>
              <Text style={styles.modalCancelText}>Annuler</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalSubmit} onPress={handleSubmit}>
              <Text style={styles.modalSubmitText}>Créer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─── CategoryCard ─────────────────────────────────────────────────
const CategoryCard = ({ category, noteCount }) => (
  <View style={[styles.card, { borderLeftColor: category.color, borderLeftWidth: 4 }]}>
    <View style={styles.cardTop}>
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        <Text style={styles.cardIcon}>{category.icon}</Text>
      </View>
      <Text style={styles.noteCount}>{noteCount} Notes</Text>
    </View>
    <Text style={styles.cardName}>{category.name}</Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────
export default function CategoriesScreen() {
  const { data: categories = [] } = useCategories();
  const { data: notes = [] }      = useNotes();
  const createCategory            = useCreateCategory();
  const [modalVisible, setModalVisible] = useState(false);

  const getNoteCount = (categoryId) =>
    notes.filter((n) => n.categoryId === categoryId).length;

  const handleCreate = async (data) => {
    await createCategory.mutateAsync(data);
    setModalVisible(false);
  };

  // ─── Stats ──────────────────────────────────────────────────────
  const totalNotes    = notes.length;
  const updatedLast7  = notes.filter((n) => {
    const diff = Date.now() - new Date(n.updatedAt).getTime();
    return diff < 7 * 24 * 60 * 60 * 1000;
  }).length;
  const pinnedCount   = notes.filter((n) => n.isPinned).length;
  const freeSpace     = 82;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ─── Header ───────────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerLabel}>ORGANISATION</Text>
            <Text style={styles.headerTitle}>Categories</Text>
          </View>
          <TouchableOpacity
            style={styles.newBtn}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.newBtnText}>+ Nouvelle Catégorie</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Cards ────────────────────────────────────────────── */}
        {categories.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            noteCount={getNoteCount(cat.id)}
          />
        ))}

        {/* ─── Ajouter un dossier ───────────────────────────────── */}
        <TouchableOpacity
          style={styles.addFolder}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addFolderIcon}>+</Text>
          <Text style={styles.addFolderText}>Ajouter un dossier</Text>
        </TouchableOpacity>

        {/* ─── Stats ────────────────────────────────────────────── */}
        <View style={styles.statsSection}>
          <Text style={styles.statsTitle}>Statistiques de Canvas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalNotes}</Text>
              <Text style={styles.statLabel}>TOTAL NOTES</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{updatedLast7}</Text>
              <Text style={styles.statLabel}>MISES À JOUR (7J)</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{pinnedCount}</Text>
              <Text style={styles.statLabel}>FAVORIS</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{freeSpace}%</Text>
              <Text style={styles.statLabel}>ESPACE LIBRE</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      <CreateCategoryModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={handleCreate}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent:      { padding: 20, paddingBottom: 40 },

  // Header
  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  headerLabel:        { fontSize: 11, color: '#9CA3AF', fontWeight: '600', letterSpacing: 1, marginBottom: 4 },
  headerTitle:        { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  newBtn:             { backgroundColor: '#2C3E50', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginTop: 8 },
  newBtnText:         { color: '#FFF', fontSize: 12, fontWeight: '600' },

  // Card
  card:               { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardTop:            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  iconContainer:      { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardIcon:           { fontSize: 22 },
  noteCount:          { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  cardName:           { fontSize: 20, fontWeight: '700', color: '#1A1A2E' },

  // Add folder
  addFolder:          { alignItems: 'center', justifyContent: 'center', paddingVertical: 20, marginBottom: 24, gap: 8 },
  addFolderIcon:      { fontSize: 28, color: '#9CA3AF' },
  addFolderText:      { fontSize: 13, color: '#9CA3AF' },

  // Stats
  statsSection:       { backgroundColor: '#FFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  statsTitle:         { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 16 },
  statsGrid:          { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard:           { flex: 1, minWidth: '40%', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 14, alignItems: 'center' },
  statValue:          { fontSize: 24, fontWeight: '700', color: '#1A1A2E' },
  statLabel:          { fontSize: 10, color: '#9CA3AF', fontWeight: '600', letterSpacing: 0.5, marginTop: 4, textAlign: 'center' },

  // Modal
  modalOverlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalCard:          { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalTitle:         { fontSize: 20, fontWeight: '700', color: '#1A1A2E', marginBottom: 20 },
  modalInput:         { backgroundColor: '#F8F9FA', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#1A1A2E', marginBottom: 16 },
  modalLabel:         { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 10, letterSpacing: 0.5 },
  colorRow:           { flexDirection: 'row', gap: 10, marginBottom: 16 },
  colorDot:           { width: 30, height: 30, borderRadius: 15 },
  colorDotSelected:   { borderWidth: 3, borderColor: '#1A1A2E' },
  iconRow:            { flexDirection: 'row', gap: 8, marginBottom: 24 },
  iconBtn:            { width: 40, height: 40, borderRadius: 10, backgroundColor: '#F8F9FA', alignItems: 'center', justifyContent: 'center' },
  iconBtnSelected:    { backgroundColor: '#4A6FA5' },
  iconBtnText:        { fontSize: 20 },
  modalActions:       { flexDirection: 'row', gap: 12 },
  modalCancel:        { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', alignItems: 'center' },
  modalCancelText:    { color: '#6B7280', fontWeight: '600' },
  modalSubmit:        { flex: 1, paddingVertical: 14, borderRadius: 12, backgroundColor: '#4A6FA5', alignItems: 'center' },
  modalSubmitText:    { color: '#FFF', fontWeight: '600' },
});