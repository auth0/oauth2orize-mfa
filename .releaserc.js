const UPSTREAM_VERSION = '0.3.0';

module.exports = {
  repositoryUrl: 'https://github.com/auth0/oauth2orize-mfa.git',
  tagFormat: `${UPSTREAM_VERSION}-auth0-\${version}`,
  branches: ['master'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    [
      '@semantic-release/exec',
      {
        prepareCmd: `npm version --no-git-tag-version ${UPSTREAM_VERSION}-auth0-\${nextRelease.version}`,
      },
    ],
  ],
};