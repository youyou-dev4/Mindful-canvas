import React from 'react';
import {View,Text,ScrollView,TouchableOpacity,StyleSheet,Switch,Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import useAppStore from '../store/useAppStore';
import { useNotes } from '../hooks/useNotes';
import { useCategories } from '../hooks/useCategories';

// ─── Composants réutilisables ─────────────────────────────────────
const SectionTitle = ({ label }) => (
  <Text style={styles.sectionTitle}>{label}</Text>
);

const SettingRow = ({ icon, title, subtitle, right }) => (
  <View style={styles.settingRow}>
    <Text style={styles.settingIcon}>{icon}</Text>
    <View style={styles.settingInfo}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    <View style={styles.settingRight}>{right}</View>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────
export default function SettingsScreen() {
  const { theme, toggleTheme } = useAppStore();
  const { data: notes = [] }      = useNotes();
  const { data: categories = [] } = useCategories();

  // Calcul stockage fictif basé sur le nombre de notes
  const usedMB    = (notes.length * 0.48).toFixed(1);
  const totalMB   = 5000;
  const usedRatio = (usedMB / totalMB);

  const handleConfigureCode = () =>
    Alert.alert('Sécurité', 'Configuration du code PIN — disponible prochainement.');

  const handleLogout = () =>
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Déconnexion', style: 'destructive', onPress: () => {} },
    ]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* ─── Header ───────────────────────────────────────────── */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
          <Text style={styles.headerSubtitle}>Personnalisez votre sanctuaire de pensée</Text>
        </View>

        {/* ─── Apparence ────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🎨</Text>
            <Text style={styles.cardTitle}>Apparence</Text>
          </View>
          <Text style={styles.cardSubtitle}>Choisissez l'ambiance de votre espace de travail.</Text>

          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'light' && styles.themeBtnActive]}
              onPress={() => theme !== 'light' && toggleTheme()}
            >
              <Text style={[styles.themeBtnText, theme === 'light' && styles.themeBtnTextActive]}>
                Clair
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeBtn, theme === 'dark' && styles.themeBtnActive]}
              onPress={() => theme !== 'dark' && toggleTheme()}
            >
              <Text style={[styles.themeBtnText, theme === 'dark' && styles.themeBtnTextActive]}>
                Sombre
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Sécurité ─────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>🔒</Text>
            <Text style={styles.cardTitle}>Sécurité</Text>
          </View>
          <Text style={styles.cardSubtitle}>Protégez vos notes avec un code secret.</Text>
          <TouchableOpacity style={styles.configBtn} onPress={handleConfigureCode}>
            <Text style={styles.configBtnText}>Configurer le code</Text>
          </TouchableOpacity>
        </View>

        {/* ─── Stockage & Cloud ─────────────────────────────────── */}
        <SectionTitle label="STOCKAGE & CLOUD" />
        <View style={styles.card}>
          <SettingRow
            icon="☁️"
            title="Sauvegarde Automatique"
            subtitle="Dernière synchro : il y a 5 min"
            right={<Switch value={true} onValueChange={() => {}} trackColor={{ true: '#4A6FA5' }} />}
          />

          <View style={styles.divider} />

          <View style={styles.storageSection}>
            <View style={styles.storageHeader}>
              <Text style={styles.storageLabel}>Espace Cloud</Text>
              <Text style={styles.storageValue}>{usedMB} MB / {totalMB} MB</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(usedRatio * 100, 100)}%` }]} />
            </View>
            <TouchableOpacity>
              <Text style={styles.manageStorage}>Gérer le stockage →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── À propos ─────────────────────────────────────────── */}
        <SectionTitle label="À PROPOS" />
        <View style={styles.card}>
          <SettingRow
            icon="ℹ️"
            title="Version de l'application"
            right={<Text style={styles.versionBadge}>v1.0.0-stable</Text>}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="🛡️"
            title="Politique de Confidentialité"
            right={<Text style={styles.arrow}>↗</Text>}
          />
          <View style={styles.divider} />
          <SettingRow
            icon="❓"
            title="Centre d'aide & Support"
            right={<Text style={styles.arrow}>›</Text>}
          />
        </View>

        {/* ─── Stats rapides ────────────────────────────────────── */}
        <View style={styles.quickStats}>
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{notes.length}</Text>
            <Text style={styles.quickStatLabel}>Notes</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{categories.length}</Text>
            <Text style={styles.quickStatLabel}>Catégories</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStat}>
            <Text style={styles.quickStatValue}>{notes.filter(n => n.isPinned).length}</Text>
            <Text style={styles.quickStatLabel}>Épinglées</Text>
          </View>
        </View>

        {/* ─── Déconnexion ──────────────────────────────────────── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>⎋  Déconnexion</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent:      { padding: 20, paddingBottom: 40 },

  // Header
  header:             { marginBottom: 24 },
  headerTitle:        { fontSize: 28, fontWeight: '700', color: '#1A1A2E' },
  headerSubtitle:     { fontSize: 13, color: '#9CA3AF', marginTop: 4 },

  // Section title
  sectionTitle:       { fontSize: 11, color: '#9CA3AF', fontWeight: '600', letterSpacing: 1, marginBottom: 10, marginTop: 8 },

  // Card
  card:               { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardHeader:         { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  cardIcon:           { fontSize: 20 },
  cardTitle:          { fontSize: 16, fontWeight: '700', color: '#1A1A2E' },
  cardSubtitle:       { fontSize: 13, color: '#6B7280', marginBottom: 16 },

  // Theme
  themeRow:           { flexDirection: 'row', backgroundColor: '#F8F9FA', borderRadius: 12, padding: 4 },
  themeBtn:           { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  themeBtnActive:     { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  themeBtnText:       { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  themeBtnTextActive: { color: '#1A1A2E', fontWeight: '700' },

  // Security
  configBtn:          { backgroundColor: '#EBF0F8', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  configBtnText:      { color: '#4A6FA5', fontWeight: '600', fontSize: 14 },

  // Setting row
  settingRow:         { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIcon:        { fontSize: 20 },
  settingInfo:        { flex: 1 },
  settingTitle:       { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  settingSubtitle:    { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  settingRight:       { alignItems: 'flex-end' },

  // Storage
  storageSection:     { marginTop: 16 },
  storageHeader:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  storageLabel:       { fontSize: 14, fontWeight: '600', color: '#1A1A2E' },
  storageValue:       { fontSize: 13, color: '#6B7280' },
  progressBar:        { height: 6, backgroundColor: '#F0F0F0', borderRadius: 3, marginBottom: 10 },
  progressFill:       { height: 6, backgroundColor: '#4A6FA5', borderRadius: 3 },
  manageStorage:      { color: '#4A6FA5', fontSize: 13, fontWeight: '600' },

  // About
  versionBadge:       { backgroundColor: '#F0F0F0', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, fontSize: 12, color: '#6B7280', fontFamily: 'monospace' },
  arrow:              { fontSize: 18, color: '#9CA3AF' },
  divider:            { height: 1, backgroundColor: '#F0F0F0', marginVertical: 12 },

  // Quick stats
  quickStats:         { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  quickStat:          { flex: 1, alignItems: 'center' },
  quickStatValue:     { fontSize: 22, fontWeight: '700', color: '#1A1A2E' },
  quickStatLabel:     { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  quickStatDivider:   { width: 1, backgroundColor: '#F0F0F0' },

  // Logout
  logoutBtn:          { borderWidth: 1.5, borderColor: '#E74C3C', borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  logoutText:         { color: '#E74C3C', fontWeight: '600', fontSize: 15 },
});