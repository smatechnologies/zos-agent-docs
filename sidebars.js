module.exports = {
  mySidebar: [
    'getting-started',
    'release-notes',
    {
      type: 'category', 
      label: 'Installation',
      collapsed: false,
      items: [
        'installation/introduction',
        'installation/checklist',
        'installation/process',
        'installation/verifying',
      ], 
    },
    'customization',
    'operations',
    {
      type: 'category', 
      label: 'Advanced features',
      collapsed: false,
      items: [
        'advanced-features/csa-storage',
        'advanced-features/xpscomm',
        'advanced-features/ispf',
        'advanced-features/mapping',
        'advanced-features/xpstimer',
        'advanced-features/xpstrack',
        'advanced-features/restarting-jobs',
      ], 
    },
    'machine-messages',
    {
      type: 'category', 
      label: 'Reference',
      collapsed: true,
      items: [
        'reference/multiple-lsams',
        'reference/standalone-file-transfer',
        'reference/djf',
        'reference/translation-tables',
        'reference/tls',
        'reference/faq',
        'reference/known-issues',
      ], 
    },
  ],
};
