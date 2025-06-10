#!/usr/bin/env tsx
// Migration Script: localStorage to PostgreSQL
// Run this to migrate your existing localStorage data to the database

import { DatabaseService } from '../lib/db/database-service';
import { prisma } from '../lib/prisma';

async function runMigration() {
  console.log('🚀 Starting localStorage to PostgreSQL migration...\n');

  try {
    // Test database connection
    console.log('📡 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully\n');

    // Run the migration
    console.log('📦 Migrating localStorage data...');
    const results = await DatabaseService.migrateLocalStorageToDatabase();

    // Display results
    console.log('\n📊 Migration Results:');
    console.log(`✅ Clients migrated: ${results.clients}`);
    console.log(`✅ Progress records migrated: ${results.progressRecords}`);
    
    if (results.errors.length > 0) {
      console.log(`⚠️  Errors encountered: ${results.errors.length}`);
      results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    } else {
      console.log('🎉 Migration completed without errors!');
    }

    console.log('\n💾 Your localStorage data is preserved as backup.');
    console.log('🔄 The app will now use database storage with localStorage fallback.');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    console.log('\n🛡️  Don\'t worry - your localStorage data is safe!');
    console.log('🔧 Please check your database connection and try again.');
  } finally {
    await prisma.$disconnect();
  }
}

// Check if running directly (not imported)
if (require.main === module) {
  runMigration().catch(console.error);
}

export { runMigration }; 