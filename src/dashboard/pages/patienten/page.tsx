import React, { useState, useEffect, useMemo } from 'react';
import {
  Page,
  WixDesignSystemProvider,
  Button,
  Box,
  Text,
  Heading,
  Table,
  TableToolbar,
  TableActionCell,
  Search,
  Badge,
  Avatar,
  Card,
  Pagination,
  Loader
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { dashboard } from '@wix/dashboard';
import { usePatientData } from '../../hooks/usePatientData';
import { useFilters } from '../../hooks/useFilters';
import { PatientTable } from '../../components/PatientTable';
import { FilterPanel } from '../../components/FilterPanel';
import { StatisticsCards } from '../../components/StatisticsCards';

const PatientDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Use the custom hook to fetch real patient data
  // ALL HOOKS MUST BE CALLED FIRST - BEFORE ANY CONDITIONAL RETURNS

  // Use the custom hook to fetch real patient data
  const {
    allSubmissions,
    loading,
    error,
    loadSubmissions,
    calculateAgeGroups,
    calculateGenderGroups
  } = usePatientData();

  // Use the filter hook
  const {
    filters,
    filteredSubmissions,
    updateFilter,
    clearFilters
  } = useFilters(allSubmissions);

  // Update time every minute - MUST be before conditional returns
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const berlinTime = now.toLocaleTimeString('de-DE', {
        timeZone: 'Europe/Berlin',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      const berlinDate = now.toLocaleDateString('de-DE', {
        timeZone: 'Europe/Berlin',
        day: 'numeric',
        month: 'long'
      });

      setCurrentTime(berlinTime);
      setCurrentDate(berlinDate);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate statistics
  const ageGroups = calculateAgeGroups(allSubmissions);
  const genderGroups = calculateGenderGroups(allSubmissions);
  const waitingTime = { months: 7, days: 23 }; // You can calculate this based on real data later

  // NOW you can do conditional returns - AFTER all hooks are called
  if (loading) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Page>
          <Box textAlign="center" padding="80px">
            <Loader />
            <Text>Lade Patientendaten...</Text>
          </Box>
        </Page>
      </WixDesignSystemProvider>
    );
  }

  if (error) {
    return (
      <WixDesignSystemProvider features={{ newColorsBranding: true }}>
        <Page>
          <Box textAlign="center" padding="40px">
            <Text>Fehler beim Laden der Daten: {error}</Text>
            <Button onClick={loadSubmissions}>Erneut versuchen</Button>
          </Box>
        </Page>
      </WixDesignSystemProvider>
    );
  }

  const handleRefresh = async () => {
    dashboard.showToast({
      message: 'Daten werden aktualisiert...',
      type: 'success',
    });
    await loadSubmissions();
  };

  const handleAddNewRegistration = () => {
    window.open('https://www.xn--logopdie-falkensee-ptb.de/anmeldung', '_blank');
  };

  const handleViewPatient = (patient: any) => {
    const patientName = `${patient.submissions.name_1 || ''} ${patient.submissions.vorname || ''}`.trim();
    dashboard.showToast({
      message: `Öffne Details für ${patientName}`,
      type: 'standard',
    });
  };

  const handlePrintPatient = (patient: any) => {
    const patientName = `${patient.submissions.name_1 || ''} ${patient.submissions.vorname || ''}`.trim();
    dashboard.showToast({
      message: `Drucke ${patientName}`,
      type: 'standard',
    });
  };

  return (
    <WixDesignSystemProvider features={{ newColorsBranding: true }}>
      <Page>
        <Page.Header
          title="Patientenliste"
          subtitle="Verwalten Sie Ihre Patienteneinreichungen und Wartelisten"
          actionsBar={
            <Box direction="horizontal" gap="SP3">
              <Button
                onClick={handleRefresh}
                prefixIcon={<Icons.Refresh />}
                priority="secondary"
              >
                Aktualisieren
              </Button>
              <Button
                onClick={handleAddNewRegistration}
                prefixIcon={<Icons.Add />}
              >
                Neue Einreichung Hinzufügen
              </Button>
            </Box>
          }
        />

        <Page.Content>
          {/* Main Container - Vertical Stack */}
          <Box direction="vertical" gap="SP6" padding="24px">

            {/* Statistics Cards Section - Horizontal Row at Top */}
            <StatisticsCards
              totalPatients={allSubmissions.length}
              waitingTime={waitingTime}
              ageGroups={ageGroups}
              genderGroups={genderGroups}
              currentTime={currentTime}
              currentDate={currentDate}
            />

            {/* Main Content Area - Two Column Layout */}
            <Box direction="horizontal" gap="SP6" width="100%">

              {/* Left Column - Patient Table */}
              <Box direction="vertical" gap="SP4" flexGrow={1}>
                <PatientTable
                  patients={filteredSubmissions}
                  onViewPatient={handleViewPatient}
                  onPrintPatient={handlePrintPatient}
                  onDeletePatient={(id) => console.log('Delete', id)}
                  onUpdatePatientStatus={(id, status) => console.log('Update status', id, status)}
                  searchTerm={filters.searchTerm}
                  onSearchChange={(value) => updateFilter('searchTerm', value)}
                  totalPatients={allSubmissions.length}
                />
              </Box>

              {/* Right Column - Filter Panel */}
              <Box width="300px">
                <FilterPanel
                  filters={filters}
                  onFilterChange={updateFilter}
                  onClearFilters={clearFilters}
                />
              </Box>

            </Box>
          </Box>
        </Page.Content>
      </Page>
    </WixDesignSystemProvider>
  );
};

export default PatientDashboard;