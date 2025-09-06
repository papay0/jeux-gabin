#!/usr/bin/env node

// Script to test that each brand has a unique image URL
const fs = require('fs');
const path = require('path');

// Read the verification report
const reportPath = path.join(__dirname, '..', 'brand-images-report.json');
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

console.log('🔍 Testing brand image uniqueness...\n');

// Check for duplicate URLs
const urlMap = new Map();
const duplicates = [];

report.forEach(item => {
  if (item.imageUrl) {
    if (urlMap.has(item.imageUrl)) {
      duplicates.push({
        url: item.imageUrl,
        brands: [urlMap.get(item.imageUrl), item.brand]
      });
    } else {
      urlMap.set(item.imageUrl, item.brand);
    }
  }
});

// Report results
if (duplicates.length === 0) {
  console.log('✅ SUCCESS: All brands have unique images!');
  console.log('\n📊 Image Statistics:');
  console.log(`   Total brands: ${report.length}`);
  console.log(`   Verified images: ${report.filter(r => r.status === 'verified').length}`);
  console.log(`   Unique URLs: ${urlMap.size}`);
} else {
  console.log('❌ FAILED: Found duplicate images!');
  console.log('\nDuplicate images found:');
  duplicates.forEach(dup => {
    console.log(`   URL: ${dup.url}`);
    console.log(`   Used by: ${dup.brands.join(', ')}`);
  });
}

// List all brand-image pairs
console.log('\n📋 Brand-Image Mapping:');
console.log('========================');
report.forEach(item => {
  if (item.imageUrl) {
    console.log(`${item.brand}: ${item.imageUrl.substring(0, 60)}...`);
  }
});