/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// src/firebase/firebase.service.ts

import { Injectable, OnModuleInit } from '@nestjs/common';
import * as admin from 'firebase-admin';
// import { Storage } from '@google-cloud/storage';
// import { enumBucket } from 'src/drizzle/schema/utils.schema';
// import { EnvConfiguracion } from 'src/common/config/envs';

@Injectable()
export class FirebaseService implements OnModuleInit {
  private admin: admin.app.App;
  private storage: Storage;

  onModuleInit() {
    // get ENV varibles of Service Account
    const serviceAccountReady =
      // EnvConfiguracion().
      process.env.SERVICE_ACCOUNT_FIREBASE_MICROFINANZAS2;
    if (!serviceAccountReady) {
      throw new Error(
        'SERVICE_ACCOUNT_FIREBASE_MICROFINANZAS2 environment variable is not set',
      );
    }

    const serviceAccount = JSON.parse(
      serviceAccountReady,
      // serviceTEst,
    ) as admin.ServiceAccount;

    if (!admin.apps.length) {
      // Write serviceAccount to file
      // Initialize the app only if it hasn't been initialized yet
      this.admin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        // storageBucket: this.default_bucket,
      });
      // const storage = new Storage({
      //   // keyFilename: path.join(__dirname, '../../service-account.json'), // o usa process.env
      //   // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      //   credentials: serviceAccount as any,
      // });
      // this.storage = storage;
    }
  }

  getFirestore() {
    return admin.firestore();
  }
  getTimestamp() {
    return admin.firestore.Timestamp;
  }

  getAuth() {
    return admin.auth();
  }

  getStorage() {
    return admin.storage();
  }
  // getBucket(bucket?: string) {
  //   return this.admin.storage().bucket(bucket || this.default_bucket);
  // }
  getStorageInstance() {
    return this.storage;
  }
  getAdmin() {
    return this.admin;
  }

  // Otros accesos según tu necesidad
}
