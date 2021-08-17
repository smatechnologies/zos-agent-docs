module.exports = {
  mySidebar: [
    'getting-started',
    'release-notes',
    'installation',
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
