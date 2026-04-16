import React, { useMemo } from 'react';
import {View,Text,ScrollView,TextInput,TouchableOpacity,StyleSheet,FlatList} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';
import useAppStore from '../store/useAppStore';

// Helpers
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Aujourd'hui";
  if (days === 1) return 'Hier';
  if (days < 7)  return `Il y a ${days} jours`;
  return 'Semaine dernière';
};

// NoteCard 
const NoteCard = ({ note, category, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
    {note.isPinned && (
      <View style={styles.pinnedBadge}>
        <Text style={styles.pinnedText}>NOTE ÉPINGLÉE</Text>
        <Text style={styles.pinIcon}>📌</Text>
      </View>
    )}

    <View style={[styles.cardAccent, { backgroundColor: category?.color ?? '#4A6FA5' }]} />

    <View style={styles.cardContent}>
      <Text style={styles.cardTitle} numberOfLines={2}>{note.title}</Text>
      <Text style={styles.cardPreview} numberOfLines={3}>{note.content}</Text>
      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>{timeAgo(note.updatedAt)}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Screen
export default function NotesListScreen({ navigation }) {
  const { data: notes = [], isLoading } = useNotes();
  const { data: categories = [] } = useCategories();

  const { activeFilter, setActiveFilter, searchQuery, setSearchQuery } = useAppStore();

  //Filtrage & recherche
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (activeFilter !== 'all') {
      result = result.filter((n) => n.categoryId === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.content.toLowerCase().includes(q)
      );
    }

    // Épinglées en premier
    return result.sort((a, b) => b.isPinned - a.isPinned);
  }, [notes, activeFilter, searchQuery]);

  const getCategoryById = (id) => categories.find((c) => c.id === id);

  const filters = [{ id: 'all', name: 'Tout' }, ...categories];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}

        //Header
        ListHeaderComponent={
          <View>
            {/* Titre */}
            <View style={styles.header}>
              <View>
                <Text style={styles.greeting}>Bonjour,</Text>
                <Text style={styles.subtitle}>Votre espace de pensée est prêt.</Text>
              </View>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>Y</Text>
              </View>
            </View>

            {/* Searchbar */}
            <View style={styles.searchContainer}>
              <Text style={styles.searchIcon}>🔍</Text>
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher une pensée..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            {/* Filtres */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filtersScroll}
              contentContainerStyle={styles.filtersContent}
            >
              {filters.map((f) => (
                <TouchableOpacity
                  key={f.id}
                  style={[
                    styles.filterChip,
                    activeFilter === f.id && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilter(f.id)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === f.id && styles.filterTextActive,
                    ]}
                  >
                    {f.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        }

        // Notes
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            category={getCategoryById(item.categoryId)}
            onPress={() => navigation.navigate('NoteEditor', { noteId: item.id })}
          />
        )}

        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Aucune note trouvée</Text>
          </View>
        }
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NoteEditor', {})}
        activeOpacity={0.8}
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

//Styles
const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: '#F8F9FA' },
  centered:       { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  loadingText:    { color: '#9CA3AF', fontSize: 14 },
  emptyText:      { color: '#9CA3AF', fontSize: 14 },

  // Header
  header:         { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 12 },
  greeting:       { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  subtitle:       { fontSize: 13, color: '#9CA3AF', marginTop: 2 },
  avatar:         { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4A6FA5', alignItems: 'center', justifyContent: 'center' },
  avatarText:     { color: '#FFF', fontWeight: '700', fontSize: 16 },

  // Search
  searchContainer:{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, marginHorizontal: 20, marginBottom: 16, paddingHorizontal: 14, paddingVertical: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchIcon:     { fontSize: 16, marginRight: 8 },
  searchInput:    { flex: 1, fontSize: 14, color: '#1A1A2E' },

  // Filters
  filtersScroll:  { marginBottom: 16 },
  filtersContent: { paddingHorizontal: 20, gap: 8 },
  filterChip:     { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E5E7EB' },
  filterChipActive:{ backgroundColor: '#4A6FA5', borderColor: '#4A6FA5' },
  filterText:     { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterTextActive:{ color: '#FFF' },

  // List
  listContent:    { paddingBottom: 100 },

  // Card
  card:           { backgroundColor: '#FFF', borderRadius: 16, marginHorizontal: 20, marginBottom: 12, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardAccent:     { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4 },
  cardContent:    { padding: 16, paddingLeft: 20 },
  pinnedBadge:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 0 },
  pinnedText:     { fontSize: 10, color: '#9CA3AF', fontWeight: '600', letterSpacing: 0.8 },
  pinIcon:        { fontSize: 14 },
  cardTitle:      { fontSize: 16, fontWeight: '700', color: '#1A1A2E', marginBottom: 6 },
  cardPreview:    { fontSize: 13, color: '#6B7280', lineHeight: 19 },
  cardFooter:     { marginTop: 10 },
  cardDate:       { fontSize: 11, color: '#9CA3AF' },

  // FAB
  fab:            { position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: '#4A6FA5', alignItems: 'center', justifyContent: 'center', shadowColor: '#4A6FA5', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 6 },
  fabIcon:        { color: '#FFF', fontSize: 28, fontWeight: '300', marginTop: -2 },
});