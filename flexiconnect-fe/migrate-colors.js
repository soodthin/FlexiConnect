#!/usr/bin/env node
/**
 * Color Migration Script
 * Automatically replaces hard-coded colors with semantic color tokens
 *
 * Usage: node migrate-colors.js <file-path>
 */

const fs = require('fs');
const path = require('path');

// Color replacement mappings
const colorReplacements = {
  // Background colors
  'bg-\\[#f7f6f3\\]': 'bg-beige-100',
  'bg-\\[#f5efe6\\]': 'bg-beige-200',
  'bg-\\[#e6e1d3\\]': 'bg-beige-300',
  'bg-\\[#f5f5dc\\]': 'bg-beige-300',

  // Dark backgrounds
  'dark:bg-\\[#181818\\]': 'dark:bg-dark-bg-primary',
  'dark:bg-\\[#232323\\]': 'dark:bg-dark-bg-secondary',
  'dark:bg-\\[#2a2a2a\\]': 'dark:bg-dark-bg-tertiary',
  'dark:bg-\\[#2b2b2b\\]': 'dark:bg-dark-bg-tertiary',
  'dark:bg-\\[#2c2c2c\\]': 'dark:bg-dark-bg-elevated',
  'dark:bg-\\[#2d2d2d\\]': 'dark:bg-dark-bg-elevated',
  'dark:bg-\\[#353535\\]': 'dark:bg-dark-bg-elevated',
  'dark:bg-\\[#3a3a3a\\]': 'dark:bg-neutral-700',
  'dark:bg-\\[#1f1f1f\\]': 'dark:bg-neutral-850',
  'dark:bg-\\[#1e1e1e\\]': 'dark:bg-neutral-850',
  'dark:bg-\\[#1c1c1c\\]': 'dark:bg-neutral-900',
  'dark:bg-\\[#111\\]': 'dark:bg-offblack',
  'dark:bg-\\[#111111\\]': 'dark:bg-offblack',

  // Text colors
  'text-\\[#222222\\]': 'text-softblack',
  'text-\\[#111111\\]': 'text-offblack',
  'text-\\[#f5efe6\\]': 'text-beige-200',
  'dark:text-\\[#f5efe6\\]': 'dark:text-dark-text-primary',
  'dark:text-\\[#ccc\\]': 'dark:text-dark-text-secondary',
  'dark:text-\\[#cccccc\\]': 'dark:text-dark-text-secondary',
  'dark:text-\\[#aaa\\]': 'dark:text-dark-text-tertiary',
  'dark:text-\\[#aaaaaa\\]': 'dark:text-dark-text-tertiary',
  'dark:text-\\[#888\\]': 'dark:text-dark-text-muted',
  'dark:text-\\[#888888\\]': 'dark:text-dark-text-muted',
  'text-\\[#6b7280\\]': 'text-neutral-500',

  // Border colors
  'border-\\[#d1d5db\\]': 'border-neutral-300',
  'dark:border-\\[#444\\]': 'dark:border-dark-border-primary',
  'dark:border-\\[#444444\\]': 'dark:border-dark-border-primary',
  'dark:border-\\[#3a3a3a\\]': 'dark:border-dark-border-secondary',
  'dark:border-\\[#333\\]': 'dark:border-dark-border-subtle',
  'dark:border-\\[#333333\\]': 'dark:border-dark-border-subtle',

  // Hover backgrounds
  'hover:bg-\\[#f5f5dc\\]': 'hover:bg-beige-300',
  'dark:hover:bg-\\[#353535\\]': 'dark:hover:bg-dark-bg-elevated',
  'dark:hover:bg-\\[#3a3a3a\\]': 'dark:hover:bg-neutral-700',

  // Gray to Neutral
  'bg-gray-50(?!\\d)': 'bg-neutral-50',
  'bg-gray-100(?!\\d)': 'bg-neutral-100',
  'bg-gray-200(?!\\d)': 'bg-neutral-200',
  'bg-gray-300(?!\\d)': 'bg-neutral-300',
  'bg-gray-400(?!\\d)': 'bg-neutral-400',
  'bg-gray-500(?!\\d)': 'bg-neutral-500',
  'bg-gray-600(?!\\d)': 'bg-neutral-600',
  'bg-gray-700(?!\\d)': 'bg-neutral-700',
  'bg-gray-800(?!\\d)': 'bg-neutral-800',
  'bg-gray-900(?!\\d)': 'bg-neutral-900',

  'text-gray-50(?!\\d)': 'text-neutral-50',
  'text-gray-100(?!\\d)': 'text-neutral-100',
  'text-gray-200(?!\\d)': 'text-neutral-200',
  'text-gray-300(?!\\d)': 'text-neutral-300',
  'text-gray-400(?!\\d)': 'text-neutral-400',
  'text-gray-500(?!\\d)': 'text-neutral-500',
  'text-gray-600(?!\\d)': 'text-neutral-600',
  'text-gray-700(?!\\d)': 'text-neutral-700',
  'text-gray-800(?!\\d)': 'text-neutral-800',
  'text-gray-900(?!\\d)': 'text-neutral-900',

  'border-gray-50(?!\\d)': 'border-neutral-50',
  'border-gray-100(?!\\d)': 'border-neutral-100',
  'border-gray-200(?!\\d)': 'border-neutral-200',
  'border-gray-300(?!\\d)': 'border-neutral-300',
  'border-gray-400(?!\\d)': 'border-neutral-400',
  'border-gray-500(?!\\d)': 'border-neutral-500',
  'border-gray-600(?!\\d)': 'border-neutral-600',
  'border-gray-700(?!\\d)': 'border-neutral-700',
  'border-gray-800(?!\\d)': 'border-neutral-800',
  'border-gray-900(?!\\d)': 'border-neutral-900',

  'dark:text-gray-100(?!\\d)': 'dark:text-dark-text-primary',
  'dark:text-gray-200(?!\\d)': 'dark:text-dark-text-primary',
  'dark:text-gray-300(?!\\d)': 'dark:text-dark-text-secondary',
  'dark:text-gray-400(?!\\d)': 'dark:text-dark-text-secondary',

  'dark:border-gray-700(?!\\d)': 'dark:border-dark-border-primary',
  'dark:border-neutral-700(?!\\d)': 'dark:border-dark-border-primary',
  'dark:border-neutral-600(?!\\d)': 'dark:border-dark-border-subtle',
};

function migrateColors(content) {
  let modified = content;
  let changeCount = 0;

  // Apply all replacements
  for (const [pattern, replacement] of Object.entries(colorReplacements)) {
    const regex = new RegExp(pattern, 'g');
    const matches = (modified.match(regex) || []).length;
    if (matches > 0) {
      modified = modified.replace(regex, replacement);
      changeCount += matches;
      console.log(`  ✓ Replaced ${matches}x: ${pattern} → ${replacement}`);
    }
  }

  return { modified, changeCount };
}

function addCnImport(content) {
  // Check if cn import already exists
  if (content.includes('import { cn }') || content.includes("import { cn }")) {
    return content;
  }

  // Find the first import statement
  const importMatch = content.match(/^import .+ from .+;/m);
  if (importMatch) {
    const insertPosition = content.indexOf(importMatch[0]) + importMatch[0].length;
    return content.slice(0, insertPosition) + '\nimport { cn } from "@/utils/cn";' + content.slice(insertPosition);
  }

  // If no imports, add at the beginning
  return 'import { cn } from "@/utils/cn";\n\n' + content;
}

function processFile(filePath) {
  console.log(`\nProcessing: ${filePath}`);

  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { modified, changeCount } = migrateColors(content);

    if (changeCount > 0) {
      // Add cn import if we made changes
      const withImport = addCnImport(modified);
      fs.writeFileSync(filePath, withImport, 'utf8');
      console.log(`✅ Updated ${changeCount} color references`);
    } else {
      console.log('ℹ️  No changes needed');
    }
  } catch (error) {
    console.error(`❌ Error processing file: ${error.message}`);
  }
}

// Main execution
const args = process.argv.slice(2);

if (args.length === 0) {
  console.log('Usage: node migrate-colors.js <file-path>');
  console.log('\nExample:');
  console.log('  node migrate-colors.js src/pages/auth/Register.jsx');
  console.log('  node migrate-colors.js "src/pages/**/*.jsx"');
  process.exit(1);
}

const filePath = args[0];

if (fs.existsSync(filePath)) {
  if (fs.statSync(filePath).isDirectory()) {
    console.error('❌ Please specify a file, not a directory');
    process.exit(1);
  }
  processFile(filePath);
} else {
  console.error(`❌ File not found: ${filePath}`);
  process.exit(1);
}

console.log('\n✨ Migration complete!');
