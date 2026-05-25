# Releasing

This package uses [semantic-release](https://github.com/semantic-release/semantic-release) to automate versioning and publishing to JFrog Artifactory via the **Auth0 Library Pipeline (LP)**.

## Versioning Scheme

Versions follow the hybrid format: `0.3.0-auth0-<semver>` (e.g., `0.3.0-auth0-1.0.0`).

- `0.3.0` is the upstream Mozilla version this fork is based on.
- The `-auth0-<semver>` suffix tracks internal changes using semantic versioning.

## How Releases Work

Releases are triggered by conventional commit messages on the `master` branch:

| Commit prefix | Version bump |
|---|---|
| `fix:` | Patch (e.g., 1.0.0 -> 1.0.1) |
| `feat:` | Minor (e.g., 1.0.0 -> 1.1.0) |
| `BREAKING CHANGE:` in body | Major (e.g., 1.0.0 -> 2.0.0) |

## CI Pipeline: Library Pipeline (LP)

Publishing is handled by the standardized [Library Pipeline](https://oktainc.atlassian.net/wiki/spaces/L0CTRL/pages/710574528) maintained by the Platform Build Services (PBS) team.

### How it works

1. Jenkins detects pushes to `master` via the multibranch pipeline job.
2. LP runs `pipeline-cli stage publish-library`, which invokes `npx semantic-release`.
3. Artifactory credentials are injected automatically by Jenkins (via the `artifactory` credential).
4. The package is published to Artifactory's npm repository.

### Configuration files

| File | Purpose |
|---|---|
| `project.yaml` | LP metadata: language, node version, team channel |
| `Makefile` | Build targets: `install`, `test`, `lint`, `integration` |
| `opslevel.yml` | Tags repo with `cic.ci.pipeline: lp` |
| `.releaserc.js` | Semantic-release config (tag format, plugins) |

### Setting up the Jenkins job

Per [LP documentation](https://oktainc.atlassian.net/wiki/spaces/L0CTRL/pages/710574528#Setting-up-a-new-project), open an ESD ticket for the Platform Build Services team to create the Jenkins multibranch pipeline job:

- Portal: https://auth0team.atlassian.net/servicedesk/customer/portal/34/group/189/create/432
- Request: "Create Jenkins LP job for `atko-cic/node-client-sessions`"

### Reference repos using LP

- [`atko-cic/limitd-redis`](https://github.com/atko-cic/limitd-redis) — `@a0/limitd-redis`
- [`atko-cic/token-replay-lib`](https://github.com/atko-cic/token-replay-lib) — `@a0/token-replay-lib`
- [`atko-cic/dadjokes-library`](https://github.com/atko-cic/dadjokes-library)

## Running Locally (Dry Run)

```bash
export GITHUB_TOKEN="$(ocm auth github --scope atko-cic --type access-token)"
export NPM_TOKEN="$(ocm auth artifactory)"

npx semantic-release --dry-run
```

## Verifying a Release

```bash
# Check the tag was created
git ls-remote --tags origin | grep auth0

# Check the artifact in Artifactory
curl -s -H "Authorization: Bearer $(ocm auth artifactory)" \
  "https://a0us.jfrog.io/a0us/api/npm/npm-forks-local/client-sessions" | jq '.versions | keys'
```

## Current Status

The git tag `0.11.0-auth0-1.0.0` has been created on `master`. Once the Jenkins LP job is provisioned (via ESD ticket), it will publish the artifact automatically.