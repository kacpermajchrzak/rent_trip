import { FIREBASE_CONFIG } from './firebase-config';

// example firebase-config.ts
// export const FIREBASE_CONFIG = {
//     apiKey: "",
//     authDomain: "",
//     projectId: "",
//     storageBucket: "",
//     messagingSenderId: "",
//     appId: ""
// };

export const environment = {
    production: false,
    firebase: {
        apiKey: FIREBASE_CONFIG.apiKey,
        authDomain: FIREBASE_CONFIG.authDomain,
        projectId: FIREBASE_CONFIG.projectId,
        storageBucket: FIREBASE_CONFIG.storageBucket,
        messagingSenderId: FIREBASE_CONFIG.messagingSenderId,
        appId: FIREBASE_CONFIG.appId
    }
};