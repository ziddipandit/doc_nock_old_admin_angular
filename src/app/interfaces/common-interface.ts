//Admin Interfaces
export interface NursingHome {
    name: string,
    email: string,
    nursing_company: string,
    location: string,
    contact: string,
    image: string,
    role: string
}

export interface AssistedLiving {
    name: string,
    email: string,
    location: string,
    contact: string,
    image: string,
    geo_location: boolean,
    role: string
}

export interface Physician {
    name: string,
    email: string,
    location: string,
    contact: string,
    image: string,
    role: string,
    assissted_living_id: string,
    nursing_home_id: string
}

export interface NurseInterface {
    name: string,
    email: string,
    location: string,
    contact: string,
    image: string,
    role: string,
    assissted_living_id: string,
    nursing_home_id: string
}

export interface SetupAccount {
    name: string,
    email: string,
    location: string,
    contact: string,
    image: string,
    password: string,
    confirm_password: string
}
