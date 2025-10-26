import { Global, Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { CloudStorageService } from './cloudstorage.service';

@Global()
@Module({
  providers: [FirebaseService, CloudStorageService],
  exports: [FirebaseService, CloudStorageService],
})
export class FirebaseModule {}
