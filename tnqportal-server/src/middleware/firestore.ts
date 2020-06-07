import env = require('env-var');
import { Firestore } from '@google-cloud/firestore';

const db = new Firestore({
  projectId: 'technique-student-portal',
  keyFilename: env.get('GOOGLE_APPLICATION-CREDENTIALS').required().asString(),
});

let colName : string;

switch (env.get('NODE_ENV').required().asEnum(["development", "production", "test"])) {
    case 'development':
        colName = 'tnqportal-dev';
        break;
    case 'production':
        colName = 'tnqportal-prod';
        break;
    case 'test':
        colName = 'tnqportal-test';
        break;
}

export const userCollection = db.collection(colName);