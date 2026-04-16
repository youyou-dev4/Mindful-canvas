import React, { useState, useEffect } from 'react';
import {View,Text,TextInput,TouchableOpacity,StyleSheet,ScrollView,KeyboardAvoidingView,Platform,Alert,} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useNote, useCreateNote, useUpdateNote, useDeleteNote } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';

// ─── Screen ───────────────────────────────────────────────────────
export default function NoteEditorScreen({ navigation, route }) {
  const { noteId } = route.params ?? {};
  const isEditing = !!noteId;

  // ─── Data ───────────────────────────────────────────────────────
  const { data: note } = useNote(noteId);
  const { data: categories = [] } = useCategories();

  const createNote  = useCreateNote();
  const updateNote  = useUpdateNote();
  const deleteNote  = useDeleteNote();

  // ─── State local ────────────────────────────────────────────────
  const [title,      setTitle]      = useState('');
  const [content,    setContent]    = useState('');
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? '');

  // Pré-remplir si édition
  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setCategoryId(note.categoryId);
    }
  }, [note]);

  // ─── Actions ────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Titre requis', 'Donne un titre à ta note.');
      return;
    }

    if (isEditing) {
      await updateNote.mutateAsync({ id: noteId, updates: { title, content, categoryId } });
    } else {
      await createNote.mutateAsync({ title, content, categoryId });
    }

    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert(
      'Supprimer la note',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteNote.mutateAsync(noteId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  const isSaving = createNote.isPending || updateNote.isPending;

  const selectedCategory = categories.find((c) => c.id === categoryId);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* ─── Header ─────────────────────────────────────────── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>✕</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Mindful Canvas</Text>

          <View style={styles.headerRight}>
            {isEditing && (
              <TouchableOpacity onPress={handleDelete} style={styles.headerBtn}>
                <Text style={styles.deleteIcon}>🗑️</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, isSaving && styles.saveBtnDisabled]}
              disabled={isSaving}
            >
              <Text style={styles.saveBtnText}>
                {isSaving ? '...' : '✓  Save'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Filtres catégories ──────────────────────────────── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.catChip,
                categoryId === cat.id && { backgroundColor: cat.color ?? '#4A6FA5' },
              ]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Text
                style={[
                  styles.catChipText,
                  categoryId === cat.id && styles.catChipTextActive,
                ]}
              >
                {cat.name.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ─── Éditeur ────────────────────────────────────────── */}
        <ScrollView style={styles.editor} contentContainerStyle={styles.editorContent}>
          <TextInput
            style={styles.titleInput}
            placeholder="Untitled Thought"
            placeholderTextColor="#C0C0C0"
            value={title}
            onChangeText={setTitle}
            multiline
          />

          {/* Meta */}
          <View style={styles.meta}>
            <Text style={styles.metaText}>
              📅  {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
            {selectedCategory && (
              <View style={[styles.catDot, { backgroundColor: selectedCategory.color }]} />
            )}
          </View>

          <TextInput
            style={styles.contentInput}
            placeholder="Start your story here..."
            placeholderTextColor="#C0C0C0"
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        {/* ─── Toolbar bas ────────────────────────────────────── */}
        <View style={styles.toolbar}>
          {['B', 'I', '≡', '❝', '🔗', '🖼', '⋯'].map((icon) => (
            <TouchableOpacity key={icon} style={styles.toolbarBtn}>
              <Text style={styles.toolbarIcon}>{icon}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#F8F9FA' },

  // Header
  header:             { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F8F9FA' },
  headerBtn:          { padding: 8 },
  headerBtnText:      { fontSize: 18, color: '#6B7280' },
  headerTitle:        { fontSize: 16, fontWeight: '700', color: '#4A6FA5' },
  headerRight:        { flexDirection: 'row', alignItems: 'center', gap: 8 },
  deleteIcon:         { fontSize: 18 },
  saveBtn:            { backgroundColor: '#2C3E50', paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20 },
  saveBtnDisabled:    { opacity: 0.5 },
  saveBtnText:        { color: '#FFF', fontWeight: '600', fontSize: 14 },

  // Categories
  categoriesScroll:   { maxHeight: 50, backgroundColor: '#F8F9FA' },
  categoriesContent:  { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  catChip:            { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: '#E5E7EB' },
  catChipText:        { fontSize: 11, fontWeight: '700', color: '#6B7280', letterSpacing: 0.8 },
  catChipTextActive:  { color: '#FFF' },

  // Editor
  editor:             { flex: 1 },
  editorContent:      { padding: 20, paddingBottom: 40 },
  titleInput:         { fontSize: 28, fontWeight: '700', color: '#C0C0C0', marginBottom: 12, lineHeight: 36 },
  meta:               { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  metaText:           { fontSize: 12, color: '#9CA3AF' },
  catDot:             { width: 8, height: 8, borderRadius: 4 },
  contentInput:       { fontSize: 15, color: '#374151', lineHeight: 24, minHeight: 300 },

  // Toolbar
  toolbar:            { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#F0F0F0', paddingVertical: 12, paddingHorizontal: 8 },
  toolbarBtn:         { padding: 8 },
  toolbarIcon:        { fontSize: 18, color: '#374151' },
});