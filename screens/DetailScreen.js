import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../config/constants';

export default function DetailScreen({ route }) {
  const { record } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Record Details</Text>
            {record.table_name && (
              <Text style={styles.headerSubtitle}>
                Source: {record.table_name}
              </Text>
            )}
          </View>

          <View style={styles.detailsContainer}>
            {Object.entries(record).map(([key, value]) => {
              // Skip internal fields or display them differently
              if (key === 'id' || key === '_id') {
                return null;
              }

              const displayValue =
                value !== null && value !== undefined ? String(value) : 'N/A';

              return (
                <View key={key} style={styles.detailRow}>
                  <View style={styles.detailLabelContainer}>
                    <Text style={styles.detailLabel}>{key}</Text>
                  </View>
                  <View style={styles.detailValueContainer}>
                    <Text style={styles.detailValue}>{displayValue}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
    fontStyle: 'italic',
  },
  detailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailRow: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  detailLabelContainer: {
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.lightGray,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValueContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    padding: 12,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.white,
    lineHeight: 22,
  },
});
