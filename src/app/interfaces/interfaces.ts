export interface Patient {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    gender: string;
    age: number;
    avatar: string;
}

export interface Diagnose {
    id: number;
    diseaseId: number;
    date: Date;
    patientId: number;
}
