// ==============================================
// 1. src/dashboard/pages/types/index.ts
// ==============================================
export interface PatientSubmission {
    _id: string;
    _createdDate: string;
    submissions: {
        name_1?: string;
        vorname?: string;
        email_726a?: string;
        geburtsdatum?: string;
        geschlecht?: string;
        date_5bd8?: string;
        waren_sie_schon_einmal_bei_uns_in_behandlung?: string; // Fixed typo
        wurde_ein_hausbesuch_verordnet?: string;
        montag?: string[];
        dienstag?: string[];
        mittwoch?: string[];
        donnerstag?: string[];
        freitag?: string[];
        address_51bd?: string;
        telefon?: string;
        diagnose_oder_grund_ihrer_anmeldung?: string;
        verordnende_r_aerztin_arzt?: string;
        krankenkasse?: string;
    };
}

export interface FilterState {
    selectedDay: string | null;
    selectedTimeSlots: string[];
    selectedHomeVisit: string[];
    selectedAgeGroups: string[];
    searchTerm: string;
}

export interface AgeGroups {
    kids: number;
    teenagers: number;
    adults: number;
}

export interface GenderGroups {
    men: number;
    women: number;
    divers: number;
}

export interface WaitingTime {
    months: number;
    days: number;
}