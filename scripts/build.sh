#!/usr/bin/env bash
set -e

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do SOURCE="$(readlink "$SOURCE")"; done
ROOTDIR="$(cd -P "$(dirname "$SOURCE")/.." && pwd)"

RELEASE="$1"

cd "$ROOTDIR"

# Build Docker image with latest commit hash
docker build \
  -t afsdigitalstudio-docker.jfrog.io/launchspectrumsite:latest \
  -t "afsdigitalstudio-docker.jfrog.io/launchspectrumsite:$COMMIT_SHA" \
  .

echo "Built Docker images:"
echo "  afsdigitalstudio-docker.jfrog.io/launchspectrumsite:latest"
echo "  afsdigitalstudio-docker.jfrog.io/launchspectrumsite:$COMMIT_SHA"

echo "Releasing Docker images tags:"
echo "  $COMMIT_SHA"

# Push Docker image to artifactory
docker push "afsdigitalstudio-docker.jfrog.io/launchspectrumsite:$COMMIT_SHA"

if [[ -n "$RELEASE" ]]; then
  echo "  latest"
  docker push afsdigitalstudio-docker.jfrog.io/launchspectrumsite:latest
fi
