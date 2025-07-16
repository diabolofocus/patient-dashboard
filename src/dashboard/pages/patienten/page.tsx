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
  Loader,
  Layout,
  Cell,
  CustomModalLayout
} from '@wix/design-system';
import '@wix/design-system/styles.global.css';
import * as Icons from '@wix/wix-ui-icons-common';
import { dashboard } from '@wix/dashboard';
import { usePatientData } from '../../hooks/usePatientData';
import { useFilters } from '../../hooks/useFilters';
import { PatientTable } from '../../components/PatientTable';
import { FilterPanel } from '../../components/FilterPanel';
import { StatisticsCards } from '../../components/StatisticsCards';
import { PatientDetailsModal } from '../../components/PatientDetailsModal';
import { printPatientDetails } from '../../utils/printUtils';
import { useNotes } from '../../hooks/useNotes';
import { NotesDebug } from '../../components/NotesDebug';





const PatientDashboard: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    console.log('handleViewPatient called with:', patient);
    setSelectedPatient(patient);
    setIsModalOpen(true);
    console.log('Modal should be open now, isModalOpen:', true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handlePrintPatient = (patient: any) => {
    printPatientDetails(patient);
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
          <Layout>
            <Cell>
              {/* Add this debug section */}
              <Box marginBottom="SP4">
                <NotesDebug />
              </Box>
              {/* Statistics Cards Section - Full Width */}
              <Box marginBottom="SP4">
                <StatisticsCards
                  totalPatients={allSubmissions.length}
                  waitingTime={waitingTime}
                  ageGroups={ageGroups}
                  genderGroups={genderGroups}
                  currentTime={currentTime}
                  currentDate={currentDate}
                />
              </Box>

              {/* Main Content Area - Two Column Layout */}
              <Layout>
                {/* Left Column - Patient Table (70% = span 8.4, round to 8) */}
                <Cell span={9}>
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
                </Cell>

                {/* Right Column - Filter Panel (30% = span 3.6, round to 4) */}
                <Cell span={3}>
                  <Box position="sticky" top="90px" maxHeight="calc(100vh - 115px)" overflow="scroll" background="white" borderRadius="8px">
                    <FilterPanel
                      filters={filters}
                      onFilterChange={updateFilter}
                      onClearFilters={clearFilters}
                    />
                  </Box>
                </Cell>
              </Layout>
            </Cell>
          </Layout>
        </Page.Content>
      </Page>
      {isModalOpen && (
        <PatientDetailsModal
          patient={selectedPatient}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onPrint={handlePrintPatient}
        />
      )}
    </WixDesignSystemProvider>
  );
};

export default PatientDashboard;